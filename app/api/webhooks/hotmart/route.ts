// Webhook de Hotmart — el endpoint más atacado de la app (docs/sistema/18-VENTA-HOTMART.md →
// "SEGURIDAD DEL WEBHOOK DE HOTMART"). Si alguien lo engaña, se autootorga LUMA gratis para
// siempre. Pipeline OBLIGATORIO en orden: autenticidad → frescura → parse → catálogo → dedupe →
// resolver usuario (crear si hace falta) → transición atómica en la base (RPC apply_hotmart_event)
// → email de acceso. Cada intento (éxito o fallo) se registra en webhook_log, para la alerta de
// salud "sin webhooks hace N horas" del backoffice (21-BACKOFFICE.md).

import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { verifyHotmart } from '@/lib/hotmart-verify';
import { estadoParaEvento, transicionValida, PLAN_CHANGE_EVENT, type EstadoMembresia } from '@/lib/membership-fsm';
import { clienteAdminSupabase } from '@/lib/supabase/admin';
import { registrarError } from '@/lib/log-servidor';

export const runtime = 'nodejs'; // necesitamos node:crypto y el raw body — no Edge

const REPLAY_WINDOW_MS = 5 * 60 * 1000;

// Catálogo server-side: qué ID de producto de Hotmart aceptamos. Se rellena con el ID real
// (docs/sistema/18 → "3B. Validación de catálogo") en cuanto el usuario lo confirme en su panel;
// mientras tanto, sin ID configurado, NO se filtra por producto (fail-open documentado a propósito:
// LUMA solo tiene un producto en Hotmart hoy, así que bloquear por ID antes de conocerlo bloquearía
// TODAS las compras reales). Configurar HOTMART_PRODUCT_ID en cuanto se sepa.
const PRODUCT_ID_ESPERADO = process.env.HOTMART_PRODUCT_ID;

interface RegistroWebhook {
  event_id?: string;
  type?: string;
  result: 'applied' | 'duplicate' | 'illegal' | 'unauthorized' | 'error' | 'ignored';
  detail?: string;
}

async function registrarLog(admin: ReturnType<typeof clienteAdminSupabase>, log: RegistroWebhook) {
  try {
    await admin.from('webhook_log').insert(log);
  } catch {
    // Si ni siquiera el log se puede escribir, no bloquear la respuesta al webhook por eso.
  }
}

/** ¿A quién le llega el correo de "ya tienes acceso"? Solo cuando el estado nuevo da acceso Y el
 * usuario no lo tenía ya (evita reenviar el mismo correo en cada reintento de Hotmart). */
function esPrimeraActivacion(estadoAnterior: EstadoMembresia | null, estadoNuevo: EstadoMembresia): boolean {
  const teniaAcceso = estadoAnterior === 'trialing' || estadoAnterior === 'active';
  const tieneAcceso = estadoNuevo === 'trialing' || estadoNuevo === 'active';
  return tieneAcceso && !teniaAcceso;
}

export async function POST(req: Request) {
  const admin = clienteAdminSupabase();

  // 1. RAW body — los bytes exactos, antes de parsear (necesario para el hash de auditoría y por
  //    si algún día hay que verificar una firma documentada por Hotmart sobre el cuerpo crudo).
  const rawBody = await req.text();

  // 2. Autenticidad — hottok en tiempo constante, sobre HTTPS (Vercel ya lo fuerza).
  const hottok = req.headers.get('x-hotmart-hottok') ?? undefined;
  if (!verifyHotmart({ hottok })) {
    await registrarLog(admin, { result: 'unauthorized' });
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 }); // genérico, no revela por qué
  }

  // 3. Parsear SOLO después de verificar.
  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    await registrarLog(admin, { result: 'error', detail: 'json_invalido' });
    return NextResponse.json({ error: 'bad request' }, { status: 400 });
  }

  // 4. Frescura (anti-replay).
  const ts = payload.creation_date ?? payload.data?.purchase?.approved_date;
  if (ts && Date.now() - Number(ts) > REPLAY_WINDOW_MS) {
    await registrarLog(admin, { result: 'error', detail: 'evento_viejo' });
    return NextResponse.json({ error: 'stale' }, { status: 400 });
  }

  // 5. Datos del evento.
  const event: string = payload.event;
  const eventId: string =
    payload.id ?? payload.event_id ?? payload.data?.purchase?.transaction ?? `${event}:${payload.data?.buyer?.email}:${ts ?? ''}`;
  // El correo viaja en sitios distintos según el evento (confirmado con el payload real de
  // "Enviar prueba de configuración" del panel de Hotmart, 2026-09-28): una compra lo trae en
  // `data.buyer`; SWITCH_PLAN y SUBSCRIPTION_CANCELLATION lo traen en `data.subscription.user`.
  const email: string | undefined =
    payload.data?.buyer?.email ?? payload.data?.subscription?.user?.email ?? payload.email;
  const productoId: string | undefined = String(payload.data?.product?.id ?? '');
  const transactionId: string | undefined = payload.data?.purchase?.transaction;
  const amountMinor: number | null = payload.data?.purchase?.price?.value
    ? Math.round(Number(payload.data.purchase.price.value) * 100)
    : null;
  const currency: string | undefined = payload.data?.purchase?.price?.currency_value;
  const offerCode: string | undefined = payload.data?.purchase?.offer?.code;
  const periodEndRaw: string | undefined = payload.data?.subscription?.date_next_charge
    ? new Date(payload.data.subscription.date_next_charge).toISOString()
    : undefined;

  // 5B. Catálogo: rechazar productos ajenos si ya sabemos cuál es el nuestro.
  if (PRODUCT_ID_ESPERADO && productoId && productoId !== PRODUCT_ID_ESPERADO) {
    await registrarLog(admin, { event_id: eventId, type: event, result: 'error', detail: `producto_ajeno:${productoId}` });
    return NextResponse.json({ received: true, ignored: 'producto_ajeno' });
  }

  // 6. Cambio de plan (mensual↔anual): no toca el status, solo el plan guardado. Dedupe propio.
  if (event === PLAN_CHANGE_EVENT) {
    if (!email) {
      await registrarLog(admin, { event_id: eventId, type: event, result: 'error', detail: 'sin_email' });
      return NextResponse.json({ received: true, ignored: 'sin_email' });
    }
    const { data: userId } = await admin.rpc('buscar_usuario_por_email', { p_email: email });
    if (userId) {
      // El plan nuevo (al que se cambió) viene en `data.plans`, el elemento con `current: true`
      // (confirmado con el payload real, 2026-09-28) — no en `data.subscription.plan`.
      const planesPayload: Array<{ current?: boolean; name?: string }> = Array.isArray(payload.data?.plans) ? payload.data.plans : [];
      const nombrePlanActual = planesPayload.find((p) => p.current)?.name ?? '';
      const planNuevo = /anual/i.test(offerCode ?? '') || /anual/i.test(nombrePlanActual) ? 'anual' : 'mensual';
      await admin.from('subscriptions').update({ plan: planNuevo, updated_at: new Date().toISOString() }).eq('user_id', userId);
      await registrarLog(admin, { event_id: eventId, type: event, result: 'applied' });
    }
    return NextResponse.json({ received: true });
  }

  const nuevoEstado = estadoParaEvento(event);
  if (!nuevoEstado) {
    // Evento que no nos interesa (ej. uno informativo que Hotmart también manda): 200 igual,
    // Hotmart no debe reintentar algo que no vamos a procesar nunca.
    await registrarLog(admin, { event_id: eventId, type: event, result: 'ignored' });
    return NextResponse.json({ received: true, ignored: event });
  }

  if (!email) {
    await registrarLog(admin, { event_id: eventId, type: event, result: 'error', detail: 'sin_email' });
    return NextResponse.json({ received: true, ignored: 'sin_email' });
  }

  try {
    // 7. Resolver el usuario: buscar por email; si no existe, crearlo SIN enviar ningún correo de
    //    Supabase (email_confirm: true) — el correo real de bienvenida lo manda Resend más abajo.
    let userId: string | null = null;
    const { data: encontrado } = await admin.rpc('buscar_usuario_por_email', { p_email: email });
    userId = encontrado ?? null;

    if (!userId) {
      const { data: creado, error: errorCrear } = await admin.auth.admin.createUser({
        email,
        email_confirm: true,
      });
      if (errorCrear || !creado?.user) {
        // Hotmart puede mandar varios eventos de la misma compra casi a la vez (el propio test
        // de "Enviar prueba de configuración" lo hace): si dos peticiones llegan juntas, las dos
        // pueden no encontrar la cuenta todavía y las dos intentan crearla — una gana, la otra
        // recibe "ya existe". En ese caso NO es un fallo real: se vuelve a buscar por email antes
        // de rendirse.
        const { data: reintento } = await admin.rpc('buscar_usuario_por_email', { p_email: email });
        if (!reintento) {
          await registrarError(errorCrear?.message ?? 'sin usuario creado', '/api/webhooks/hotmart');
          await registrarLog(admin, { event_id: eventId, type: event, result: 'error', detail: 'no_se_creo_usuario' });
          return NextResponse.json({ error: 'no se pudo crear el usuario' }, { status: 502 });
        }
        userId = reintento;
      } else {
        userId = creado.user.id;
      }
    }

    // Estado ANTES de aplicar el evento (para decidir si mandamos el correo de bienvenida).
    const { data: filaPrevia } = await admin.from('subscriptions').select('estado').eq('user_id', userId).maybeSingle();
    const estadoAnterior = (filaPrevia?.estado as EstadoMembresia | undefined) ?? null;

    if (!transicionValida(estadoAnterior, nuevoEstado)) {
      await registrarLog(admin, { event_id: eventId, type: event, result: 'illegal', detail: `${estadoAnterior}->${nuevoEstado}` });
      return NextResponse.json({ received: true, ignored: 'transicion_ilegal' });
    }

    const economicKind = event.startsWith('PURCHASE_REFUND')
      ? 'refund'
      : event === 'PURCHASE_CHARGEBACK'
        ? 'chargeback'
        : nuevoEstado === 'active' || nuevoEstado === 'trialing'
          ? 'sale'
          : null;

    const plan = /anual/i.test(offerCode ?? '') || /anual/i.test(payload.data?.subscription?.plan?.name ?? '') ? 'anual' : 'mensual';
    const payloadHash = crypto.createHash('sha256').update(rawBody).digest('hex');

    const { data: resultado, error: errorRpc } = await admin.rpc('apply_hotmart_event', {
      p_event_id: eventId,
      p_event_type: event,
      p_payload_hash: payloadHash,
      p_user_id: userId,
      p_new_status: nuevoEstado,
      p_plan: plan,
      p_transaction_id: transactionId ?? null,
      p_economic_kind: economicKind,
      p_product_id: productoId || null,
      p_amount_minor: amountMinor,
      p_currency: currency ?? null,
      p_period_end: periodEndRaw ?? null,
    });

    if (errorRpc) {
      await registrarError(errorRpc.message, '/api/webhooks/hotmart');
      await registrarLog(admin, { event_id: eventId, type: event, result: 'error', detail: errorRpc.code });
      return NextResponse.json({ error: 'no se pudo procesar' }, { status: 502 });
    }

    const resultadoTexto = resultado as 'applied' | 'duplicate' | 'illegal';
    await registrarLog(admin, { event_id: eventId, type: event, result: resultadoTexto });

    // 8. Correo de acceso: solo en la PRIMERA activación (no en cada reintento de Hotmart).
    //    Vía Resend (SMTP custom ya configurado en Supabase Auth) — el propio enlace mágico.
    if (resultadoTexto === 'applied' && esPrimeraActivacion(estadoAnterior, nuevoEstado)) {
      const { createClient } = await import('@supabase/supabase-js');
      const anon = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);
      await anon.auth
        .signInWithOtp({ email, options: { emailRedirectTo: 'https://www.tuluma.app/entrar' } })
        .catch((e) => registrarError(String(e), '/api/webhooks/hotmart:magic-link'));
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    await registrarError(error instanceof Error ? error.message : String(error), '/api/webhooks/hotmart');
    await registrarLog(admin, { event_id: eventId, type: event, result: 'error', detail: 'excepcion' });
    return NextResponse.json({ error: 'error interno' }, { status: 500 });
  }
}
