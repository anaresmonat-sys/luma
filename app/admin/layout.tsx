// Guardia de acceso al panel de administración — VERIFICADO EN EL SERVIDOR,
// no solo ocultando la ruta (eso sería IDOR, ver docs/sistema/09-SEGURIDAD.md
// y 26-AUTH-MODERNO.md). Dos capas: (1) esta comprobación de sesión + rol
// antes de renderizar nada, (2) la RLS de la base de datos por si esta capa
// tuviera un fallo — ver la política "admin_lee_todo" de cada tabla
// (migración panel_admin_v1). Un usuario sin sesión o sin rol 'admin' nunca ve
// ni el layout ni ningún dato: se redirige antes de pintar la página.

import type { ReactNode } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { crearClienteServidor } from '@/lib/supabase/server';

const SECCIONES = [
  { href: '/admin', label: 'Resumen' },
  { href: '/admin/usuarios', label: 'Usuarios' },
  { href: '/admin/ia', label: 'Costo de IA' },
  { href: '/admin/errores', label: 'Errores' },
  { href: '/admin/ventas', label: 'Ventas' },
] as const;

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await crearClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/entrar');
  }

  const { data: perfil } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();

  if (perfil?.role !== 'admin') {
    // No se revela que /admin existe ni por qué se le niega — vuelve al inicio.
    redirect('/');
  }

  return (
    <div className="mx-auto min-h-dvh w-full max-w-[1080px] px-5 pb-16 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">Panel privado</p>
          <h1 className="text-[22px] font-semibold text-[var(--text-primary)] [font-family:var(--font-display)]">
            LUMA — Administración
          </h1>
        </div>
        <a href="/app" className="text-[12px] font-semibold text-[var(--text-tertiary)]">
          ← Volver a la app
        </a>
      </div>

      <nav className="mt-5 flex flex-wrap gap-2 border-b border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] pb-3">
        {SECCIONES.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="flex h-9 items-center rounded-full border border-[color-mix(in_oklab,var(--accent)_30%,transparent)] px-4 text-[12.5px] font-semibold text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--accent-lite)]"
          >
            {s.label}
          </Link>
        ))}
      </nav>

      <div className="mt-6">{children}</div>
    </div>
  );
}
