'use client';

// APP INTERNA — MÁS (cuenta/ajustes). Pantalla secundaria (no una de las 4 del
// dinero): checklist + medición, sin revisor-visual obligatorio (32/PREFLIGHT).
// Protagonista: el estado del plan — REAL, no un texto fijo ("Plan Premium
// $9,99/mes" para todo el mundo era un dato falso, defecto reportado por el
// usuario en la auditoría 2026-09-18; todavía no hay tabla `subscriptions`
// conectada, así que el estado honesto hoy es "sin plan" hasta que Hotmart
// esté conectado — nunca se inventa un plan que la persona no tiene).
// Reutiliza las páginas legales ya construidas en vez de duplicarlas.
// "Cerrar sesión" cierra la sesión de Supabase de verdad.
//
// Auditoría legal 2026-09-23 (docs/sistema/47-LEGAL-FISCAL-Y-PRIVACIDAD.md):
// (1) el nombre mostrado era el de los datos de ejemplo ("Ana") sin importar
// quién había iniciado sesión — mismo defecto ya corregido en Inicio, corregido
// aquí igual (correo real o genérico, nunca un nombre inventado); (2) faltaban
// los enlaces a Cookies/Reembolsos/Aviso de IA; (3) no existía "Cómo cancelar"
// ni "Eliminar mi cuenta" — ambas obligatorias, ninguna existía hasta hoy.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { User } from 'lucide-react';
import { crearClienteNavegador } from '@/lib/supabase/client';
import { pruebaGratisDisponible } from '@/lib/prueba-gratis';

const ENLACES = [
  { emoji: '↩️', label: 'Cómo cancelar', href: '/app/cancelar' },
  { emoji: '📄', label: 'Términos', href: '/terminos' },
  { emoji: '🔒', label: 'Privacidad', href: '/privacidad' },
  { emoji: '💳', label: 'Reembolsos', href: '/reembolsos' },
  { emoji: '🍪', label: 'Cookies', href: '/cookies' },
  { emoji: '✨', label: 'Aviso sobre la IA', href: '/aviso-ia' },
];

const PROXIMAMENTE = [
  { emoji: '🔔', label: 'Notificaciones' },
  { emoji: '💬', label: 'Ayuda y soporte' },
];

export default function MasPage() {
  const router = useRouter();
  const [aviso, setAviso] = useState<string | null>(null);
  const [conSesion, setConSesion] = useState(false);
  const [correo, setCorreo] = useState<string | null>(null);
  const [cerrando, setCerrando] = useState(false);
  const [gratisDisponible, setGratisDisponible] = useState(true);
  const [confirmandoBorrado, setConfirmandoBorrado] = useState(false);
  const [borrando, setBorrando] = useState(false);
  const [errorBorrado, setErrorBorrado] = useState<string | null>(null);

  useEffect(() => {
    setGratisDisponible(pruebaGratisDisponible());
    let cancelado = false;
    void (async () => {
      const supabase = crearClienteNavegador();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!cancelado) {
        setConSesion(Boolean(user));
        setCorreo(user?.email ?? null);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, []);

  function tocarProximamente(label: string) {
    setAviso(label);
    window.setTimeout(() => setAviso(null), 2200);
  }

  async function cerrarSesion() {
    setCerrando(true);
    const supabase = crearClienteNavegador();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  async function eliminarCuenta() {
    setBorrando(true);
    setErrorBorrado(null);
    try {
      const res = await fetch('/api/cuenta/eliminar', { method: 'POST' });
      if (!res.ok) throw new Error();
      // Borra también lo guardado en este dispositivo (diario, tiradas, círculo…).
      try {
        Object.keys(window.localStorage)
          .filter((k) => k.startsWith('luma_'))
          .forEach((k) => window.localStorage.removeItem(k));
      } catch {
        // Sin acceso a localStorage: nada más que limpiar.
      }
      const supabase = crearClienteNavegador();
      await supabase.auth.signOut();
      router.push('/');
      router.refresh();
    } catch {
      setErrorBorrado('No se pudo eliminar tu cuenta. Inténtalo de nuevo en un momento.');
      setBorrando(false);
    }
  }

  return (
    <div className="flex min-h-min flex-1 flex-col pb-4 pt-3">
      <div className="flex shrink-0 items-center py-2">
        <h1 className="text-[16px] font-semibold text-[var(--text-primary)] [font-family:var(--font-display)]">Más</h1>
      </div>

      <div className="mt-2 flex items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface)] p-4">
        <span
          className="flex size-12 shrink-0 items-center justify-center rounded-full"
          style={{ background: 'linear-gradient(150deg, var(--accent-lite), var(--card-title))' }}
        >
          <User size={20} strokeWidth={2.5} color="var(--on-accent)" aria-hidden="true" />
        </span>
        <div className="flex-1">
          <p className="text-[15px] font-semibold text-[var(--text-primary)]">{correo ?? 'Tu cuenta'}</p>
          {gratisDisponible ? (
            <p className="mt-0.5 text-[11px] font-semibold text-[var(--text-secondary)]">Sin plan activo todavía</p>
          ) : (
            <Link
              href="/paywall"
              className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-bold text-[var(--accent-lite)] underline underline-offset-2"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--accent-lite)" aria-hidden="true">
                <path d="M3 8l4 3 5-6 5 6 4-3v9H3z" />
              </svg>
              Elige tu plan
            </Link>
          )}
        </div>
      </div>

      <div className="mt-auto h-5 shrink-0 pt-4">
        <AnimatePresence>
          {aviso && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-2 text-[11px] font-semibold text-[var(--accent-lite)]"
            >
              {aviso}: próximamente
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-2 flex flex-col">
        {PROXIMAMENTE.map((o, i) => (
          <button
            key={o.label}
            type="button"
            onClick={() => tocarProximamente(o.label)}
            className={`flex items-center gap-3 py-3 text-left text-[13px] font-medium text-[var(--text-primary)] ${
              i > 0 ? 'border-t border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)]' : ''
            }`}
          >
            <span className="text-[16px]" aria-hidden="true">
              {o.emoji}
            </span>
            {o.label}
          </button>
        ))}
        {ENLACES.map((o) => (
          <Link
            key={o.label}
            href={o.href}
            className="flex items-center gap-3 border-t border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] py-3 text-[13px] font-medium text-[var(--text-primary)]"
          >
            <span className="text-[16px]" aria-hidden="true">
              {o.emoji}
            </span>
            {o.label}
            <span className="ml-auto text-[var(--text-tertiary)]" aria-hidden="true">
              →
            </span>
          </Link>
        ))}
      </div>

      {conSesion && (
        <button
          type="button"
          onClick={cerrarSesion}
          disabled={cerrando}
          className="mt-6 flex h-11 w-full items-center justify-center rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] text-[13px] font-semibold text-[var(--text-secondary)] disabled:opacity-60"
        >
          {cerrando ? 'Cerrando sesión…' : 'Cerrar sesión'}
        </button>
      )}

      {conSesion && (
        <div className="mt-6 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--an-risk)_30%,transparent)] p-4">
          <p className="text-[12.5px] font-semibold text-[var(--an-risk)]">Zona de riesgo</p>
          {!confirmandoBorrado ? (
            <button
              type="button"
              onClick={() => setConfirmandoBorrado(true)}
              className="mt-2 text-[13px] font-semibold text-[var(--text-secondary)] underline underline-offset-2"
            >
              Eliminar mi cuenta y todos mis datos
            </button>
          ) : (
            <div className="mt-2 flex flex-col gap-3">
              <p className="text-[12.5px] leading-relaxed text-[var(--text-secondary)]">
                Esto borra para siempre tu diario, tus tiradas, tus conversaciones con el coach y tu círculo. No se
                puede deshacer.
              </p>
              {errorBorrado && <p className="text-[12px] font-semibold text-[var(--an-risk)]">{errorBorrado}</p>}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={eliminarCuenta}
                  disabled={borrando}
                  className="flex h-10 flex-1 items-center justify-center rounded-[var(--radius-button)] bg-[var(--an-risk)] text-[13px] font-semibold text-[var(--on-accent)] disabled:opacity-60"
                >
                  {borrando ? 'Eliminando…' : 'Sí, eliminar todo'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmandoBorrado(false)}
                  disabled={borrando}
                  className="flex h-10 flex-1 items-center justify-center rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] text-[13px] font-semibold text-[var(--text-secondary)]"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
