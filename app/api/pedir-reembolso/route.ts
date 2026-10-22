// "Pedir reembolso" desde la app (PASO 1: no mueve dinero). Hotmart exige que quien vende apruebe cada reembolso
// a mano (Ventas → Mis ventas → Reembolsar al comprador), solo del PRIMER cobro y dentro de la garantía de 15 días.
// Esta ruta: (1) guarda la hora exacta de la petición, (2) comprueba el plazo, (3) cancela la suscripción en Hotmart
// para que no haya más cobros y (4) deja la petición en Admin → Ventas lista para reembolsar con tres clics.
// Si todavía no se cobró nada (primeras 72 h de la prueba) no hay nada que reembolsar: se indica cancelar.

import { NextResponse } from 'next/server';
import { crearClienteServidor } from '@/lib/supabase/server';
import { clienteAdminSupabase } from '@/lib/supabase/admin';
import { cancelarEnHotmart } from '@/lib/hotmart-api';
import { registrarError } from '@/lib/log-servidor';
import { limiteExcedido, identificadorDePeticion } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const HORA_MS = 3_600_000;
const DIA_MS = 24 * HORA_MS;
const GARANTIA_DIAS = 15;
const MARGEN_HORARIO_HORAS = 12; // el cambio horario nunca debe dejar a alguien fuera de plazo por unas horas
const PRUEBA_SIN_COBRO_HORAS = 72;

export type EstadoReembolso = 'recibida' | 'en_prueba' | 'fuera_de_plazo' | 'ya_reembolsada';

export async function POST(request: Request) {
  if (limiteExcedido(`pedir-reembolso:${identificadorDePeticion(request)}`, 5, 60_000)) {
    return NextResponse.json({ error: 'Demasiados intentos seguidos — espera un momento.' }, { status: 429 });
  }
  const origen = request.headers.get('origin');
  if (origen && origen !== new URL(request.url).origin) {
    return NextResponse.json({ error: 'Origen no permitido' }, { status: 403 });
  }

  const supabase = await crearClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: 'Entra con tu correo para pedir el reembolso.' }, { status: 401 });

  const admin = clienteAdminSupabase();
  const { data: sub } = await admin
    .from('subscriptions')
    .select('estado, created_at, hotmart_subscriber_code')
    .eq('user_id', user.id)
    .maybeSingle();
  if (!sub) {
    return NextResponse.json({ error: 'No encontramos ninguna compra con este correo. Escribe a soporte@tuluma.app.' }, { status: 404 });
  }

  if (sub.estado === 'refunded' || sub.estado === 'chargeback') {
    return NextResponse.json({ estado: 'ya_reembolsada' satisfies EstadoReembolso });
  }

  const ahora = Date.now();
  const desdeLaCompra = ahora - new Date(sub.created_at as string).getTime();

  if (desdeLaCompra < PRUEBA_SIN_COBRO_HORAS * HORA_MS) {
    return NextResponse.json({ estado: 'en_prueba' satisfies EstadoReembolso });
  }
  if (desdeLaCompra > GARANTIA_DIAS * DIA_MS + MARGEN_HORARIO_HORAS * HORA_MS) {
    return NextResponse.json({ estado: 'fuera_de_plazo' satisfies EstadoReembolso });
  }

  // Una sola petición abierta por persona: se devuelve la misma, con su hora original.
  const { data: previa } = await admin
    .from('cancel_requests')
    .select('requested_at')
    .eq('user_id', user.id)
    .eq('tipo', 'reembolso')
    .order('requested_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (previa) {
    return NextResponse.json({ estado: 'recibida' satisfies EstadoReembolso, solicitadaEn: previa.requested_at });
  }

  const { data: creada, error: errorCrear } = await admin
    .from('cancel_requests')
    .insert({ user_id: user.id, email: user.email, tipo: 'reembolso', estado: 'pendiente', detalle: 'reembolsar_en_hotmart' })
    .select('requested_at')
    .single();
  if (errorCrear || !creada) {
    await registrarError(errorCrear?.message ?? 'reembolso sin fila', '/api/pedir-reembolso');
    return NextResponse.json(
      { error: 'No pudimos registrar tu petición. Inténtalo de nuevo o escribe a soporte@tuluma.app.' },
      { status: 502 },
    );
  }

  // Corta los cobros siguientes. Si ya estaba cancelada o falla, la petición de reembolso queda igualmente guardada.
  if (sub.estado !== 'cancelled') {
    const cancelacion = await cancelarEnHotmart(user.email, sub.hotmart_subscriber_code as string | null | undefined);
    if (!cancelacion.ok && cancelacion.motivo !== 'sin_credenciales') {
      await registrarError(`reembolso_sin_cancelar:${cancelacion.motivo}`, '/api/pedir-reembolso');
    }
  }

  return NextResponse.json({ estado: 'recibida' satisfies EstadoReembolso, solicitadaEn: creada.requested_at });
}
