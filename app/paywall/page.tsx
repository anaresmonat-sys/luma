'use client';

// LUMA — Paywall (Sesión 4, paso 2 de la SECUENCIA MAESTRA). Blueprint:
// docs/sistema/50-DISENO-ONBOARDING-PAYWALL.md §C (C1 blueprint, C4 timeline
// como visual default de todo paywall CON trial, C4ter checkout externo).
// Precios/plazos: FICHA-MERCADO.md §1/§4 (Prueba 3 · Garantía 15 · 9,99/mes ·
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
import { X, Lock, ShieldCheck } from 'lucide-react';
import { CheckCustom, Hairline } from '@/components/landing/ui';
import { MarkedCopy } from '@/components/landing/MarkedCopy';
import { TimelineTrial } from '@/components/paywall/Timeline';
import { PlanCards, type PlanPaywall } from '@/components/paywall/PlanCards';
import { leerRespuestas } from '@/lib/almacenamiento-onboarding';
import { beneficiosPlan, type Respuestas } from '@/app/onboarding/flujo';
import { CartaSacerdotisa } from '@/components/app/HeroDemoLuma';
import { registrarEvento, registrarEventoUnaVez } from '@/lib/registrar-evento';
import { checkoutHotmart } from '@/lib/hotmart-links';

const TRIAL_DIAS = 3;

const PLAN_ANUAL: PlanPaywall = {
  id: 'anual',
  nombre: 'Anual',
  badge: 'MÁS POPULAR',
  precioMes: '$7,50',
  sufijo: '/mes aprox.',
  descomposicionDia: 'menos de $0,25 al día',
  totalAnual: 'Se cobra $89,99/año',
  ahorro: 'Ahorras 3 meses frente al plan mensual',
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
  { texto: 'Tiradas de tarot con tus preguntas, no genéricas' },
  { texto: 'Un espacio privado, sin juicio, para pensar en voz alta' },
];

export default function PaywallLuma() {
  const reduce = useReducedMotion();
  const [seleccionado, setSeleccionado] = useState<'anual' | 'mensual'>('anual');
  const [respuestas, setRespuestas] = useState<Respuestas | null>(null);
  // Llegó porque ya gastó su lectura gratis: se le dice claro, en vez de caer sin explicación.
  const [lecturaUsada, setLecturaUsada] = useState(false);
  const [abriendoPago, setAbriendoPago] = useState(false);
  const [errorPago, setErrorPago] = useState(false);

  // Lectura en efecto (no lazy initializer): localStorage es client-only —
  // leerlo de forma síncrona en el render inicial rompe la hidratación
  // (el HTML que sirve el servidor no puede conocer ese valor). Se probó y
  // confirmó: React marcaba "Hydration failed" en dev. El costo aceptado es
  // un salto breve de beneficios genéricos → personalizados tras montar.
  useEffect(() => {
    const reiniciar = () => setAbriendoPago(false);
    window.addEventListener('pageshow', reiniciar);
    return () => window.removeEventListener('pageshow', reiniciar);
  }, []);

  useEffect(() => {
    setRespuestas(leerRespuestas());
    setLecturaUsada(new URLSearchParams(window.location.search).get('motivo') === 'lectura-usada');
    registrarEventoUnaVez('paywall_visto');
  }, []);

  const beneficios = respuestas ? beneficiosPlan(respuestas) : BENEFICIOS_GENERICOS;

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

      <div className="mx-auto flex w-full max-w-[480px] flex-1 flex-col px-5 pb-40 pt-4">
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

        {/* Headline: promesa concreta (entender qué pasa y qué responder) + la escena del avatar en el subtítulo; sin prometer un resultado emocional */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.2 : 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="-mt-4"
        >
          {lecturaUsada && (
            <p className="mb-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_40%,transparent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] px-3 py-2 text-[13px] font-semibold leading-snug text-[var(--text-primary)]">
              Ya usaste tu lectura gratis. Con los {TRIAL_DIAS} días de prueba tienes LUMA completa.
            </p>
          )}
          <h1 className="text-balance text-[28px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
            <MarkedCopy text={`${TRIAL_DIAS} días para [acento]entender qué pasa[/acento] y qué responder`} />
          </h1>
          {/* Ancla emocional de FICHA-AVATAR (se repite landing+onboarding+paywall):
              "obsesionada mirando el teléfono" → "en 1 minuto entiendes qué pasa" */}
          <p className="mt-2 text-[15px] leading-snug text-[var(--text-secondary)]">
            <MarkedCopy text="Para esas noches [b]mirando el teléfono[/b], esperando que responda." />
          </p>
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
              maskImage: 'linear-gradient(to bottom, black 35%, transparent)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 35%, transparent)',
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

        {/* CTA único + reversibilidad + salida limpia */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.2 : 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7"
        >
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
              Garantía de 15 días
            </span>
          </p>
        </motion.div>
      </div>

      {/* CTA fijo al fondo: siempre a la vista desde la primera pantalla (ronda 6 del revisor).
          Va fuera de los bloques animados porque un transform rompe position:fixed. */}
      <div className="fixed inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)] to-transparent pb-3 pt-6">
        <div className="mx-auto w-full max-w-[480px] px-5">
          <motion.button
            type="button"
            disabled={abriendoPago}
            onClick={() => {
              if (abriendoPago) return;
              setErrorPago(false);
              setAbriendoPago(true);
              window.setTimeout(() => setAbriendoPago(false), 8000);
              registrarEvento('plan_elegido', { plan: seleccionado });
              try {
                window.location.href = checkoutHotmart(seleccionado);
              } catch {
                setAbriendoPago(false);
                setErrorPago(true);
              }
            }}
            whileTap={abriendoPago ? undefined : { scale: 0.97 }}
            className="flex h-[52px] w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] shadow-[0_8px_30px_color-mix(in_oklab,var(--accent)_25%,transparent)] transition-opacity [touch-action:manipulation] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:opacity-70"
          >
            {abriendoPago ? 'Abriendo el pago seguro…' : `Empezar mis ${TRIAL_DIAS} días gratis`}
          </motion.button>
          {errorPago && (
            <p role="alert" className="mt-2 text-center text-[13px] font-semibold leading-snug text-[var(--an-risk)]">
              No pudimos abrir el pago. Vuelve a intentarlo o escríbenos a soporte@tuluma.app.
            </p>
          )}
          <p className="mt-2 text-center text-[12px] leading-snug text-[var(--text-tertiary)]">
            Después, {seleccionado === 'anual' ? '$89,99 al año' : '$9,99 al mes'}, más impuestos. Se cobra en tu moneda local y el importe final lo ves en la página de pago. Cancelas cuando quieras y tienes 15 días de garantía desde el primer cobro.
          </p>
        </div>
      </div>
    </div>
  );
}
