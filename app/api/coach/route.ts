// Coach — texto→texto síncrono (docs/sistema/30-INTEGRACION-IA.md). Patrón BFF:
// el frontend nunca ve la clave; esta ruta la usa desde el servidor.
// Guardarraíl real de gasto: pon un tope de gasto (spend cap) en la consola de
// Anthropic — es la CAPA 0 de 30 y la única protección que no depende de este
// código. El kill-switch por base de datos (tabla ai_calls) llega cuando se
// conecte Supabase más adelante en esta misma sesión.

import { NextResponse } from 'next/server';
import { clienteAnthropic, AI_MODEL } from '@/lib/anthropic';

export const runtime = 'nodejs';

const SYSTEM_PROMPT = `Eres LUMA, una coach intuitiva experta en relaciones sentimentales, inteligencia emocional y simbolismo del tarot. Tu objetivo es ayudar a mujeres a descifrar situaciones confusas, reducir la ansiedad y tomar decisiones con dignidad.

REGLAS DE RESPUESTA:
1. Analiza el mensaje o situación que te da la usuaria identificando: HECHOS, POSIBLE RIESGO y ACCIÓN RECOMENDADA.
2. Si la usuaria hace una tirada de tarot, conecta el significado simbólico de la carta con el caso específico de su relación.
3. Mantén un tono cálido, directo y empático (como una amiga sabia). No uses lenguaje robótico ni enciclopédico.
4. PROHIBICIONES ESTRICTAS: Nunca hagas predicciones absolutas del futuro ("él va a volver el martes"), nunca justifiques maltratos ni recomiendes romper límites de dignidad.`;

interface MensajeEntrada {
  role: 'user' | 'assistant';
  content: string;
}

interface PerfilNumerologico {
  nombre: string;
  signo: string;
  arcano: string;
  numeroAlma: number;
  patronSombra: string;
}

const MAX_MENSAJES_HISTORIAL = 20;
const MAX_CARACTERES_MENSAJE = 4000;

export async function POST(request: Request) {
  let cuerpo: { messages?: unknown; perfil?: unknown };
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 });
  }

  // Si la usuaria ya calculó su Mapa de Poder (numerología + arcano personal,
  // /api/numerologia y /api/mapa-poder), se le pasa a LUMA como ficha técnica —
  // pedido explícito del usuario, 2026-09-18: "así la IA tiene más datos sobre
  // la persona y en coach la puede guiar mejor y más profesional".
  const perfilCrudo = cuerpo.perfil as Partial<PerfilNumerologico> | undefined;
  const perfilCompleto =
    perfilCrudo &&
    typeof perfilCrudo.nombre === 'string' &&
    typeof perfilCrudo.signo === 'string' &&
    typeof perfilCrudo.arcano === 'string' &&
    typeof perfilCrudo.numeroAlma === 'number' &&
    typeof perfilCrudo.patronSombra === 'string'
      ? (perfilCrudo as PerfilNumerologico)
      : null;
  const systemPrompt = perfilCompleto
    ? `${SYSTEM_PROMPT}

ESTÁS HABLANDO CON: ${perfilCompleto.nombre}
- Signo Zodiacal: ${perfilCompleto.signo}
- Arcano Personal: ${perfilCompleto.arcano}
- Número del Alma: ${perfilCompleto.numeroAlma}
- Patrón Emocional: ${perfilCompleto.patronSombra}

INSTRUCCIÓN DE PERSONALIZACIÓN: Usa sutilmente el perfil emocional y astrológico de la usuaria para que tus consejos se sientan profundamente certeros y adaptados a su forma de amar. Nunca le leas la ficha técnica como un reporte frío; úsala como contexto para responder a sus dudas relacionales con máxima empatía e intuición.`
    : SYSTEM_PROMPT;

  const mensajes = cuerpo.messages;
  if (!Array.isArray(mensajes) || mensajes.length === 0) {
    return NextResponse.json({ error: 'Falta la conversación' }, { status: 400 });
  }

  const historial: MensajeEntrada[] = mensajes
    .slice(-MAX_MENSAJES_HISTORIAL)
    .filter(
      (m): m is MensajeEntrada =>
        typeof m === 'object' &&
        m !== null &&
        (m as MensajeEntrada).role !== undefined &&
        ((m as MensajeEntrada).role === 'user' || (m as MensajeEntrada).role === 'assistant') &&
        typeof (m as MensajeEntrada).content === 'string'
    )
    .map((m) => ({ ...m, content: m.content.slice(0, MAX_CARACTERES_MENSAJE) }));

  if (historial.length === 0 || historial[historial.length - 1].role !== 'user') {
    return NextResponse.json({ error: 'La conversación no es válida' }, { status: 400 });
  }

  try {
    const client = clienteAnthropic();
    const respuesta = await client.messages.create({
      model: AI_MODEL,
      max_tokens: 500,
      system: systemPrompt,
      messages: historial,
    });

    const bloqueTexto = respuesta.content.find((b) => b.type === 'text');
    const texto = bloqueTexto && bloqueTexto.type === 'text' ? bloqueTexto.text : '';

    if (!texto) {
      return NextResponse.json({ error: 'Sin respuesta' }, { status: 502 });
    }

    return NextResponse.json({ texto });
  } catch (error) {
    console.error('Error en /api/coach:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'No se pudo generar la respuesta' }, { status: 502 });
  }
}
