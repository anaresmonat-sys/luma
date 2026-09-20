'use client';

// KIT DE LANDING — §5 LA APP POR DENTRO (blueprint: 55 §5)
// Carrusel de frames de teléfono 9:19.5 con scroll-snap + controles (flechas y un
// punto por frame, activo = píldora en acento) sincronizados con el scroll +
// mask-fade lateral (el corte nunca es seco) + CTA mid-page con el MISMO verbo
// del hero (19). Sin screenshot → frame PLACEHOLDER gris con el nombre de la
// pantalla futura (pendiente en ESTADO.md). Los screenshots reales los toma la IA
// al cerrar la app (paso obligatorio de 19 §5).

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { CtaButton, Kicker, SectionShell, useReveal, VIEWPORT_ONCE } from './ui';
import { MarkedCopy, warnCopy, warnRango } from './MarkedCopy';

export interface FrameCarrusel {
  /** Screenshot REAL a 375px (ratio 9:19.5). Sin src → placeholder honesto. */
  src?: string;
  alt?: string;
  /** Label bajo el frame: nombre-RESULTADO de la pantalla ("Tu semana, ya planificada"). */
  label: string;
  /** Nombre de la pantalla futura para el placeholder ("Plan del día"). */
  nombrePantalla?: string;
}

export interface AppPorDentroProps {
  kicker?: string;
  /** Copy MARCADO del título (máx 8 palabras). */
  tituloMarked: string;
  /** 3-6 frames. */
  frames: FrameCarrusel[];
  /** CTA mid-page: mismas medidas y MISMO verbo del CTA héroe (19). */
  ctaLabel: string;
  ctaHref: string;
  id?: string;
}

export function AppPorDentro({
  kicker = 'ASÍ SE VE POR DENTRO',
  tituloMarked,
  frames,
  ctaLabel,
  ctaHref,
  id,
}: AppPorDentroProps) {
  warnCopy('AppPorDentro → título', tituloMarked, 8);
  warnRango('AppPorDentro → frames', frames.length, 3, 6);
  const reduce = useReducedMotion();
  const { contenedor, item } = useReveal();
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activo, setActivo] = useState(0);

  // Frame activo = el más cercano al centro de la pista. Se calcula en scroll (rAF)
  // en vez de con IntersectionObserver: con 5-6 frames el observer dejaba puntos
  // sin encender y solo el primero y el último respondían bien.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    let raf = 0;
    const calcular = () => {
      const centro = scroller.scrollLeft + scroller.clientWidth / 2;
      let mejor = 0;
      let dist = Infinity;
      frameRefs.current.forEach((f, i) => {
        if (!f) return;
        const d = Math.abs(f.offsetLeft + f.offsetWidth / 2 - centro);
        if (d < dist) {
          dist = d;
          mejor = i;
        }
      });
      setActivo(mejor);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(calcular);
    };
    scroller.addEventListener('scroll', onScroll, { passive: true });
    calcular();
    return () => {
      cancelAnimationFrame(raf);
      scroller.removeEventListener('scroll', onScroll);
    };
  }, [frames.length]);

  // Scroll horizontal calculado a mano: scrollIntoView movía también la página y
  // fallaba con snap-mandatory en los frames del medio.
  const irA = (destino: number): void => {
    const i = Math.max(0, Math.min(frames.length - 1, destino));
    const scroller = scrollerRef.current;
    const f = frameRefs.current[i];
    if (!scroller || !f) return;
    setActivo(i);
    scroller.scrollTo({
      left: f.offsetLeft - (scroller.clientWidth - f.offsetWidth) / 2,
      behavior: reduce ? 'auto' : 'smooth',
    });
  };

  return (
    <SectionShell id={id} elevacion="elevada" ariaLabel="La app por dentro">
      <motion.div variants={contenedor} initial="hidden" whileInView="visible" viewport={VIEWPORT_ONCE}>
        <motion.div variants={item} className="mx-auto max-w-[620px] text-center">
          <Kicker>{kicker}</Kicker>
          <h2 className="text-balance text-[30px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)] md:text-[40px]">
            <MarkedCopy text={tituloMarked} />
          </h2>
        </motion.div>

        {/* Pista con scroll-snap + fade en ambos bordes (mask-image) */}
        <motion.div variants={item} className="mt-10">
          <div
            ref={scrollerRef}
            className="relative flex snap-x snap-mandatory gap-5 overflow-x-auto px-[max(20px,calc(50%-125px))] pb-2 [scrollbar-width:none] [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] [&::-webkit-scrollbar]:hidden"
          >
            {frames.map((f, i) => (
              <div
                key={i}
                ref={(el) => {
                  frameRefs.current[i] = el;
                }}
                onClick={() => irA(i)}
                className={`shrink-0 snap-center transition-[transform,opacity] duration-300 ${
                  activo === i ? 'scale-100 opacity-100' : 'scale-[0.94] opacity-60'
                }`}
              >
                <div
                  className="relative aspect-[9/19.5] w-[250px] overflow-hidden rounded-[30px] border-[5px] shadow-[var(--shadow-2)]"
                  style={{ borderColor: 'color-mix(in oklab, var(--text-primary) 90%, var(--accent))' }}
                >
                  {f.src ? (
                    /* Si el proyecto usa next/image, cambiar por <Image> — <img> mantiene el kit portable */
                    <img
                      src={f.src}
                      alt={f.alt ?? f.label}
                      width={250}
                      height={542}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    /* Placeholder honesto (55 §5.2): gris elevado + nombre + dashed —
                       nunca un frame que finja producto terminado */
                    <div className="flex h-full w-full items-center justify-center border-2 border-dashed border-[color-mix(in_oklab,var(--text-tertiary)_40%,transparent)] bg-[var(--surface-2)] px-4">
                      <span className="text-center text-[14px] font-medium text-[var(--text-secondary)]">
                        {f.nombrePantalla ?? f.label}
                      </span>
                    </div>
                  )}
                </div>
                <p
                  className={`mt-3 text-center text-[13px] font-medium transition-colors duration-300 ${
                    activo === i ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {f.label}
                </p>
              </div>
            ))}
          </div>

          {/* Controles: flecha · un punto por frame (activo = píldora en acento) · flecha */}
          <div className="mt-4 flex items-center justify-center gap-1">
            <button
              type="button"
              onClick={() => irA(activo - 1)}
              disabled={activo === 0}
              aria-label="Pantalla anterior"
              className="flex size-11 items-center justify-center text-[var(--text-secondary)] transition-opacity [touch-action:manipulation] disabled:opacity-30"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div className="flex items-center" role="group" aria-label="Pantallas de la app">
              {frames.map((f, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => irA(i)}
                  aria-label={`Ir a: ${f.label}`}
                  aria-current={activo === i ? 'true' : undefined}
                  className="flex h-11 min-w-8 items-center justify-center [touch-action:manipulation]"
                >
                  <span
                    className={`h-2 rounded-full transition-[width,background-color] duration-300 ${
                      activo === i
                        ? 'w-6 bg-[var(--accent)]'
                        : 'w-2 bg-[color-mix(in_oklab,var(--text-tertiary)_35%,transparent)]'
                    }`}
                  />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => irA(activo + 1)}
              disabled={activo === frames.length - 1}
              aria-label="Pantalla siguiente"
              className="flex size-11 items-center justify-center text-[var(--text-secondary)] transition-opacity [touch-action:manipulation] disabled:opacity-30"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </motion.div>

        {/* CTA mid-page (reglas de CTA de 19): tras la prueba visual, cuando la confianza es alta */}
        <motion.div variants={item} className="mt-10 flex justify-center">
          <CtaButton href={ctaHref}>{ctaLabel}</CtaButton>
        </motion.div>
      </motion.div>
    </SectionShell>
  );
}
