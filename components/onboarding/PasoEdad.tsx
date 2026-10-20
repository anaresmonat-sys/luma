'use client';

// Paso real de confirmación de edad. Una sola vez por navegador, antes de entrar a
// la función real (recorrido sin preguntas, 2026-10-13). Revisión visual ronda 6:
// sin barra de progreso falsa (es un paso único), botón SIEMPRE tocable con una pista
// clara si falta la casilla, y nombra el destino ("tu primera lectura es gratis").
// Ronda 10: entrada escalonada; la casilla, su aviso y el botón viven juntos en la zona
// del pulgar; el aviso sacude la casilla en CADA toque sin marcar; «Entrando…» con salida
// si la navegación falla.

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Check, Lock } from 'lucide-react';

export function PasoEdad({
  onContinuar,
  conSesion = false,
  nota,
  onEnviando,
}: {
  onContinuar: () => void;
  /** Avisa a quien contiene la pantalla de que ya se está enviando (para apagar la flecha «Atrás»). */
  onEnviando?: (enviando: boolean) => void;
  conSesion?: boolean;
  /** Línea de confianza bajo el texto (p. ej. «tu conversación es privada»). Solo si es cierta para la función elegida. */
  nota?: string;
}) {
  const reduce = useReducedMotion();
  const [marcado, setMarcado] = useState(false);
  const [intentos, setIntentos] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [falloEnvio, setFalloEnvio] = useState(false);
  const pausaSalida = useRef<number | null>(null);
  const [saliendo, setSaliendo] = useState(false);
  useEffect(() => {
    if (!enviando) {
      setSaliendo(false);
      return;
    }
    setSaliendo(true);
    const t = window.setTimeout(() => setSaliendo(false), 1500);
    return () => window.clearTimeout(t);
  }, [enviando]);
  useEffect(() => {
    onEnviando?.(saliendo);
  }, [saliendo, onEnviando]);
  useEffect(
    () => () => {
      if (pausaSalida.current !== null) window.clearTimeout(pausaSalida.current);
    },
    []
  );

  // Entrada escalonada: medallón → titular → párrafo → zona de la casilla.
  const entrada = (i: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.2 : 0.35, delay: reduce ? 0 : i * 0.07 },
  });

  const faltaCasilla = intentos > 0 && !marcado;

  // Si la navegación no ocurre en 8 s, se libera el botón y se dice qué pasó.
  useEffect(() => {
    if (!enviando) return;
    const t = window.setTimeout(() => {
      setEnviando(false);
      setFalloEnvio(true);
    }, 8000);
    return () => window.clearTimeout(t);
  }, [enviando]);

  return (
    <div className="flex flex-1 flex-col gap-6 pt-2">
      <motion.div
        className="relative flex flex-col items-center pt-12 text-center"
        animate={{ opacity: saliendo ? 0.35 : 1 }}
        transition={{ duration: reduce ? 0 : 0.2 }}
      >
        {/* Tercer nivel de profundidad: bloom vino-ámbar detrás del medallón */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[-20px] -top-8 -z-10 h-72"
          style={{ background: 'radial-gradient(220px 170px at 50% 30%, color-mix(in oklab, var(--accent) 18%, transparent), transparent 72%)' }}
        />
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
          {nota ? 'Aquí nadie te juzga.' : 'Aquí nadie te juzga: es un espacio privado.'}
        </motion.p>
        <motion.p {...entrada(2)} className="mt-2 max-w-[340px] text-[14px] leading-relaxed text-[var(--text-secondary)]">
          {conSesion
            ? 'Cuenta lo que te pasa sin miedo. Solo te pedimos esto una vez.'
            : 'Cuenta lo que te pasa sin miedo. Tu primera lectura es gratis, sin tarjeta.'}
        </motion.p>
        {nota && (
          <motion.p
            {...entrada(2)}
            className="mt-4 max-w-[340px] text-balance text-center text-[14px] leading-snug text-[var(--text-secondary)]"
          >
            <Lock size={14} strokeWidth={2} aria-hidden="true" className="mr-1.5 inline align-[-2px] text-[var(--accent-lite)]" />
            {nota}
          </motion.p>
        )}
      </motion.div>

      {/* Zona del pulgar: casilla + aviso + botón + legal, juntos y al fondo */}
      <motion.div {...entrada(3)} className="relative mt-auto">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[-20px] -top-24 -z-10 h-72"
          style={{ background: 'radial-gradient(260px 190px at 50% 65%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 72%)' }}
        />

        <motion.button
          type="button"
          role="checkbox"
          aria-checked={marcado}
          aria-describedby="pista-edad"
          onClick={() => {
            setMarcado((m) => !m);
            setIntentos(0);
          }}
          whileTap={reduce ? undefined : { scale: 0.98 }}
          animate={reduce ? undefined : { x: 0 }}
          className="relative flex w-full items-center gap-3 overflow-hidden rounded-[var(--radius-card)] border bg-[var(--surface)] p-4 text-left [touch-action:manipulation] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          style={{
            borderColor:
              faltaCasilla || marcado ? 'var(--accent)' : 'color-mix(in oklab, var(--accent) 35%, transparent)',
          }}
        >
          {/* Hairline degradé oro → transparente en el borde superior (2px, visible a 375px) */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-0.5"
            style={{ background: 'linear-gradient(90deg, var(--accent-lite), transparent 75%)' }}
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
          <span className="text-[14px] leading-snug text-[var(--text-primary)]">Confirmo que soy mayor de 18 años.</span>
        </motion.button>

        <div id="pista-edad" className="mt-2 mb-2 min-h-6 text-center text-[14px] font-semibold text-[var(--accent-lite)]" role="status">
          <AnimatePresence mode="wait">
            {faltaCasilla && (
              <motion.span
                key={intentos}
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: 0 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, x: [0, -6, 6, -4, 4, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="inline-block"
              >
                Marca la casilla para continuar.
              </motion.span>
            )}
            {falloEnvio && !faltaCasilla && (
              <span className="inline-block text-[var(--an-risk)]">No pudimos entrar. Toca el botón de nuevo.</span>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          type="button"
          disabled={enviando}
          aria-live="polite"
          whileTap={enviando ? undefined : { scale: 0.97 }}
          onClick={() => {
            if (enviando) return;
            if (!marcado) {
              setIntentos((n) => n + 1);
              return;
            }
            setFalloEnvio(false);
            setEnviando(true);
            pausaSalida.current = window.setTimeout(onContinuar, reduce ? 0 : 220);
          }}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-bold text-[var(--on-accent)] shadow-[0_8px_30px_color-mix(in_oklab,var(--accent)_25%,transparent)] [touch-action:manipulation] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lite)] disabled:opacity-100"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={enviando ? 'enviando' : 'reposo'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center gap-2"
            >
              {enviando ? (
                <>
                  <span
                    aria-hidden="true"
                    className="size-[18px] animate-spin rounded-full border-[3px] border-[var(--on-accent)] border-t-transparent"
                  />
                  {conSesion ? 'Entrando…' : 'Preparando tu lectura…'}
                </>
              ) : conSesion ? (
                'Entrar a LUMA'
              ) : (
                'Empezar mi lectura gratis'
              )}
            </motion.span>
          </AnimatePresence>
        </motion.button>
        <p className="mt-3 text-center text-[14px] leading-snug text-[var(--text-tertiary)]">
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
      </motion.div>
    </div>
  );
}
