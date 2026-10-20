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

function entrarALaFuncion(ayuda: OpcionAyuda) {
  guardarRespuestas({ ayuda, ayudaLabel: OPCIONES_AYUDA[ayuda].label });
  registrarEvento('onboarding_completado');
  window.location.href = OPCIONES_AYUDA[ayuda].ruta + signosElegidos(ayuda);
}

// La calculadora de signos de la página de ventas manda los dos signos que la persona eligió
// (?tu=leo&su=sagitario) para que la sinergia llegue ya preparada. Solo letras minúsculas.
function signosElegidos(ayuda: OpcionAyuda): string {
  if (ayuda !== 'compatibilidad') return '';
  const q = new URLSearchParams(window.location.search);
  const tu = q.get('tu') ?? '';
  const su = q.get('su') ?? '';
  const valido = (v: string) => /^[a-z]{3,12}$/.test(v);
  return valido(tu) && valido(su) ? `?tu=${tu}&su=${su}` : '';
}

export default function OnboardingLuma() {
  // La edad se lee en efecto, no en el estado inicial: localStorage es client-only
  // y leerlo de forma síncrona en el primer render rompe la hidratación.
  const [ayuda, setAyuda] = useState<OpcionAyuda | null>(null);
  const [pidiendoEdad, setPidiendoEdad] = useState(false);
  const [enviando, setEnviando] = useState(false);

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
    <PasoShell onBack={() => (window.location.href = '/')} atrasDeshabilitado={enviando} direccion={1}>
      <PasoEdad
        onEnviando={setEnviando}
        nota={
          ayuda === 'analizar'
            ? 'Tu conversación es privada: la usamos solo para este análisis y no la guardamos.'
            : undefined
        }
        onContinuar={() => {
          confirmarEdad();
          entrarALaFuncion(ayuda);
        }}
      />
    </PasoShell>
  );
}
