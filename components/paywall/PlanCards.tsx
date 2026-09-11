'use client';

// PLAN CARDS del paywall (50 → C2 punto 4/5): 2 cards TOCABLES (no cada una con
// su propio CTA — a diferencia de la Oferta de la landing). Tap = selecciona
// (borde acento se mueve); el CTA único de la pantalla actúa sobre el plan
// seleccionado. Anual recomendado y PRE-SELECCIONADO (+15-20% eligen anual, 02C).

import { motion } from 'motion/react';
import { Star } from 'lucide-react';

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

function TrialBadge({ dias }: { dias: number }) {
  return (
    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[color-mix(in_oklab,var(--accent)_13%,transparent)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--accent)]">
      <Star size={12} strokeWidth={2.5} aria-hidden="true" />
      {dias} días gratis
    </span>
  );
}

function Card({
  plan,
  seleccionado,
  trialDias,
  onClick,
}: {
  plan: PlanPaywall;
  seleccionado: boolean;
  trialDias: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className={`relative w-full rounded-[var(--radius-card)] p-5 text-left transition-colors duration-150 [touch-action:manipulation] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
        seleccionado
          ? 'border-2 border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_7%,transparent)] shadow-[0_12px_32px_color-mix(in_oklab,var(--accent)_18%,transparent)]'
          : 'border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] bg-[var(--surface)]'
      }`}
    >
      {plan.badge && (
        <span className="absolute -top-[10px] left-1/2 -translate-x-1/2 rounded-full border border-[color-mix(in_oklab,var(--accent)_25%,transparent)] bg-[var(--accent)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--bg)]">
          {plan.badge}
        </span>
      )}
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">{plan.nombre}</h3>
        <TrialBadge dias={trialDias} />
      </div>
      <p className="mt-3 flex items-baseline gap-1">
        <span className="text-[24px] font-bold leading-none tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
          {plan.precioMes}
        </span>
        <span className="text-[13px] text-[var(--text-secondary)]">{plan.sufijo ?? '/mes'}</span>
      </p>
      {plan.descomposicionDia && <p className="mt-0.5 text-[12px] text-[var(--text-secondary)]">{plan.descomposicionDia}</p>}
      {plan.totalAnual && <p className="mt-1 text-[12px] text-[var(--text-secondary)]">{plan.totalAnual}</p>}
      {plan.ahorro && <p className="mt-1 text-[13px] font-semibold text-[var(--accent)]">{plan.ahorro}</p>}
    </motion.button>
  );
}

export function PlanCards({
  anual,
  mensual,
  seleccionado,
  trialDias,
  onSeleccionar,
}: {
  anual: PlanPaywall;
  mensual: PlanPaywall;
  seleccionado: 'anual' | 'mensual';
  trialDias: number;
  onSeleccionar: (id: 'anual' | 'mensual') => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <Card plan={anual} seleccionado={seleccionado === 'anual'} trialDias={trialDias} onClick={() => onSeleccionar('anual')} />
      <Card plan={mensual} seleccionado={seleccionado === 'mensual'} trialDias={trialDias} onClick={() => onSeleccionar('mensual')} />
    </div>
  );
}
