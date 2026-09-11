'use client';

// ONBOARDING — piezas compartidas (blueprint: docs/sistema/50-DISENO-ONBOARDING-PAYWALL.md §A).
// Iconografía de opción = EMOJI (FICHA-ARTE.md §Ronda #4 — override explícito del usuario,
// documentado y vigente para toda la app, INCLUIDO el onboarding).

import { useEffect, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Check, ChevronLeft } from 'lucide-react';

/* ── <OnboardingHeader> — marca (vuelve a /) + atrás + barra de progreso ────
   Barra: línea 2-3px, fill acento, arranca en 5-8% (endowed progress) y
   anima cada avance. Atrás: SIEMPRE presente (en el paso 0 vuelve a /). ── */
export function OnboardingHeader({
  progreso,
  onBack,
}: {
  /** 0-100, YA con el piso de 5-8% aplicado por quien orquesta el flujo. */
  progreso: number;
  onBack: () => void;
}) {
  return (
    <div className="sticky top-0 z-20 bg-[var(--bg)]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-11 w-full max-w-[480px] items-center justify-center px-4">
        <a href="/" className="text-[13px] font-semibold tracking-[0.04em] text-[var(--text-tertiary)]">
          LUMA
        </a>
      </div>
      <div className="mx-auto flex h-14 w-full max-w-[480px] items-center gap-3 px-4">
        <button
          type="button"
          aria-label="Atrás"
          onClick={onBack}
          className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-button)] text-[var(--text-secondary)] [touch-action:manipulation] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          <ChevronLeft size={22} strokeWidth={2} aria-hidden="true" />
        </button>
        <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--text-tertiary)_15%,transparent)]">
          <motion.div
            className="h-full rounded-full bg-[var(--accent)]"
            initial={false}
            animate={{ width: `${progreso}%` }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <span className="w-10 shrink-0 text-right text-[11px] tabular-nums text-[var(--text-tertiary)]">
          {Math.round(progreso)}%
        </span>
      </div>
    </div>
  );
}

/* ── <ChipOpcion> — fila de opción de ancho completo, ícono emoji + label.
   Seleccionado: borde acento 1.5-2px + fondo acento 8-12% + check acento. ── */
export function ChipOpcion({
  emoji,
  label,
  seleccionado,
  onClick,
}: {
  emoji: string;
  label: string;
  seleccionado: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className={`flex min-h-[60px] w-full items-center gap-3 rounded-[var(--radius-button)] px-4 py-3 text-left transition-colors duration-150 [touch-action:manipulation] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
        seleccionado
          ? 'border-[1.5px] border-[var(--accent)] bg-[var(--chip-bg)]'
          : 'border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface)]'
      }`}
    >
      <span
        aria-hidden="true"
        className="flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-[20px]"
      >
        {emoji}
      </span>
      <span className="flex-1 text-[16px] font-medium leading-snug text-[var(--text-primary)]">{label}</span>
      {seleccionado && (
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
          aria-hidden="true"
          className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]"
        >
          <Check size={13} strokeWidth={2.5} color="var(--bg)" aria-hidden="true" />
        </motion.span>
      )}
    </motion.button>
  );
}

/* ── <EscapeHatchInput> — "Otra cosa (escribe la tuya)": revela un campo con
   su propio CTA; NUNCA auto-avanza (A2 regla dura). ── */
export function EscapeHatchInput({
  valor,
  onChange,
  onContinuar,
  placeholder = 'Cuéntame con tus palabras…',
}: {
  valor: string;
  onChange: (v: string) => void;
  onContinuar: () => void;
  placeholder?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-3 overflow-hidden"
    >
      <input
        type="text"
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus
        className="h-14 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface)] px-4 text-[16px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)] focus-visible:border-[var(--accent)]"
      />
      <button
        type="button"
        disabled={valor.trim().length === 0}
        onClick={onContinuar}
        className="flex h-[52px] w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] transition-opacity duration-200 disabled:opacity-[0.65] [touch-action:manipulation] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      >
        Continuar
      </button>
      {valor.trim().length === 0 && (
        <p className="text-center text-[12px] text-[var(--text-tertiary)]">Escribe algo para continuar</p>
      )}
    </motion.div>
  );
}

/* ── <PasoShell> — layout base de una pantalla de pregunta/reconocimiento:
   header + contenido con transición de entrada/salida horizontal (A4). ── */
export function PasoShell({
  progreso,
  onBack,
  direccion,
  children,
}: {
  progreso: number;
  onBack: () => void;
  /** 1 = avanzando (entra desde la derecha) · -1 = retrocediendo. */
  direccion: 1 | -1;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <div className="flex min-h-dvh flex-col [font-family:var(--font-body)]">
      <OnboardingHeader progreso={progreso} onBack={onBack} />
      <motion.div
        key={direccion + '-frame'}
        initial={reduce ? { opacity: 0 } : { opacity: 0, x: direccion === 1 ? 40 : -40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, x: direccion === 1 ? -24 : 24 }}
        transition={{ duration: reduce ? 0.2 : 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto flex w-full max-w-[480px] flex-1 flex-col px-5 pb-8 pt-6"
      >
        {children}
      </motion.div>
    </div>
  );
}

export function usarSliderValor(inicial: number) {
  const [valor, setValor] = useState(inicial);
  return { valor, setValor };
}

/* ── <ContadorHero> — número héroe que cuenta al montar (baseline #2). ── */
export function ContadorHero({ valor }: { valor: number }) {
  const [mostrado, setMostrado] = useState(valor);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) {
      setMostrado(valor);
      return;
    }
    setMostrado(valor);
  }, [valor, reduce]);
  return (
    <span className="text-[44px] font-bold leading-none tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
      {mostrado}
    </span>
  );
}
