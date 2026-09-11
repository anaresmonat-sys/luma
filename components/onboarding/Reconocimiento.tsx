'use client';

// Micro-pantalla de RECONOCIMIENTO (50 → A5): cada 3-5 preguntas, devuelve un
// insight construido con la respuesta REAL. CERO opciones — solo Continuar.
// La variante `etiquetado` es la ÚLTIMA, obligatoria antes del loading (regla b
// de LA ESCALERA en 02B): etiqueta con una identidad aspiracional.

import { motion } from 'motion/react';

export function Reconocimiento({
  emoji,
  titulo,
  cuerpo,
  ctaLabel = 'Continuar',
  onContinuar,
}: {
  emoji: string;
  titulo: string;
  cuerpo: string;
  ctaLabel?: string;
  onContinuar: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center pt-6 text-center">
      <motion.span
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden="true"
        className="flex size-20 items-center justify-center rounded-full text-[40px]"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--accent) 20%, transparent), transparent 70%)',
        }}
      >
        {emoji}
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6 text-balance text-[28px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]"
      >
        {titulo}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="mt-3 max-w-[340px] text-[15px] leading-relaxed text-[var(--text-secondary)]"
      >
        {cuerpo}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
        className="mt-auto w-full pt-10"
      >
        <button
          type="button"
          onClick={onContinuar}
          className="flex h-[52px] w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] [touch-action:manipulation] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          {ctaLabel}
        </button>
      </motion.div>
    </div>
  );
}
