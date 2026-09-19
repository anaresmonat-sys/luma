// Lectura de autoconocimiento (Número de Camino de Vida + Arcano personal) —
// texto→texto síncrono (docs/sistema/30-INTEGRACION-IA.md). Patrón BFF, mismo
// esquema que /api/coach. El número y el arcano los calcula lib/numerologyUtils.ts
// (matemática pura, sin API externa) — la IA solo redacta la interpretación.

import { NextResponse } from 'next/server';
import { clienteAnthropic, AI_MODEL } from '@/lib/anthropic';

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
  let cuerpo: CuerpoEntrada;
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 });
  }

  const numero = typeof cuerpo.numero === 'number' ? cuerpo.numero : null;
  const arcano = typeof cuerpo.arcano === 'string' ? cuerpo.arcano : '';
  if (numero === null || !arcano) {
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
    const crudo = bloqueTexto && bloqueTexto.type === 'text' ? bloqueTexto.text : '';
    const resultado = crudo ? extraerJSON(crudo) : null;

    if (!resultado || !resultado.arquetipo || !resultado.superpoder || !resultado.puntoCiego || !resultado.consejo) {
      return NextResponse.json({ error: 'Sin respuesta' }, { status: 502 });
    }

    return NextResponse.json(resultado);
  } catch (error) {
    console.error('Error en /api/numerologia:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'No se pudo generar la lectura' }, { status: 502 });
  }
}
