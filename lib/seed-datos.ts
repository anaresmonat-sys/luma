// Datos semilla realistas para la app por dentro (32 — nunca se enseña vacía).
// Sin backend aún (Sesión 6 conecta Supabase real): esto simula lo que vendría de
// la base de datos. Ana = avatar primario de FICHA-AVATAR.md; el caso de la
// conversación ("no quiero nada serio... pero el finde te veo") es el mismo usado
// en la landing y el paywall — mantiene coherencia de producto en todo el funnel.

export const USUARIA = { nombre: 'Ana' };

export interface Emocion {
  id: string;
  emoji: string;
  label: string;
  color: string;
}

export const EMOCIONES_INICIO: Emocion[] = [
  { id: 'bien', emoji: '😌', label: 'Bien', color: 'var(--mood-bien)' },
  { id: 'normal', emoji: '🙂', label: 'Normal', color: 'var(--mood-normal)' },
  { id: 'ansiosa', emoji: '😰', label: 'Ansiosa', color: 'var(--mood-ansiosa)' },
  { id: 'triste', emoji: '😢', label: 'Triste', color: 'var(--mood-triste)' },
  { id: 'ilusion', emoji: '🥰', label: 'Ilusión', color: 'var(--mood-ilusion)' },
];

export const EMOCIONES_DIARIO: Emocion[] = [
  { id: 'feliz', emoji: '😄', label: 'Feliz', color: 'var(--mood-normal)' },
  { id: 'tranquila', emoji: '😌', label: 'Tranquila', color: 'var(--mood-bien)' },
  { id: 'ansiosa', emoji: '😰', label: 'Ansiosa', color: 'var(--mood-ansiosa)' },
  { id: 'triste', emoji: '😢', label: 'Triste', color: 'var(--mood-triste)' },
  { id: 'enfadada', emoji: '😠', label: 'Enfadada', color: 'var(--mood-enfadada)' },
];

export const CARTA_DEL_DIA = {
  numero: 'II',
  nombre: 'La Sacerdotisa',
  cita: 'Escucha antes de responder.',
};

export const CONVERSACION_EJEMPLO =
  'Él: no quiero nada serio ahora mismo. Pero el finde te veo, ¿no? Y no me gusta que salgas con el grupo ese.';

export const ANALISIS_EJEMPLO = [
  {
    id: 'vemos',
    emoji: '👀',
    color: 'var(--an-eye)',
    titulo: 'Lo que vemos',
    texto: 'Dice que no quiere una relación, pero busca intimidad y cierta exclusividad emocional.',
  },
  {
    id: 'riesgo',
    emoji: '⚠️',
    color: 'var(--an-risk)',
    titulo: 'Posible riesgo',
    texto: 'Hay una discrepancia entre sus palabras y sus comportamientos.',
  },
  {
    id: 'pregunta',
    emoji: '🤔',
    color: 'var(--an-question)',
    titulo: 'Pregunta para ti',
    texto: '¿Este tipo de relación satisface lo que tú buscas?',
  },
];

export interface MensajeCoach {
  id: string;
  autor: 'yo' | 'luma';
  texto: string;
  hora?: string;
}

export interface TiradaTarot {
  id: string;
  emoji: string;
  nombre: string;
  /** Pregunta que viaja a la IA cuando la persona NO escribe la suya. */
  pregunta: string;
  /** Completa "¿Cuál es tu pregunta sobre …?" (vacío = esa tirada no pregunta nada). */
  sobre: string;
}

// Pedido del usuario, 2026-10-02: 7 temas + Carta del día. Al tocar un tema LUMA
// pregunta "¿Cuál es tu pregunta sobre …?" (opcional); la Carta del día no pregunta.
export const TIRADAS_TAROT: TiradaTarot[] = [
  { id: 'amor', emoji: '❤️', nombre: 'Amor', sobre: 'el amor', pregunta: '¿Qué necesito comprender sobre esta persona o sobre mi relación de pareja ahora?' },
  { id: 'ruptura', emoji: '💔', nombre: 'Ruptura', sobre: 'tu ruptura', pregunta: '¿Qué me está impidiendo cerrar este ciclo?' },
  { id: 'decision', emoji: '🧭', nombre: 'Decisión', sobre: 'tu decisión', pregunta: '¿Qué necesito considerar antes de decidir?' },
  { id: 'autoconocimiento', emoji: '🪷', nombre: 'Autoconocimiento', sobre: 'ti misma', pregunta: '¿Qué no estoy viendo de mí misma?' },
  { id: 'relaciones', emoji: '👥', nombre: 'Relaciones', sobre: 'tus relaciones', pregunta: '¿Qué necesito comprender sobre mis relaciones con familia, amistades o compañeros?' },
  { id: 'salud', emoji: '🌿', nombre: 'Salud y bienestar', sobre: 'tu salud y bienestar', pregunta: '¿Qué necesita mi bienestar ahora mismo?' },
  { id: 'prosperidad', emoji: '💰', nombre: 'Prosperidad', sobre: 'tu prosperidad', pregunta: '¿Qué necesito ver sobre mi dinero y mi trabajo ahora?' },
  { id: 'carta-del-dia', emoji: '☀️', nombre: 'Carta del día', sobre: '', pregunta: '¿Qué energía puedo observar hoy?' },
];

export const LECTURAS_TAROT: Record<string, { numero: string; nombre: string; cita: string; lectura: string }> = {
  amor: {
    numero: 'II',
    nombre: 'La Sacerdotisa',
    cita: 'Escucha antes de responder.',
    lectura: 'Esta carta te pide calma antes que certezas: la relación te muestra señales mezcladas porque todavía no le has puesto nombre a lo que sientes tú. Antes de leerlo a él, escúchate.',
  },
  ruptura: {
    numero: 'XIII',
    nombre: 'La Transformación',
    cita: 'Cerrar no es olvidar. Es soltar.',
    lectura: 'Lo que termina no se borra, se transforma. Esta carta marca un cierre real: la energía que gastabas esperando una respuesta puede volver a ser tuya.',
  },
  decision: {
    numero: 'VII',
    nombre: 'El Carro',
    cita: 'Dos caminos, una sola dirección.',
    lectura: 'La indecisión no es falta de claridad: es miedo a elegir mal. Esta carta te recuerda que puedes corregir el rumbo después — pero primero tienes que moverte.',
  },
  autoconocimiento: {
    numero: 'XVIII',
    nombre: 'La Luna',
    cita: 'Lo que no ves también te habla.',
    lectura: 'Hay un patrón repitiéndose que todavía no nombras del todo. Esta carta te invita a mirar de frente lo que sueles evitar sentir.',
  },
  'carta-del-dia': {
    numero: 'II',
    nombre: 'La Sacerdotisa',
    cita: 'Escucha antes de responder.',
    lectura: 'Hoy es un día para observar antes de reaccionar. La respuesta que buscas no está en lo que él diga, sino en lo que tú ya sabes y no has querido escuchar.',
  },
};

