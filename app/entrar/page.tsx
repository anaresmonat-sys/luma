'use client';

// LUMA — Entrar (Sesión 4, paso 3 de la SECUENCIA MAESTRA). Blueprint:
// docs/sistema/50-DISENO-ONBOARDING-PAYWALL.md §E. Magic link por email como
// método primario (26-AUTH-MODERNO, decisión Hotmart-first) — sin contraseñas.
// Conectado a Supabase Auth real (Sesión 6): signInWithOtp + app/auth/callback
// intercambia el código por una sesión real. Login con Google llega después.

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Mail, X } from 'lucide-react';
import { crearClienteNavegador } from '@/lib/supabase/client';

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Estado = 'reposo' | 'enviando' | 'enviado' | 'error';

const REENVIAR_SEGUNDOS = 60;
const MENSAJE_EMAIL_INVALIDO = 'Escribe un correo válido para continuar.';
const MENSAJE_ENVIO_FALLIDO = 'No pudimos enviarte el enlace. Inténtalo de nuevo en un momento.';
const MENSAJE_ENLACE_EXPIRADO = 'Ese enlace ya no es válido. Pide uno nuevo.';

export default function EntrarLuma() {
  const reduce = useReducedMotion();
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState<Estado>('reposo');
  const [mensajeError, setMensajeError] = useState(MENSAJE_EMAIL_INVALIDO);
  const [segundosRestantes, setSegundosRestantes] = useState(0);
  const [avisoGoogle, setAvisoGoogle] = useState(false);
  // ?desde=paywall (enlace de "Restaurar compra"): ofrece volver ahí en vez
  // de perder el contexto de compra con un genérico "Volver al inicio".
  const [vieneDePaywall, setVieneDePaywall] = useState(false);

  useEffect(() => {
    const parametros = new URLSearchParams(window.location.search);
    setVieneDePaywall(parametros.get('desde') === 'paywall');
    if (parametros.get('error') === 'enlace') {
      setMensajeError(MENSAJE_ENLACE_EXPIRADO);
      setEstado('error');
    }
  }, []);

  useEffect(() => {
    if (segundosRestantes <= 0) return;
    const id = window.setTimeout(() => setSegundosRestantes((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [segundosRestantes]);

  async function enviar() {
    if (!REGEX_EMAIL.test(email)) {
      setMensajeError(MENSAJE_EMAIL_INVALIDO);
      setEstado('error');
      return;
    }
    setEstado('enviando');
    const supabase = crearClienteNavegador();
    const next = vieneDePaywall ? '/paywall' : '/app';
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${next}` },
    });
    if (error) {
      setMensajeError(MENSAJE_ENVIO_FALLIDO);
      setEstado('error');
      return;
    }
    setEstado('enviado');
    setSegundosRestantes(REENVIAR_SEGUNDOS);
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
            Te enviamos el enlace de acceso a <strong className="text-[var(--text-primary)]">{email}</strong>. Ábrelo
            desde este mismo dispositivo para entrar.
          </p>
          <button
            type="button"
            disabled={segundosRestantes > 0}
            onClick={() => void enviar()}
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
        <motion.img
          src="/luma-lockup.png"
          alt="LUMA"
          initial={{ opacity: 0, y: reduce ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.2 : 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto h-36 w-auto"
        />

        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.2 : 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-center"
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
          transition={{ duration: reduce ? 0.2 : 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 flex flex-col gap-3"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (estado !== 'enviando') void enviar();
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
              <p className="text-[13px] text-[var(--accent-2)]">{mensajeError}</p>
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

          {/* Acceso de la dueña para revisar la app por dentro. Solo existe mientras la
              app corre en tu computadora (`next dev`): en la versión publicada este
              bloque no se incluye, así que ahí solo se entra con el enlace del correo. */}
          {process.env.NODE_ENV === 'development' && (
            <a
              href="/app"
              className="mt-2 flex h-[52px] w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-dashed border-[color-mix(in_oklab,var(--accent)_45%,transparent)] text-[14px] font-semibold text-[var(--accent-lite)]"
            >
              <span aria-hidden="true">🛠️</span>
              Entrar a revisar la app
              <span className="text-[12px] font-normal text-[var(--text-tertiary)]">(solo en tu computadora)</span>
            </a>
          )}
        </motion.div>
      </div>
    </div>
  );
}
