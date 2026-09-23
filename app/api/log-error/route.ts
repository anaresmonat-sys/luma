// Recibe errores capturados en el navegador (Error Boundary) y los guarda en
// error_log — mismo patrón que /api/log-event. Nunca debe poder tumbar la app:
// cualquier fallo aquí responde 200 igual (ver docs/sistema/21-BACKOFFICE.md).

import { NextResponse } from 'next/server';
import { crearClienteServidor } from '@/lib/supabase/server';
import { registrarError } from '@/lib/log-servidor';
import { limiteExcedido, identificadorDePeticion } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (limiteExcedido(`log-error:${identificadorDePeticion(request)}`, 30, 60_000)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  let cuerpo: { message?: unknown; context?: unknown };
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const message = typeof cuerpo.message === 'string' ? cuerpo.message : 'Error sin mensaje';
  const context = typeof cuerpo.context === 'string' ? cuerpo.context : 'desconocido';

  const supabase = await crearClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await registrarError(message, context, user?.id ?? null);
  return NextResponse.json({ ok: true });
}
