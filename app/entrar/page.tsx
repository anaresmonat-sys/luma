'use client';

// LUMA — Entrar (Sesión 4, paso 3 de la SECUENCIA MAESTRA). Blueprint:
// docs/sistema/50-DISENO-ONBOARDING-PAYWALL.md §E. Magic link por email como
// método primario (26-AUTH-MODERNO, decisión Hotmart-first) — sin contraseñas.
// Existe ahora (mínima pero real) para que "Entrar"/"Restaurar compra" del
// resto del funnel dejen de caer en 404 — el envío real de magic link y el
// login con Google llegan con Supabase en Sesión 6 (mismo patrón C3ter que
// el paywall: simula el flujo con estado local, nunca finge un envío real).

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Mail, X } from 'lucide-react';

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Estado = 'reposo' | 'enviando' | 'enviado' | 'error';

const REENVIAR_SEGUNDOS = 60;

export default function EntrarLuma() {
  const reduce = useReducedMotion();
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState<Estado>('reposo');
  const [segundosRestantes, setSegundosRestantes] = useState(0);
  const [avisoGoogle, setAvisoGoogle] = useState(false);
  // ?desde=paywall (enlace de "Restaurar compra"): ofrece volver ahí en vez
  // de perder el contexto de compra con un genérico "Volver al inicio".
  const [vieneDePaywall, setVieneDePaywall] = useState(false);

  useEffect(() => {
    setVieneDePaywall(new URLSearchParams(window.location.search).get('desde') === 'paywall');
  }, []);

  useEffect(() => {
    if (segundosRestantes <= 0) return;
    const id = window.setTimeout(() => setSegundosRestantes((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [segundosRestantes]);

  function enviar() {
    if (!REGEX_EMAIL.test(email)) {
      setEstado('error');
      return;
    }
    setEstado('enviando');
    window.setTimeout(() => {
      setEstado('enviado');
      setSegundosRestantes(REENVIAR_SEGUNDOS);
    }, 700);
  }

  const salidaHref = vieneDePaywall ? '/paywall' : '/';

  const header = (
    <div className="sticky top-0 z-20 flex h-14 items-center justify-between bg-[var(--bg)]/75 px-3 backdrop-blur-md">
      <a
        href={salidaHref}
        aria-label="Cerrar"
        className="flex size-11 items-center justify-center rounded-[var(--radius-button)] text-[var(--text-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      >
        <X size={20} strokeWidth={2} aria-hidden="true" />
      </a>
      <span className="text-[13px] font-semibold tracking-[0.04em] text-[var(--text-tertiary)] [font-family:var(--font-display)]">
        LUMA
      </span>
      <span className="size-11" aria-hidden="true" />
    </div>
  );

  if (estado === 'enviado') {
    return (
      <div className="flex min-h-dvh flex-col [font-family:var(--font-body)]">
        {header}
        <div className="flex flex-1 flex-col items-center justify-center px-6 pb-14 text-center">
        <motion.div
          initial={{ opacity: 0, scale: reduce ? 1 : 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduce ? 0.2 : 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex max-w-[340px] flex-col items-center"
        >
          <span
            aria-hidden="true"
            className="flex size-16 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_15%,transparent)]"
          >
            <Mail size={26} strokeWidth={2} color="var(--accent)" aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-[24px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
            Revisa tu correo
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-secondary)]">
            Te enviaríamos el enlace de acceso a <strong className="text-[var(--text-primary)]">{email}</strong>. El
            envío real se activa al conectar el sistema de cuentas — nada se envió todavía.
          </p>
          <button
            type="button"
            disabled={segundosRestantes > 0}
            onClick={() => {
              setSegundosRestantes(REENVIAR_SEGUNDOS);
            }}
            className="mt-6 flex min-h-11 items-center px-3 text-[14px] font-medium text-[var(--accent)] underline-offset-4 hover:underline disabled:text-[var(--text-tertiary)] disabled:no-underline"
          >
            {segundosRestantes > 0 ? `Reenviar en ${segundosRestantes}s` : 'Reenviar'}
          </button>
          <a
            href={vieneDePaywall ? '/paywall' : '/'}
            className="mt-4 flex min-h-11 items-center px-3 text-[13px] text-[var(--text-tertiary)] underline-offset-4 hover:underline"
          >
            {vieneDePaywall ? '‹ Volver a los planes' : 'Volver al inicio'}
          </a>
        </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col [font-family:var(--font-body)]">
      {header}

      <div className="mx-auto flex w-full max-w-[480px] flex-1 flex-col px-5 pt-6">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.2 : 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
            Entra a tu plan
          </h1>
          <p className="mt-2 text-[14px] leading-snug text-[var(--text-secondary)]">
            Para guardarlo y verlo en cualquier dispositivo.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.2 : 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 flex flex-col gap-3"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (estado !== 'enviando') enviar();
            }}
            className="flex flex-col gap-3"
          >
            <label htmlFor="email-entrar" className="text-[13px] font-medium text-[var(--text-secondary)]">
              Correo electrónico
            </label>
            <input
              id="email-entrar"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (estado === 'error') setEstado('reposo');
              }}
              placeholder="tu@correo.com"
              autoFocus
              className={`h-14 w-full rounded-[var(--radius-button)] border bg-[var(--surface)] px-4 text-[16px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)] focus-visible:border-[var(--accent)] ${
                estado === 'error'
                  ? 'border-[var(--accent-2)]'
                  : 'border-[color-mix(in_oklab,var(--accent)_28%,transparent)]'
              }`}
            />
            {estado === 'error' && (
              <p className="text-[13px] text-[var(--accent-2)]">Escribe un correo válido para continuar.</p>
            )}

            <motion.button
              type="submit"
              disabled={estado === 'enviando'}
              whileTap={{ scale: 0.97 }}
              className="flex h-[52px] w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] transition-opacity duration-200 disabled:opacity-70 [touch-action:manipulation] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              {estado === 'enviando' ? 'Enviando…' : 'Enviarme mi enlace de acceso'}
            </motion.button>
          </form>

          <button
            type="button"
            onClick={() => setAvisoGoogle(true)}
            className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] text-[15px] font-medium text-[var(--text-secondary)] [touch-action:manipulation] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            Continuar con Google
            <span className="text-[12px] text-[var(--text-tertiary)]">(disponible pronto)</span>
          </button>
          {avisoGoogle && (
            <p className="text-center text-[13px] text-[var(--text-tertiary)]">
              La entrada con Google se activa en una etapa posterior — usa tu correo por ahora.
            </p>
          )}

          <p className="mt-1 text-center text-[13px] text-[var(--text-tertiary)]">
            Sin contraseñas: te llegará un enlace de un solo uso
          </p>
        </motion.div>
      </div>
    </div>
  );
}
