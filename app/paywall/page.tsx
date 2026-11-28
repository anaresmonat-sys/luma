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

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { X, ShieldCheck, Loader2 } from 'lucide-react';
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
  badge: 'RECOMENDADO',
  precioMes: 'US$7,50*',
  sufijo: '/mes aprox.',
  descomposicionDia: 'Menos de US$0,25 al día',
  totalAnual: `Primer cobro al día ${TRIAL_DIAS}: US$89,99/año*`,
  ahorro: 'Ahorras 3 meses frente al plan mensual',
};

const PLAN_MENSUAL: PlanPaywall = {
  id: 'mensual',
  nombre: 'Mensual',
  precioMes: 'US$9,99*',
};

const PRECIO_TEXTO: Record<'anual' | 'mensual', string> = {
  anual: 'US$89,99/año*',
  mensual: 'US$9,99/mes*',
};

// Fallback honesto cuando no hay respuestas del onboarding (llegó directo a /paywall):
// mismos 3 pilares del producto, sin fingir personalización que no existe.
const BENEFICIOS_GENERICOS = [
  { texto: 'Descifra chats: hechos, riesgo y qué responder' },
  { texto: 'Tiradas de tarot para tu caso, no genéricas' },
  { texto: 'Un espacio privado y sin juicio' },
];

export default function PaywallLuma() {
  const reduce = useReducedMotion();
  const [seleccionado, setSeleccionado] = useState<'anual' | 'mensual'>('anual');
  const [respuestas, setRespuestas] = useState<Respuestas | null>(null);
  // Llegó porque ya gastó su lectura gratis: se le dice claro, en vez de caer sin explicación.
  const [lecturaUsada, setLecturaUsada] = useState(false);
  const [abriendoPago, setAbriendoPago] = useState(false);
  const [errorPago, setErrorPago] = useState(false);
  const temporizadorPago = useRef<number | null>(null);
  const limpiarTemporizador = () => {
    if (temporizadorPago.current !== null) {
      window.clearTimeout(temporizadorPago.current);
      temporizadorPago.current = null;
    }
  };

  // Lectura en efecto (no lazy initializer): localStorage es client-only —
  // leerlo de forma síncrona en el render inicial rompe la hidratación
  // (el HTML que sirve el servidor no puede conocer ese valor). Se probó y
  // confirmó: React marcaba "Hydration failed" en dev. El costo aceptado es
  // un salto breve de beneficios genéricos → personalizados tras montar.
  useEffect(() => {
    const reiniciar = () => {
      limpiarTemporizador();
      setAbriendoPago(false);
    };
    window.addEventListener('pageshow', reiniciar);
    return () => {
      window.removeEventListener('pageshow', reiniciar);
      limpiarTemporizador();
    };
  }, []);

  // Se lee ANTES de pintar (layout effect): el HTML del servidor sale invisible en esa zona y la persona nunca ve
  // beneficios genéricos que cambian de texto (defecto de parpadeo señalado por el revisor, rondas 7-11).
  const [listo, setListo] = useState(false);
  useLayoutEffect(() => {
    setRespuestas(leerRespuestas());
    setLecturaUsada(new URLSearchParams(window.location.search).get('motivo') === 'lectura-usada');
    setListo(true);
  }, []);

  useEffect(() => {
    registrarEventoUnaVez('paywall_visto');
  }, []);

  const beneficios = respuestas ? beneficiosPlan(respuestas) : BENEFICIOS_GENERICOS;

  return (
    <div className="flex min-h-dvh flex-col [font-family:var(--font-body)]">
      {/* Header: X (44px, sale a /) + marca — nunca oculta/retardada (C5) */}
      <div className="sticky top-0 z-20 grid h-14 grid-cols-[1fr_auto_1fr] items-center bg-[var(--bg)]/90 px-3 backdrop-blur-md">
        <a
          href="/"
          aria-label="Cerrar"
          className="flex size-11 items-center justify-center rounded-[var(--radius-button)] text-[var(--text-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          <X size={20} strokeWidth={2} aria-hidden="true" />
        </a>
        <span className="justify-self-center text-[13px] font-semibold tracking-[0.04em] text-[var(--accent-lite)] [font-family:var(--font-display)]">
          LUMA
        </span>
        {/* Salida siempre visible: quien ya pagó no tiene que bajar para encontrar por dónde entrar */}
        <a
          href="/entrar?desde=paywall"
          className="flex min-h-11 items-center justify-self-end rounded-[var(--radius-button)] px-3 text-sm font-semibold text-[var(--text-secondary)] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          Ya pagué
        </a>
      </div>

      <div className="mx-auto flex w-full max-w-[480px] sm:max-w-[640px] flex-1 flex-col px-5 pb-32 pt-4 sm:pt-8">
        {/* Dispositivo ownable de FICHA-ARTE — repite el motivo del funnel (Hero,
            Casos, PlanListo), en tamaño reducido y sin animación de entrada. */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.2 : 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center [@media(max-height:700px)]:hidden"
        >
          <div className="h-14 scale-[0.27] [transform-origin:top]">
            <CartaSacerdotisa animar={false} />
          </div>
        </motion.div>

        {/* Headline elegido por la dueña (28-nov): tono de magia + «gratis». Lo concreto lo explican los beneficios de
            justo debajo; el subtítulo mantiene la escena del avatar. */}
        {/* Fundido con CSS puro: el título es el LCP y no debe esperar a que cargue el JavaScript (38) */}
        <div className="luma-fade-in mt-2 sm:mt-4">
          {lecturaUsada && (
            <p className="mb-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_40%,transparent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] px-3 py-2 text-[13px] font-semibold leading-snug text-[var(--text-primary)]">
              Ya usaste tu lectura gratis. Con los {TRIAL_DIAS} días de prueba tienes LUMA completa.
            </p>
          )}
          <h1 className="text-balance text-[28px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
            <MarkedCopy text={`${TRIAL_DIAS} días gratis en el [acento]maravilloso mundo de LUMA[/acento]`} />
          </h1>
          {/* Ancla emocional de FICHA-AVATAR (se repite landing+onboarding+paywall):
              "obsesionada mirando el teléfono" → "en 1 minuto entiendes qué pasa" */}
          <p className="mt-2 text-[15px] leading-snug text-[var(--text-secondary)]">
            <MarkedCopy text="Para esas noches [b]mirando el teléfono[/b], esperando que responda." />
          </p>
        </div>

        {/* Beneficios: personalizados si hay datos del onboarding, genéricos si no */}
        <motion.ul
          initial={{ opacity: 0, y: reduce ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.2 : 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className={`mt-4 flex flex-col gap-2 sm:mt-6 sm:gap-3 ${listo ? '' : 'invisible'}`}
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
          className="relative mt-4 sm:mt-8"
        >
          {/* 2º resplandor: la página es larga y el bloom del body (fijo, cerca
              del header) no llega hasta aquí — sin esto la mitad inferior se
              siente plana. Mismo lenguaje de "luz de vela" de FICHA-ARTE. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-5 -top-10 -z-10 h-[420px]"
            style={{
              background:
                'radial-gradient(ellipse 50% 50% at 50% 45%, color-mix(in oklab, var(--accent) 16%, transparent), transparent 100%)',
              maskImage: 'linear-gradient(to bottom, transparent, black 30%, black 55%, transparent)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 30%, black 55%, transparent)',
            }}
          />
          <PlanCards
            anual={PLAN_ANUAL}
            mensual={PLAN_MENSUAL}
            seleccionado={seleccionado}
            onSeleccionar={setSeleccionado}
          />
          <p className="mt-2 text-center text-[13px] leading-snug text-[var(--text-secondary)]">
            * Precios en US$. Al pagar verás el total en tu moneda, con impuestos.
          </p>
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
          className="mt-4"
        >
          <div className="mt-2 flex items-center justify-center gap-2">
            <a
              href="/"
              className="flex min-h-11 items-center px-3 text-[13px] font-medium text-[var(--text-secondary)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              Ahora no
            </a>
            {/* «Ya pagué» vive en la cabecera (siempre visible): aquí solo queda la salida limpia. */}
          </div>

        </motion.div>
      </div>

      {/* CTA fijo al fondo: siempre a la vista desde la primera pantalla (ronda 6 del revisor).
          Va fuera de los bloques animados porque un transform rompe position:fixed. */}
      <div className="fixed inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[var(--bg)] from-80% to-transparent pb-2 pt-3">
        <div className="mx-auto w-full max-w-[480px] px-5">
          <motion.button
            type="button"
            disabled={abriendoPago}
            onClick={() => {
              if (abriendoPago) return;
              setErrorPago(false);
              setAbriendoPago(true);
              limpiarTemporizador();
              temporizadorPago.current = window.setTimeout(() => {
                setAbriendoPago(false);
                setErrorPago(true);
              }, 8000);
              registrarEvento('plan_elegido', { plan: seleccionado });
              try {
                window.location.href = checkoutHotmart(seleccionado);
              } catch {
                setAbriendoPago(false);
                setErrorPago(true);
              }
            }}
            whileTap={abriendoPago ? undefined : { scale: 0.97 }}
            className="flex h-11 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[15px] font-semibold text-[var(--bg)] shadow-[0_8px_30px_color-mix(in_oklab,var(--accent)_25%,transparent)] transition-opacity [touch-action:manipulation] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:opacity-70"
          >
            {abriendoPago ? (
              <span className="flex items-center gap-2" role="status">
                <Loader2 size={18} aria-hidden="true" className="motion-safe:animate-spin" />
                Abriendo el pago seguro…
              </span>
            ) : (
              `Empezar mis ${TRIAL_DIAS} días gratis`
            )}
          </motion.button>
          {errorPago && (
            <p role="alert" className="mt-2 text-center text-[13px] font-semibold leading-snug text-[var(--an-risk)]">
              El pago tarda más de lo normal. Toca de nuevo el botón o escríbenos a soporte@tuluma.app.
            </p>
          )}
          {/* Antes de saltar a Hotmart: allí se ve primero el total en moneda local (los días gratis quedan más abajo) */}
          <p className="mt-2 text-center text-sm font-semibold leading-snug text-[var(--text-primary)]">
            Hoy no pagas nada. Primer cobro al día {TRIAL_DIAS}.
          </p>
          <p className="mt-1 text-center text-[13px] font-semibold leading-snug text-[var(--text-secondary)]">
            <ShieldCheck size={16} aria-hidden="true" className="mr-1 inline align-[-3px] text-[var(--accent-lite)]" />
            <a href="/reembolsos" className="underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
              Garantía LUMA de 15 días
            </a>
            {' · '}
            <span className="whitespace-nowrap">Pago con Hotmart</span>
          </p>
        </div>
      </div>
    </div>
  );
}
