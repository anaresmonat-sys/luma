// FLUJO DEL ONBOARDING — copy y pasos, trazados a FICHA-AVATAR.md (57 §9 / test de
// traza de 52). Cada pregunta ecoa un DOLOR; el slider apunta a un DESEO; los
// reconocimientos usan el dolor emocional/identidad #1 en el lenguaje literal
// de la ficha. 7 preguntas reales + 2 reconocimientos — rango "4-8 pasos de alto
// rendimiento" de 02B para bienestar/personalización emocional.

export type OpcionChip = { id: string; emoji: string; label: string };

export type PasoChip = {
  tipo: 'chip';
  id: string;
  pregunta: string;
  microcopy?: string;
  opciones: OpcionChip[];
  otraCosa?: boolean;
};

export type PasoSlider = {
  tipo: 'slider';
  id: string;
  pregunta: string;
  min: number;
  max: number;
  inicial: number;
  sufijo: string;
  ctaLabel: string;
};

export type PasoReconocimiento = {
  tipo: 'reconocimiento';
  id: string;
  emoji: string;
  // Recibe las respuestas acumuladas y devuelve título/cuerpo ya personalizados.
  render: (r: Respuestas) => { titulo: string; cuerpo: string };
};

export type Paso = PasoChip | PasoSlider | PasoReconocimiento;

/** IDs de las 7 preguntas REALES (excluye reconocimientos, que no piden datos). */
export const IDS_PREGUNTAS_REALES = ['motivo', 'momento', 'ayuda', 'temor', 'compromiso', 'hora', 'atribucion'] as const;

export interface Respuestas {
  motivo?: string;
  motivoLabel?: string;
  momento?: string;
  momentoLabel?: string;
  ayuda?: string;
  ayudaLabel?: string;
  temor?: string;
  temorLabel?: string;
  compromiso?: number;
  hora?: string;
  horaLabel?: string;
  atribucion?: string;
}

// dolor #1 de FICHA-AVATAR: "Estoy obsesionada mirando el teléfono a ver si ya me respondió"
// dolor #2: "No sé qué responderle sin quedar como que me importa demasiado"
export const PASOS: Paso[] = [
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
    id: 'momento',
    pregunta: '¿Cuándo sientes más esa [acento]ansiedad[/acento]?',
    microcopy: 'Así sabemos en qué momento ayudarte más.',
    opciones: [
      { id: 'noche', emoji: '🌙', label: 'De noche, antes de dormir' },
      { id: 'tarda', emoji: '⏳', label: 'Cuando tarda en responder' },
      { id: 'redes', emoji: '📱', label: 'Después de ver su historia o red social' },
      { id: 'todo-el-dia', emoji: '😮‍💨', label: 'Prácticamente todo el día' },
    ],
  },
  {
    tipo: 'reconocimiento',
    id: 'reconocimiento-1',
    emoji: '🕊️',
    render: (r) => ({
      titulo: 'No es que pienses [acento]de más[/acento]',
      cuerpo: `Nadie te enseñó a separar los hechos de las historias que arma tu mente — sobre todo ${
        r.momentoLabel ? r.momentoLabel.charAt(0).toLowerCase() + r.momentoLabel.slice(1) : 'en esos momentos'
      }. Eso es justo lo que LUMA hace por ti, en menos de un minuto.`,
    }),
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
  {
    tipo: 'chip',
    id: 'temor',
    pregunta: '¿Qué es lo que más [acento]temes[/acento] que pase?',
    microcopy: 'No hay respuestas incorrectas.',
    opciones: [
      { id: 'equivocarme', emoji: '😟', label: 'Volver a equivocarme como antes' },
      { id: 'intensa', emoji: '😬', label: "Ser 'la intensa' que aleja a la gente" },
      { id: 'callada', emoji: '🤐', label: 'Quedarme callada y que se aleje igual' },
      { id: 'perder-tiempo', emoji: '⌛', label: 'Perder tiempo en algo que no va a ningún lado' },
    ],
  },
  {
    tipo: 'reconocimiento',
    id: 'reconocimiento-2',
    emoji: '💛',
    render: () => ({
      titulo: 'Ese miedo no te hace [acento]"la intensa"[/acento]',
      cuerpo:
        'Te hace alguien que presta atención — el problema nunca fue sentir tanto, fue no tener con quién revisarlo con calma. Para eso está LUMA.',
    }),
  },
  {
    tipo: 'slider',
    id: 'compromiso',
    pregunta: '¿Cuántas veces por semana te gustaría hacer una [acento]pausa[/acento] de 1 minuto?',
    min: 1,
    max: 7,
    inicial: 4,
    sufijo: 'veces por semana',
    ctaLabel: 'Fijar mi ritmo',
  },
  {
    tipo: 'chip',
    id: 'hora',
    pregunta: '¿A qué hora te gustaría que te lo [acento]recordemos[/acento]?',
    microcopy: 'Así ajustamos tu recordatorio diario.',
    opciones: [
      { id: 'manana', emoji: '☀️', label: 'En la mañana, al despertar' },
      { id: 'mediodia', emoji: '🌤️', label: 'Al mediodía' },
      { id: 'noche', emoji: '🌙', label: 'En la noche, antes de dormir' },
      { id: 'sin-recordatorio', emoji: '🤷‍♀️', label: 'Prefiero decidir yo cada vez' },
    ],
  },
  {
    tipo: 'chip',
    id: 'atribucion',
    pregunta: '¿Cómo llegaste a [acento]LUMA[/acento]?',
    microcopy: 'Nos ayuda a mejorar — no es obligatorio.',
    opciones: [
      { id: 'instagram', emoji: '📸', label: 'Instagram' },
      { id: 'tiktok', emoji: '🎵', label: 'TikTok' },
      { id: 'recomendacion', emoji: '👯', label: 'Recomendación de una amiga' },
      { id: 'busqueda', emoji: '🔎', label: 'Buscando en internet' },
    ],
  },
  {
    // VARIANTE FINAL OBLIGATORIA — etiquetado de identidad positiva (02B regla b).
    // Reencuadra "soy intensa, lo pienso todo demasiado" (identidad de la ficha) en positivo.
    tipo: 'reconocimiento',
    id: 'reconocimiento-final',
    emoji: '✨',
    render: () => ({
      titulo: 'Tus respuestas [acento]te describen[/acento]',
      cuerpo:
        'Eres alguien que prefiere entender antes de reaccionar — pocas personas se detienen a mirar sus patrones antes de que exploten. Tu plan usa exactamente esa fuerza.',
    }),
  },
];

export const LABEL_DE = {
  motivo: Object.fromEntries((PASOS.find((p) => p.id === 'motivo') as PasoChip).opciones.map((o) => [o.id, o.label])),
  momento: Object.fromEntries((PASOS.find((p) => p.id === 'momento') as PasoChip).opciones.map((o) => [o.id, o.label])),
  ayuda: Object.fromEntries((PASOS.find((p) => p.id === 'ayuda') as PasoChip).opciones.map((o) => [o.id, o.label])),
  temor: Object.fromEntries((PASOS.find((p) => p.id === 'temor') as PasoChip).opciones.map((o) => [o.id, o.label])),
  hora: Object.fromEntries((PASOS.find((p) => p.id === 'hora') as PasoChip).opciones.map((o) => [o.id, o.label])),
};

/** Cuenta solo las 7 preguntas reales respondidas (nunca las claves *Label ni reconocimientos). */
export function contarRespuestas(r: Respuestas): number {
  return IDS_PREGUNTAS_REALES.filter((id) => (r as Record<string, unknown>)[id] !== undefined).length;
}

export function feedbackCompromiso(valor: number): string {
  if (valor <= 2) return 'Para empezar con calma';
  if (valor <= 5) return 'Un ritmo que sí puedes sostener';
  return 'Full compromiso — te acompañamos';
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

export function lineasLoading(r: Respuestas): { texto: string }[] {
  return [
    { texto: `Analizando tu situación: ${r.motivoLabel ?? 'tu caso'}` },
    { texto: `Ajustando a tu ritmo: ${r.compromiso ?? 4} veces por semana` },
    { texto: `Preparando tu recordatorio: ${r.horaLabel ?? 'cuando tú prefieras'}` },
    { texto: 'Armando tu primer análisis de ejemplo' },
  ];
}
