// Saludo de apertura del Coach, personalizado con lo que la persona eligió en
// "¿Qué te trae por aquí hoy?" (onboarding) y, si ya hizo el Mapa de Poder, con
// su nombre. No es un mensaje del hilo: no viaja a la IA, solo abre la pantalla
// con una invitación a escribir (decisión del usuario, 2026-09-20: quitar la
// conversación de ejemplo, que parecía una charla ya empezada por otra persona).

export interface ApeturaCoach {
  saludo: string;
  /** Frases de arranque: rellenan la caja de texto, no se envían solas. */
  arranques: string[];
}

const POR_MOTIVO: Record<string, ApeturaCoach> = {
  conociendo: {
    saludo: 'Cuéntame qué está pasando con esa persona. Sin prisa, sin juicio.',
    arranques: [
      'Me escribía mucho y ahora tarda en responder',
      'No sé qué somos y no me atrevo a preguntar',
      'Me dijo algo y no sé cómo tomarlo',
    ],
  },
  pareja: {
    saludo: 'Cuéntame qué te está haciendo dudar de tu pareja. Aquí puedes decirlo todo.',
    arranques: [
      'Siento que algo cambió entre nosotros',
      'Discutimos y no sé si estoy exagerando',
      'Necesito saber si esto es lo que quiero',
    ],
  },
  ruptura: {
    saludo: 'Lo siento mucho. Cuéntame cómo estás hoy, a tu ritmo.',
    arranques: [
      'No dejo de pensar en esa persona',
      'Quiero escribirle y no sé si debo',
      'No entiendo por qué terminó',
    ],
  },
  patrones: {
    saludo: 'Cuéntame qué historia sientes que se repite en tus relaciones.',
    arranques: [
      'Siempre me pasa lo mismo con las personas que me gustan',
      'Me cuesta poner límites',
      'Me aferro demasiado rápido',
    ],
  },
};

const GENERICA: ApeturaCoach = {
  saludo: 'Aquí estoy. Cuéntame qué está pasando, con calma.',
  arranques: ['Necesito desahogarme', 'No sé qué responderle', 'Quiero entender qué siento'],
};

export function aperturaCoach(motivo: string | undefined, nombre: string | undefined): ApeturaCoach {
  const base = (motivo && POR_MOTIVO[motivo]) || GENERICA;
  const crudo = nombre?.trim().split(/\s+/)[0];
  const primerNombre = crudo ? crudo.charAt(0).toUpperCase() + crudo.slice(1) : undefined;
  return primerNombre ? { ...base, saludo: `Hola, ${primerNombre}. ${base.saludo}` } : base;
}
