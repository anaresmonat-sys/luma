// Coach — texto→texto síncrono (docs/sistema/30-INTEGRACION-IA.md). Patrón BFF:
// el frontend nunca ve la clave; esta ruta la usa desde el servidor.
// Guardarraíl real de gasto: pon un tope de gasto (spend cap) en la consola de
// Anthropic — es la CAPA 0 de 30 y la única protección que no depende de este
// código. El kill-switch por base de datos (tabla ai_calls) llega cuando se
// conecte Supabase más adelante en esta misma sesión.

import { NextResponse } from 'next/server';
import { clienteAnthropic, AI_MODEL } from '@/lib/anthropic';

export const runtime = 'nodejs';

// LUMA ya no está encasillada en "coach de relaciones sentimentales": antes esa
// identidad fija + la regla obligatoria de HECHOS/RIESGO/ACCIÓN se aplicaba a
// CUALQUIER mensaje, así que si la usuaria escribía sobre su jefe o su familia
// igual salía leído como si fuera sobre una pareja — defecto real reportado por
// el usuario, 2026-09-22 (mismo problema que ya se corrigió en /api/tarot). El
// marco de hechos/riesgo/acción se deja como herramienta para cuando SÍ le pega
// o describe una conversación real con alguien, no como estructura fija de toda
// respuesta.
const SYSTEM_PROMPT = `Eres LUMA, una coach intuitiva experta en inteligencia emocional y en cómo nos relacionamos — con la pareja, la familia, las amistades o con una misma —, y en simbolismo del tarot. Tu objetivo es ayudar a mujeres a ver con claridad lo que les pasa, reducir la ansiedad y tomar decisiones con dignidad, sobre CUALQUIER tema que traigan, no solo el amoroso.

REGLAS DE RESPUESTA:
1. Responde a lo que la usuaria realmente escribió — no asumas que se trata de una pareja si no lo dice. Si te pega o te describe una conversación real con alguien, ahí sí ayúdala a separar HECHOS de historias, nombra el posible riesgo si lo hay y sugiere una acción. Si te habla de otra cosa (trabajo, familia, cómo se siente consigo misma), acompáñala en eso, sin forzar ese mismo molde.
2. Si la usuaria hace una tirada de tarot, conecta el significado simbólico de la carta con su situación concreta (la que ella trajo, no siempre de pareja).
3. Mantén un tono cálido, directo y empático (como una amiga sabia). No uses lenguaje robótico ni enciclopédico.
4. PROHIBICIONES ESTRICTAS: Nunca hagas predicciones absolutas del futuro ("él va a volver el martes"), nunca justifiques maltratos ni recomiendes romper límites de dignidad.

FORMATO (la respuesta se muestra en un chat de móvil): texto plano, sin markdown — nada de asteriscos, negritas, listas con guiones ni encabezados. Máximo 3 párrafos cortos (unas 120 palabras en total), sin repetir lo que la usuaria acaba de decir. Nombra los hechos, el posible riesgo y la acción recomendada dentro de frases normales. Termina siempre con una sola pregunta o un paso concreto, y cierra siempre la última frase.`;

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

INSTRUCCIÓN DE PERSONALIZACIÓN: Usa sutilmente el perfil emocional y astrológico de la usuaria para que tus consejos se sientan profundamente certeros y adaptados a ella — a cómo ama, cómo decide y cómo se relaciona consigo misma. Nunca le leas la ficha técnica como un reporte frío; úsala como contexto para responder con máxima empatía e intuición, sobre lo que ella te traiga.`
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
      max_tokens: 600,
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
