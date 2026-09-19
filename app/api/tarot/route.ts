// Tirada de tarot — texto→texto síncrono (docs/sistema/30-INTEGRACION-IA.md).
// Patrón BFF, mismo esquema que /api/coach. La carta la extrae de verdad
// lib/tarotDeck.ts (78 cartas, al azar, con estado invertida) — la IA no
// inventa lore de tarot, solo genera la LECTURA conectando el significado real
// de la carta (sus palabras clave al derecho o invertida, según corresponda)
// con la pregunta real de la usuaria.

import { NextResponse } from 'next/server';
import { clienteAnthropic, AI_MODEL } from '@/lib/anthropic';

export const runtime = 'nodejs';

const SYSTEM_PROMPT = `Eres LUMA, una coach intuitiva experta en relaciones sentimentales y simbolismo del tarot. Te doy el nombre de una carta (si salió invertida o no), sus palabras clave y la pregunta que la usuaria quiere responder sobre su situación sentimental.

Escribe la LECTURA: 2-3 frases que conecten el significado simbólico de la carta (usando sus palabras clave como base, sin listarlas literalmente) con su pregunta concreta. Si la carta salió invertida, la lectura debe reflejar ese matiz (bloqueo, exceso o la sombra del significado normal), no el significado al derecho. Responde SOLO con el texto de la lectura, sin comillas, sin introducción.

Tono cálido, directo y empático, como una amiga sabia. Nunca predigas el futuro de forma absoluta ni justifiques maltrato o el cruce de límites de dignidad.`;

interface CuerpoEntrada {
  numero?: unknown;
  nombre?: unknown;
  invertida?: unknown;
  palabrasClave?: unknown;
  pregunta?: unknown;
}

export async function POST(request: Request) {
  let cuerpo: CuerpoEntrada;
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 });
  }

  const numero = typeof cuerpo.numero === 'string' ? cuerpo.numero : '';
  const nombre = typeof cuerpo.nombre === 'string' ? cuerpo.nombre : '';
  const invertida = cuerpo.invertida === true;
  const palabrasClave =
    Array.isArray(cuerpo.palabrasClave) && cuerpo.palabrasClave.every((p) => typeof p === 'string')
      ? (cuerpo.palabrasClave as string[]).slice(0, 5)
      : [];
  const pregunta = typeof cuerpo.pregunta === 'string' ? cuerpo.pregunta : '';

  if (!nombre || !pregunta) {
    return NextResponse.json({ error: 'Falta la carta o la pregunta' }, { status: 400 });
  }

  try {
    const client = clienteAnthropic();
    const respuesta = await client.messages.create({
      model: AI_MODEL,
      max_tokens: 220,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Carta: ${numero ? numero + ' — ' : ''}${nombre}${invertida ? ' (INVERTIDA)' : ''}. Palabras clave: ${palabrasClave.join(', ') || 'sin datos'}. Pregunta de la usuaria: ${pregunta}`,
        },
      ],
    });

    const bloqueTexto = respuesta.content.find((b) => b.type === 'text');
    const texto = bloqueTexto && bloqueTexto.type === 'text' ? bloqueTexto.text.trim() : '';

    if (!texto) {
      return NextResponse.json({ error: 'Sin respuesta' }, { status: 502 });
    }

    return NextResponse.json({ texto });
  } catch (error) {
    console.error('Error en /api/tarot:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'No se pudo generar la lectura' }, { status: 502 });
  }
}
