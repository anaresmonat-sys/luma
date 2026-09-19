// "El Círculo" — perfiles de amigas/crushes que la usuaria guarda para
// analizar con la misma numerología que ya usa consigo misma (Mapa de Poder).
// Persistencia sin backend por defecto (regla del stack); con sesión real se
// sincroniza a Supabase (tabla `circulo_perfiles`, ver lib/supabase/circulo.ts).

const CLAVE = 'luma_circulo';

export interface PersonaCirculo {
  id: string;
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

export function leerCirculo(): PersonaCirculo[] {
  try {
    const crudo = window.localStorage.getItem(CLAVE);
    return crudo ? (JSON.parse(crudo) as PersonaCirculo[]) : [];
  } catch {
    return [];
  }
}

export function guardarCirculo(personas: PersonaCirculo[]): void {
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(personas));
  } catch {
    // localStorage puede fallar (modo privado, cuota) — no bloquea el flujo.
  }
}

export function agregarAlCirculo(persona: PersonaCirculo): PersonaCirculo[] {
  const siguiente = [persona, ...leerCirculo()];
  guardarCirculo(siguiente);
  return siguiente;
}

export function quitarDelCirculo(id: string): PersonaCirculo[] {
  const siguiente = leerCirculo().filter((p) => p.id !== id);
  guardarCirculo(siguiente);
  return siguiente;
}
