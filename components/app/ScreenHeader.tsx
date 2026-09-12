'use client';

// Header genérico de pantallas interiores: flecha volver + título + slot derecho
// opcional (ícono de calendario en Diario, vacío en Tarot/Descifrar). Composición
// tomada de vista-previa-app.html (frames 4/6/7), aprobado por el usuario.

import Link from 'next/link';
import type { ReactNode } from 'react';

export function ScreenHeader({
  titulo,
  volverHref = '/app',
  derecha,
  tituloDisplay = false,
}: {
  titulo: string;
  volverHref?: string;
  derecha?: ReactNode;
  /** true = título en la serif display (Descifra/Coach); false = sans semibold (Tarot/Diario). */
  tituloDisplay?: boolean;
}) {
  return (
    <div className="flex shrink-0 items-center justify-between py-2">
      <Link
        href={volverHref}
        aria-label="Volver"
        className="flex size-11 shrink-0 items-center justify-center text-[var(--text-primary)]"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </Link>
      <h1
        className={
          tituloDisplay
            ? 'text-[17px] font-semibold text-[var(--text-primary)] [font-family:var(--font-display)]'
            : 'text-[15px] font-semibold text-[var(--text-primary)]'
        }
      >
        {titulo}
      </h1>
      <div className="flex size-11 shrink-0 items-center justify-center">{derecha}</div>
    </div>
  );
}
