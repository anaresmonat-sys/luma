// Tirada de tarot — texto→texto síncrono (docs/sistema/30-INTEGRACION-IA.md).
// Patrón BFF, mismo esquema que /api/coach. Las cartas se extraen de verdad de
// lib/tarotDeck.ts (78 cartas, al azar, con estado invertida) — la IA no
// inventa lore de tarot, solo genera la LECTURA conectando el significado real
// de cada carta con la pregunta real de la usuaria.
//
// Tiradas de 3 cartas (pedido del usuario, 2026-09-22, tras investigar apps de
// tarot top como Raka/Nummi/Jenova): Amor, Ruptura, Decisión y Autoconocimiento
// piden 3 cartas con posición propia (lib/tarotDeck.ts → POSICIONES_TIRADA) y
// se leen como UNA sola historia conectada — no 3 párrafos sueltos, que es la
// diferencia real entre una lectura básica y una profesional. Carta del día
// se queda en 1 sola carta, como en todo el sector.

import { NextResponse } from 'next/server';
import { clienteAnthropic, AI_MODEL } from '@/lib/anthropic';
import { registrarLlamadaIA, registrarError } from '@/lib/log-servidor';
import { limiteExcedido, identificadorDePeticion } from '@/lib/rate-limit';
import { topeDiarioIAExcedido, idUsuarioOpcional } from '@/lib/tope-ia';
import { controlarAccesoGratis } from '@/lib/prueba-servidor';

export const runtime = 'nodejs';

// El enfoque de la lectura lo decide la CATEGORÍA de la tirada, no un tema fijo:
// antes el prompt era "coach experta en relaciones sentimentales" siempre, así que
// hasta "Autoconocimiento" (¿qué no estoy viendo de mí misma?) salía leído en clave
// de pareja — defecto real reportado por el usuario, 2026-09-22. Las apps de tarot
// con más ventas separan categorías con enfoque propio (amor, decisiones, autoconocimiento,
// diario) en vez de forzar todo a lo romántico; aquí se replica con un mismo lector
// experto en simbolismo de tarot cuyo ángulo de lectura cambia según la categoría.
const ENFOQUE_POR_CATEGORIA: Record<string, string> = {
  // Pedido explícito del usuario, 2026-09-30: "una experta tarotista no
  // pregunta nunca... tiene que leer las cartas según salgan". No se le
  // pregunta nada a la usuaria antes de tirar (ni "¿pareja o soltera?" ni
  // "¿sobre quién?"): las 3 cartas son neutras (POSICIONES_TIRADA.amor en
  // lib/tarotDeck.ts) y es la IA, leyendo el simbolismo real de las cartas que
  // salieron, quien decide de qué tipo de amor está hablando esa tirada en
  // concreto — pareja, familia, amistad o la relación consigo misma —, tal
  // como haría una tarotista de verdad frente a una tirada sin contexto previo.
  amor: 'Esta tirada es sobre el amor en su sentido más amplio: puede ser pareja, familia, amistad o la relación de la usuaria consigo misma — NO tienes ningún dato sobre cuál de estos es, así que decídelo TÚ, leyendo el simbolismo de las cartas que salieron (sus palos, arcanos y energía) como lo haría una tarotista real sin preguntar nada de antemano. Elige el ángulo que las cartas sugieran con más fuerza y sé clara y concreta sobre cuál es (no dejes la lectura ambigua sobre a quién se refiere). No fuerces pareja por default: si las cartas apuntan más a un patrón interno, a una relación no romántica o a la autoestima, léelo así con total naturalidad.',
  ruptura: 'Enfoca la lectura en el cierre de un ciclo o vínculo que terminó: qué le impide soltar, qué necesita para cerrarlo con paz.',
  decision: 'Enfoca la lectura en una decisión de vida que tiene por delante (no asumas que es sobre pareja salvo que la pregunta lo diga): qué factor no está viendo, qué camino sugiere la carta.',
  autoconocimiento: 'Enfoca la lectura en ella misma: un patrón, una sombra o una fortaleza propia — NO la traduzcas a una relación de pareja salvo que la pregunta lo mencione explícitamente.',
  'carta-del-dia': 'Enfoca la lectura en la energía general del día: un consejo o una actitud a observar, sin asumir que se trata de una relación romántica.',
};

const SYSTEM_PROMPT = `Eres LUMA, una tarotista intuitiva y profesional, con años leyendo cartas de verdad, experta en simbolismo del tarot (78 cartas, arcanos mayores y menores) y en cómo se relaciona la gente. Te doy una o varias cartas (con su posición en la tirada cuando hay más de una), sus palabras clave, la categoría de la tirada y la pregunta concreta de la usuaria.

LA PREGUNTA DE LA USUARIA MANDA SOBRE TODO LO DEMÁS: es el dato más concreto que tienes sobre su vida real — léela con cuidado y ancla la lectura a EXACTAMENTE lo que ella preguntó, no a una interpretación genérica de la categoría. Si pregunta por ella misma (su autoestima, cómo se quiere o se cuida), la lectura es 100% sobre su relación consigo misma — JAMÁS menciones ni insinúes una pareja, ni "alguien especial", ni "esa persona". Si pregunta por su pareja, por alguien que le gusta, por su familia o por una amistad, la lectura es sobre ESE vínculo concreto, no sobre otro. Una lectura que ignora a quién se refiere la pregunta y cae en la interpretación más obvia de la categoría (ej. "amor" = pareja) es una lectura genérica y mala — precisamente lo que NO debes hacer.

Si hay UNA sola carta: escribe 2-3 frases que conecten su significado simbólico (usando sus palabras clave como base, sin listarlas literalmente) con la pregunta, siguiendo el enfoque de la categoría.

Si hay VARIAS cartas: NO las interpretes por separado ni las numeres — léelas como UNA SOLA HISTORIA conectada, tal como lo haría una tarotista profesional de verdad: fíjate si se repite un palo o un tema entre ellas, si una carta suaviza o intensifica a otra, y en lo que dice la posición de cada una dentro de la tirada. Escribe 4-6 frases que tejan las tres cartas entre sí y respondan la pregunta, siguiendo el enfoque de la categoría (no fuerces un ángulo romántico si la categoría no es sobre pareja).

Si alguna carta salió invertida, refleja ese matiz (bloqueo, exceso o la sombra del significado normal), nunca el significado al derecho.

EVITA EL TONO DE HORÓSCOPO GENÉRICO: nada de frases que sirvan para cualquier persona en cualquier situación ("todo pasa por algo", "el universo tiene un plan", "confía en el proceso"). Cada lectura tiene que sonar como si la hubieras pensado PARA ESTA pregunta y ninguna otra — nombra el patrón concreto, el miedo concreto o el paso concreto que las cartas señalan, no una idea flotante y bonita.

Responde SOLO con el texto de la lectura corrida, sin comillas, sin introducción, sin encabezados y sin mencionar "posición 1/2/3".

Tono cálido, directo y empático, como una amiga sabia. Nunca predigas el futuro de forma absoluta ni justifiques maltrato o el cruce de límites de dignidad.`;

interface CartaEntrada {
  posicion?: unknown;
  numero?: unknown;
  nombre?: unknown;
  invertida?: unknown;
  palabrasClave?: unknown;
}

interface CuerpoEntrada {
  cartas?: unknown;
  pregunta?: unknown;
  categoria?: unknown;
}

interface CartaValida {
  posicion: string;
  numero: string;
  nombre: string;
  invertida: boolean;
  palabrasClave: string[];
}

function normalizarCarta(c: unknown): CartaValida | null {
  if (typeof c !== 'object' || c === null) return null;
  const e = c as CartaEntrada;
  const nombre = typeof e.nombre === 'string' ? e.nombre : '';
  if (!nombre) return null;
  return {
    posicion: typeof e.posicion === 'string' ? e.posicion : '',
    numero: typeof e.numero === 'string' ? e.numero : '',
    nombre,
    invertida: e.invertida === true,
    palabrasClave:
      Array.isArray(e.palabrasClave) && e.palabrasClave.every((p) => typeof p === 'string')
        ? (e.palabrasClave as string[]).slice(0, 5)
        : [],
  };
}

export async function POST(request: Request) {
  if (limiteExcedido(`tarot:${identificadorDePeticion(request)}`, 8, 60_000)) {
    return NextResponse.json({ error: 'Demasiadas peticiones seguidas — espera un momento.' }, { status: 429 });
  }
  if (await topeDiarioIAExcedido()) {
    return NextResponse.json(
      { error: 'LUMA está muy solicitada hoy — vuelve a intentarlo mañana.' },
      { status: 503 }
    );
  }
  const usuarioIdIA = await idUsuarioOpcional();

  let cuerpo: CuerpoEntrada;
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 });
  }

  const cartas = (Array.isArray(cuerpo.cartas) ? cuerpo.cartas : [])
    .map(normalizarCarta)
    .filter((c): c is CartaValida => c !== null)
    .slice(0, 3);
  const pregunta = typeof cuerpo.pregunta === 'string' ? cuerpo.pregunta : '';
  const categoria = typeof cuerpo.categoria === 'string' ? cuerpo.categoria : '';
  const enfoque = ENFOQUE_POR_CATEGORIA[categoria] ?? ENFOQUE_POR_CATEGORIA.amor;

  if (cartas.length === 0 || !pregunta) {
    return NextResponse.json({ error: 'Faltan las cartas o la pregunta' }, { status: 400 });
  }

  const descripcionCartas = cartas
    .map((c, i) => {
      const prefijo = c.posicion ? `${c.posicion} — ` : cartas.length > 1 ? `Carta ${i + 1} — ` : '';
      return `${prefijo}${c.numero ? c.numero + ' — ' : ''}${c.nombre}${c.invertida ? ' (INVERTIDA)' : ''}. Palabras clave: ${c.palabrasClave.join(', ') || 'sin datos'}.`;
    })
    .join(' ');

  const acceso = await controlarAccesoGratis(request, usuarioIdIA);
  if (!acceso.permitido) {
    return NextResponse.json({ error: 'prueba_agotada' }, { status: 402 });
  }

  try {
    const client = clienteAnthropic();
    const respuesta = await client.messages.create({
      model: AI_MODEL,
      // 340 se quedaba corto para las "4-6 frases" de una tirada de 3 cartas y
      // la respuesta se cortaba a mitad de una oración (defecto real, 2026-09-30:
      // la lectura de Ruptura terminaba sin llegar al final). 550 da margen de
      // sobra incluso para lecturas largas en español (más denso en tokens que
      // el inglés).
      max_tokens: cartas.length > 1 ? 550 : 220,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Cartas: ${descripcionCartas} Categoría de la tirada: ${enfoque} Pregunta de la usuaria: ${pregunta}`,
        },
      ],
    });

    const bloqueTexto = respuesta.content.find((b) => b.type === 'text');
    await registrarLlamadaIA('tarot', AI_MODEL, respuesta.usage.input_tokens, respuesta.usage.output_tokens, usuarioIdIA);
    const texto = bloqueTexto && bloqueTexto.type === 'text' ? bloqueTexto.text.trim() : '';

    if (!texto) {
      await acceso.devolver();
      return NextResponse.json({ error: 'Sin respuesta' }, { status: 502 });
    }

    return NextResponse.json({ texto });
  } catch (error) {
    await acceso.devolver();
    console.error('Error en /api/tarot:', error instanceof Error ? error.message : error);
    await registrarError(error instanceof Error ? error.message : String(error), '/api/tarot');
    return NextResponse.json({ error: 'No se pudo generar la lectura' }, { status: 502 });
  }
}
