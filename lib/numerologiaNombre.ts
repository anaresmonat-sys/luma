// Numerología del nombre (tabla pitagórica) — matemática pura, sin API externa.
// Número de Expresión: todas las letras del nombre completo. Número del Alma:
// solo las vocales (lo que la usuaria anhela en el fondo, en una pareja).

const TABLA_PITAGORICA: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
  Ñ: 5,
};

const VOCALES = new Set(['A', 'E', 'I', 'O', 'U']);

/** Quita acentos (Á→A, É→E…) pero conserva la Ñ — tiene su propio valor en la tabla. */
function normalizar(letra: string): string {
  if (letra === 'Ñ') return 'Ñ';
  return letra.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function reducir(n: number): number {
  let valor = n;
  while (valor > 9 && valor !== 11 && valor !== 22) {
    valor = String(valor)
      .split('')
      .reduce((suma, d) => suma + Number(d), 0);
  }
  return valor;
}

function letrasValidas(nombreCompleto: string): string[] {
  return nombreCompleto
    .toUpperCase()
    .split('')
    .map(normalizar)
    .filter((l) => l.length === 1 && l in TABLA_PITAGORICA);
}

/** Número de Expresión: cómo canaliza sus emociones y talentos (todas las letras). */
export function calcularNumeroExpresion(nombreCompleto: string): number {
  const suma = letrasValidas(nombreCompleto).reduce((acc, l) => acc + TABLA_PITAGORICA[l], 0);
  return reducir(suma || 0);
}

/** Número del Alma: sus anhelos íntimos en una pareja (solo vocales). */
export function calcularNumeroAlma(nombreCompleto: string): number {
  const suma = letrasValidas(nombreCompleto)
    .filter((l) => VOCALES.has(l))
    .reduce((acc, l) => acc + TABLA_PITAGORICA[l], 0);
  return reducir(suma || 0);
}
