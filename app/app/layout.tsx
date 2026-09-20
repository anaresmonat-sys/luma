// Marco de TODA la app interna (con o sin barra inferior). Es una app pensada para
// el móvil: en pantallas anchas se queda como una columna centrada del ancho de un
// teléfono grande, en vez de estirar botones, estados de ánimo y textos a lo ancho
// del monitor (defecto real reportado por el usuario, 2026-09-20).

import type { ReactNode } from 'react';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[480px] md:border-x md:border-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)]">
      {children}
    </div>
  );
}
