// Derecho de eliminación (docs/sistema/47-LEGAL-FISCAL-Y-PRIVACIDAD.md §3) —
// antes de la auditoría legal 2026-09-23 esta ruta no existía y no había
// ninguna forma real de que una usuaria borrara su cuenta y sus datos.
// Borrar el usuario de auth.users arrastra en cascada (ON DELETE CASCADE)
// TODAS sus filas en profiles/checkins/journal_entries/coach_messages/
// tarot_readings/situations/relationships/circulo_perfiles/subscriptions/
// onboarding_answers/daily_cards — verificado en el esquema real de Supabase.
// ai_calls/event_log/error_log quedan anonimizados (user_id → NULL), que es
// lo correcto: son registros operativos del negocio, no datos personales.

import { NextResponse } from 'next/server';
import { crearClienteServidor } from '@/lib/supabase/server';
import { clienteAdminSupabase } from '@/lib/supabase/admin';
import { registrarEvento } from '@/lib/log-servidor';
import { limiteExcedido, identificadorDePeticion } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (limiteExcedido(`eliminar-cuenta:${identificadorDePeticion(request)}`, 3, 60_000)) {
    return NextResponse.json({ error: 'Demasiados intentos seguidos — espera un momento.' }, { status: 429 });
  }

  // Defensa anti-CSRF: una acción destructiva solo se acepta desde nuestro propio sitio.
  const origen = request.headers.get('origin');
  if (origen && origen !== new URL(request.url).origin) {
    return NextResponse.json({ error: 'Origen no permitido' }, { status: 403 });
  }

  const supabase = await crearClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  await registrarEvento('cuenta_eliminada', user.id);

  const admin = clienteAdminSupabase();
  const { error } = await admin.auth.admin.deleteUser(user.id);

  if (error) {
    return NextResponse.json({ error: 'No se pudo eliminar la cuenta. Inténtalo de nuevo.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
