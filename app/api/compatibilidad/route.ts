// Compatibilidad zodiacal — texto→texto síncrono (docs/sistema/30-INTEGRACION-IA.md).
// Patrón BFF, mismo esquema que /api/coach y /api/descifrar. Sin API externa de
// efemérides/sinastría (decisión explícita del usuario) — la IA genera el
// análisis directo a partir de los 2 signos, en JSON estricto para poder
// mostrar el % y "Química" gratis y bloquear el resto.

import { NextResponse } from 'next/server';
import { clienteAnthropic, AI_MODEL } from '@/lib/anthropic';

export const runtime = 'nodejs';

const SYSTEM_PROMPT = `Eres LUMA, una coach intuitiva experta en relaciones sentimentales y simbolismo del tarot, con conocimiento profundo de astrología. La usuaria te da su signo zodiacal y el de su pareja o interés amoroso.

Responde EXCLUSIVAMENTE con un JSON válido, sin texto antes ni después, con este formato exacto:
{"porcentaje": 0, "quimica": "...", "friccion": "...", "arcano": "...", "consejo": "..."}

- "porcentaje": un número entero del 1 al 99 (nunca 0, nunca 100 — la conexión real siempre tiene matices) que represente la compatibilidad entre ambos signos.
- "quimica": QUÍMICA Y ATRACCIÓN — 3 frases sobre la dinámica entre sus elementos.
- "friccion": PUNTOS DE FRICCIÓN — dónde chocan y cómo evitar drama innecesario.
- "arcano": ARCANO COMBINADO — asocia la mezcla de ambos signos a un Arcano Mayor del Tarot, nombrándolo.
- "consejo": CONSEJO DE DIGNIDAD — 1 recomendación práctica de comunicación para la usuaria.

Tono de amiga sabia, sofisticado y protector. Nunca predigas el futuro de forma absoluta ni justifiques maltrato o el cruce de límites de dignidad.`;

interface CuerpoEntrada {
  signo1?: unknown;
  signo2?: unknown;
}

interface ResultadoJSON {
  porcentaje?: number;
  quimica?: string;
  friccion?: string;
  arcano?: string;
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

  const signo1 = typeof cuerpo.signo1 === 'string' ? cuerpo.signo1 : '';
  const signo2 = typeof cuerpo.signo2 === 'string' ? cuerpo.signo2 : '';
  if (!signo1 || !signo2) {
    return NextResponse.json({ error: 'Faltan los signos' }, { status: 400 });
  }

  try {
    const client = clienteAnthropic();
    const respuesta = await client.messages.create({
      model: AI_MODEL,
      max_tokens: 700,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: `La usuaria es ${signo1} y su pareja/interés es ${signo2}.` }],
    });

    const bloqueTexto = respuesta.content.find((b) => b.type === 'text');
    const crudo = bloqueTexto && bloqueTexto.type === 'text' ? bloqueTexto.text : '';
    const resultado = crudo ? extraerJSON(crudo) : null;

    if (
      !resultado ||
      typeof resultado.porcentaje !== 'number' ||
      !resultado.quimica ||
      !resultado.friccion ||
      !resultado.arcano ||
      !resultado.consejo
    ) {
      return NextResponse.json({ error: 'Sin respuesta' }, { status: 502 });
    }

    return NextResponse.json({
      porcentaje: Math.max(1, Math.min(99, Math.round(resultado.porcentaje))),
      quimica: resultado.quimica,
      friccion: resultado.friccion,
      arcano: resultado.arcano,
      consejo: resultado.consejo,
    });
  } catch (error) {
    console.error('Error en /api/compatibilidad:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'No se pudo calcular la compatibilidad' }, { status: 502 });
  }
}
