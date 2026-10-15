// Numerología de vida (Camino de Vida) — puro cálculo matemático, sin ninguna
// API externa. Suma los dígitos de la fecha de nacimiento hasta reducirla a un
// solo dígito (1-9), manteniendo los números maestros 11 y 22 sin reducir más.
// Cada número se asocia a un Arcano Mayor del tarot (reutiliza lib/tarotDeck.ts,
// mismo mazo que ya usan Tarot y Compatibilidad — un solo mazo, una sola vez).

import { MAZO_TAROT, type CartaTarot } from './tarotDeck';

/** Suma repetida de dígitos hasta llegar a 1-9, salvo que el resultado
 * intermedio sea 11 o 22 (números maestros) — ahí se detiene. */
function reducir(n: number): number {
  let valor = n;
  while (valor > 9 && valor !== 11 && valor !== 22) {
    valor = String(valor)
      .split('')
      .reduce((suma, d) => suma + Number(d), 0);
  }
  return valor;
}

/** Número de Camino de Vida a partir de una fecha "AAAA-MM-DD". */
export function calcularNumeroVida(fechaISO: string): number {
  const soloDigitos = fechaISO.replace(/\D/g, '');
  const suma = soloDigitos.split('').reduce((acc, d) => acc + Number(d), 0);
  return reducir(suma);
}

// Correspondencia Número de Camino de Vida → Arcano Mayor (tradición numerológica
// pitagórica + tarot: 1-9 en orden, 11 = La Justicia (arcano XI), 22 = El Loco
// (el "maestro constructor", arcano 0 — cierra el ciclo).
const NUMERO_A_ARCANO_ID: Record<number, string> = {
  1: 'el-mago',
  2: 'la-sacerdotisa',
  3: 'la-emperatriz',
  4: 'el-emperador',
  5: 'el-hierofante',
  6: 'los-enamorados',
  7: 'el-carro',
  8: 'la-fuerza',
  9: 'el-ermitano',
  11: 'la-justicia',
  22: 'el-loco',
};

export function arcanoDeNumero(numero: number): CartaTarot {
  const id = NUMERO_A_ARCANO_ID[numero] ?? 'el-mago';
  return MAZO_TAROT.find((c) => c.id === id)!;
}

// ARCANO DE NACIMIENTO — los 22 arcanos mayores. Se suman los dígitos de la fecha completa y, si
// el total pasa de 22, se vuelven a sumar hasta quedar entre 1 y 22 (22 = El Loco, arcano 0).
// Con el método anterior (reducir a un dígito) solo salían 11 de los 22 arcanos.
// El Camino de Vida (arriba) NO cambia: es una cosa distinta y se sigue mostrando aparte.
const ARCANO_ID_POR_NUMERO: Record<number, string> = {
  1: 'el-mago',
  2: 'la-sacerdotisa',
  3: 'la-emperatriz',
  4: 'el-emperador',
  5: 'el-hierofante',
  6: 'los-enamorados',
  7: 'el-carro',
  8: 'la-fuerza',
  9: 'el-ermitano',
  10: 'la-rueda',
  11: 'la-justicia',
  12: 'el-colgado',
  13: 'la-muerte',
  14: 'la-templanza',
  15: 'el-diablo',
  16: 'la-torre',
  17: 'la-estrella',
  18: 'la-luna',
  19: 'el-sol',
  20: 'el-juicio',
  21: 'el-mundo',
  22: 'el-loco',
};

/** Número del arcano de nacimiento (1 a 22) a partir de "AAAA-MM-DD". */
export function calcularNumeroArcano(fechaISO: string): number {
  let valor = fechaISO
    .replace(/D/g, '')
    .split('')
    .reduce((acc, d) => acc + Number(d), 0);
  while (valor > 22) {
    valor = String(valor)
      .split('')
      .reduce((acc, d) => acc + Number(d), 0);
  }
  return valor < 1 ? 22 : valor;
}

export function arcanoDeNacimiento(fechaISO: string): CartaTarot {
  const id = ARCANO_ID_POR_NUMERO[calcularNumeroArcano(fechaISO)] ?? 'el-mago';
  return MAZO_TAROT.find((c) => c.id === id)!;
}
