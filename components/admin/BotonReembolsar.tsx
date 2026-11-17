'use client';

// Botón «Reembolsar ahora» del panel de Ventas. El dinero solo sale si la dueña confirma; el servidor vuelve a
// comprobar plazo y transacción antes de llamar a Hotmart (/api/admin/reembolsar).

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function BotonReembolsar({ peticionId, correo }: { peticionId: string; correo: string }) {
  const router = useRouter();
  const [confirmando, setConfirmando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  async function reembolsar() {
    if (enviando) return;
    setEnviando(true);
    setMensaje(null);
    try {
      const r = await fetch('/api/admin/reembolsar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ peticionId }),
      });
      const j = await r.json().catch(() => ({}));
      if (r.ok) {
        setMensaje('✓ Reembolsado en Hotmart.');
        router.refresh();
      } else {
        setMensaje(`${j.error ?? 'No se pudo reembolsar.'}${j.estadoHttp ? ` (código ${j.estadoHttp})` : ''}`);
      }
    } catch {
      setMensaje('Sin conexión. Inténtalo de nuevo.');
    } finally {
      setEnviando(false);
      setConfirmando(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {confirmando ? (
        <>
          <p className="text-sm font-semibold text-[var(--text-primary)]">¿Devolver el dinero a {correo}? No se puede deshacer.</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={reembolsar}
              disabled={enviando}
              className="min-h-11 rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--on-accent)] disabled:opacity-60"
            >
              {enviando ? 'Reembolsando…' : 'Sí, reembolsar'}
            </button>
            <button
              type="button"
              onClick={() => setConfirmando(false)}
              disabled={enviando}
              className="min-h-11 rounded-full border border-[var(--border)] px-5 text-sm font-semibold text-[var(--text-primary)]"
            >
              No
            </button>
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setConfirmando(true)}
          className="min-h-11 self-start rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--on-accent)]"
        >
          Reembolsar ahora
        </button>
      )}
      {mensaje && (
        <p role="status" className="text-sm text-[var(--text-secondary)]">
          {mensaje}
        </p>
      )}
    </div>
  );
}
