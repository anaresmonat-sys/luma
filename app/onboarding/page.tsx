'use client';

// LUMA — Recorrido de inicio. Un solo paso previo: confirmar la mayoría de edad
// (una vez por navegador) y directo a la función real que la persona eligió en la
// página de ventas (?ayuda=analizar|tarot|coach|diario; sin parámetro, Descifrar).
// Sin preguntas: ver app/onboarding/flujo.ts. El paywall vive en /paywall y se
// muestra cuando la persona agota su prueba gratis (lib/prueba-gratis.ts).

import { useEffect, useState } from 'react';
import { PasoShell } from '@/components/onboarding/ui';
import { PasoEdad } from '@/components/onboarding/PasoEdad';
import { AYUDA_POR_DEFECTO, OPCIONES_AYUDA, esOpcionAyuda, type OpcionAyuda } from './flujo';
import { guardarRespuestas } from '@/lib/almacenamiento-onboarding';
import { edadConfirmada, confirmarEdad } from '@/lib/edad-confirmada';
import { registrarEvento, registrarEventoUnaVez } from '@/lib/registrar-evento';

const PISO_PROGRESO = 6;

function entrarALaFuncion(ayuda: OpcionAyuda) {
  guardarRespuestas({ ayuda, ayudaLabel: OPCIONES_AYUDA[ayuda].label });
  registrarEvento('onboarding_completado');
  window.location.href = OPCIONES_AYUDA[ayuda].ruta;
}

export default function OnboardingLuma() {
  // La edad se lee en efecto, no en el estado inicial: localStorage es client-only
  // y leerlo de forma síncrona en el primer render rompe la hidratación.
  const [ayuda, setAyuda] = useState<OpcionAyuda | null>(null);
  const [pidiendoEdad, setPidiendoEdad] = useState(false);

  useEffect(() => {
    registrarEventoUnaVez('onboarding_iniciado');
    const pedida = new URLSearchParams(window.location.search).get('ayuda');
    const elegida = esOpcionAyuda(pedida) ? pedida : AYUDA_POR_DEFECTO;
    setAyuda(elegida);
    if (edadConfirmada()) entrarALaFuncion(elegida);
    else setPidiendoEdad(true);
  }, []);

  if (!pidiendoEdad || !ayuda) {
    // Ya confirmó la edad (redirigiendo) o aún leyendo: pantalla neutra, sin parpadeo.
    return <div className="min-h-dvh bg-[var(--bg)]" aria-hidden="true" />;
  }

  return (
    <PasoShell progreso={PISO_PROGRESO} onBack={() => (window.location.href = '/')} direccion={1}>
      <PasoEdad
        onContinuar={() => {
          confirmarEdad();
          entrarALaFuncion(ayuda);
        }}
      />
    </PasoShell>
  );
}
