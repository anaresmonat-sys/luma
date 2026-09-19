// FLUJO DEL ONBOARDING — copy y pasos, trazados a FICHA-AVATAR.md (57 §9 / test de
// traza de 52). Cada pregunta ecoa un DOLOR; el reconocimiento usa el dolor
// emocional/identidad #1 en el lenguaje literal de la ficha. 3 preguntas reales +
// 1 reconocimiento, y el flujo TERMINA al responder "ayuda": salta directo a la
// pantalla real elegida (feedback directo del usuario, 2026-09-17, dos rondas:
// primero se quitaron "pausa semanal" y "hora de recordatorio" por forzar un
// compromiso de hábito antes de resolver el motivo puntual; después el usuario
// pidió ir más lejos — "estamos vendiendo la app, no haciendo encuestas" — y se
// quitó TODO lo que seguía a "ayuda" —temor, 2º reconocimiento, atribución,
// reconocimiento final, plan— porque nadie los ve: la persona entra directo a
// probar gratis UNA vez la función real que eligió, ver `lib/prueba-gratis.ts`,
// y recién si quiere un segundo resultado real se le muestra el paywall).

export type OpcionChip = { id: string; emoji: string; label: string };

export type PasoChip = {
  tipo: 'chip';
  id: string;
  pregunta: string;
  microcopy?: string;
  opciones: OpcionChip[];
  otraCosa?: boolean;
};

export type PasoReconocimiento = {
  tipo: 'reconocimiento';
  id: string;
  emoji: string;
  // Recibe las respuestas acumuladas y devuelve título/cuerpo ya personalizados.
  render: (r: Respuestas) => { titulo: string; cuerpo: string };
};

export type Paso = PasoChip | PasoReconocimiento;

/** IDs de las preguntas REALES (excluye el reconocimiento, que no pide datos). */
export const IDS_PREGUNTAS_REALES = ['motivo', 'momento', 'ayuda'] as const;

export interface Respuestas {
  motivo?: string;
  motivoLabel?: string;
  momento?: string;
  momentoLabel?: string;
  ayuda?: string;
  ayudaLabel?: string;
}

/** A qué pantalla real salta la persona apenas responde "ayuda" — el onboarding
 * termina ahí, no hay pantallas de encuesta después. */
export const RUTA_POR_AYUDA: Record<string, string> = {
  analizar: '/app/descifrar',
  coach: '/app/coach',
  tarot: '/app/tarot',
  diario: '/app/diario',
};

// dolor #1 de FICHA-AVATAR: "Estoy obsesionada mirando el teléfono a ver si ya me respondió"
// dolor #2: "No sé qué responderle sin quedar como que me importa demasiado"

/** La pregunta 2 ("momento") se adapta a lo que la usuaria respondió en la
 * pregunta 1 ("motivo") — antes asumía "esa ansiedad" para TODAS las
 * respuestas, incluso para quien eligió "Quiero entender mis patrones" (que
 * no implica ansiedad). Feedback real del usuario, 2026-09-17. */
function pasoMomento(r: Respuestas): PasoChip {
  const base = {
    tipo: 'chip' as const,
    id: 'momento',
    microcopy: 'Así sabemos en qué momento ayudarte más.',
  };
  if (r.motivo === 'ruptura') {
    return {
      ...base,
      pregunta: '¿Cuándo se te hace más [acento]difícil[/acento]?',
      opciones: [
        { id: 'noche', emoji: '🌙', label: 'De noche, antes de dormir' },
        { id: 'recordatorio', emoji: '💭', label: 'Cuando algo te lo recuerda' },
        { id: 'redes', emoji: '📱', label: 'Al ver sus redes sociales' },
        { id: 'todo-el-dia', emoji: '😮‍💨', label: 'Prácticamente todo el día' },
      ],
    };
  }
  if (r.motivo === 'patrones') {
    return {
      ...base,
      pregunta: '¿Cuándo notas más ese [acento]patrón[/acento]?',
      opciones: [
        { id: 'conocer', emoji: '👋', label: 'Cuando conozco a alguien nuevo' },
        { id: 'conflicto', emoji: '💬', label: 'Después de una conversación difícil' },
        { id: 'mirar-atras', emoji: '🔁', label: 'Cuando miro atrás' },
        { id: 'casi-siempre', emoji: '😮‍💨', label: 'Casi siempre' },
      ],
    };
  }
  // 'conociendo' | 'pareja' | "otra cosa" | sin responder
  return {
    ...base,
    pregunta: '¿Cuándo sientes esto con más [acento]fuerza[/acento]?',
    opciones: [
      { id: 'noche', emoji: '🌙', label: 'De noche, antes de dormir' },
      { id: 'tarda', emoji: '⏳', label: 'Cuando tarda en responder' },
      { id: 'redes', emoji: '📱', label: 'Después de ver su historia o red social' },
      { id: 'todo-el-dia', emoji: '😮‍💨', label: 'Prácticamente todo el día' },
    ],
  };
}

export function construirPasos(r: Respuestas): Paso[] {
  return [
  {
    tipo: 'chip',
    id: 'motivo',
    pregunta: '¿Qué te trae por aquí [acento]hoy[/acento]?',
    microcopy: 'Así personalizamos lo que ves primero.',
    otraCosa: true,
    opciones: [
      { id: 'conociendo', emoji: '💬', label: 'Estoy conociendo a alguien y no sé qué pasa' },
      { id: 'pareja', emoji: '💛', label: 'Tengo dudas con mi pareja' },
      { id: 'ruptura', emoji: '💔', label: 'Estoy saliendo de una relación' },
      { id: 'patrones', emoji: '🔍', label: 'Quiero entender mis patrones' },
    ],
  },
  pasoMomento(r),
  {
    tipo: 'reconocimiento',
    id: 'reconocimiento-1',
    emoji: '🕊️',
    render: (r) => {
      const cuando = r.momentoLabel ? r.momentoLabel.charAt(0).toLowerCase() + r.momentoLabel.slice(1) : 'en esos momentos';
      if (r.motivo === 'ruptura') {
        return {
          titulo: 'Cerrar un ciclo toma tiempo, no [acento]perfección[/acento]',
          cuerpo: `No se trata de dejar de sentir de un día para otro — se trata de entender qué pasó, sobre todo ${cuando}, sin quedarte atrapada ahí. LUMA te acompaña a tu ritmo.`,
        };
      }
      if (r.motivo === 'patrones') {
        return {
          titulo: 'Mirar tus patrones es un acto de [acento]valentía[/acento]',
          cuerpo: `La mayoría repite la misma historia sin darse cuenta — tú ya diste el primer paso al querer verlo, sobre todo ${cuando}. LUMA te ayuda a conectar los puntos entre tus relaciones.`,
        };
      }
      if (r.motivo === 'pareja') {
        return {
          titulo: 'Tus dudas no salen [acento]de la nada[/acento]',
          cuerpo: `Cuando algo no cuadra en una relación, tu mente busca explicaciones — no porque exageres, sino porque mereces claridad, sobre todo ${cuando}. LUMA te ayuda a ver qué es real, en menos de un minuto.`,
        };
      }
      return {
        titulo: 'No es que pienses [acento]de más[/acento]',
        cuerpo: `Nadie te enseñó a separar los hechos de las historias que arma tu mente — sobre todo ${cuando}. Eso es justo lo que LUMA hace por ti, en menos de un minuto.`,
      };
    },
  },
  {
    tipo: 'chip',
    id: 'ayuda',
    pregunta: '¿Qué te [acento]ayudaría[/acento] más ahora mismo?',
    microcopy: 'Con esto armamos tu plan.',
    opciones: [
      { id: 'analizar', emoji: '👀', label: 'Entender un mensaje o conversación confusa' },
      { id: 'coach', emoji: '🫂', label: 'Hablar con alguien que no me juzgue' },
      { id: 'tarot', emoji: '🔮', label: 'Una guía de tarot para reflexionar' },
      { id: 'diario', emoji: '📔', label: 'Llevar un registro de cómo me siento' },
    ],
  },
  ];
}

/** Cuenta solo las preguntas reales respondidas (nunca las claves *Label ni reconocimientos). */
export function contarRespuestas(r: Respuestas): number {
  return IDS_PREGUNTAS_REALES.filter((id) => (r as Record<string, unknown>)[id] !== undefined).length;
}

// Beneficios del PLAN LISTO — el primero depende de "ayuda" (personaliza el mecanismo líder).
export function beneficiosPlan(r: Respuestas): { texto: string }[] {
  const porAyuda: Record<string, string> = {
    analizar: 'Descifra conversaciones confusas: hechos, riesgo y qué responder',
    coach: 'Habla con LUMA, tu coach, cuando la ansiedad aparezca',
    tarot: 'Tiradas de tarot pensadas para tu situación, no genéricas',
    diario: 'Tu diario emocional para ver tus patrones con el tiempo',
  };
  const principal = (r.ayuda && porAyuda[r.ayuda]) || porAyuda.analizar;
  const secundaria = r.ayuda === 'tarot' ? porAyuda.analizar : porAyuda.tarot;
  return [
    { texto: principal },
    { texto: secundaria },
    { texto: 'Un espacio privado, sin juicio, para desahogarte' },
  ];
}
