'use client';

// LUMA — Onboarding (Sesión 4 de la SECUENCIA MAESTRA, paso 1: el recorrido de
// inicio). Flujo de una sola ruta (sin recarga, C0 de 50) orquestado por
// índice de paso; el copy y el mapeo a FICHA-AVATAR viven en ./flujo.ts.
// El flujo TERMINA al responder "ayuda": salta directo a la pantalla real
// elegida — no hay pantalla de "plan listo" ni paywall aquí (feedback directo
// del usuario, 2026-09-17: "estamos vendiendo la app, no haciendo encuestas").
// El paywall vive en /paywall y se muestra desde la pantalla real cuando la
// persona agota su prueba gratis (ver lib/prueba-gratis.ts).

import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { PasoShell } from '@/components/onboarding/ui';
import { PreguntaChips } from '@/components/onboarding/PreguntaChips';
import { Reconocimiento } from '@/components/onboarding/Reconocimiento';
import { construirPasos, RUTA_POR_AYUDA, type Respuestas } from './flujo';
import { guardarRespuestas } from '@/lib/almacenamiento-onboarding';

const PISO_PROGRESO = 6; // endowed progress (Nunes & Drèze 2006) — nunca arranca en 0%

export default function OnboardingLuma() {
  const [indice, setIndice] = useState(0);
  const [direccion, setDireccion] = useState<1 | -1>(1);
  const [respuestas, setRespuestas] = useState<Respuestas>({});

  // Se recalcula en cada render: la pregunta "momento" se adapta a `respuestas.motivo`.
  const pasos = construirPasos(respuestas);
  const progreso = PISO_PROGRESO + (indice / pasos.length) * (100 - PISO_PROGRESO);

  function irAtras() {
    if (indice === 0) {
      window.location.href = '/';
      return;
    }
    setDireccion(-1);
    setIndice((i) => i - 1);
  }

  function avanzar(nuevas?: Partial<Respuestas>) {
    const respuestasFinal = nuevas ? { ...respuestas, ...nuevas } : respuestas;
    if (nuevas) setRespuestas(respuestasFinal);
    if (indice + 1 >= pasos.length) {
      // Última pregunta ("ayuda") respondida: guarda y salta directo a la función real.
      guardarRespuestas(respuestasFinal);
      window.location.href = (respuestasFinal.ayuda && RUTA_POR_AYUDA[respuestasFinal.ayuda]) || '/app/descifrar';
      return;
    }
    setDireccion(1);
    setIndice((i) => i + 1);
  }

  const paso = pasos[indice];

  return (
    <AnimatePresence mode="wait" initial={false}>
      <PasoShell key={paso.id} progreso={progreso} onBack={irAtras} direccion={direccion}>
        {paso.tipo === 'chip' && (
          <PreguntaChips
            pregunta={paso.pregunta}
            microcopy={paso.microcopy}
            opciones={paso.opciones}
            otraCosa={paso.otraCosa}
            valorInicial={(respuestas as Record<string, unknown>)[paso.id] as string | undefined}
            onResponder={(id, labelLibre) => {
              const label =
                id === '__otra__' ? labelLibre ?? '' : paso.opciones.find((o) => o.id === id)?.label ?? id;
              avanzar({ [paso.id]: id, [`${paso.id}Label`]: label } as Partial<Respuestas>);
            }}
          />
        )}

        {paso.tipo === 'reconocimiento' &&
          (() => {
            const { titulo, cuerpo } = paso.render(respuestas);
            return <Reconocimiento emoji={paso.emoji} titulo={titulo} cuerpo={cuerpo} onContinuar={() => avanzar()} />;
          })()}
      </PasoShell>
    </AnimatePresence>
  );
}
