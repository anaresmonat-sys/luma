// Agregar un usuario manualmente (correo + nombre) — para cuando el acceso
// automático (magic link) no le llega a alguien, o el dueño quiere darle
// entrada a mano (pedido explícito del usuario, 2026-09-22). Verificación de
// admin EN EL SERVIDOR con la sesión real de cookies — nunca confiar en que
// la ruta /admin ya filtró (defensa en profundidad, 09-SEGURIDAD.md). Usa la
// API de administración de Supabase (clienteAdminSupabase) para invitar al
// correo de verdad; si falla, se devuelve el error real, nunca un "listo" falso.

import { NextResponse } from 'next/server';
import { crearClienteServidor } from '@/lib/supabase/server';
import { clienteAdminSupabase } from '@/lib/supabase/admin';
import { registrarError } from '@/lib/log-servidor';
import { limiteExcedido, identificadorDePeticion } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  if (limiteExcedido(`admin-usuarios:${identificadorDePeticion(request)}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Demasiadas peticiones seguidas — espera un momento.' }, { status: 429 });
  }
  const adminId = await verificarAdmin();
  if (!adminId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  let cuerpo: { email?: unknown; nombre?: unknown };
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 });
  }

  const email = typeof cuerpo.email === 'string' ? cuerpo.email.trim().toLowerCase() : '';
  const nombre = typeof cuerpo.nombre === 'string' ? cuerpo.nombre.trim() : '';

  if (!REGEX_EMAIL.test(email)) {
    return NextResponse.json({ error: 'Correo inválido' }, { status: 400 });
  }
  if (!nombre) {
    return NextResponse.json({ error: 'Falta el nombre' }, { status: 400 });
  }

  const admin = clienteAdminSupabase();

  try {
    const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
      data: { nombre },
    });

    if (error || !data.user) {
      throw error ?? new Error('Supabase no devolvió el usuario creado');
    }

    // El perfil se crea/actualiza a mano: el resto de la app lo crea recién
    // cuando la persona completa su Mapa de Poder, pero aquí ya sabemos su
    // nombre y conviene que exista desde ya para que aparezca en la lista.
    const { error: errorPerfil } = await admin
      .from('profiles')
      .upsert({ id: data.user.id, nombre }, { onConflict: 'id' });

    if (errorPerfil) throw errorPerfil;

    return NextResponse.json({ ok: true, userId: data.user.id });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido';
    await registrarError(mensaje, '/api/admin/usuarios', adminId);
    return NextResponse.json({ error: mensaje }, { status: 502 });
  }
}
