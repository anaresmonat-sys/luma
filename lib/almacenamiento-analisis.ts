// Continuidad de Descifrar: el último análisis se recuerda MIENTRAS DURE LA SESIÓN del navegador (sessionStorage: se borra
// al cerrar la pestaña; no sale del dispositivo ni va a ninguna base de datos). Así, al ir a Tarot o al Coach desde un
// resultado, se puede VOLVER al análisis (antes se perdía). Y la situación viaja a Tarot como pregunta ya escrita.

export interface ItemAnalisisGuardado {
  id: string;
  emoji: string;
  color: string;
  titulo: string;
  texto: string;
}

export interface UltimoAnalisis {
  texto: string;
  analisis: ItemAnalisisGuardado[];
}

const CLAVE_ANALISIS = 'luma_ultimo_analisis';
const CLAVE_PREGUNTA_TAROT = 'luma_tarot_pregunta_pendiente';
const MAX_TEXTO = 4000;

export function guardarUltimoAnalisis(datos: UltimoAnalisis): void {
  try {
    window.sessionStorage.setItem(CLAVE_ANALISIS, JSON.stringify({ texto: datos.texto.slice(0, MAX_TEXTO), analisis: datos.analisis }));
  } catch {
    // sin almacenamiento de sesión: se sigue sin continuidad, no se bloquea nada.
  }
}

export function leerUltimoAnalisis(): UltimoAnalisis | null {
  try {
    const crudo = window.sessionStorage.getItem(CLAVE_ANALISIS);
    if (!crudo) return null;
    const d = JSON.parse(crudo) as Partial<UltimoAnalisis>;
    if (typeof d.texto !== 'string' || !Array.isArray(d.analisis) || d.analisis.length === 0) return null;
    return { texto: d.texto, analisis: d.analisis as ItemAnalisisGuardado[] };
  } catch {
    return null;
  }
}

export function borrarUltimoAnalisis(): void {
  try {
    window.sessionStorage.removeItem(CLAVE_ANALISIS);
  } catch {
    // ídem.
  }
}

/** La situación que Tarot recibe como pregunta: lo que ella pegó (recortado) o, si fue una captura, lo que vio LUMA. */
export function guardarPreguntaTarotPendiente(texto: string): void {
  try {
    window.sessionStorage.setItem(CLAVE_PREGUNTA_TAROT, texto.slice(0, 400));
  } catch {
    // ídem.
  }
}

export function leerYLimpiarPreguntaTarotPendiente(): string | null {
  try {
    const t = window.sessionStorage.getItem(CLAVE_PREGUNTA_TAROT);
    if (t) window.sessionStorage.removeItem(CLAVE_PREGUNTA_TAROT);
    return t;
  } catch {
    return null;
  }
}
