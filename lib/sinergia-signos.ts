// Sinergia SIMBÓLICA entre dos signos — cálculo fijo y explicable, sin IA (costo cero,
// instantáneo, sin abuso posible). Se basa en los "aspectos" clásicos de la astrología
// occidental: la distancia entre los dos signos en el zodiaco (0 a 6 pasos) da el tipo
// de vínculo. Es un juego para reflexionar, NO una predicción (mismo criterio que el
// tarot en LUMA). Una misma pareja da SIEMPRE el mismo resultado, en cualquier orden.

import { SIGNOS_ZODIACO } from '@/lib/zodiaco';

export interface SinergiaSignos {
  porcentaje: number;
  frase: string;
}

interface Aspecto {
  base: number;
  frase: (a: string, b: string, elemento: string) => string;
}

// Índice = distancia entre signos (0 = mismo signo … 6 = signos opuestos).
const ASPECTOS: Aspecto[] = [
  {
    base: 80,
    frase: (a) => `Los dos son ${a}: se reconocen al instante… y también se repiten sus manías.`,
  },
  {
    base: 60,
    frase: (a, b) => `${a} y ${b} parecen cercanos pero funcionan distinto: piden paciencia y buenos acuerdos.`,
  },
  {
    base: 84,
    frase: (a, b) => `${a} y ${b} se llevan fácil: hay chispa para conversar y crecer juntos.`,
  },
  {
    base: 55,
    frase: (a, b) => `${a} y ${b} se retan: mucha tensión que se vuelve impulso si hay respeto y límites claros.`,
  },
  {
    base: 92,
    frase: (a, b, elemento) => `${a} y ${b} comparten el elemento ${elemento}: se entienden sin explicarse demasiado.`,
  },
  {
    base: 58,
    frase: (a, b) => `${a} y ${b} hablan idiomas distintos: la conexión llega cuando aprenden a traducirse.`,
  },
  {
    base: 74,
    frase: (a, b) => `${a} y ${b} son opuestos que se atraen: se complementan… y también se provocan.`,
  },
];

export function sinergiaEntre(idA: string, idB: string): SinergiaSignos | null {
  const i = SIGNOS_ZODIACO.findIndex((s) => s.id === idA);
  const j = SIGNOS_ZODIACO.findIndex((s) => s.id === idB);
  if (i === -1 || j === -1) return null;

  const menor = Math.min(i, j);
  const mayor = Math.max(i, j);
  const brecha = mayor - menor;
  const distancia = Math.min(brecha, 12 - brecha);
  const aspecto = ASPECTOS[distancia];

  // Pequeña variación fija por pareja (−4…+4) para que no todas las de un tipo den lo mismo.
  const variacion = ((menor * 7 + mayor * 13) % 9) - 4;
  const porcentaje = Math.max(48, Math.min(96, aspecto.base + variacion));

  const signoA = SIGNOS_ZODIACO[menor];
  const signoB = SIGNOS_ZODIACO[mayor];
  return {
    porcentaje,
    frase: aspecto.frase(signoA.nombre, signoB.nombre, signoA.elemento),
  };
}
