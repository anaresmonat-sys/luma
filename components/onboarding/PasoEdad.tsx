'use client';

// Paso real de confirmación de edad. Una sola vez por navegador, antes de entrar a
// la función real (recorrido sin preguntas, 2026-10-13). Revisión visual ronda 6:
// sin barra de progreso falsa (es un paso único), botón SIEMPRE tocable con una pista
// clara si falta la casilla, contenido anclado arriba (sin 230px de vacío), y nombra
// el destino ("tu primera lectura es gratis").

import { useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { Check } from 'lucide-react';

export function PasoEdad({ onContinuar }: { onContinuar: () => void }) {
  const reduce = useReducedMotion();
  const [marcado, setMarcado] = useState(false);
  const [pista, setPista] = useState(false);

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.2 : 0.35 }}
      className="flex flex-1 flex-col gap-6 pt-2"
    >
      <div className="flex flex-col items-center text-center">
        <span
          aria-hidden="true"
          className="flex size-16 items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--accent)_45%,transparent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] shadow-[0_0_28px_-8px_color-mix(in_oklab,var(--accent)_60%,transparent)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/luma-icon.png" alt="" className="h-9 w-auto brightness-125" />
        </span>
        <h1 className="mt-5 text-balance text-[28px] font-bold leading-[1.1] text-[var(--text-primary)] [font-family:var(--font-display)]">
          Una cosa antes de tu <span className="text-[var(--accent)]">primera lectura</span>
        </h1>
        <p className="mt-3 max-w-[340px] text-[15px] leading-relaxed text-[var(--text-secondary)]">
          LUMA habla de relaciones, tarot e inteligencia emocional para adultos. Confirma tu edad y empiezas: tu primera
          lectura es gratis, sin tarjeta.
        </p>
        <p className="mt-2 max-w-[340px] text-[14px] leading-relaxed text-[var(--text-secondary)]">
          Aquí nadie te juzga: es un espacio privado.
        </p>
      </div>

      <div>
        <button
          type="button"
          role="checkbox"
          aria-checked={marcado}
          onClick={() => {
            setMarcado((m) => !m);
            setPista(false);
          }}
          className="flex w-full items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_35%,transparent)] bg-[var(--surface)] p-4 text-left [touch-action:manipulation] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          <span
            aria-hidden="true"
            className="flex size-7 shrink-0 items-center justify-center rounded-[8px] border-2"
            style={{
              borderColor: marcado ? 'var(--accent)' : 'color-mix(in oklab, var(--text-tertiary) 55%, transparent)',
              background: marcado ? 'var(--accent)' : 'transparent',
            }}
          >
            {marcado && <Check size={16} strokeWidth={3} color="var(--on-accent)" aria-hidden="true" />}
          </span>
          <span className="text-[15px] leading-snug text-[var(--text-primary)]">Confirmo que soy mayor de 18 años.</span>
        </button>

        <div className="mt-2 h-5 text-center text-[13px] font-semibold text-[var(--accent-lite)]" role="status">
          {pista && !marcado ? 'Marca la casilla para continuar.' : ''}
        </div>
      </div>

      <div className="mt-auto">
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            if (!marcado) {
              setPista(true);
              return;
            }
            onContinuar();
          }}
          className="flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-bold text-[var(--on-accent)] shadow-[0_8px_30px_color-mix(in_oklab,var(--accent)_25%,transparent)] [touch-action:manipulation] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lite)]"
        >
          Empezar mi lectura gratis
        </motion.button>
        <p className="mt-3 text-center text-[12px] leading-snug text-[var(--text-tertiary)]">
          Al continuar aceptas los{' '}
          <Link href="/terminos" className="inline-block py-3 underline underline-offset-2">
            Términos
          </Link>{' '}
          y la{' '}
          <Link href="/privacidad" className="inline-block py-3 underline underline-offset-2">
            Privacidad
          </Link>
          .
        </p>
      </div>
    </motion.div>
  );
}
