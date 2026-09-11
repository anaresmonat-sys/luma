// Puente de datos onboarding → paywall SIN backend (Sesión 6 conecta Supabase real).
// Regla del stack (CLAUDE.md): "Persistencia sin backend: app desplegada → localStorage."
// Se guarda al llegar a PlanListo y se lee al montar /paywall para personalizar
// (costo hundido "Hecho con tus N respuestas" — 02B regla a). Si no hay datos
// (usuario llegó directo a /paywall) el paywall usa su copy no-personalizado.

import type { Respuestas } from '@/app/onboarding/flujo';

const CLAVE = 'luma_onboarding_respuestas';

export function guardarRespuestas(respuestas: Respuestas): void {
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(respuestas));
  } catch {
    // localStorage puede fallar (modo privado, cuota) — no bloquea el flujo.
  }
}

export function leerRespuestas(): Respuestas | null {
  try {
    const crudo = window.localStorage.getItem(CLAVE);
    if (!crudo) return null;
    return JSON.parse(crudo) as Respuestas;
  } catch {
    return null;
  }
}
