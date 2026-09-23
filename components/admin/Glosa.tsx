'use client';

// Burbuja de información ("i") para palabras técnicas o en inglés del panel de
// administración — pedido del usuario, 2026-09-23: "pon globos de información
// en aquellas palabras que estén en inglés o que para una persona que no sepa
// de cómo funcionan puedan entenderlo". Funciona con TAP (no solo hover) por
// ser un panel que también se usa desde el celular; se cierra al tocar fuera.

import { useEffect, useRef, useState, type ReactNode } from 'react';

export function Glosa({ termino, children }: { termino: string; children: ReactNode }) {
  const [abierta, setAbierta] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!abierta) return;
    function alTocarFuera(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setAbierta(false);
    }
    document.addEventListener('mousedown', alTocarFuera);
    return () => document.removeEventListener('mousedown', alTocarFuera);
  }, [abierta]);

  return (
    <span ref={ref} className="relative inline-flex translate-y-[-1px]">
      <button
        type="button"
        onClick={() => setAbierta((v) => !v)}
        aria-expanded={abierta}
        aria-label={`Qué significa "${termino}"`}
        className="ml-1 inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--accent)_50%,transparent)] text-[12px] font-bold leading-none text-[var(--accent-lite)] transition-colors duration-150 hover:bg-[color-mix(in_oklab,var(--accent)_15%,transparent)]"
      >
        i
      </button>
      {abierta && (
        <span
          role="tooltip"
          className="absolute left-1/2 top-full z-30 mt-2 w-60 -translate-x-1/2 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_35%,transparent)] bg-[var(--surface)] p-3 text-left text-[12px] font-normal normal-case leading-relaxed text-[var(--text-secondary)] shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
        >
          <strong className="block text-[11.5px] font-semibold text-[var(--accent-lite)]">{termino}</strong>
          <span className="mt-1 block">{children}</span>
        </span>
      )}
    </span>
  );
}
