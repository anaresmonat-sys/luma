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
    <span className="ml-2 inline-flex flex-wrap items-center gap-2">
      {confirmando ? (
        <>
          <span className="font-semibold">¿Devolver el dinero a {correo}? No se puede deshacer.</span>
          <button type="button" onClick={reembolsar} disabled={enviando} className="rounded border px-2 py-1 font-semibold">
            {enviando ? 'Reembolsando…' : 'Sí, reembolsar'}
          </button>
          <button type="button" onClick={() => setConfirmando(false)} disabled={enviando} className="rounded border px-2 py-1">
            No
          </button>
        </>
      ) : (
        <button type="button" onClick={() => setConfirmando(true)} className="rounded border px-2 py-1 font-semibold">
          Reembolsar ahora
        </button>
      )}
      {mensaje && <span role="status">{mensaje}</span>}
    </span>
  );
}
