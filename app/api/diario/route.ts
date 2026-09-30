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
import { controlarAccesoGratis } from '@/lib/prueba-servidor';
import { crearClienteServidor } from '@/lib/supabase/server';

export const runtime = 'nodejs';

const SYSTEM_PROMPT = `Eres LUMA, una tarotista intuitiva y profesional, experta también en inteligencia emocional y en cómo nos relacionamos — con la pareja, la familia, las amistades o con una misma. La usuaria te comparte una entrada de su diario emocional.

Responde con una sola frase corta (máximo 2 líneas), como una reflexión cálida y perceptiva sobre lo que escribió — nombra el patrón o la emoción de fondo que ves, sin sermonear ni dar consejos genéricos tipo "todo va a estar bien". No repitas literalmente lo que ella ya dijo. Responde SOLO con esa frase, sin comillas ni introducción.

NO recurras a "calma" o "ansiedad" como reflejo automático — son solo dos emociones posibles entre muchas (alegría, orgullo, cansancio, ilusión, culpa, enojo, alivio, nostalgia...). Fíjate en la palabra o el detalle CONCRETO de lo que ella escribió esta vez y arma la frase a partir de eso, no de una plantilla emocional genérica que serviría para cualquier entrada. Nada de frases de horóscopo que sirvan para cualquier persona en cualquier situación.

Tono cálido, directo y empático, como una amiga sabia. Nunca predigas el futuro de forma absoluta ni justifiques maltrato o el cruce de límites de dignidad.`;

// Cuando la entrada es una lectura de tarot guardada tal cual (botón "Guardar
// en mi diario" de /app/tarot), NO es un relato de la usuaria sobre su día —
// es texto que LA PROPIA LUMA ya escribió como lectura. Sin este aviso, el
// prompt de arriba trataba esa lectura como si fuera un desahogo personal y,
// al no tener ningún hecho concreto de la vida real de la usuaria del cual
// tirar, caía en una reflexión vacía y genérica (defecto real reportado por
// el usuario, 2026-09-30: "esto que dice es genérico y sigue apelando a la
// calma"). Ahora se le avisa explícitamente para que reaccione A LA LECTURA,
// no que finja ver un patrón de vida que nunca vio.
const AVISO_ORIGEN_TAROT = `\n\nOJO: este texto NO es algo que la usuaria haya escrito sobre su vida — es una lectura de tarot que tú (LUMA) ya generaste antes y ella guardó en su diario. No inventes un "patrón" sobre su vida real, porque no tienes ningún hecho suyo del cual partir. En vez de eso, responde como si la acompañaras a quedarse con lo esencial de ESA lectura: nombra el punto concreto de la lectura que más vale la pena que no suelte (la carta, la imagen o la frase exacta que usaste), no una frase motivacional genérica.`;

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

  let cuerpo: { texto?: unknown; animo?: unknown; origen?: unknown };
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 });
  }

  const texto = typeof cuerpo.texto === 'string' ? cuerpo.texto.trim().slice(0, MAX_CARACTERES) : '';
  const animo = typeof cuerpo.animo === 'string' ? cuerpo.animo : null;
  const esLecturaTarot = cuerpo.origen === 'tarot';
  if (texto.length < 3) {
    return NextResponse.json({ error: 'Falta el registro' }, { status: 400 });
  }

  const acceso = await controlarAccesoGratis(request, usuarioIdIA);
  if (!acceso.permitido) {
    return NextResponse.json({ error: 'prueba_agotada' }, { status: 402 });
  }

  try {
    const client = clienteAnthropic();
    const respuesta = await client.messages.create({
      model: AI_MODEL,
      max_tokens: 120,
      system: esLecturaTarot ? SYSTEM_PROMPT + AVISO_ORIGEN_TAROT : SYSTEM_PROMPT,
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
      await acceso.devolver();
      return NextResponse.json({ error: 'Sin respuesta' }, { status: 502 });
    }

    // Guardar de verdad el registro (antes solo vivía en localStorage, así que
    // se perdía al cambiar de celular o borrar datos del navegador — defecto
    // real, 2026-09-29: sin esto no hay ningún historial que mostrar). Solo con
    // sesión real: con RLS (insert_own), cada quien solo puede escribir la suya.
    // Si falla el guardado, la reflexión igual se entrega — no se bloquea a
    // nadie por un problema de la base de datos.
    if (usuarioIdIA) {
      const supabase = await crearClienteServidor();
      const { error: errorGuardar } = await supabase
        .from('journal_entries')
        .insert({ user_id: usuarioIdIA, texto, animo, patron });
      if (errorGuardar) {
        await registrarError(errorGuardar.message, '/api/diario:guardar');
      }
    }

    return NextResponse.json({ patron });
  } catch (error) {
    await acceso.devolver();
    console.error('Error en /api/diario:', error instanceof Error ? error.message : error);
    await registrarError(error instanceof Error ? error.message : String(error), '/api/diario');
    return NextResponse.json({ error: 'No se pudo generar la reflexión' }, { status: 502 });
  }
}
