// Recibe eventos de activación desde el navegador y los guarda en event_log
// (patrón BFF: el cliente nunca escribe la tabla directamente — ver
// docs/sistema/21-BACKOFFICE.md). Vocabulario cerrado (TIPOS_DE_EVENTO): un
// tipo fuera de la lista se descarta en silencio, no rompe la app del usuario.

import { NextResponse } from 'next/server';
import { crearClienteServidor } from '@/lib/supabase/server';
import { registrarEvento, TIPOS_DESDE_NAVEGADOR, hayDemasiadosRegistros, type TipoDeEvento } from '@/lib/log-servidor';
import { limiteExcedido, identificadorDePeticion } from '@/lib/rate-limit';

export const runtime = 'nodejs';

function esTipoValido(t: unknown): t is TipoDeEvento {
  return typeof t === 'string' && (TIPOS_DESDE_NAVEGADOR as readonly string[]).includes(t);
}

export async function POST(request: Request) {
  if (limiteExcedido(`log-event:${identificadorDePeticion(request)}`, 30, 60_000)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  let cuerpo: { type?: unknown; metadata?: unknown };
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!esTipoValido(cuerpo.type)) {
    // Silencioso a propósito: un evento desconocido no es un error del usuario.
    return NextResponse.json({ ok: true });
  }

  // Si hay sesión real de Supabase, el evento queda atado a esa persona; la
  // mayoría del uso de LUMA es anónimo (sin login) y eso también es válido.
  const supabase = await crearClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Datos extra: solo un objeto pequeño (máx. ~1 KB); si no, se guarda vacío — evita llenar la base.
  const metadataCruda =
    cuerpo.metadata && typeof cuerpo.metadata === 'object' && !Array.isArray(cuerpo.metadata)
      ? (cuerpo.metadata as Record<string, unknown>)
      : {};
  const metadata = JSON.stringify(metadataCruda).length <= 1024 ? metadataCruda : {};

  if (await hayDemasiadosRegistros('event_log')) {
    return NextResponse.json({ ok: true });
  }
  await registrarEvento(cuerpo.type, user?.id ?? null, metadata);
  return NextResponse.json({ ok: true });
}
