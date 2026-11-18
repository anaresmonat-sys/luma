'use client';

// PLAN CARDS del paywall (50 → C2 punto 4/5): 2 cards TOCABLES (no cada una con
// su propio CTA — a diferencia de la Oferta de la landing). Tap = selecciona
// (borde acento se mueve); el CTA único de la pantalla actúa sobre el plan
// seleccionado. Anual recomendado y PRE-SELECCIONADO (+15-20% eligen anual, 02C).

import { motion, useReducedMotion } from 'motion/react';
import { Check } from 'lucide-react';

export interface PlanPaywall {
  id: 'anual' | 'mensual';
  nombre: string;
  precioMes: string;
  sufijo?: string;
  descomposicionDia?: string;
  totalAnual?: string;
  ahorro?: string;
  badge?: string;
}

function Card({
  plan,
  seleccionado,
  onClick,
}: {
  plan: PlanPaywall;
  seleccionado: boolean;
  onClick: () => void;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={seleccionado}
      id={`plan-${plan.id}`}
      tabIndex={seleccionado ? 0 : -1}
      onClick={onClick}
      // Al elegir el plan, la tarjeta hace un pequeño «latido» (sin movimiento si la persona lo tiene desactivado).
      initial={false}
      animate={seleccionado && !reduce ? { scale: [1, 1.025, 1] } : { scale: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      whileTap={{ scale: 0.98 }}
      className={`relative w-full rounded-[var(--radius-card)] border p-4 text-left transition-colors duration-150 [touch-action:manipulation] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
        seleccionado
          ? 'border-transparent bg-[color-mix(in_oklab,var(--accent)_7%,transparent)] shadow-[0_12px_32px_color-mix(in_oklab,var(--accent)_18%,transparent)]'
          : 'border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] bg-[var(--surface)]'
      }`}
    >
      {seleccionado && (
        <motion.span
          layoutId="plan-seleccionado"
          aria-hidden="true"
          transition={{ type: 'spring', bounce: 0.12, duration: 0.4 }}
          className="pointer-events-none absolute -inset-px rounded-[var(--radius-card)] border-2 border-[var(--accent)]"
        />
      )}
      {plan.badge && (
        <span className="absolute -top-[10px] left-1/2 -translate-x-1/2 rounded-full border border-[color-mix(in_oklab,var(--accent)_25%,transparent)] bg-[var(--accent)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--bg)]">
          {plan.badge}
        </span>
      )}
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2">
          {/* Check visible del plan seleccionado — antes solo el borde/sombra
              distinguían la card activa (defecto de accesibilidad de color). */}
          <span
            aria-hidden="true"
            className={`flex size-5 shrink-0 items-center justify-center rounded-full transition-colors duration-150 ${
              seleccionado
                ? 'bg-[var(--accent)]'
                : 'border border-[color-mix(in_oklab,var(--text-tertiary)_40%,transparent)]'
            }`}
          >
            {seleccionado && <Check size={12} strokeWidth={2.5} color="var(--bg)" aria-hidden="true" />}
          </span>
          <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">{plan.nombre}</h3>
        </span>
      </div>
      <p className="mt-2 flex items-baseline gap-1">
        <span className="text-[24px] font-bold leading-none tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
          {plan.precioMes.replace(/\*$/, '')}
          {plan.precioMes.endsWith('*') && (
            <span aria-hidden="true" className="-ml-px text-[12px] font-medium leading-none text-[var(--text-secondary)]">
              *
            </span>
          )}
        </span>
        <span className="text-sm text-[var(--text-secondary)]">{plan.sufijo ?? '/mes'}</span>
      </p>
      {plan.descomposicionDia && <p className="mt-0.5 text-sm text-[var(--text-secondary)]">{plan.descomposicionDia}</p>}
      {plan.totalAnual && <p className="mt-1 text-sm text-[var(--text-secondary)]">{plan.totalAnual}</p>}
      {plan.ahorro && <p className="mt-1 text-sm font-semibold text-[var(--accent)]">{plan.ahorro}</p>}
    </motion.button>
  );
}

export function PlanCards({
  anual,
  mensual,
  seleccionado,
  onSeleccionar,
}: {
  anual: PlanPaywall;
  mensual: PlanPaywall;
  seleccionado: 'anual' | 'mensual';
  onSeleccionar: (id: 'anual' | 'mensual') => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Elige tu plan"
      className="flex flex-col gap-3"
      onKeyDown={(e) => {
        if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) return;
        e.preventDefault();
        const siguiente = seleccionado === "anual" ? "mensual" : "anual";
        onSeleccionar(siguiente);
        window.requestAnimationFrame(() => document.getElementById(`plan-${siguiente}`)?.focus());
      }}
    >
      <Card plan={anual} seleccionado={seleccionado === 'anual'} onClick={() => onSeleccionar('anual')} />
      <Card plan={mensual} seleccionado={seleccionado === 'mensual'} onClick={() => onSeleccionar('mensual')} />
    </div>
  );
}
