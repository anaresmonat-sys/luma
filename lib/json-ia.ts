// Saca el objeto JSON de la respuesta de la IA aunque venga con texto alrededor o se «corrija» y escriba varios.
// Orden: 1) todo el texto es un JSON válido; 2) el ÚLTIMO objeto {…} completo que sea válido según `valido`.

// Objetos { ... } completos del texto, en orden (cuenta llaves; ignora las que van dentro de cadenas).
export function objetosJSON(texto: string): string[] {
  const salida: string[] = [];
  let profundidad = 0;
  let inicio = -1;
  let enCadena = false;
  let escape = false;
  for (let i = 0; i < texto.length; i++) {
    const ch = texto[i];
    if (enCadena) {
      if (escape) escape = false;
      else if (ch === '\\') escape = true;
      else if (ch === '"') enCadena = false;
      continue;
    }
    if (ch === '"') enCadena = true;
    else if (ch === '{') {
      if (profundidad === 0) inicio = i;
      profundidad += 1;
    } else if (ch === '}' && profundidad > 0) {
      profundidad -= 1;
      if (profundidad === 0 && inicio >= 0) salida.push(texto.slice(inicio, i + 1));
    }
  }
  return salida;
}

export function extraerJSON<T extends object>(texto: string, valido: (objeto: T) => boolean): T | null {
  try {
    const todo = JSON.parse(texto) as T;
    if (todo && typeof todo === 'object' && valido(todo)) return todo;
  } catch {
    // sigue con los candidatos
  }
  for (const candidato of objetosJSON(texto).reverse()) {
    try {
      const objeto = JSON.parse(candidato) as T;
      if (valido(objeto)) return objeto;
    } catch {
      // siguiente candidato
    }
  }
  return null;
}
