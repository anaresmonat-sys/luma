'use client';

// Puerta de mayoría de edad para TODA la app interna. La confirmación vivía solo en
// /onboarding, así que entrar directo por /app (marcador, enlace compartido, sesión
// iniciada desde /entrar) se la saltaba. Una sola vez por navegador (localStorage);
// hasta comprobarlo no se pinta nada de la app.

import { useEffect, useState, type ReactNode } from 'react';
import { PasoShell } from '@/components/onboarding/ui';
import { PasoEdad } from '@/components/onboarding/PasoEdad';
import { edadConfirmada, confirmarEdad, haySesion, edadConfirmadaEnCuenta, guardarEdadEnCuenta } from '@/lib/edad-confirmada';

export function PuertaEdad({ children }: { children: ReactNode }) {
  // null = aún sin comprobar (localStorage solo existe en el navegador).
  const [confirmada, setConfirmada] = useState<boolean | null>(null);

  // Con sesión abierta: si la cuenta ya confirmó su edad (en otro navegador o dispositivo) no se vuelve a pedir,
  // y si no, se pide con un texto de quien ya está dentro (sin "tu primera lectura es gratis").
  const [conSesion, setConSesion] = useState(false);

  useEffect(() => {
    if (edadConfirmada()) {
      setConfirmada(true);
      return;
    }
    let cancelado = false;
    void (async () => {
      const sesion = await haySesion();
      if (cancelado) return;
      if (sesion && (await edadConfirmadaEnCuenta())) {
        confirmarEdad();
        if (!cancelado) setConfirmada(true);
        return;
      }
      if (cancelado) return;
      setConSesion(sesion);
      setConfirmada(false);
    })();
    return () => {
      cancelado = true;
    };
  }, []);

  if (confirmada === null) return <div className="min-h-dvh bg-[var(--bg)]" aria-hidden="true" />;
  if (confirmada) return <>{children}</>;

  return (
    <PasoShell onBack={() => (window.location.href = '/')} direccion={1}>
      <PasoEdad
        conSesion={conSesion}
        onContinuar={() => {
          confirmarEdad();
          if (conSesion) void guardarEdadEnCuenta();
          setConfirmada(true);
        }}
      />
    </PasoShell>
  );
}
