'use client';

// APP INTERNA — MÁS (cuenta/ajustes). Pantalla secundaria (no una de las 4 del
// dinero): checklist + medición, sin revisor-visual obligatorio (32/PREFLIGHT).
// Protagonista: el estado del plan — REAL, no un texto fijo ("Plan Premium
// $9,99/mes" para todo el mundo era un dato falso, defecto reportado por el
// usuario en la auditoría 2026-09-18; todavía no hay tabla `subscriptions`
// conectada, así que el estado honesto hoy es "sin plan" hasta que Hotmart
// esté conectado — nunca se inventa un plan que la persona no tiene).
// Reutiliza las páginas legales ya construidas en la landing (privacidad/
// términos) en vez de duplicarlas. Notificaciones/Ayuda aún no tienen pantalla
// propia: aviso "Próximamente" honesto en vez de un enlace muerto (11 — todo
// elemento tocable responde algo). "Cerrar sesión" ahora cierra la sesión de
// Supabase de verdad (antes solo navegaba a "/" sin tocar la sesión).

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { USUARIA } from '@/lib/seed-datos';
import { crearClienteNavegador } from '@/lib/supabase/client';
import { pruebaGratisDisponible } from '@/lib/prueba-gratis';
import { leerMapaPoder, type MapaPoder } from '@/lib/almacenamiento-numerologia';

const ENLACES = [
  { emoji: '📄', label: 'Términos', href: '/terminos' },
  { emoji: '🔒', label: 'Privacidad', href: '/privacidad' },
];

const PROXIMAMENTE = [
  { emoji: '🔔', label: 'Notificaciones' },
  { emoji: '💬', label: 'Ayuda y soporte' },
];

export default function MasPage() {
  const router = useRouter();
  const [aviso, setAviso] = useState<string | null>(null);
  const [conSesion, setConSesion] = useState(false);
  const [cerrando, setCerrando] = useState(false);
  const [gratisDisponible, setGratisDisponible] = useState(true);
  const [mapaPoder, setMapaPoder] = useState<MapaPoder | null>(null);

  useEffect(() => {
    setGratisDisponible(pruebaGratisDisponible());
    setMapaPoder(leerMapaPoder());
    let cancelado = false;
    void (async () => {
      const supabase = crearClienteNavegador();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!cancelado) setConSesion(Boolean(user));
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

  return (
    <div className="flex min-h-0 flex-1 flex-col pb-4 pt-3">
      <div className="flex shrink-0 items-center py-2">
        <h1 className="text-[16px] font-semibold text-[var(--text-primary)] [font-family:var(--font-display)]">Más</h1>
      </div>

      <div className="mt-2 flex items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface)] p-4">
        <span
          className="flex size-12 shrink-0 items-center justify-center rounded-full text-[16px] font-bold text-[var(--on-accent)]"
          style={{ background: 'linear-gradient(150deg, var(--accent-lite), var(--card-title))' }}
        >
          {USUARIA.nombre.charAt(0)}
        </span>
        <div className="flex-1">
          <p className="text-[15px] font-semibold text-[var(--text-primary)]">{USUARIA.nombre}</p>
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

      <Link
        href="/app/mapa-poder"
        className="mt-3 flex items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_35%,transparent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] px-4 py-3"
      >
        <span className="text-[17px] leading-none" aria-hidden="true">
          ✨
        </span>
        <span className="flex-1">
          <span className="block text-[13px] font-semibold text-[var(--accent-lite)]">
            {mapaPoder ? `Tu arcano: ${mapaPoder.arcanoNombre}` : 'Conócete a ti misma'}
          </span>
          <span className="mt-0.5 block text-[11px] leading-snug text-[var(--text-secondary)]">
            {mapaPoder ? `Número de Camino de Vida ${mapaPoder.numero}` : 'Descubre tu arcano de nacimiento'}
          </span>
        </span>
        <span aria-hidden="true" className="text-[var(--accent-lite)]">
          →
        </span>
      </Link>

      <div className="h-5 shrink-0">
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
    </div>
  );
}
