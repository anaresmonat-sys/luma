'use client';

// KIT DE LANDING — §3 AGITACIÓN (blueprint: 55 §3)
// Cada frase lleva su ícono de dolor — regla de escaneabilidad: los dolores
// NUNCA van como lista de texto plano, necesitan un ancla visual para el ojo.
// Emoji (no SVG de Lucide): pedido explícito del usuario para que el ícono
// se sienta "acorde con el resto de la app, más divertido" — coherente con
// la decisión ya vigente de FICHA-ARTE (Ronda #4: toda la app usa emoji).
// A propósito sin IconChip/caja (el chip de 44px con borde de Problema.tsx):
// el emoji va suelto para que Agitación se lea como el mismo movimiento
// elevado que §2 pero un peldaño MÁS callado — la intensidad sube en el
// texto, no en el envoltorio. Cada frase es corta (máx 2 líneas; warn a
// las 18 palabras). El NÚMERO del costo va en [b]/[acento] (dato héroe).

import { motion } from 'motion/react';
import { SectionShell, useReveal, VIEWPORT_ONCE } from './ui';
import { MarkedCopy, warnCopy, warnRango } from './MarkedCopy';

export interface FraseAgitacion {
  /** Emoji del dolor (mismo sistema que el resto de la app) — 1 glifo. */
  emoji: string;
  /** Copy MARCADO y corto — máx 18 palabras, warn. */
  textoMarked: string;
}

export interface AgitacionProps {
  /** 2-4 frases MARCADAS y cortas, cada una con su ícono — nada de párrafos. */
  frases: FraseAgitacion[];
  /** Mini-card opcional "hoy vs en 6 meses" (55 §3). */
  contraste?: {
    labelHoy: string;
    hoy: string;
    labelFuturo: string;
    futuro: string;
  };
  id?: string;
}

export function Agitacion({ frases, contraste, id }: AgitacionProps) {
  warnRango('Agitación → frases', frases.length, 2, 4);
  frases.forEach((f, i) => warnCopy(`Agitación → frase ${i + 1}`, f.textoMarked, 18));
  const { contenedor, item } = useReveal();

  return (
    <SectionShell id={id} elevacion="elevada" flush="top" ariaLabel="El costo de seguir igual">
      <motion.div
        variants={contenedor}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="mx-auto max-w-[620px]"
      >
        <div className="flex flex-col gap-5">
          {frases.map((f, i) => (
            <motion.div key={i} variants={item} className="flex items-start gap-3">
              <span className="shrink-0 text-[22px] leading-none" aria-hidden="true">
                {f.emoji}
              </span>
              <p className="pt-0.5 text-[17px] leading-[1.6] text-[var(--text-secondary)]">
                <MarkedCopy text={f.textoMarked} />
              </p>
            </motion.div>
          ))}
        </div>

        {contraste && (
          <motion.div variants={item} className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-[var(--radius-card)] bg-[var(--bg)] p-5">
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                {contraste.labelHoy}
              </p>
              <p className="mt-2 text-[15px] leading-snug text-[var(--text-primary)]">{contraste.hoy}</p>
            </div>
            {/* "si nada cambia": más apagado/frío — el peso lo pone el copy, no el rojo */}
            <div className="rounded-[var(--radius-card)] bg-[var(--surface-2)] p-5">
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                {contraste.labelFuturo}
              </p>
              <p className="mt-2 text-[15px] leading-snug text-[var(--text-secondary)]">{contraste.futuro}</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </SectionShell>
  );
}
