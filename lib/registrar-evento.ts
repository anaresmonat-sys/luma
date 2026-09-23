// Ayudante 'use client' — dispara el registro sin bloquear ni romper el flujo
// del usuario si falla (fire-and-forget con try/catch mudo). Ver
// docs/sistema/21-BACKOFFICE.md y lib/log-servidor.ts (el vocabulario cerrado
// de eventos vive ahí, no aquí — este archivo solo envía).

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
