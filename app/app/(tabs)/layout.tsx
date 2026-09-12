// Shell compartido de las 4 pantallas con barra inferior (Inicio·Coach·Tarot·Diario·
// Más). "Descifra la conversación" vive FUERA de este grupo de rutas: no lleva nav
// (se abre como flujo dedicado desde el acceso de Inicio, con su propio ScreenHeader).

import type { ReactNode } from 'react';
import { BottomNav } from '@/components/app/BottomNav';

export default function TabsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5">{children}</main>
      <BottomNav />
    </div>
  );
}
