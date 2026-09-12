'use client';

// Botón primario de la app interna: relleno oro, el mismo tratamiento en TODA la
// app (Empezar/Siguiente del onboarding, Analizar, Guardar, accesos de Inicio —
// FICHA-ARTE: "Home: las dos cajitas... mismo estilo que los botones Empezar/Siguiente").
// <AppButton> renderiza <button> (acciones en la misma pantalla); <AppLinkButton>
// renderiza <Link> (navegación a otra pantalla) con la MISMA clase visual.
// `compact`: para tiles de 2 columnas (accesos de Inicio) — texto más chico y
// altura mínima en vez de fija, así 2 líneas no desbordan el pill (14 (49).

import Link from 'next/link';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

function clase(compact?: boolean) {
  return `flex w-full items-center justify-center rounded-[var(--radius-button)] bg-gradient-to-b from-[var(--accent-lite)] to-[var(--accent)] font-bold text-[var(--on-accent)] shadow-[0_8px_16px_-10px_color-mix(in_oklab,var(--accent)_60%,transparent)] transition-transform duration-150 [touch-action:manipulation] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lite)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] ${
    compact ? 'min-h-[48px] gap-1.5 px-3 py-2 text-center text-[12px] leading-snug' : 'h-[48px] gap-2 px-4 text-[14px]'
  }`;
}

export function AppButton({
  children,
  onClick,
  type = 'button',
  disabled,
  ariaLabel,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  ariaLabel?: string;
}) {
  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.97 }}
      onClick={onClick}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${clase()} ${disabled ? 'opacity-50' : ''}`}
    >
      {children}
    </motion.button>
  );
}

export function AppLinkButton({ href, children, compact }: { href: string; children: ReactNode; compact?: boolean }) {
  return (
    <motion.div whileTap={{ scale: 0.97 }}>
      <Link href={href} className={clase(compact)}>
        {children}
      </Link>
    </motion.div>
  );
}
