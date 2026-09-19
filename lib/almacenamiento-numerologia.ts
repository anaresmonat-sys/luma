// Puente de datos del "Mapa de Poder" (numerología personal) — persistencia
// sin backend (regla del stack: "app desplegada → localStorage"). Se calcula
// UNA sola vez (la fecha de nacimiento no cambia) y se lee desde Más, Tarot y
// el Coach — este último lo usa para personalizar sus respuestas (pedido
// explícito del usuario, 2026-09-18: "así la IA tiene más datos sobre la
// persona... la puede guiar mejor y más profesional").

const CLAVE = 'luma_mapa_poder';

export interface MapaPoder {
  nombre: string;
  fecha: string;
  numero: number;
  arcanoId: string;
  arcanoNombre: string;
  signoId: string;
  signoNombre: string;
  numeroExpresion: number;
  numeroAlma: number;
  arquetipo: string;
  superpoder: string;
  puntoCiego: string;
  consejo: string;
}

export function guardarMapaPoder(mapa: MapaPoder): void {
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(mapa));
  } catch {
    // localStorage puede fallar (modo privado, cuota) — no bloquea el flujo.
  }
}

export function leerMapaPoder(): MapaPoder | null {
  try {
    const crudo = window.localStorage.getItem(CLAVE);
    return crudo ? (JSON.parse(crudo) as MapaPoder) : null;
  } catch {
    return null;
  }
}
