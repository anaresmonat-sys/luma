'use client';

// Paso real de confirmación de edad. Una sola vez por navegador, antes de entrar a
// la función real (recorrido sin preguntas, 2026-10-13). Revisión visual ronda 6:
// sin barra de progreso falsa (es un paso único), botón SIEMPRE tocable con una pista
// clara si falta la casilla, contenido anclado arriba (sin 230px de vacío), y nombra
// el destino ("tu primera lectura es gratis"). Ronda 10: entrada escalonada, la casilla
// avisa (borde acento + sacudida corta) si falta marcarla y el botón muestra «Entrando…».

import { useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { Check } from 'lucide-react';

export function PasoEdad({ onContinuar, conSesion = false }: { onContinuar: () => void; conSesion?: boolean }) {
  const reduce = useReducedMotion();
  const [marcado, setMarcado] = useState(false);
  const [pista, setPista] = useState(false);
  const [enviando, setEnviando] = useState(false);

  // Entrada escalonada: medallón → titular → párrafo → casilla.
  const entrada = (i: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.2 : 0.35, delay: reduce ? 0 : i * 0.07 },
  });

  const faltaCasilla = pista && !marcado;

  return (
    <div className="flex flex-1 flex-col gap-6 pt-2">
      <div className="flex flex-col items-center text-center">
        <motion.span
          {...entrada(0)}
          aria-hidden="true"
          className="flex size-16 items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--accent)_45%,transparent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] shadow-[0_0_28px_-8px_color-mix(in_oklab,var(--accent)_60%,transparent)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/luma-icon.png" alt="" className="h-9 w-auto brightness-125" />
        </motion.span>
        <motion.h1
          {...entrada(1)}
          className="mt-5 text-balance text-[28px] font-bold leading-[1.1] text-[var(--text-primary)] [font-family:var(--font-display)]"
        >
          {conSesion ? (
            <>
              Una cosa antes de <span className="text-[var(--accent)]">entrar</span>
            </>
          ) : (
            <>
              Una cosa antes de tu <span className="text-[var(--accent)]">primera lectura</span>
            </>
          )}
        </motion.h1>
        <motion.p {...entrada(2)} className="mt-3 max-w-[340px] text-[16px] font-semibold leading-snug text-[var(--text-primary)]">
          Aquí nadie te juzga: es un espacio privado.
        </motion.p>
        <motion.p {...entrada(2)} className="mt-2 max-w-[340px] text-[14px] leading-relaxed text-[var(--text-secondary)]">
          {conSesion
            ? 'Cuenta lo que te pasa sin miedo. LUMA es para adultos: confirma tu edad y entras, solo te lo pedimos una vez.'
            : 'Cuenta lo que te pasa sin miedo. LUMA es para adultos: confirma tu edad y tu primera lectura es gratis, sin tarjeta.'}
        </motion.p>
      </div>

      <motion.div {...entrada(3)}>
        <motion.button
          type="button"
          role="checkbox"
          aria-checked={marcado}
          aria-describedby="pista-edad"
          onClick={() => {
            setMarcado((m) => !m);
            setPista(false);
          }}
          animate={faltaCasilla && !reduce ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.15 * 2 }}
          className="relative flex w-full items-center gap-3 overflow-hidden rounded-[var(--radius-card)] border bg-[var(--surface)] p-4 text-left [touch-action:manipulation] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          style={{
            borderColor: faltaCasilla ? 'var(--accent)' : 'color-mix(in oklab, var(--accent) 35%, transparent)',
          }}
        >
          {/* Hairline degradé oro → transparente en el borde superior */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{ background: 'linear-gradient(90deg, var(--accent-lite), transparent 70%)' }}
          />
          <motion.span
            aria-hidden="true"
            className="flex size-7 shrink-0 items-center justify-center rounded-[8px] border-2"
            animate={{ scale: marcado && !reduce ? [1, 1.12, 1] : 1 }}
            transition={{ type: 'spring', bounce: 0.12, duration: 0.35 }}
            style={{
              borderColor: marcado ? 'var(--accent)' : 'color-mix(in oklab, var(--text-tertiary) 55%, transparent)',
              background: marcado ? 'var(--accent)' : 'transparent',
            }}
          >
            {marcado && <Check size={16} strokeWidth={3} color="var(--on-accent)" aria-hidden="true" />}
          </motion.span>
          <span className="text-[15px] leading-snug text-[var(--text-primary)]">Confirmo que soy mayor de 18 años.</span>
        </motion.button>

        <div id="pista-edad" className="mt-2 h-5 text-center text-[13px] font-semibold text-[var(--accent-lite)]" role="status">
          {faltaCasilla ? 'Marca la casilla para continuar.' : ''}
        </div>
      </motion.div>

      <div className="relative mt-auto">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[-20px] -top-32 -z-10 h-64"
          style={{ background: 'radial-gradient(260px 170px at 50% 70%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 72%)' }}
        />
        <motion.button
          type="button"
          disabled={enviando}
          whileTap={enviando ? undefined : { scale: 0.97 }}
          onClick={() => {
            if (enviando) return;
            if (!marcado) {
              setPista(true);
              return;
            }
            setEnviando(true);
            onContinuar();
          }}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-bold text-[var(--on-accent)] shadow-[0_8px_30px_color-mix(in_oklab,var(--accent)_25%,transparent)] [touch-action:manipulation] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lite)] disabled:opacity-80"
        >
          {enviando ? (
            <>
              <span
                aria-hidden="true"
                className="size-4 animate-spin rounded-full border-2 border-[var(--on-accent)] border-t-transparent"
              />
              {conSesion ? 'Entrando…' : 'Preparando tu lectura…'}
            </>
          ) : conSesion ? (
            'Entrar a LUMA'
          ) : (
            'Empezar mi lectura gratis'
          )}
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
    </div>
  );
}
