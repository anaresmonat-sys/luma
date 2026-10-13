'use client';

// Puerta de mayoría de edad para TODA la app interna. La confirmación vivía solo en
// /onboarding, así que entrar directo por /app (marcador, enlace compartido, sesión
// iniciada desde /entrar) se la saltaba. Una sola vez por navegador (localStorage);
// hasta comprobarlo no se pinta nada de la app.

import { useEffect, useState, type ReactNode } from 'react';
import { PasoShell } from '@/components/onboarding/ui';
import { PasoEdad } from '@/components/onboarding/PasoEdad';
import { edadConfirmada, confirmarEdad } from '@/lib/edad-confirmada';

export function PuertaEdad({ children }: { children: ReactNode }) {
  // null = aún sin comprobar (localStorage solo existe en el navegador).
  const [confirmada, setConfirmada] = useState<boolean | null>(null);

  useEffect(() => {
    setConfirmada(edadConfirmada());
  }, []);

  if (confirmada === null) return <div className="min-h-dvh bg-[var(--bg)]" aria-hidden="true" />;
  if (confirmada) return <>{children}</>;

  return (
    <PasoShell onBack={() => (window.location.href = '/')} direccion={1}>
      <PasoEdad
        onContinuar={() => {
          confirmarEdad();
          setConfirmada(true);
        }}
      />
    </PasoShell>
  );
}
