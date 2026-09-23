'use client';

// Pestañas del panel de administración, con la pestaña actual marcada — antes
// las 5 se veían idénticas sin importar dónde estaba parada la dueña (defecto
// real encontrado al pulir el panel, 2026-09-23). Patrón visto en los paneles
// de las apps grandes (Stripe, Vercel): la pestaña activa lleva fondo sólido,
// las demás solo borde.

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavAdmin({
  secciones,
}: {
  secciones: readonly { href: string; label: string; icono: string }[];
}) {
  const pathname = usePathname();

  return (
    <nav className="mt-5 flex flex-wrap gap-2 border-b border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] pb-3">
      {secciones.map((s) => {
        const activa = pathname === s.href;
        return (
          <Link
            key={s.href}
            href={s.href}
            aria-current={activa ? 'page' : undefined}
            className={
              activa
                ? 'flex h-9 items-center gap-1.5 rounded-full border border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_16%,transparent)] px-4 text-[12.5px] font-semibold text-[var(--accent-lite)]'
                : 'flex h-9 items-center gap-1.5 rounded-full border border-[color-mix(in_oklab,var(--accent)_30%,transparent)] px-4 text-[12.5px] font-semibold text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--accent-lite)]'
            }
          >
            <span aria-hidden="true">{s.icono}</span>
            {s.label}
          </Link>
        );
      })}
    </nav>
  );
}
