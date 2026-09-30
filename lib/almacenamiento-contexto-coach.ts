// Contexto rápido del Coach: 5 preguntas de Sí/No sobre distintas áreas de su
// vida (amor, dinero, salud, trabajo, apoyo) — idea del usuario, 2026-09-30,
// investigada contra apps de coaching reales (intake corto = más gente lo
// termina; "estilo de apego"/áreas de vida = lo que de verdad ayuda a
// personalizar). Se pregunta UNA sola vez, antes del primer mensaje del Coach,
// y queda guardado — mismo patrón que el Mapa de Poder (localStorage, sin
// backend nuevo que mantener).

const CLAVE = 'luma_contexto_coach';

export interface ContextoCoach {
  nombre?: string;
  pareja: boolean;
  dineroPreocupa: boolean;
  saludBien: boolean;
  trabajoLlena: boolean;
  apoyo: boolean;
}

export function leerContextoCoach(): ContextoCoach | null {
  try {
    const crudo = window.localStorage.getItem(CLAVE);
    return crudo ? (JSON.parse(crudo) as ContextoCoach) : null;
  } catch {
    return null;
  }
}

export function guardarContextoCoach(contexto: ContextoCoach): void {
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(contexto));
  } catch {
    // localStorage puede fallar (modo privado, cuota) — no bloquea el flujo;
    // el Coach sigue funcionando, solo sin este contexto de fondo.
  }
}
