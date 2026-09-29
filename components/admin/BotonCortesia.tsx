'use client';

// Botón por fila en /admin/usuarios: activar o quitar el acceso de cortesía
// (pedido explícito del usuario, 2026-09-29 — dejar entrar a gente de confianza
// sin pasar por Hotmart). `esCortesia` decide si el botón activa o quita.

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function BotonCortesia({ userId, esCortesia }: { userId: string; esCortesia: boolean }) {
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  async function alternar() {
    setEnviando(true);
    setError('');
    try {
      const res = await fetch('/api/admin/cortesia', {
        method: esCortesia ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const datos: { error?: string } = await res.json();
      if (!res.ok) throw new Error(datos.error || 'No se pudo cambiar el acceso');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo cambiar el acceso');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={alternar}
        disabled={enviando}
        className={
          esCortesia
            ? 'flex h-8 items-center justify-center rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] px-3 text-[11.5px] font-semibold text-[var(--text-secondary)] disabled:opacity-60'
            : 'flex h-8 items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] px-3 text-[11.5px] font-bold text-[var(--on-accent)] disabled:opacity-60'
        }
      >
        {enviando ? 'Un momento…' : esCortesia ? 'Quitar cortesía' : '+ Dar acceso de cortesía'}
      </button>
      {error && <p className="text-[11px] font-semibold text-[var(--an-risk)]">{error}</p>}
    </div>
  );
}
