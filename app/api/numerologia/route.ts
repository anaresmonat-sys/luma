// Lectura de autoconocimiento (Número de Camino de Vida + Arcano personal) —
// texto→texto síncrono (docs/sistema/30-INTEGRACION-IA.md). Patrón BFF, mismo
// esquema que /api/coach. El número y el arcano los calcula lib/numerologyUtils.ts
// (matemática pura, sin API externa) — la IA solo redacta la interpretación.

import { NextResponse } from 'next/server';
import { clienteAnthropic, AI_MODEL, REGLA_DE_IDIOMA } from '@/lib/anthropic';
import { instruccionDeTrato } from '@/lib/trato';
import { leerTrato } from '@/lib/trato-servidor';
import { registrarLlamadaIA, registrarError } from '@/lib/log-servidor';
import { limiteExcedido, identificadorDePeticion } from '@/lib/rate-limit';
import { topeDiarioIAExcedido, idUsuarioOpcional } from '@/lib/tope-ia';
import { MAZO_TAROT } from '@/lib/tarotDeck';

// Auditoría de seguridad, 2026-09-23: `arcano` llegaba como texto libre sin
// tope — alguien llamando a esta ruta directamente (sin pasar por la UI)
// podía mandar cualquier cadena. Se valida contra los nombres reales del mazo.
const NOMBRES_ARCANOS = new Set(MAZO_TAROT.filter((c) => c.arcano === 'mayor').map((c) => c.nombre));

export const runtime = 'nodejs';

const SYSTEM_PROMPT = `Eres LUMA, una coach intuitiva experta en relaciones sentimentales, inteligencia emocional y simbolismo del tarot. La persona usuaria te da su Número de Camino de Vida (numerología) y el Arcano Mayor que le corresponde.

Responde EXCLUSIVAMENTE con un JSON válido, sin texto antes ni después, con este formato exacto:
{"arquetipo": "...", "superpoder": "...", "puntoCiego": "...", "consejo": "..."}

- "arquetipo": TU ARQUETIPO EMOCIONAL — cómo se comporta esta persona cuando se enamora.
- "superpoder": TU SUPERPODER EN LAS RELACIONES — su mayor atractivo inconsciente.
- "puntoCiego": TU PUNTO CIEGO / PATRÓN DE SOMBRA — qué error o miedo suele repetir por una herida del pasado.
- "consejo": TU CONSEJO DE SOBERANÍA — una afirmación breve de dignidad para mantener su centro.

Tono cálido, certero, empático y protector — como alguien sabio de confianza que te conoce de verdad. Nunca prediga el futuro de forma absoluta ni justifique maltrato o el cruce de límites de dignidad.`;

// Mapa ampliado (2026-10-15): lee a la persona ENTERA — no solo cómo ama. Cada dato del mapa alimenta
// una faceta distinta. El reto va aparte y la pantalla lo muestra dentro de la tarjeta de la esencia.
const SYSTEM_PROMPT_AMPLIADO = `Eres LUMA, una coach intuitiva experta en autoconocimiento, inteligencia emocional y simbolismo del tarot y la numerología. Te doy cinco datos de una persona: su Arcano de nacimiento, su Número de Camino de Vida (de la fecha), su Número de Expresión (todas las letras de su nombre), su Número del Alma (las vocales) y su Número de Personalidad (las consonantes).

Responde EXCLUSIVAMENTE con un JSON válido, sin texto antes ni después, con este formato exacto:
{"esencia": "...", "reto": "...", "proposito": "...", "talentos": "...", "deseos": "...", "imagen": "..."}

Cada campo mira UNA faceta distinta de la persona, sin repetir ideas entre campos:
- "esencia": QUIÉN ES de fondo, según el Arcano de nacimiento: su carácter y su fuerza central (máximo 45 palabras).
- "reto": el patrón o la sombra de ese mismo arcano que le cuesta (1 frase, máximo 25 palabras). Honesto y cálido, sin dramatizar.
- "proposito": su misión o rumbo de vida, según el Camino de Vida (máximo 40 palabras).
- "talentos": sus habilidades naturales según el Número de Expresión, y cómo se notan en su trabajo, su dinero y sus decisiones (máximo 40 palabras).
- "deseos": lo que de verdad la mueve por dentro según el Número del Alma — en el amor y en la vida (máximo 40 palabras).
- "imagen": cómo la ven los demás según el Número de Personalidad, y qué suele malinterpretarse de ella (máximo 40 palabras).

NO reduzcas la lectura al amor: el amor aparece solo donde corresponde (sobre todo en "deseos"). Háblale en segunda persona (tú), sin marcas de género. Tono cálido, certero y cercano, como una amiga sabia que la conoce — nunca de horóscopo genérico ni con frases que sirvan para cualquiera. Habla de tendencias ("tiendes a", "es probable que"), nunca de certezas ni de predicciones. Nunca justifiques maltrato ni el cruce de límites de dignidad. Escribe TODO en español neutro, sin palabras en otros idiomas.`;

interface CuerpoEntrada {
  numero?: unknown;
  arcano?: unknown;
  expresion?: unknown;
  alma?: unknown;
  personalidad?: unknown;
}

interface ResultadoJSON {
  arquetipo?: string;
  superpoder?: string;
  puntoCiego?: string;
  consejo?: string;
  esencia?: string;
  reto?: string;
  proposito?: string;
  talentos?: string;
  deseos?: string;
  imagen?: string;
}

// Palabras clave en español de cada número: anclan la lectura (y evitan que el modelo meta términos en otro idioma).
const CLAVES_NUMERO: Record<number, string> = {
  1: 'independencia, iniciativa, liderazgo',
  2: 'sensibilidad, cooperación, diplomacia',
  3: 'expresión, creatividad, alegría',
  4: 'orden, constancia, estabilidad, trabajo',
  5: 'libertad, cambio, curiosidad',
  6: 'cuidado, responsabilidad, armonía',
  7: 'análisis, introspección, búsqueda de verdad',
  8: 'ambición, firmeza, manejo del poder y del dinero',
  9: 'compasión, generosidad, cierre de ciclos',
  11: 'intuición elevada, inspiración, sensibilidad',
  22: 'visión práctica, construcción a gran escala',
};

function claves(n: number): string {
  return CLAVES_NUMERO[n] ? ` (${CLAVES_NUMERO[n]})` : '';
}

// Quita guiones blandos y caracteres invisibles que a veces se cuelan en la salida del modelo.
function limpiar(v: string): string {
  return v.replace(/[\u00AD\u200B-\u200D\uFEFF]/g, '').trim();
}

function numeroValido(v: unknown): number | null {
  return typeof v === 'number' && Number.isInteger(v) && v > 0 && v <= 99 ? v : null;
}

function extraerJSON(texto: string): ResultadoJSON | null {
  try {
    return JSON.parse(texto) as ResultadoJSON;
  } catch {
    const match = texto.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]) as ResultadoJSON;
    } catch {
      return null;
    }
  }
}

export async function POST(request: Request) {
  if (limiteExcedido(`numerologia:${identificadorDePeticion(request)}`, 8, 60_000)) {
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

  const numero =
    typeof cuerpo.numero === 'number' && Number.isInteger(cuerpo.numero) && cuerpo.numero > 0 && cuerpo.numero <= 99
      ? cuerpo.numero
      : null;
  const arcano = typeof cuerpo.arcano === 'string' ? cuerpo.arcano : '';
  if (numero === null || !NOMBRES_ARCANOS.has(arcano)) {
    return NextResponse.json({ error: 'Faltan el número o el arcano' }, { status: 400 });
  }

  const expresion = numeroValido(cuerpo.expresion);
  const alma = numeroValido(cuerpo.alma);
  const personalidad = numeroValido(cuerpo.personalidad);
  const ampliado = expresion !== null && alma !== null && personalidad !== null;

  try {
    const client = clienteAnthropic();
    const respuesta = await client.messages.create({
      model: AI_MODEL,
      // Sin "pensar" antes de responder: el modelo gastaba todo max_tokens en un bloque de razonamiento y
      // devolvía el texto cortado o vacío (visto en Tarot 3 cartas y en Descifrar, 2026-10-13).
      thinking: { type: 'disabled' },
      max_tokens: ampliado ? 900 : 700,
      system: (ampliado ? SYSTEM_PROMPT_AMPLIADO : SYSTEM_PROMPT) + REGLA_DE_IDIOMA + instruccionDeTrato(await leerTrato()),
      messages: [
        {
          role: 'user',
          content: ampliado
            ? `Arcano de nacimiento: ${arcano}. Número de Camino de Vida: ${numero}${claves(numero)}. Número de Expresión: ${expresion}${claves(expresion!)}. Número del Alma: ${alma}${claves(alma!)}. Número de Personalidad: ${personalidad}${claves(personalidad!)}.`
            : `Número de Camino de Vida: ${numero}. Arcano: ${arcano}.`,
        },
      ],
    });

    const bloqueTexto = respuesta.content.find((b) => b.type === 'text');
    await registrarLlamadaIA('numerologia', AI_MODEL, respuesta.usage.input_tokens, respuesta.usage.output_tokens, usuarioIdIA);
    const crudo = bloqueTexto && bloqueTexto.type === 'text' ? bloqueTexto.text : '';
    const resultado = crudo ? extraerJSON(crudo) : null;

    if (ampliado) {
      if (
        !resultado ||
        !resultado.esencia ||
        !resultado.reto ||
        !resultado.proposito ||
        !resultado.talentos ||
        !resultado.deseos ||
        !resultado.imagen
      ) {
        return NextResponse.json({ error: 'Sin respuesta' }, { status: 502 });
      }
      return NextResponse.json({
        esencia: limpiar(resultado.esencia),
        reto: limpiar(resultado.reto),
        proposito: limpiar(resultado.proposito),
        talentos: limpiar(resultado.talentos),
        deseos: limpiar(resultado.deseos),
        imagen: limpiar(resultado.imagen),
      });
    }

    if (!resultado || !resultado.arquetipo || !resultado.superpoder || !resultado.puntoCiego || !resultado.consejo) {
      return NextResponse.json({ error: 'Sin respuesta' }, { status: 502 });
    }

    return NextResponse.json(resultado);
  } catch (error) {
    console.error('Error en /api/numerologia:', error instanceof Error ? error.message : error);
    await registrarError(error instanceof Error ? error.message : String(error), '/api/numerologia');
    return NextResponse.json({ error: 'No se pudo generar la lectura' }, { status: 502 });
  }
}
