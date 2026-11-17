// «Enviar una sugerencia» desde Más: guarda lo que la clienta escribe en la tabla `sugerencias` (la administradora la lee en
// /admin/sugerencias). Requiere sesión (así se sabe quién escribe y se puede responder) y tiene tope de envíos por persona.

import { NextResponse } from 'next/server';
import { crearClienteServidor } from '@/lib/supabase/server';
import { clienteAdminSupabase } from '@/lib/supabase/admin';
import { registrarError } from '@/lib/log-servidor';
import { limiteExcedido, identificadorDePeticion } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const TIPOS = ['mejora', 'falta', 'falla', 'otro'] as const;
const MAX_POR_DIA = 10;

export async function POST(request: Request) {
  if (limiteExcedido(`sugerencia:${identificadorDePeticion(request)}`, 5, 60_000)) {
    return NextResponse.json({ error: 'Demasiados envíos seguidos — espera un momento.' }, { status: 429 });
  }
  const origen = request.headers.get('origin');
  if (origen && origen !== new URL(request.url).origin) {
    return NextResponse.json({ error: 'Origen no permitido' }, { status: 403 });
  }

  const supabase = await crearClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Entra con tu correo para enviar tu sugerencia.' }, { status: 401 });

  let cuerpo: { tipo?: unknown; mensaje?: unknown };
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: 'No pudimos leer tu mensaje.' }, { status: 400 });
  }
  const mensaje = typeof cuerpo.mensaje === 'string' ? cuerpo.mensaje.trim() : '';
  const tipo = TIPOS.find((t) => t === cuerpo.tipo) ?? 'mejora';
  if (mensaje.length < 3) return NextResponse.json({ error: 'Cuéntanos un poco más.' }, { status: 400 });
  if (mensaje.length > 1000) return NextResponse.json({ error: 'Tu mensaje es muy largo (máximo 1000 letras).' }, { status: 400 });

  try {
    const admin = clienteAdminSupabase();
    const ayer = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count } = await admin
      .from('sugerencias')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', ayer);
    if ((count ?? 0) >= MAX_POR_DIA) {
      return NextResponse.json({ error: 'Ya nos enviaste varias hoy. ¡Gracias! Seguimos leyéndote mañana.' }, { status: 429 });
    }
    const { error } = await admin.from('sugerencias').insert({ user_id: user.id, email: user.email ?? null, tipo, mensaje });
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true });
  } catch (e) {
    await registrarError(e instanceof Error ? e.message : 'sugerencia', 'api/sugerencia', user.id);
    return NextResponse.json({ error: 'No pudimos enviar tu mensaje. Inténtalo de nuevo.' }, { status: 500 });
  }
}
