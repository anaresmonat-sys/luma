'use client';

// LUMA — Onboarding (Sesión 4 de la SECUENCIA MAESTRA, paso 1: el recorrido de
// inicio). Flujo de una sola ruta (sin recarga, C0 de 50) orquestado por
// índice de paso; el copy y el mapeo a FICHA-AVATAR viven en ./flujo.ts.
// Termina en la revelación del plan (el PICO) — el paywall es la etapa siguiente.

import { useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { PasoShell } from '@/components/onboarding/ui';
import { PreguntaChips } from '@/components/onboarding/PreguntaChips';
import { PreguntaSlider } from '@/components/onboarding/PreguntaSlider';
import { Reconocimiento } from '@/components/onboarding/Reconocimiento';
import { LoadingPlan } from '@/components/onboarding/LoadingPlan';
import { PlanListo } from '@/components/onboarding/PlanListo';
import { PASOS, LABEL_DE, feedbackCompromiso, beneficiosPlan, lineasLoading, type Respuestas } from './flujo';
import { guardarRespuestas } from '@/lib/almacenamiento-onboarding';

const N_RESPUESTAS_REALES = PASOS.filter((p) => p.tipo !== 'reconocimiento').length;
const PISO_PROGRESO = 6; // endowed progress (Nunes & Drèze 2006) — nunca arranca en 0%

type Etapa = 'flujo' | 'loading' | 'plan';

export default function OnboardingLuma() {
  const [etapa, setEtapa] = useState<Etapa>('flujo');
  const [indice, setIndice] = useState(0);
  const [direccion, setDireccion] = useState<1 | -1>(1);
  const [respuestas, setRespuestas] = useState<Respuestas>({});

  const progreso = PISO_PROGRESO + (indice / PASOS.length) * (100 - PISO_PROGRESO);

  useEffect(() => {
    if (etapa === 'plan') guardarRespuestas(respuestas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etapa]);

  function irAtras() {
    if (indice === 0) {
      window.location.href = '/';
      return;
    }
    setDireccion(-1);
    setIndice((i) => i - 1);
  }

  function avanzar(nuevas?: Partial<Respuestas>) {
    if (nuevas) setRespuestas((r) => ({ ...r, ...nuevas }));
    setDireccion(1);
    if (indice + 1 >= PASOS.length) {
      setEtapa('loading');
    } else {
      setIndice((i) => i + 1);
    }
  }

  if (etapa === 'loading') {
    return <LoadingPlan lineas={lineasLoading(respuestas)} onCompletar={() => setEtapa('plan')} />;
  }

  if (etapa === 'plan') {
    return (
      <PlanListo
        tituloMarked="Tu plan para dejar de [acento]sobrepensar[/acento] está listo"
        nRespuestas={N_RESPUESTAS_REALES}
        beneficios={beneficiosPlan(respuestas)}
        ctaLabel="Ver mi plan completo"
        ctaHref="/paywall"
      />
    );
  }

  const paso = PASOS[indice];

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
            skipLabel={paso.id === 'atribucion' ? 'Prefiero no decirlo' : undefined}
            onSkip={paso.id === 'atribucion' ? () => avanzar() : undefined}
            onResponder={(id, labelLibre) => {
              const label = id === '__otra__' ? labelLibre ?? '' : (LABEL_DE as Record<string, Record<string, string>>)[paso.id]?.[id] ?? id;
              avanzar({ [paso.id]: id, [`${paso.id}Label`]: label } as Partial<Respuestas>);
            }}
          />
        )}

        {paso.tipo === 'slider' && (
          <PreguntaSlider
            pregunta={paso.pregunta}
            min={paso.min}
            max={paso.max}
            inicial={respuestas.compromiso ?? paso.inicial}
            sufijo={paso.sufijo}
            feedback={feedbackCompromiso}
            ctaLabel={paso.ctaLabel}
            onResponder={(valor) => avanzar({ compromiso: valor })}
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
