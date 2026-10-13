'use client';

// Barra inferior de la app (5 destinos): Inicio · Coach · Tarot · Diario · Más.
// Iconos de línea (lucide), decisión de la dueña 2026-10-13 tras la ronda 7 del
// revisor visual: los emojis de colores desentonaban con terciopelo y oro. El destino
// activo va en dorado y con el trazo más grueso.
// "Descifra la conversación" no vive aquí: se abre desde un acceso en Inicio.

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Ellipsis, House, MessageCircle, Sparkles } from 'lucide-react';

const DESTINOS = [
  { href: '/app', Icono: House, label: 'Inicio' },
  { href: '/app/coach', Icono: MessageCircle, label: 'Coach' },
  { href: '/app/tarot', Icono: Sparkles, label: 'Tarot' },
  { href: '/app/diario', Icono: BookOpen, label: 'Diario' },
  { href: '/app/mas', Icono: Ellipsis, label: 'Más' },
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
            <d.Icono size={22} strokeWidth={activo ? 2.2 : 1.75} aria-hidden="true" />
            {d.label}
          </Link>
        );
      })}
    </nav>
  );
}
