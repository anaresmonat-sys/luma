import Link from 'next/link';

// Aviso del resultado gratis, a la vista ANTES de escribir. Con la prueba
// disponible: una línea que fija la expectativa. Ya usada: tarjeta con la salida
// (planes) para que nadie escriba un texto largo y se entere al final.
export function AvisoPrueba({ disponible, className = '' }: { disponible: boolean; className?: string }) {
  if (disponible) {
    return (
      <p className={`text-center text-[11px] font-semibold text-[var(--accent-lite)] ${className}`}>
        🎁 Tu primer resultado es gratis
      </p>
    );
  }
  return (
    <div
      className={`rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_35%,transparent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] p-3 ${className}`}
    >
      <p className="text-[12.5px] font-semibold text-[var(--text-primary)]">Ya usaste tu resultado gratis</p>
      <p className="mt-0.5 text-[11.5px] leading-snug text-[var(--text-secondary)]">
        Elige tu plan para seguir — así no pierdes lo que escribas.
      </p>
      <Link
        href="/paywall"
        className="mt-2 inline-flex h-9 items-center rounded-[var(--radius-button)] bg-[var(--accent)] px-4 text-[12.5px] font-semibold text-[var(--on-accent)]"
      >
        Ver planes
      </Link>
    </div>
  );
}
