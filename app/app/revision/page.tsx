'use client';

// Panel de revisión de la dueña: probar LUMA como lo vería una persona nueva, tantas
// veces como quiera, sin límites reales (la cuenta de administradora no gasta cupo).
// Solo cambia lo que se ve en ESTE navegador (lib/modo-revision.ts); no da accesos.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ScreenHeader } from '@/components/app/ScreenHeader';
import {
  fijarModoPersonaNueva,
  modoPersonaNueva,
  reiniciarEdad,
  reiniciarPruebaGratis,
} from '@/lib/modo-revision';

const ATAJOS: { href: string; titulo: string; detalle: string }[] = [
  { href: '/', titulo: 'Página de ventas', detalle: 'Como la ve alguien que llega por primera vez.' },
  { href: '/onboarding?ayuda=tarot', titulo: 'Primera lectura de tarot', detalle: 'Edad → pregunta → elegir tres cartas → lectura.' },
  { href: '/onboarding?ayuda=analizar', titulo: 'Primera lectura de Descifrar', detalle: 'Edad → pegar la conversación.' },
  { href: '/onboarding?ayuda=coach', titulo: 'Primera conversación con el Coach', detalle: 'Edad → saludo de LUMA.' },
  { href: '/onboarding?ayuda=diario', titulo: 'Primera entrada del Diario', detalle: 'Edad → escribir y reflexión.' },
  { href: '/paywall?motivo=lectura-usada', titulo: 'Pantalla de planes (lectura usada)', detalle: 'Con el aviso "Ya usaste tu lectura gratis".' },
];

export default function RevisionPage() {
  const [permitido, setPermitido] = useState<boolean | null>(null);
  const [personaNueva, setPersonaNueva] = useState(false);
  const [aviso, setAviso] = useState('');

  useEffect(() => {
    setPersonaNueva(modoPersonaNueva());
    if (process.env.NODE_ENV !== 'production') {
      setPermitido(true);
      return;
    }
    fetch('/api/mi-plan')
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { admin?: boolean } | null) => setPermitido(Boolean(d?.admin)))
      .catch(() => setPermitido(false));
  }, []);

  function avisar(texto: string) {
    setAviso(texto);
    window.setTimeout(() => setAviso(''), 2500);
  }

  if (permitido === null) return <div className="min-h-dvh" aria-hidden="true" />;
  if (!permitido) {
    return (
      <div className="px-5 pt-3">
        <ScreenHeader titulo="Revisión" volverHref="/app" />
        <p className="mt-6 text-center text-[14px] text-[var(--text-secondary)]">
          Esta pantalla es solo para la administradora. Inicia sesión con tu correo de administradora en /entrar.
        </p>
      </div>
    );
  }

  return (
    <div className="px-5 pb-8 pt-3">
      <ScreenHeader titulo="Modo revisión" volverHref="/app" />
      <p className="mt-2 text-[13px] leading-relaxed text-[var(--text-secondary)]">
        Prueba LUMA como una persona nueva, las veces que quieras. Tu cuenta no tiene límites y no gasta nada real.
      </p>

      <button
        type="button"
        aria-pressed={personaNueva}
        onClick={() => {
          const nuevo = !personaNueva;
          fijarModoPersonaNueva(nuevo);
          setPersonaNueva(nuevo);
          avisar(nuevo ? 'Ahora te ves como una persona nueva.' : 'Vuelves a verte como administradora.');
        }}
        className={`mt-5 flex w-full items-center justify-between rounded-[var(--radius-card)] border p-4 text-left ${
          personaNueva
            ? 'border-[color-mix(in_oklab,var(--accent)_70%,transparent)] bg-[color-mix(in_oklab,var(--accent)_14%,transparent)]'
            : 'border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] bg-[var(--surface)]'
        }`}
      >
        <span>
          <span className="block text-[15px] font-semibold text-[var(--text-primary)]">Verme como persona nueva</span>
          <span className="mt-0.5 block text-[12px] leading-snug text-[var(--text-secondary)]">
            Muestra la lectura gratis, el aviso y la invitación a elegir plan.
          </span>
        </span>
        <span className="ml-3 shrink-0 text-[13px] font-bold text-[var(--accent-lite)]">{personaNueva ? 'ACTIVADO' : 'Apagado'}</span>
      </button>

      <div className="mt-3 grid grid-cols-1 gap-2">
        <button
          type="button"
          onClick={() => {
            reiniciarPruebaGratis();
            avisar('Listo: tu primera lectura gratis vuelve a estar disponible.');
          }}
          className="flex h-12 w-full items-center justify-center rounded-[var(--radius-button)] bg-gradient-to-b from-[var(--accent-lite)] to-[var(--accent)] text-[14px] font-bold text-[var(--on-accent)]"
        >
          Reiniciar mi primera lectura gratis
        </button>
        <button
          type="button"
          onClick={() => {
            reiniciarEdad();
            avisar('Listo: se volverá a pedir la confirmación de edad.');
          }}
          className="flex h-11 w-full items-center justify-center rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_45%,transparent)] text-[13px] font-bold text-[var(--accent-lite)]"
        >
          Volver a pedir la edad
        </button>
      </div>

      <div className="mt-2 h-5 text-center text-[12px] font-semibold text-[var(--accent-lite)]" role="status">
        {aviso}
      </div>

      <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--accent)]">Ir directo a…</p>
      <ul className="mt-2 flex flex-col gap-2">
        {ATAJOS.map((a) => (
          <li key={a.href}>
            <Link
              href={a.href}
              className="block rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] bg-[var(--surface)] px-4 py-3"
            >
              <span className="block text-[14px] font-semibold text-[var(--text-primary)]">{a.titulo}</span>
              <span className="mt-0.5 block text-[12px] leading-snug text-[var(--text-secondary)]">{a.detalle}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
