'use client';

// LOADING "CONSTRUYENDO TU PLAN" (50 → B) — el argumento de apertura del
// paywall (labor illusion, Buell & Norton 2011). 4-6s, 3-5 líneas con datos
// REALES del onboarding, anillo con mesetas (nunca linear perfecto).

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Check } from 'lucide-react';

export interface LineaPlan {
  texto: string;
}

const RADIO = 44;
const CIRCUNFERENCIA = 2 * Math.PI * RADIO;

export function LoadingPlan({ lineas, onCompletar }: { lineas: LineaPlan[]; onCompletar: () => void }) {
  const reduce = useReducedMotion();
  const [activa, setActiva] = useState(-1);
  const [completadas, setCompletadas] = useState<number>(0);

  useEffect(() => {
    let cancelado = false;
    const delays = lineas.map((_, i) => 700 + i * 750);

    lineas.forEach((_, i) => {
      window.setTimeout(() => {
        if (cancelado) return;
        setActiva(i);
      }, delays[i]);
      window.setTimeout(
        () => {
          if (cancelado) return;
          setCompletadas((c) => Math.max(c, i + 1));
        },
        delays[i] + 550
      );
    });

    const total = delays[delays.length - 1] + 550 + 700;
    const t = window.setTimeout(() => {
      if (!cancelado) onCompletar();
    }, total);

    return () => {
      cancelado = true;
      window.clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pct = Math.round((completadas / lineas.length) * 100);
  const offset = CIRCUNFERENCIA - (pct / 100) * CIRCUNFERENCIA;

  return (
    <div
      className="flex min-h-dvh flex-col items-center justify-center px-6 [font-family:var(--font-body)]"
      role="status"
      aria-live="polite"
      aria-busy={pct < 100}
    >
      <div className="relative flex size-28 items-center justify-center">
        <svg width="112" height="112" viewBox="0 0 112 112" className="-rotate-90">
          <circle cx="56" cy="56" r={RADIO} fill="none" stroke="color-mix(in oklab, var(--text-tertiary) 18%, transparent)" strokeWidth="9" />
          <motion.circle
            cx="56"
            cy="56"
            r={RADIO}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={CIRCUNFERENCIA}
            initial={{ strokeDashoffset: CIRCUNFERENCIA }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: reduce ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <span className="absolute text-[22px] font-bold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
          {pct}%
        </span>
      </div>

      <h1 className="mt-6 text-[22px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
        Construyendo tu plan…
      </h1>

      <ul className="mt-8 flex w-full max-w-[340px] flex-col gap-4">
        {lineas.map((l, i) => {
          const estado = i < completadas ? 'completada' : i === activa ? 'activa' : 'pendiente';
          return (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: estado === 'pendiente' ? 0.4 : 1, y: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3"
            >
              <span
                aria-hidden="true"
                className={`flex size-5 shrink-0 items-center justify-center rounded-full ${
                  estado === 'completada' ? 'bg-[var(--accent)]' : 'border border-[var(--text-tertiary)]'
                }`}
              >
                {estado === 'completada' && <Check size={12} strokeWidth={2.5} color="var(--bg)" />}
                {estado === 'activa' && (
                  <motion.span
                    className="size-1.5 rounded-full bg-[var(--accent)]"
                    animate={reduce ? {} : { opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </span>
              <span className="text-[15px] leading-snug text-[var(--text-primary)]">{l.texto}</span>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
