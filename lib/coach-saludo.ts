// Saludo de apertura del Coach, personalizado con su nombre (Mapa de Poder o las
// preguntas de contexto del Coach). Ya no depende de "¿Qué te trae por aquí hoy?":
// esa pregunta se eliminó del recorrido de inicio (2026-10-13).
// No es un mensaje del hilo: no viaja a la IA, solo abre la pantalla
// con una invitación a escribir (decisión del usuario, 2026-09-20: quitar la
// conversación de ejemplo, que parecía una charla ya empezada por otra persona).

/** Frase de arranque que, en vez de rellenar la caja de texto, lleva a otra pantalla. */
export interface ArranqueEnlace {
  texto: string;
  href: string;
}

export interface ApeturaCoach {
  saludo: string;
  /** Frases de arranque: rellenan la caja de texto, no se envían solas. */
  arranques: Array<string | ArranqueEnlace>;
}

const GENERICA: ApeturaCoach = {
  saludo: 'Aquí estoy. ¿De qué quieres que hablemos hoy?',
  arranques: [
    'Necesito desahogarme',
    { texto: 'Quiero que leas un mensaje', href: '/app/descifrar' },
    'Quiero entender qué siento',
    'Quiero hablar de mi trabajo o mi dinero',
  ],
};

export function aperturaCoach(nombre: string | undefined): ApeturaCoach {
  const base = GENERICA;
  const crudo = nombre?.trim().split(/\s+/)[0];
  const primerNombre = crudo ? crudo.charAt(0).toUpperCase() + crudo.slice(1) : undefined;
  return primerNombre ? { ...base, saludo: `Hola, ${primerNombre}. ${base.saludo}` } : base;
}
