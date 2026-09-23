// Diario emocional — texto→texto síncrono (docs/sistema/30-INTEGRACION-IA.md).
// Patrón BFF, mismo esquema que /api/coach. Antes mostraba SIEMPRE la misma
// frase fija (PATRON_DIARIO_EJEMPLO) sin importar lo que la usuaria escribiera
// — defecto real reportado por el usuario en la auditoría 2026-09-18. Ahora lee
// el registro real y devuelve una reflexión generada de verdad.

import { NextResponse } from 'next/server';
import { clienteAnthropic, AI_MODEL } from '@/lib/anthropic';
import { registrarLlamadaIA, registrarError } from '@/lib/log-servidor';
import { limiteExcedido, identificadorDePeticion } from '@/lib/rate-limit';
import { topeDiarioIAExcedido, idUsuarioOpcional } from '@/lib/tope-ia';

export const runtime = 'nodejs';

const SYSTEM_PROMPT = `Eres LUMA, una coach intuitiva experta en relaciones sentimentales e inteligencia emocional. La usuaria te comparte una entrada de su diario emocional (cómo se siente hoy, con o sin contexto de una relación).

Responde con una sola frase corta (máximo 2 líneas), como una reflexión cálida y perceptiva sobre lo que escribió — nombra el patrón o la emoción de fondo que ves, sin sermonear ni dar consejos genéricos tipo "todo va a estar bien". No repitas literalmente lo que ella ya dijo. Responde SOLO con esa frase, sin comillas ni introducción.

Tono cálido, directo y empático, como una amiga sabia. Nunca predigas el futuro de forma absoluta ni justifiques maltrato o el cruce de límites de dignidad.`;

const MAX_CARACTERES = 2000;

export async function POST(request: Request) {
  if (limiteExcedido(`diario:${identificadorDePeticion(request)}`, 8, 60_000)) {
    return NextResponse.json({ error: 'Demasiadas peticiones seguidas — espera un momento.' }, { status: 429 });
  }
  if (await topeDiarioIAExcedido()) {
    return NextResponse.json(
      { error: 'LUMA está muy solicitada hoy — vuelve a intentarlo mañana.' },
      { status: 503 }
    );
  }
  const usuarioIdIA = await idUsuarioOpcional();

  let cuerpo: { texto?: unknown; animo?: unknown };
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 });
  }

  const texto = typeof cuerpo.texto === 'string' ? cuerpo.texto.trim().slice(0, MAX_CARACTERES) : '';
  const animo = typeof cuerpo.animo === 'string' ? cuerpo.animo : null;
  if (texto.length < 3) {
    return NextResponse.json({ error: 'Falta el registro' }, { status: 400 });
  }

  try {
    const client = clienteAnthropic();
    const respuesta = await client.messages.create({
      model: AI_MODEL,
      max_tokens: 120,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: animo ? `Ánimo de hoy: ${animo}. Entrada: ${texto}` : `Entrada: ${texto}`,
        },
      ],
    });

    const bloqueTexto = respuesta.content.find((b) => b.type === 'text');
    await registrarLlamadaIA('diario', AI_MODEL, respuesta.usage.input_tokens, respuesta.usage.output_tokens, usuarioIdIA);
    const patron = bloqueTexto && bloqueTexto.type === 'text' ? bloqueTexto.text.trim() : '';

    if (!patron) {
      return NextResponse.json({ error: 'Sin respuesta' }, { status: 502 });
    }

    return NextResponse.json({ patron });
  } catch (error) {
    console.error('Error en /api/diario:', error instanceof Error ? error.message : error);
    await registrarError(error instanceof Error ? error.message : String(error), '/api/diario');
    return NextResponse.json({ error: 'No se pudo generar la reflexión' }, { status: 502 });
  }
}
