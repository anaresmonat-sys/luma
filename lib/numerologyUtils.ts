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
