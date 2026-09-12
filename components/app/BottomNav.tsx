'use client';

// Barra inferior de la app (5 destinos, FICHA-ARTE §Ronda #3/#4): Inicio · Coach ·
// Tarot · Diario · Más. Emoji como sistema de íconos — decisión explícita del
// usuario que ANULA la regla general anti-emoji SOLO para este proyecto (Ronda #4).
// "Descifra la conversación" no vive aquí: se abre desde un acceso en Inicio.

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const DESTINOS = [
  { href: '/app', emoji: '🏠', label: 'Inicio' },
  { href: '/app/coach', emoji: '💬', label: 'Coach' },
  { href: '/app/tarot', emoji: '🔮', label: 'Tarot' },
  { href: '/app/diario', emoji: '📔', label: 'Diario' },
  { href: '/app/mas', emoji: '⋯', label: 'Más' },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="flex shrink-0 items-center justify-around border-t border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] bg-[color-mix(in_oklab,var(--bg)_92%,transparent)] px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-sm"
      aria-label="Navegación principal"
    >
      {DESTINOS.map((d) => {
        const activo = d.href === '/app' ? pathname === '/app' : pathname.startsWith(d.href);
        return (
          <Link
            key={d.href}
            href={d.href}
            aria-current={activo ? 'page' : undefined}
            className={`flex min-w-[44px] flex-col items-center gap-1 py-1 text-[11px] font-semibold transition-colors duration-150 ${
              activo ? 'text-[var(--accent-lite)]' : 'text-[var(--text-tertiary)]'
            }`}
          >
            <span className="text-[20px] leading-none" aria-hidden="true">
              {d.emoji}
            </span>
            {d.label}
          </Link>
        );
      })}
    </nav>
  );
}
