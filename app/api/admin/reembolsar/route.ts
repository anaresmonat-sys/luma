// «Reembolsar ahora» (solo administradora): devuelve el dinero de una petición de reembolso por la API de Hotmart.
// El dinero NO sale solo: la dueña pulsa el botón del panel (con confirmación) y aquí se vuelve a comprobar todo en el
// servidor antes de llamar a Hotmart: que es una petición de reembolso abierta, que la compra está dentro de los
// 15 días de garantía (+12 h de margen horario) y que existe su primera transacción.

import { NextResponse } from 'next/server';
import { crearClienteServidor } from '@/lib/supabase/server';
import { clienteAdminSupabase } from '@/lib/supabase/admin';
import { reembolsarEnHotmart } from '@/lib/hotmart-api';
import { registrarError } from '@/lib/log-servidor';
import { limiteExcedido, identificadorDePeticion } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const GARANTIA_MS = 15 * 24 * 3_600_000 + 12 * 3_600_000;

async function verificarAdmin(): Promise<string | null> {
  const supabase = await crearClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: perfil } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
  return perfil?.role === 'admin' ? user.id : null;
}

export async function POST(request: Request) {
  if (limiteExcedido(`admin-reembolsar:${identificadorDePeticion(request)}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Demasiadas peticiones seguidas — espera un momento.' }, { status: 429 });
  }
  const origen = request.headers.get('origin');
  if (origen && origen !== new URL(request.url).origin) {
    return NextResponse.json({ error: 'Origen no permitido' }, { status: 403 });
  }
  if (!(await verificarAdmin())) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

  let cuerpo: { peticionId?: unknown };
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: 'Petición inválida' }, { status: 400 });
  }
  const peticionId = typeof cuerpo.peticionId === 'string' ? cuerpo.peticionId : '';
  if (!/^[0-9a-f-]{36}$/i.test(peticionId)) return NextResponse.json({ error: 'Petición inválida' }, { status: 400 });

  const admin = clienteAdminSupabase();
  const { data: peticion } = await admin
    .from('cancel_requests')
    .select('id, user_id, email, tipo, estado, detalle')
    .eq('id', peticionId)
    .maybeSingle();
  if (!peticion || peticion.tipo !== 'reembolso') {
    return NextResponse.json({ error: 'No es una petición de reembolso.' }, { status: 404 });
  }
  if (peticion.detalle === 'reembolsado_por_api') {
    return NextResponse.json({ error: 'Ese reembolso ya se hizo.' }, { status: 409 });
  }

  const { data: sub } = await admin.from('subscriptions').select('estado, created_at').eq('user_id', peticion.user_id).maybeSingle();
  if (!sub || sub.estado === 'refunded' || sub.estado === 'chargeback') {
    return NextResponse.json({ error: 'Esa compra ya figura como reembolsada o no existe.' }, { status: 409 });
  }
  if (Date.now() - new Date(sub.created_at as string).getTime() > GARANTIA_MS) {
    return NextResponse.json({ error: 'Han pasado más de 15 días: fuera de la garantía.' }, { status: 409 });
  }

  const { data: venta } = await admin
    .from('payment_transactions')
    .select('transaction_id')
    .eq('user_id', peticion.user_id)
    .eq('economic_kind', 'sale')
    .order('occurred_at', { ascending: true })
    .limit(1)
    .maybeSingle();
  if (!venta?.transaction_id) {
    return NextResponse.json({ error: 'No encontré la transacción de esa compra. Reembólsala a mano en Hotmart.' }, { status: 404 });
  }

  const resultado = await reembolsarEnHotmart(venta.transaction_id as string);
  if (resultado.ok) {
    await admin
      .from('cancel_requests')
      .update({ estado: 'cancelada', detalle: 'reembolsado_por_api', resolved_at: new Date().toISOString() })
      .eq('id', peticion.id);
    return NextResponse.json({ ok: true, transaccion: venta.transaction_id });
  }

  await registrarError(`reembolso_api:${resultado.motivo}:${resultado.estadoHttp ?? ''}`, '/api/admin/reembolsar');
  const mensajes: Record<string, string> = {
    sin_credenciales: 'Faltan las claves de Hotmart en Vercel.',
    rechazado:
      'Hotmart no aceptó el reembolso (por ejemplo, porque no es la primera transacción o ya pasó su plazo). Hazlo a mano en Hotmart si quieres.',
    error_hotmart: 'Hotmart no respondió bien. Inténtalo en unos minutos o hazlo a mano.',
  };
  return NextResponse.json(
    { error: mensajes[resultado.motivo], estadoHttp: resultado.estadoHttp, detalle: resultado.detalle },
    { status: 502 },
  );
}
