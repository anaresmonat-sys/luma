// ¿Esta cuenta ya tiene acceso completo (admin, cortesía o pago real)? El aviso
// "Ya usaste tu resultado gratis" (AvisoPrueba) solo miraba un recordatorio
// guardado en el propio navegador, que no sabe nada del plan real — así que
// alguien con cortesía o con Hotmart pagado seguía viendo el aviso de "elige
// un plan" aunque ya tuviera acceso completo (defecto real, 2026-09-29). Esta
// ruta le da al cliente la verdad real, sin exponer nada más que un booleano.

import { NextResponse } from 'next/server';
import { crearClienteServidor } from '@/lib/supabase/server';
import { clienteAdminSupabase } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

const ESTADOS_CON_ACCESO = ['active', 'trialing', 'trial'];

export async function GET() {
  const supabase = await crearClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ activo: false });
  }

  try {
    const admin = clienteAdminSupabase();
    const [{ data: perfil }, { data: suscripciones }] = await Promise.all([
      admin.from('profiles').select('role').eq('id', user.id).maybeSingle(),
      admin.from('subscriptions').select('estado, current_period_end').eq('user_id', user.id).in('estado', ESTADOS_CON_ACCESO),
    ]);
    const ahora = Date.now();
    const conPlan = (suscripciones ?? []).some(
      (s: { current_period_end: string | null }) => !s.current_period_end || new Date(s.current_period_end).getTime() > ahora
    );
    return NextResponse.json({ activo: perfil?.role === 'admin' || conPlan });
  } catch {
    // Disponibilidad primero: si falla la consulta, no se afirma nada de más —
    // el aviso local sigue siendo el respaldo y el 402 real del servidor sigue
    // protegiendo el gasto de todas formas.
    return NextResponse.json({ activo: false });
  }
}
