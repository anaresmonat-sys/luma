'use client';

// Paso real de confirmación de edad — antes de esto no existía ningún control
// activo, solo una frase en las páginas legales (auditoría 2026-09-23). Se
// muestra UNA sola vez por navegador, antes de la primera pregunta del
// onboarding. Sin casilla marcada, "Continuar" queda deshabilitado — no se
// puede seguir sin confirmar.

import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Check } from 'lucide-react';

export function PasoEdad({ onContinuar }: { onContinuar: () => void }) {
  const reduce = useReducedMotion();
  const [marcado, setMarcado] = useState(false);

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.2 : 0.35 }}
      className="flex flex-1 flex-col justify-center gap-6"
    >
      <div>
        <span className="text-[28px] leading-none" aria-hidden="true">
          🕯️
        </span>
        <h1 className="mt-3 text-[22px] font-semibold leading-tight text-[var(--text-primary)] [font-family:var(--font-display)]">
          Antes de empezar
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-[var(--text-secondary)]">
          LUMA habla de relaciones, tarot e inteligencia emocional para adultos — necesitamos confirmar tu edad para
          continuar.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setMarcado((m) => !m)}
        aria-pressed={marcado}
        className="flex items-start gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_30%,transparent)] bg-[var(--surface)] p-4 text-left"
      >
        <span
          aria-hidden="true"
          className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-[8px] border-2"
          style={{
            borderColor: marcado ? 'var(--accent)' : 'color-mix(in oklab, var(--text-tertiary) 45%, transparent)',
            background: marcado ? 'var(--accent)' : 'transparent',
          }}
        >
          {marcado && <Check size={15} strokeWidth={3} color="var(--on-accent)" aria-hidden="true" />}
        </span>
        <span className="text-[13.5px] leading-relaxed text-[var(--text-primary)]">
          Confirmo que soy mayor de 18 años.
        </span>
      </button>

      <button
        type="button"
        disabled={!marcado}
        onClick={onContinuar}
        className="flex h-14 items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[15px] font-bold text-[var(--on-accent)] transition-opacity duration-150 disabled:opacity-40"
      >
        Continuar
      </button>
    </motion.div>
  );
}
