'use client';

// LUMA — Paywall (Sesión 4, paso 2 de la SECUENCIA MAESTRA). Blueprint:
// docs/sistema/50-DISENO-ONBOARDING-PAYWALL.md §C (C1 blueprint, C4 timeline
// como visual default de todo paywall CON trial, C4ter checkout externo).
// Precios/plazos: FICHA-MERCADO.md §1/§4 (Prueba 3 · Garantía 7 · 9,99/mes ·
// 71,99/año). Copy trazado a FICHA-AVATAR.md (57 §9 — ver comentarios inline).
//
// C3ter (mockups honestos pre-Hotmart): el CTA de pago SIMULA el flujo con
// estado local — Hotmart se conecta en Sesión 6. Nunca se finge un cobro real.

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { X, Lock, ShieldCheck, Check } from 'lucide-react';
import { CheckCustom, Hairline } from '@/components/landing/ui';
import { MarkedCopy } from '@/components/landing/MarkedCopy';
import { TimelineTrial } from '@/components/paywall/Timeline';
import { PlanCards, type PlanPaywall } from '@/components/paywall/PlanCards';
import { leerRespuestas } from '@/lib/almacenamiento-onboarding';
import { beneficiosPlan, contarRespuestas, type Respuestas } from '@/app/onboarding/flujo';

const TRIAL_DIAS = 3;

const PLAN_ANUAL: PlanPaywall = {
  id: 'anual',
  nombre: 'Anual',
  badge: 'MÁS POPULAR',
  precioMes: '$6,00',
  sufijo: '/mes aprox.',
  descomposicionDia: 'menos de $0,20 al día',
  totalAnual: 'Se cobra $71,99/año',
  ahorro: 'más de 4 meses gratis',
};

const PLAN_MENSUAL: PlanPaywall = {
  id: 'mensual',
  nombre: 'Mensual',
  precioMes: '$9,99',
};

const PRECIO_TEXTO: Record<'anual' | 'mensual', string> = {
  anual: '$71,99/año',
  mensual: '$9,99/mes',
};

// Fallback honesto cuando no hay respuestas del onboarding (llegó directo a /paywall):
// mismos 3 pilares del producto, sin fingir personalización que no existe.
const BENEFICIOS_GENERICOS = [
  { texto: 'Descifra conversaciones confusas: hechos, riesgo y qué responder' },
  { texto: 'Tiradas de tarot leídas para tu caso, no genéricas' },
  { texto: 'Un espacio privado, sin juicio, para desahogarte' },
];

export default function PaywallLuma() {
  const reduce = useReducedMotion();
  const [seleccionado, setSeleccionado] = useState<'anual' | 'mensual'>('anual');
  const [respuestas, setRespuestas] = useState<Respuestas | null>(null);
  const [confirmado, setConfirmado] = useState(false);

  useEffect(() => {
    setRespuestas(leerRespuestas());
  }, []);

  const nRespuestas = respuestas ? contarRespuestas(respuestas) : 0;
  const beneficios = respuestas ? beneficiosPlan(respuestas) : BENEFICIOS_GENERICOS;

  if (confirmado) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-[var(--bg)] px-6 text-center [font-family:var(--font-body)]">
        <motion.div
          initial={{ opacity: 0, scale: reduce ? 1 : 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduce ? 0.2 : 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex max-w-[340px] flex-col items-center"
        >
          <span
            aria-hidden="true"
            className="flex size-16 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_15%,transparent)]"
          >
            <Check size={28} strokeWidth={2.5} color="var(--accent)" aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-[24px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
            Vista previa de tu pago
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-secondary)]">
            Aquí se abrirá Hotmart para activar tu prueba de {TRIAL_DIAS} días gratis del plan{' '}
            {seleccionado === 'anual' ? 'anual' : 'mensual'} ({PRECIO_TEXTO[seleccionado]}). La conexión con Hotmart
            llega en una etapa posterior — nada se cobró.
          </p>
          <button
            type="button"
            onClick={() => setConfirmado(false)}
            className="mt-6 text-[14px] font-medium text-[var(--accent)] underline-offset-4 hover:underline"
          >
            Volver a los planes
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[var(--bg)] [font-family:var(--font-body)]">
      {/* Header: X (44px, sale a /) + marca — nunca oculta/retardada (C5) */}
      <div className="sticky top-0 z-20 flex h-14 items-center justify-between bg-[var(--bg)]/95 px-3 backdrop-blur-sm">
        <a
          href="/"
          aria-label="Cerrar"
          className="flex size-11 items-center justify-center rounded-[var(--radius-button)] text-[var(--text-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          <X size={20} strokeWidth={2} aria-hidden="true" />
        </a>
        <span className="text-[13px] font-semibold tracking-[0.04em] text-[var(--text-tertiary)]">LUMA</span>
        <span className="size-11" aria-hidden="true" />
      </div>

      <div className="mx-auto flex w-full max-w-[480px] flex-1 flex-col px-5 pb-10 pt-4">
        {/* Headline — fórmula única de 52 §4: LUMA + "calma" (deseo tangible #1 de FICHA-AVATAR) */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.2 : 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-balance text-[28px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
            <MarkedCopy text={`${TRIAL_DIAS} días para probar si LUMA te da la [acento]calma[/acento] que buscas`} />
          </h1>
          {/* Ancla emocional de FICHA-AVATAR (se repite landing+onboarding+paywall):
              "obsesionada mirando el teléfono" → "en 1 minuto entiendes qué pasa" */}
          <p className="mt-2 text-[15px] leading-snug text-[var(--text-secondary)]">
            <MarkedCopy text="Para esas noches [b]mirando el teléfono[/b], esperando que responda." />
          </p>
          {respuestas && nRespuestas > 0 && (
            <p className="mt-2 text-[14px] text-[var(--text-secondary)]">Hecho con tus {nRespuestas} respuestas</p>
          )}
        </motion.div>

        {/* Beneficios: personalizados si hay datos del onboarding, genéricos si no */}
        <motion.ul
          initial={{ opacity: 0, y: reduce ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.2 : 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 flex flex-col gap-3"
        >
          {beneficios.map((b, i) => (
            <li key={i} className="flex items-start gap-3 text-[14px] leading-snug text-[var(--text-primary)]">
              <CheckCustom />
              <span>{b.texto}</span>
            </li>
          ))}
        </motion.ul>

        {/* Visual del valor: TIMELINE del trial (default C4) — responde por qué ahora / puedo cancelar */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.2 : 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7"
        >
          {/* Único hairline degradé de la pantalla (gate binario de conversión) */}
          <Hairline surface="surface">
            <div className="p-5">
              <TimelineTrial diasPrueba={TRIAL_DIAS} precioTexto={PRECIO_TEXTO[seleccionado]} />
            </div>
          </Hairline>
        </motion.div>

        {/* Plan cards tocables — anual pre-seleccionado */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.2 : 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7"
        >
          <PlanCards
            anual={PLAN_ANUAL}
            mensual={PLAN_MENSUAL}
            seleccionado={seleccionado}
            trialDias={TRIAL_DIAS}
            onSeleccionar={setSeleccionado}
          />
        </motion.div>

        {/* CTA único + reversibilidad + salida limpia */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.2 : 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7"
        >
          <motion.button
            type="button"
            onClick={() => setConfirmado(true)}
            whileTap={{ scale: 0.97 }}
            className="flex h-[52px] w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] shadow-[0_8px_30px_color-mix(in_oklab,var(--accent)_25%,transparent)] [touch-action:manipulation] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            Empezar mis {TRIAL_DIAS} días gratis
          </motion.button>
          <p className="mt-3 text-center text-[13px] text-[var(--text-tertiary)]">
            Cancela cuando quieras. Te avisamos antes de cualquier cobro.
          </p>

          <div className="mt-4 flex items-center justify-center gap-5">
            <a
              href="/"
              className="text-[14px] font-medium text-[var(--text-tertiary)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              Ahora no
            </a>
            <span aria-hidden="true" className="text-[var(--text-tertiary)]">
              ·
            </span>
            <a
              href="/entrar"
              className="text-[14px] font-medium text-[var(--text-tertiary)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              Restaurar compra
            </a>
          </div>

          <p className="mt-5 flex items-center justify-center gap-1.5 text-[12px] text-[var(--text-tertiary)]">
            <Lock size={14} aria-hidden="true" />
            Pago seguro con Hotmart
            <span aria-hidden="true">·</span>
            <ShieldCheck size={14} aria-hidden="true" />
            la Garantía de Calma de 7 Días
          </p>
        </motion.div>
      </div>
    </div>
  );
}
