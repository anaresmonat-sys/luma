// Puente de datos Descifrar → Coach SIN backend (Sesión 6 conecta Supabase real).
// Regla del stack (CLAUDE.md): "Persistencia sin backend: app desplegada → localStorage."
// "¿Qué podría responderle?" desde un análisis real deja el mensaje listo para que
// el Coach lo prellene — si no, llevaba a la conversación de ejemplo genérica, sin
// ninguna relación con lo que la persona acababa de pegar (defecto real reportado
// por el usuario, 2026-09-18).

const CLAVE = 'luma_coach_mensaje_pendiente';

export function guardarMensajePendiente(texto: string): void {
  try {
    window.localStorage.setItem(CLAVE, texto);
  } catch {
    // localStorage puede fallar (modo privado, cuota) — no bloquea el flujo.
  }
}

export function leerYLimpiarMensajePendiente(): string | null {
  try {
    const texto = window.localStorage.getItem(CLAVE);
    if (texto) window.localStorage.removeItem(CLAVE);
    return texto;
  } catch {
    return null;
  }
}
