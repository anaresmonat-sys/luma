// Piezas compartidas del panel de administración — cards con dato héroe +
// insight en lenguaje claro (docs/sistema/17-VISUALIZACION-DATOS.md: máximo
// dato, mínima tinta; el insight traduce el número a una frase que el dueño
// entiende sin ser analista, ver docs/sistema/21-BACKOFFICE.md).

import type { ReactNode } from 'react';

export function Tarjeta({
  etiqueta,
  valor,
  insight,
  tono = 'normal',
}: {
  etiqueta: string;
  valor: ReactNode;
  insight?: string;
  tono?: 'normal' | 'alerta' | 'bien';
}) {
  const colorInsight =
    tono === 'alerta' ? 'var(--an-risk)' : tono === 'bien' ? 'var(--an-eye)' : 'var(--text-secondary)';
  return (
    <div className="rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_22%,transparent)] bg-[var(--surface)] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-tertiary)]">{etiqueta}</p>
      <p className="mt-1.5 text-[26px] font-bold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
        {valor}
      </p>
      {insight && (
        <p className="mt-1.5 text-[12.5px] leading-snug" style={{ color: colorInsight }}>
          {insight}
        </p>
      )}
    </div>
  );
}

/** Estado honesto "sin datos todavía" — nunca se inventa un número. */
export function SinDatos({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-dashed border-[color-mix(in_oklab,var(--text-tertiary)_35%,transparent)] bg-[color-mix(in_oklab,var(--accent)_4%,transparent)] p-5 text-center">
      <p className="text-[13px] leading-relaxed text-[var(--text-secondary)]">{children}</p>
    </div>
  );
}

export function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="mt-8 first:mt-0">
      <h2 className="text-[14px] font-semibold text-[var(--text-primary)]">{titulo}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
