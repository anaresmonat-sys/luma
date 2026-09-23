'use client';

// Error Boundary global de Next.js (regla UX #18: "la app nunca muestra
// pantalla blanca"). Registra el fallo en error_log (vía /api/log-error, el
// patrón BFF de docs/sistema/21-BACKOFFICE.md) para que el panel de admin lo
// vea, y ofrece reintentar o volver al inicio en vez de una pantalla rota.
// Cobertura de raíz: falta un Error Boundary POR SECCIÓN más fino (pendiente,
// anotado en ESTADO.md) — este es el paraguas general.

import { useEffect } from 'react';

export default function ErrorGlobal({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    try {
      void fetch('/api/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: error.message, context: window.location.pathname }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // No debe romper nada si falla el propio registro del error.
    }
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-[var(--bg)] px-6 text-center">
      <span className="text-[32px]" aria-hidden="true">
        🌙
      </span>
      <h1 className="text-[18px] font-semibold text-[var(--text-primary)] [font-family:var(--font-display)]">
        Algo no salió bien
      </h1>
      <p className="max-w-[280px] text-[13px] leading-relaxed text-[var(--text-secondary)]">
        No es nada que hayas hecho tú — ya quedó anotado. Prueba de nuevo en un momento.
      </p>
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={reset}
          className="flex h-11 items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] px-5 text-[13px] font-bold text-[var(--on-accent)]"
        >
          Reintentar
        </button>
        <a
          href="/app"
          className="flex h-11 items-center justify-center rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_35%,transparent)] px-5 text-[13px] font-bold text-[var(--accent-lite)]"
        >
          Ir al inicio
        </a>
      </div>
    </div>
  );
}
