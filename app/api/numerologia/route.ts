// Lectura de autoconocimiento (Número de Camino de Vida + Arcano personal) —
// texto→texto síncrono (docs/sistema/30-INTEGRACION-IA.md). Patrón BFF, mismo
// esquema que /api/coach. El número y el arcano los calcula lib/numerologyUtils.ts
// (matemática pura, sin API externa) — la IA solo redacta la interpretación.

import { NextResponse } from 'next/server';
import { clienteAnthropic, AI_MODEL } from '@/lib/anthropic';
import { registrarLlamadaIA, registrarError } from '@/lib/log-servidor';
import { limiteExcedido, identificadorDePeticion } from '@/lib/rate-limit';
import { topeDiarioIAExcedido, idUsuarioOpcional } from '@/lib/tope-ia';
import { MAZO_TAROT } from '@/lib/tarotDeck';

// Auditoría de seguridad, 2026-09-23: `arcano` llegaba como texto libre sin
// tope — alguien llamando a esta ruta directamente (sin pasar por la UI)
// podía mandar cualquier cadena. Se valida contra los nombres reales del mazo.
const NOMBRES_ARCANOS = new Set(MAZO_TAROT.filter((c) => c.arcano === 'mayor').map((c) => c.nombre));

export const runtime = 'nodejs';

const SYSTEM_PROMPT = `Eres LUMA, una coach intuitiva experta en relaciones sentimentales, inteligencia emocional y simbolismo del tarot. La usuaria te da su Número de Camino de Vida (numerología) y el Arcano Mayor que le corresponde.

Responde EXCLUSIVAMENTE con un JSON válido, sin texto antes ni después, con este formato exacto:
{"arquetipo": "...", "superpoder": "...", "puntoCiego": "...", "consejo": "..."}

- "arquetipo": TU ARQUETIPO EMOCIONAL — cómo se comporta esta persona cuando se enamora.
- "superpoder": TU SUPERPODER EN LAS RELACIONES — su mayor atractivo inconsciente.
- "puntoCiego": TU PUNTO CIEGO / PATRÓN DE SOMBRA — qué error o ansiedad suele repetir por una herida del pasado.
- "consejo": TU CONSEJO DE SOBERANÍA — una afirmación breve de dignidad para mantener su centro.

Tono cálido, certero, empático y protector — como una amiga sabia que la conoce de verdad. Nunca prediga el futuro de forma absoluta ni justifique maltrato o el cruce de límites de dignidad.`;

interface CuerpoEntrada {
  numero?: unknown;
  arcano?: unknown;
}

interface ResultadoJSON {
  arquetipo?: string;
  superpoder?: string;
  puntoCiego?: string;
  consejo?: string;
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

  try {
    const client = clienteAnthropic();
    const respuesta = await client.messages.create({
      model: AI_MODEL,
      max_tokens: 700,
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: `Número de Camino de Vida: ${numero}. Arcano: ${arcano}.` },
      ],
    });

    const bloqueTexto = respuesta.content.find((b) => b.type === 'text');
    await registrarLlamadaIA('numerologia', AI_MODEL, respuesta.usage.input_tokens, respuesta.usage.output_tokens, usuarioIdIA);
    const crudo = bloqueTexto && bloqueTexto.type === 'text' ? bloqueTexto.text : '';
    const resultado = crudo ? extraerJSON(crudo) : null;

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
