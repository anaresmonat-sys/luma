// Acceso de cortesía — activar/quitar el plan completo a mano, sin pasar por
// Hotmart (pedido explícito del usuario, 2026-09-29: dejar entrar a personas de
// confianza a probar la app). Mismo patrón de verificación de admin en el
// SERVIDOR que /api/admin/usuarios — nunca confiar en que /admin ya filtró.
// El acceso se guarda igual que una suscripción real (estado='active', sin
// fecha de fin): lib/prueba-servidor.ts ya trata cualquier fila 'active' sin
// current_period_end como acceso completo, así que no hace falta ningún código
// nuevo del lado de la app — el mismo camino que usa un pago real de Hotmart.

import { NextResponse } from 'next/server';
import { crearClienteServidor } from '@/lib/supabase/server';
import { clienteAdminSupabase } from '@/lib/supabase/admin';
import { registrarError } from '@/lib/log-servidor';
import { limiteExcedido, identificadorDePeticion } from '@/lib/rate-limit';

export const runtime = 'nodejs';

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
  if (limiteExcedido(`admin-cortesia:${identificadorDePeticion(request)}`, 15, 60_000)) {
    return NextResponse.json({ error: 'Demasiadas peticiones seguidas — espera un momento.' }, { status: 429 });
  }
  const adminId = await verificarAdmin();
  if (!adminId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  let cuerpo: { userId?: unknown };
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 });
  }
  const userId = typeof cuerpo.userId === 'string' ? cuerpo.userId : '';
  if (!userId) {
    return NextResponse.json({ error: 'Falta el usuario' }, { status: 400 });
  }

  const admin = clienteAdminSupabase();
  try {
    const { error } = await admin
      .from('subscriptions')
      .upsert(
        { user_id: userId, estado: 'active', plan: 'cortesia', current_period_end: null, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      );
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido';
    await registrarError(mensaje, '/api/admin/cortesia', adminId);
    return NextResponse.json({ error: mensaje }, { status: 502 });
  }
}

export async function DELETE(request: Request) {
  if (limiteExcedido(`admin-cortesia:${identificadorDePeticion(request)}`, 15, 60_000)) {
    return NextResponse.json({ error: 'Demasiadas peticiones seguidas — espera un momento.' }, { status: 429 });
  }
  const adminId = await verificarAdmin();
  if (!adminId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  let cuerpo: { userId?: unknown };
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 });
  }
  const userId = typeof cuerpo.userId === 'string' ? cuerpo.userId : '';
  if (!userId) {
    return NextResponse.json({ error: 'Falta el usuario' }, { status: 400 });
  }

  const admin = clienteAdminSupabase();
  try {
    // Solo quita la cortesía: si la fila es de un pago real de Hotmart, no se
    // toca (evita que "quitar cortesía" corte por error una suscripción pagada).
    const { error } = await admin.from('subscriptions').delete().eq('user_id', userId).eq('plan', 'cortesia');
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido';
    await registrarError(mensaje, '/api/admin/cortesia', adminId);
    return NextResponse.json({ error: mensaje }, { status: 502 });
  }
}
