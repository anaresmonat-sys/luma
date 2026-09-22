// Tirada de tarot — texto→texto síncrono (docs/sistema/30-INTEGRACION-IA.md).
// Patrón BFF, mismo esquema que /api/coach. La carta la extrae de verdad
// lib/tarotDeck.ts (78 cartas, al azar, con estado invertida) — la IA no
// inventa lore de tarot, solo genera la LECTURA conectando el significado real
// de la carta (sus palabras clave al derecho o invertida, según corresponda)
// con la pregunta real de la usuaria.

import { NextResponse } from 'next/server';
import { clienteAnthropic, AI_MODEL } from '@/lib/anthropic';

export const runtime = 'nodejs';

// El enfoque de la lectura lo decide la CATEGORÍA de la tirada, no un tema fijo:
// antes el prompt era "coach experta en relaciones sentimentales" siempre, así que
// hasta "Autoconocimiento" (¿qué no estoy viendo de mí misma?) salía leído en clave
// de pareja — defecto real reportado por el usuario, 2026-09-22. Las apps de tarot
// con más ventas separan categorías con enfoque propio (amor, decisiones, autoconocimiento,
// diario) en vez de forzar todo a lo romántico; aquí se replica con un mismo lector
// experto en simbolismo de tarot cuyo ángulo de lectura cambia según la categoría.
const ENFOQUE_POR_CATEGORIA: Record<string, string> = {
  amor: 'Enfoca la lectura en su vínculo romántico o la persona que le importa: qué dice la carta de esa relación o de cómo se está vinculando.',
  ruptura: 'Enfoca la lectura en el cierre de un ciclo o vínculo que terminó: qué le impide soltar, qué necesita para cerrarlo con paz.',
  decision: 'Enfoca la lectura en una decisión de vida que tiene por delante (no asumas que es sobre pareja salvo que la pregunta lo diga): qué factor no está viendo, qué camino sugiere la carta.',
  autoconocimiento: 'Enfoca la lectura en ella misma: un patrón, una sombra o una fortaleza propia — NO la traduzcas a una relación de pareja salvo que la pregunta lo mencione explícitamente.',
  'carta-del-dia': 'Enfoca la lectura en la energía general del día: un consejo o una actitud a observar, sin asumir que se trata de una relación romántica.',
};

const SYSTEM_PROMPT = `Eres LUMA, una tarotista profesional experta en simbolismo del tarot (78 cartas, arcanos mayores y menores). Te doy el nombre de una carta (si salió invertida o no), sus palabras clave, la categoría de la tirada y la pregunta concreta de la usuaria.

Escribe la LECTURA: 2-3 frases que conecten el significado simbólico de la carta (usando sus palabras clave como base, sin listarlas literalmente) con su pregunta concreta, siguiendo el enfoque de la categoría indicada — no fuerces un ángulo romántico si la categoría no es sobre pareja. Si la carta salió invertida, la lectura debe reflejar ese matiz (bloqueo, exceso o la sombra del significado normal), no el significado al derecho. Responde SOLO con el texto de la lectura, sin comillas, sin introducción.

Tono cálido, directo y empático, como una amiga sabia. Nunca predigas el futuro de forma absoluta ni justifiques maltrato o el cruce de límites de dignidad.`;

interface CuerpoEntrada {
  numero?: unknown;
  nombre?: unknown;
  invertida?: unknown;
  palabrasClave?: unknown;
  pregunta?: unknown;
  categoria?: unknown;
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
  const categoria = typeof cuerpo.categoria === 'string' ? cuerpo.categoria : '';
  const enfoque = ENFOQUE_POR_CATEGORIA[categoria] ?? ENFOQUE_POR_CATEGORIA.amor;

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
          content: `Carta: ${numero ? numero + ' — ' : ''}${nombre}${invertida ? ' (INVERTIDA)' : ''}. Palabras clave: ${palabrasClave.join(', ') || 'sin datos'}. Categoría de la tirada: ${enfoque} Pregunta de la usuaria: ${pregunta}`,
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
