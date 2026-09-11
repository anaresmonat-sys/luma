'use client';

// REVELACIÓN DEL PLAN — el PICO del funnel (peak-end, 02B regla c): efecto
// IKEA + dotación. Muestra la inversión cuantificada ("Hecho con tus N
// respuestas" — costo hundido OBLIGATORIO, 02B regla a) y el value stack.
// SIN precios: el paywall (Sesión 4, próxima etapa) vive en /paywall.

import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { CartaSacerdotisa } from '@/components/app/HeroDemoLuma';

export interface BeneficioPlan {
  texto: string;
}

export function PlanListo({
  tituloMarked,
  nRespuestas,
  beneficios,
  ctaLabel,
  ctaHref,
}: {
  tituloMarked: string;
  nRespuestas: number;
  beneficios: BeneficioPlan[];
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-[var(--bg)] px-5 pb-8 pt-10 [font-family:var(--font-body)]">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto flex w-full max-w-[480px] flex-1 flex-col items-center text-center"
      >
        <CartaSacerdotisa />

        <h1 className="mt-6 text-balance text-[30px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
          {tituloMarked.split('[acento]').map((parte, i) =>
            i === 0 ? (
              <span key={i}>{parte}</span>
            ) : (
              <span key={i}>
                <span className="text-[var(--accent)]">{parte.split('[/acento]')[0]}</span>
                {parte.split('[/acento]')[1]}
              </span>
            )
          )}
        </h1>
        <p className="mt-2 text-[14px] text-[var(--text-secondary)]">Hecho con tus {nRespuestas} respuestas</p>

        <ul className="mt-8 flex w-full flex-col gap-3 text-left">
          {beneficios.map((b, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-start gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_18%,transparent)] bg-[var(--surface)] p-4"
            >
              <span
                aria-hidden="true"
                className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_15%,transparent)]"
              >
                <Check size={14} strokeWidth={2.5} color="var(--accent)" aria-hidden="true" />
              </span>
              <span className="text-[15px] leading-snug text-[var(--text-primary)]">{b.texto}</span>
            </motion.li>
          ))}
        </ul>

        <div className="mt-auto w-full pt-10">
          <a
            href={ctaHref}
            className="flex h-[52px] w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] shadow-[0_8px_30px_color-mix(in_oklab,var(--accent)_25%,transparent)] [touch-action:manipulation] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            {ctaLabel}
          </a>
          <p className="mt-3 text-center text-[13px] text-[var(--text-tertiary)]">
            Sin cobros todavía — en la siguiente pantalla eliges tu plan
          </p>
        </div>
      </motion.div>
    </div>
  );
}
