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
export const IDS_PREGUNTAS_REALES = ['motivo', 'ayuda'] as const;

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

export function construirPasos(_r: Respuestas): Paso[] {
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
