// "Cancelar mi plan" desde la app. Lo primero que hace es GUARDAR la hora exacta de la petición
// (prueba si hay una disputa por el cambio horario); después intenta cancelar en Hotmart por API.
// Si no se puede (credenciales sin configurar, Hotmart caído, no se encuentra la suscripción), la petición
// queda en 'manual' y aparece en el panel de administración: la persona nunca queda sin respuesta.
// Regla del negocio: si la petición se hizo antes del cobro, se reembolsa el cobro aunque se haya adelantado.

import { NextResponse } from 'next/server';
import { crearClienteServidor } from '@/lib/supabase/server';
import { clienteAdminSupabase } from '@/lib/supabase/admin';
import { cancelarEnHotmart } from '@/lib/hotmart-api';
import { registrarError } from '@/lib/log-servidor';
import { limiteExcedido, identificadorDePeticion } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (limiteExcedido(`cancelar-plan:${identificadorDePeticion(request)}`, 5, 60_000)) {
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
  if (!user?.email) return NextResponse.json({ error: 'Entra con tu correo para cancelar.' }, { status: 401 });

  const admin = clienteAdminSupabase();

  // Si ya hay una petición abierta o ya cancelada, no se duplica: se devuelve la misma (con su hora original).
  const { data: previa } = await admin
    .from('cancel_requests')
    .select('id, estado, requested_at')
    .eq('user_id', user.id)
    .eq('tipo', 'cancelacion')
    .in('estado', ['pendiente', 'manual', 'cancelada'])
    .order('requested_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (previa) {
    return NextResponse.json({ estado: previa.estado, solicitadaEn: previa.requested_at });
  }

  const { data: creada, error: errorCrear } = await admin
    .from('cancel_requests')
    .insert({ user_id: user.id, email: user.email })
    .select('id, requested_at')
    .single();
  if (errorCrear || !creada) {
    await registrarError(errorCrear?.message ?? 'cancel_requests sin fila', '/api/cancelar-plan');
    return NextResponse.json(
      { error: 'No pudimos registrar tu petición. Inténtalo de nuevo o escribe a soporte@tuluma.app.' },
      { status: 502 },
    );
  }

  const { data: sub } = await admin.from('subscriptions').select('hotmart_subscriber_code').eq('user_id', user.id).maybeSingle();
  const resultado = await cancelarEnHotmart(user.email, sub?.hotmart_subscriber_code as string | null | undefined);

  if (resultado.ok) {
    await admin.from('cancel_requests').update({ estado: 'cancelada', resolved_at: new Date().toISOString() }).eq('id', creada.id);
    return NextResponse.json({ estado: 'cancelada', solicitadaEn: creada.requested_at });
  }

  await admin.from('cancel_requests').update({ estado: 'manual', detalle: resultado.motivo }).eq('id', creada.id);
  if (resultado.motivo !== 'sin_credenciales') await registrarError(`cancelacion_manual:${resultado.motivo}`, '/api/cancelar-plan');
  return NextResponse.json({ estado: 'manual', solicitadaEn: creada.requested_at });
}
