// «Cómo prefieres que te hable LUMA»: la persona elige ella, él o sin género (2026-10-23, tras la prueba de Pedro,
// a quien la IA trataba en femenino). Se guarda en la cuenta (user_metadata.trato), junto al nombre/apodo.
// Nunca se deduce por el nombre. Sin elección = sin género (la IA usa fórmulas neutras).
// Sin cuenta (prueba gratis) la elección vive en una cookie `luma_trato` (un año) que el servidor también lee: así LUMA
// sabe cómo hablarle a quien no ha iniciado sesión. Con cuenta manda user_metadata.trato.

export type Trato = 'ella' | 'el' | 'neutro';

export const TRATOS: ReadonlyArray<{ id: Trato; etiqueta: string }> = [
  { id: 'ella', etiqueta: 'Ella' },
  { id: 'el', etiqueta: 'Él' },
  { id: 'neutro', etiqueta: 'Sin género' },
];

export function esTrato(valor: unknown): valor is Trato {
  return valor === 'ella' || valor === 'el' || valor === 'neutro';
}

/** Frase que se añade al final del prompt de la IA. Sin elección (o «sin género») no añade nada: manda la regla neutra. */
export function instruccionDeTrato(trato: Trato | null | undefined): string {
  if (trato === 'ella') {
    return '\n\nTRATO ELEGIDO POR LA PERSONA (sustituye a la regla de GÉNERO anterior): háblale en FEMENINO. Usa adjetivos y participios en femenino para referirte a ella («segura», «tranquila», «cansada»).';
  }
  if (trato === 'el') {
    return '\n\nTRATO ELEGIDO POR LA PERSONA (sustituye a la regla de GÉNERO anterior): háblale en MASCULINO. Usa adjetivos y participios en masculino para referirte a él («seguro», «tranquilo», «cansado»).';
  }
  return '';
}

export const COOKIE_TRATO = 'luma_trato';
const CLAVE_PREGUNTADO = 'luma_trato_preguntado';

/** Solo en el navegador: el trato guardado en la cookie, o null. */
export function leerTratoLocal(): Trato | null {
  try {
    const m = document.cookie.match(/(?:^|; )luma_trato=([^;]*)/);
    const valor = m ? decodeURIComponent(m[1]) : null;
    return esTrato(valor) ? valor : null;
  } catch {
    return null;
  }
}

/** Solo en el navegador: guarda la elección en la cookie (un año) y recuerda que ya se preguntó. */
export function guardarTratoLocal(trato: Trato): void {
  try {
    const segura = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${COOKIE_TRATO}=${trato}; path=/; max-age=31536000; SameSite=Lax${segura}`;
    window.localStorage.setItem(CLAVE_PREGUNTADO, '1');
  } catch {
    // sin cookies ni almacenamiento: queda el trato neutro y no se bloquea nada.
  }
}

/** Solo en el navegador: «Ahora no» — no vuelve a preguntar, sin guardar ninguna elección. */
export function marcarTratoPreguntado(): void {
  try {
    window.localStorage.setItem(CLAVE_PREGUNTADO, '1');
  } catch {
    // ídem.
  }
}

export function tratoYaPreguntado(): boolean {
  try {
    return window.localStorage.getItem(CLAVE_PREGUNTADO) === '1' || leerTratoLocal() !== null;
  } catch {
    return leerTratoLocal() !== null;
  }
}
