// Ayudante 'use client' — dispara el registro sin bloquear ni romper el flujo
// del usuario si falla (fire-and-forget con try/catch mudo). Ver
// docs/sistema/21-BACKOFFICE.md y lib/log-servidor.ts (el vocabulario cerrado
// de eventos vive ahí, no aquí — este archivo solo envía).

/** Igual que registrarEvento pero UNA sola vez por pestaña/visita (sessionStorage): recargar la
 * página no infla el conteo del camino de compra. Sin sessionStorage, envía igual. */
export function registrarEventoUnaVez(type: string, metadata?: Record<string, unknown>): void {
  const clave = `luma_ev_${type}`;
  try {
    if (window.sessionStorage.getItem(clave) === '1') return;
    window.sessionStorage.setItem(clave, '1');
  } catch {
    // Sin sessionStorage: se envía de todos modos.
  }
  registrarEvento(type, metadata);
}

export function registrarEvento(type: string, metadata?: Record<string, unknown>): void {
  try {
    void fetch('/api/log-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, metadata }),
      keepalive: true,
    }).catch(() => {
      // No debe romper la experiencia del usuario si el registro falla.
    });
  } catch {
    // Ídem — entorno sin fetch disponible, por ejemplo.
  }
}
