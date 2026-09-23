// Descifra la conversación — texto→texto síncrono (docs/sistema/30-INTEGRACION-IA.md).
// Patrón BFF, mismo esquema que /api/coach: la clave vive solo en el servidor.
// Responde en JSON estricto (3 campos fijos) para que la UI siga mostrando las
// mismas 3 tarjetas de siempre (Lo que vemos / Posible riesgo / Pregunta para ti),
// ahora con contenido real en vez del ejemplo fijo.

import { NextResponse } from 'next/server';
import { clienteAnthropic, AI_MODEL } from '@/lib/anthropic';
import { registrarLlamadaIA, registrarError } from '@/lib/log-servidor';
import { limiteExcedido, identificadorDePeticion } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const SYSTEM_PROMPT = `Eres LUMA, una coach intuitiva experta en relaciones sentimentales e inteligencia emocional. La usuaria te pega una conversación (mensajes de texto) y tú la analizas para ayudarla a ver con claridad.

Responde EXCLUSIVAMENTE con un JSON válido, sin texto antes ni después, con este formato exacto:
{"vemos": "...", "riesgo": "...", "pregunta": "..."}

- "vemos": 1-2 frases con los HECHOS objetivos de lo que dice el mensaje — describe solo lo que está escrito, sin inventar intenciones que no están ahí.
- "riesgo": 1-2 frases sobre la posible señal de alerta o discrepancia entre lo que dice y lo que hace, si la hay. Si no ves ningún riesgo real, dilo con honestidad en vez de inventar uno.
- "pregunta": una sola pregunta reflexiva y corta para que ella se la haga a sí misma (no para que se la mande a él).

Tono cálido, directo y empático, como una amiga sabia — nunca robótico ni enciclopédico. Nunca predigas el futuro de forma absoluta ni justifiques maltrato o el cruce de límites de dignidad.`;

const MAX_CARACTERES = 4000;

interface AnalisisJSON {
  vemos?: string;
  riesgo?: string;
  pregunta?: string;
}

function extraerJSON(texto: string): AnalisisJSON | null {
  try {
    return JSON.parse(texto) as AnalisisJSON;
  } catch {
    const match = texto.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]) as AnalisisJSON;
    } catch {
      return null;
    }
  }
}

export async function POST(request: Request) {
  if (limiteExcedido(`descifrar:${identificadorDePeticion(request)}`, 8, 60_000)) {
    return NextResponse.json({ error: 'Demasiadas peticiones seguidas — espera un momento.' }, { status: 429 });
  }

  let cuerpo: { texto?: unknown };
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 });
  }

  const texto = typeof cuerpo.texto === 'string' ? cuerpo.texto.trim().slice(0, MAX_CARACTERES) : '';
  if (texto.length < 10) {
    return NextResponse.json({ error: 'Falta la conversación' }, { status: 400 });
  }

  try {
    const client = clienteAnthropic();
    const respuesta = await client.messages.create({
      model: AI_MODEL,
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: texto }],
    });

    const bloqueTexto = respuesta.content.find((b) => b.type === 'text');
    await registrarLlamadaIA('descifrar', AI_MODEL, respuesta.usage.input_tokens, respuesta.usage.output_tokens);
    const crudo = bloqueTexto && bloqueTexto.type === 'text' ? bloqueTexto.text : '';
    const analisis = crudo ? extraerJSON(crudo) : null;

    if (!analisis || !analisis.vemos || !analisis.riesgo || !analisis.pregunta) {
      return NextResponse.json({ error: 'Sin respuesta' }, { status: 502 });
    }

    return NextResponse.json({
      analisis: [
        { id: 'vemos', emoji: '👀', color: 'var(--an-eye)', titulo: 'Lo que vemos', texto: analisis.vemos },
        { id: 'riesgo', emoji: '⚠️', color: 'var(--an-risk)', titulo: 'Posible riesgo', texto: analisis.riesgo },
        { id: 'pregunta', emoji: '🤔', color: 'var(--an-question)', titulo: 'Pregunta para ti', texto: analisis.pregunta },
      ],
    });
  } catch (error) {
    console.error('Error en /api/descifrar:', error instanceof Error ? error.message : error);
    await registrarError(error instanceof Error ? error.message : String(error), '/api/descifrar');
    return NextResponse.json({ error: 'No se pudo generar el análisis' }, { status: 502 });
  }
}
