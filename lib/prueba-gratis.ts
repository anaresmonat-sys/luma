// Puerta de "un resultado real gratis" antes de elegir un plan (feedback directo
// del usuario, 2026-09-17: la persona llega del onboarding a UNA sola de las 4
// funciones reales —mensaje, coach, tarot o diario— y debe poder usarla de
// verdad una vez sin pagar; al segundo intento en CUALQUIERA de las 4, se la
// manda a elegir un plan). Una sola bandera global, no una por función.

import { registrarEvento } from '@/lib/registrar-evento';

const CLAVE = 'luma_prueba_gratis_usada';
const CLAVE_PLAN = 'luma_plan_activo';

/** ¿Tiene un plan activo? Hoy es la simulación de `desbloquearPorPlan`; con
 * Hotmart conectado se reemplaza por la lectura real del plan en el servidor. */
export function planActivo(): boolean {
  try {
    return window.localStorage.getItem(CLAVE_PLAN) === '1';
  } catch {
    return false;
  }
}

export function pruebaGratisDisponible(): boolean {
  try {
    return window.localStorage.getItem(CLAVE) !== '1';
  } catch {
    return true;
  }
}

export function consumirPruebaGratis(): void {
  try {
    // Es la primera acción de valor real (docs/sistema/21-BACKOFFICE.md:
    // "activación") solo la PRIMERA vez que se llama en este navegador — se
    // comprueba ANTES de escribir la bandera para no registrar el evento
    // de nuevo en cada acción siguiente.
    const esPrimeraVez = window.localStorage.getItem(CLAVE) !== '1';
    window.localStorage.setItem(CLAVE, '1');
    if (esPrimeraVez) registrarEvento('primera_accion');
  } catch {
    // localStorage puede fallar (modo privado, cuota) — no bloquea el flujo.
  }
}

/** "Empezar mi plan" en /paywall: hasta que Hotmart esté conectado (pendiente,
 * ver ESTADO.md), esta es la única forma honesta de desbloquear — sin esto el
 * botón no hacía nada de verdad (defecto real reportado por el usuario). Es
 * una simulación local, no un plan pagado de verdad: se reemplaza por el
 * webhook real de Hotmart cuando esté conectado. */
export function desbloquearPorPlan(): void {
  try {
    window.localStorage.removeItem(CLAVE);
    window.localStorage.setItem(CLAVE_PLAN, '1');
  } catch {
    // localStorage puede fallar (modo privado, cuota) — no bloquea el flujo.
  }
}
