'use client';

// LUMA — Paywall (Sesión 4, paso 2 de la SECUENCIA MAESTRA). Blueprint:
// docs/sistema/50-DISENO-ONBOARDING-PAYWALL.md §C (C1 blueprint, C4 timeline
// como visual default de todo paywall CON trial, C4ter checkout externo).
// Precios/plazos: FICHA-MERCADO.md §1/§4 (Prueba 3 · Garantía 7 · 9,99/mes ·
// 89,99/año — "3 meses gratis", decisión del usuario 2026-09-24). Copy trazado a FICHA-AVATAR.md (57 §9 — ver comentarios inline).
//
// C3ter (mockups honestos pre-Hotmart): el CTA de pago SIMULA el flujo con
// estado local — Hotmart se conecta en Sesión 6. Nunca se finge un cobro real.
//
// Iconografía: Lock/ShieldCheck/Star/Check son glifos de sistema (confianza,
// checkmarks), no "opciones" — misma categoría que los glifos de cromo que
// FICHA-ARTE (Ronda #4) exceptúa del emoji ('‹ volver, ✕ cerrar'). Coherente
// con cómo la landing (ya LISTA, 8 rondas) resolvió el mismo tipo de ícono.

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { X, Lock, ShieldCheck, Check } from 'lucide-react';
import { CheckCustom, Hairline } from '@/components/landing/ui';
import { MarkedCopy } from '@/components/landing/MarkedCopy';
import { TimelineTrial } from '@/components/paywall/Timeline';
import { PlanCards, type PlanPaywall } from '@/components/paywall/PlanCards';
import { leerRespuestas } from '@/lib/almacenamiento-onboarding';
import { beneficiosPlan, contarRespuestas, type Respuestas } from '@/app/onboarding/flujo';
import { CartaSacerdotisa } from '@/components/app/HeroDemoLuma';
import { desbloquearPorPlan } from '@/lib/prueba-gratis';

const TRIAL_DIAS = 3;

// Fecha exacta del primer cobro (hoy + días de prueba) — el marco legal de
// renovaciones automáticas exige la fecha, no un conteo de días (47-LEGAL §2).
// Solo se llama desde la vista previa de pago, que aparece tras un clic (nunca
// en el render inicial del servidor), así que no hay riesgo de hidratación.
function fechaPrimerCobro(): string {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + TRIAL_DIAS);
  return fecha.toLocaleDateString('es', { day: 'numeric', month: 'long' });
}

const PLAN_ANUAL: PlanPaywall = {
  id: 'anual',
  nombre: 'Anual',
  badge: 'MÁS POPULAR',
  precioMes: '$7,50',
  sufijo: '/mes aprox.',
  descomposicionDia: 'menos de $0,25 al día',
  totalAnual: 'Se cobra $89,99/año',
  ahorro: '3 meses gratis',
};

const PLAN_MENSUAL: PlanPaywall = {
  id: 'mensual',
  nombre: 'Mensual',
  precioMes: '$9,99',
};

const PRECIO_TEXTO: Record<'anual' | 'mensual', string> = {
  anual: '$89,99/año',
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

  // Lectura en efecto (no lazy initializer): localStorage es client-only —
  // leerlo de forma síncrona en el render inicial rompe la hidratación
  // (el HTML que sirve el servidor no puede conocer ese valor). Se probó y
  // confirmó: React marcaba "Hydration failed" en dev. El costo aceptado es
  // un salto breve de beneficios genéricos → personalizados tras montar.
  useEffect(() => {
    setRespuestas(leerRespuestas());
  }, []);

  const nRespuestas = respuestas ? contarRespuestas(respuestas) : 0;
  const beneficios = respuestas ? beneficiosPlan(respuestas) : BENEFICIOS_GENERICOS;

  if (confirmado) {
    return (
      <div className="flex min-h-dvh flex-col [font-family:var(--font-body)]">
        {/* Mismo header que el resto del funnel (antes solo dejaba la X flotando sin marca) */}
        <div className="flex h-14 items-center justify-between px-3">
          <a
            href="/"
            aria-label="Cerrar"
            className="flex size-11 items-center justify-center rounded-[var(--radius-button)] text-[var(--text-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <X size={20} strokeWidth={2} aria-hidden="true" />
          </a>
          <span className="text-[13px] font-semibold tracking-[0.04em] text-[var(--accent-lite)] [font-family:var(--font-display)]">
          LUMA
        </span>
          <span className="size-11" aria-hidden="true" />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center px-6 pb-14 text-center">
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
            Aquí se abrirá Hotmart para activar tu prueba — nada se cobró todavía.
          </p>

          <div className="mt-5 w-full rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_18%,transparent)] bg-[var(--surface)] p-4 text-left">
            <div className="flex items-center justify-between text-[14px]">
              <span className="text-[var(--text-secondary)]">Plan</span>
              <span className="font-semibold text-[var(--text-primary)]">
                {seleccionado === 'anual' ? 'Anual' : 'Mensual'}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[14px]">
              <span className="text-[var(--text-secondary)]">Hoy</span>
              <span className="font-semibold text-[var(--accent)]">$0,00</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[14px]">
              <span className="text-[var(--text-secondary)]">1er cobro ({fechaPrimerCobro()})</span>
              <span className="font-semibold text-[var(--text-primary)]">{PRECIO_TEXTO[seleccionado]}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setConfirmado(false)}
            className="mt-6 flex min-h-11 items-center px-3 text-[14px] font-medium text-[var(--accent)] underline-offset-4 hover:underline"
          >
            Volver a los planes
          </button>
        </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col [font-family:var(--font-body)]">
      {/* Header: X (44px, sale a /) + marca — nunca oculta/retardada (C5) */}
      <div className="sticky top-0 z-20 flex h-14 items-center justify-between bg-[var(--bg)]/75 px-3 backdrop-blur-md">
        <a
          href="/"
          aria-label="Cerrar"
          className="flex size-11 items-center justify-center rounded-[var(--radius-button)] text-[var(--text-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          <X size={20} strokeWidth={2} aria-hidden="true" />
        </a>
        <span className="text-[13px] font-semibold tracking-[0.04em] text-[var(--accent-lite)] [font-family:var(--font-display)]">
          LUMA
        </span>
        <span className="size-11" aria-hidden="true" />
      </div>

      <div className="mx-auto flex w-full max-w-[480px] flex-1 flex-col px-5 pb-10 pt-4">
        {/* Dispositivo ownable de FICHA-ARTE — repite el motivo del funnel (Hero,
            Casos, PlanListo), en tamaño reducido y sin animación de entrada. */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.2 : 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center"
        >
          <div className="scale-[0.7] [transform-origin:top]">
            <CartaSacerdotisa animar={false} />
          </div>
        </motion.div>

        {/* Headline — fórmula única de 52 §4: LUMA + "calma" (deseo tangible #1 de FICHA-AVATAR) */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.2 : 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="-mt-4"
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

        {/* Visual del valor: TIMELINE del trial (default C4) — responde por qué ahora / puedo cancelar.
            Micro-encabezado propio para no leerse como el mismo componente que
            el value stack de arriba (2 bloques seguidos de marcador circular). */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.2 : 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7"
        >
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">
            Cómo funciona tu prueba
          </p>
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
          className="relative mt-7"
        >
          {/* 2º resplandor: la página es larga y el bloom del body (fijo, cerca
              del header) no llega hasta aquí — sin esto la mitad inferior se
              siente plana. Mismo lenguaje de "luz de vela" de FICHA-ARTE. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-10 -z-10 h-[420px]"
            style={{
              background:
                'radial-gradient(480px 320px at 50% 0%, color-mix(in oklab, var(--accent) 16%, transparent), transparent 70%)',
            }}
          />
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
            onClick={() => {
              desbloquearPorPlan();
              setConfirmado(true);
            }}
            whileTap={{ scale: 0.97 }}
            className="flex h-[52px] w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] shadow-[0_8px_30px_color-mix(in_oklab,var(--accent)_25%,transparent)] [touch-action:manipulation] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            Empezar mis {TRIAL_DIAS} días gratis
          </motion.button>
          <p className="mt-3 text-center text-[13px] text-[var(--text-tertiary)]">
            Después, {seleccionado === 'anual' ? '$89,99 al año' : '$9,99 al mes'}, con renovación automática.
            Cancela cuando quieras: te avisamos antes de cada cobro.
          </p>

          <div className="mt-4 flex items-center justify-center gap-2">
            <a
              href="/"
              className="flex min-h-11 items-center px-3 text-[13px] font-medium text-[var(--text-tertiary)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              Ahora no
            </a>
            <span aria-hidden="true" className="text-[var(--text-tertiary)]">
              ·
            </span>
            {/* Más peso que "Ahora no": recuperar una compra ya hecha no es lo
                mismo que abandonar el flujo (defecto de jerarquía de conversión). */}
            <a
              href="/entrar?desde=paywall"
              className="flex min-h-11 items-center px-3 text-[14px] font-semibold text-[var(--text-secondary)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              Restaurar compra
            </a>
          </div>

          <p className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[12px] text-[var(--text-tertiary)]">
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <Lock size={14} aria-hidden="true" />
              Pago seguro con Hotmart
            </span>
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <ShieldCheck size={14} aria-hidden="true" />
              Garantía de Calma de 7 días
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
