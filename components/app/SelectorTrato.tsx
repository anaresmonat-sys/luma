'use client';

// Tres botones «Ella · Él · Sin género» para elegir cómo le habla LUMA. Se usa en la bienvenida y en Más.

import { TRATOS, type Trato } from '@/lib/trato';

export function SelectorTrato({
  valor,
  onCambio,
  aria,
}: {
  valor: Trato | null;
  onCambio: (trato: Trato) => void;
  aria: string;
}) {
  return (
    <div role="radiogroup" aria-label={aria} className="flex w-full gap-2">
      {TRATOS.map((t) => {
        const activo = valor === t.id;
        return (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={activo}
            onClick={() => onCambio(t.id)}
            className={`min-h-11 flex-1 rounded-full border px-3 text-sm font-semibold transition-colors ${
              activo
                ? 'border-[var(--accent-lite)] bg-[color-mix(in_oklab,var(--accent)_22%,transparent)] text-[var(--accent-lite)]'
                : 'border-[color-mix(in_oklab,var(--text-tertiary)_35%,transparent)] text-[var(--text-secondary)]'
            }`}
          >
            {t.etiqueta}
          </button>
        );
      })}
    </div>
  );
}
