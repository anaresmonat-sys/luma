'use client';

// KIT DE LANDING — ui.tsx
// Piezas compartidas de las 10 secciones. La estructura premium vive AQUÍ
// (chips 44px, hairline degradada, checkmarks custom, sticky CTA con safe-area,
// alternancia base/elevado, reveal con reduced-motion): las secciones componen,
// no re-estilan. Consume SOLO los tokens de tokens.css.

import { useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'motion/react';
import { ArrowUp, Check, ChevronUp, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* ── <Accent> — la palabra que vende, en el acento del kit ─────────────────── */
export function Accent({ children }: { children: ReactNode }) {
  return <span className="text-[var(--accent)]">{children}</span>;
}

/* ── <Kicker> — caps 12px/600 tracking +0.08em en acento (máx 1 por sección) ── */
export function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">
      {children}
    </p>
  );
}

/* ── <IconChip> — ícono SVG 22px dentro de chip 44px (55: jamás emoji) ──────
   tone 'accent' para secciones cálidas · 'muted' para íconos de dolor (§2:
   neutro apagado, nunca checks verdes). La FORMA la decide --radius-button:
   una sola forma de chip por página. */
export function IconChip({ icon: Icono, tone = 'accent' }: { icon: LucideIcon; tone?: 'accent' | 'muted' }) {
  const acento = tone === 'accent';
  return (
    <span
      aria-hidden="true"
      className={`inline-flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-button)] border ${
        acento
          ? 'border-[color-mix(in_oklab,var(--accent)_22%,transparent)] bg-[var(--chip-bg)]'
          : 'border-[color-mix(in_oklab,var(--text-tertiary)_35%,transparent)] bg-[color-mix(in_oklab,var(--text-tertiary)_12%,transparent)]'
      }`}
    >
      <Icono size={22} strokeWidth={2} color={acento ? 'var(--accent)' : 'var(--text-secondary)'} aria-hidden="true" />
    </span>
  );
}

/* ── <Hairline> — borde degradado 1-2px, técnica padding-box/border-box (49 §13).
   Señal de "esto importa": máx 1-3 usos por página (plan recomendado, garantía,
   chip del mecanismo). emphasis = EL elemento de la vista (2px, acento 55%). ── */
export function Hairline({
  emphasis = false,
  surface = 'surface',
  className = '',
  children,
}: {
  emphasis?: boolean;
  surface?: 'surface' | 'surface-2' | 'bg';
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-[var(--radius-card)] ${className}`}
      style={{
        border: `${emphasis ? 2 : 1}px solid transparent`,
        background:
          `linear-gradient(var(--${surface}), var(--${surface})) padding-box, ` +
          `linear-gradient(135deg, color-mix(in oklab, var(--accent) ${emphasis ? 55 : 40}%, transparent), transparent 60%) border-box`,
      }}
    >
      {children}
    </div>
  );
}

/* ── <CheckCustom> — círculo acento 12% + check SVG (55 repertorio #9).
   Nunca el ✓ del sistema ni emoji. ── */
export function CheckCustom() {
  return (
    <span
      aria-hidden="true"
      className="mt-0.5 inline-flex size-[22px] shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]"
    >
      <Check size={13} strokeWidth={2.5} color="var(--accent)" aria-hidden="true" />
    </span>
  );
}

/* ── <SectionShell> — ritmo vertical y alternancia base↔elevado (55 T1).
   64px mobile / 96px desktop; compacta (garantía) 48/64. flush pega las
   secciones que son UN movimiento visual (problema+agitación). ── */
export function SectionShell({
  id,
  elevacion = 'base',
  compacta = false,
  flush = 'none',
  ariaLabel,
  className = '',
  children,
}: {
  id?: string;
  elevacion?: 'base' | 'elevada';
  compacta?: boolean;
  flush?: 'none' | 'top' | 'bottom';
  ariaLabel?: string;
  className?: string;
  children: ReactNode;
}) {
  const pt = flush === 'top' ? 'pt-0' : compacta ? 'pt-12 md:pt-16' : 'pt-16 md:pt-24';
  const pb = flush === 'bottom' ? 'pb-8 md:pb-10' : compacta ? 'pb-12 md:pb-16' : 'pb-16 md:pb-24';
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={`${elevacion === 'elevada' ? 'bg-[var(--surface)] shadow-[var(--rim-section)]' : ''} ${pt} ${pb} ${className}`}
    >
      <div className="mx-auto w-full max-w-[1140px] px-5">{children}</div>
    </section>
  );
}

/* ── useReveal — variants de entrada whileInView con stagger, UNA sola vez,
   reduced-motion respetado (movimiento fuera, fade dentro — 55 T4). ── */
export function useReveal(stagger = 0.07): { contenedor: Variants; item: Variants } {
  const reduce = useReducedMotion();
  // MEJORA PROGRESIVA: el contenido es visible por defecto (opacity 1). La animación
  // de entrada solo se ARMA tras el montaje del cliente; si el IntersectionObserver
  // no dispara (captura full-page, JS lento, sin JS) el contenido NUNCA queda oculto.
  const [armado, setArmado] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setArmado(true), 60);
    return () => clearTimeout(t);
  }, []);
  const oculto = armado && !reduce ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 };
  return {
    contenedor: {
      hidden: {},
      visible: { transition: { staggerChildren: reduce ? 0 : stagger } },
    },
    item: {
      hidden: oculto,
      visible: { opacity: 1, y: 0, transition: { duration: reduce ? 0.2 : 0.45, ease: [0.16, 1, 0.3, 1] } },
    },
  };
}

/* Props estándar para el contenedor con reveal — amount 0 = dispara en cuanto
   la sección roza el viewport (más robusto que 0.2 en pantallas altas). */
export const VIEWPORT_ONCE = { once: true, amount: 0 } as const;

/* ── <CtaButton> — el CTA vivo del kit: ≥52px, whileTap 0.97, sombra tintada.
   El texto sobre acento usa --bg: si tu FICHA-ARTE rompe el contraste AA ahí,
   ajusta los tokens, no el componente. ── */
export function CtaButton({
  href,
  children,
  alto = 52,
  fullMobile = true,
}: {
  href: string;
  children: ReactNode;
  alto?: 52 | 56;
  fullMobile?: boolean;
}) {
  return (
    <motion.a
      whileTap={{ scale: 0.97 }}
      href={href}
      className={`inline-flex items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] px-8 text-[17px] font-semibold text-[var(--bg)] shadow-[0_8px_30px_color-mix(in_oklab,var(--accent)_25%,transparent)] transition-colors duration-150 hover:bg-[color-mix(in_oklab,var(--accent)_88%,var(--text-primary))] [touch-action:manipulation] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] ${
        alto === 56 ? 'h-14' : 'h-[52px]'
      } ${fullMobile ? 'w-full sm:w-auto' : ''}`}
    >
      {children}
    </motion.a>
  );
}

/* ── <StickyCtaMobile> — barra fija inferior SOLO mobile (55 T2).
   Aparece cuando el hero sale del viewport; se oculta frente a la oferta y al
   CTA final; safe-area respetada. DOS estados (T2): antes de ver la oferta el
   botón hace scroll a #oferta ("ver precios"); después de verla, cambia al CTA
   comercial — nunca saltar una oferta que la persona todavía no vio. */
export function StickyCtaMobile({
  labelComercial,
  href,
  labelPre = 'Ver plan y precios',
  heroId = 'hero',
  ofertaId = 'oferta',
  ctaFinalId = 'cta-final',
}: {
  labelComercial: string;
  href: string;
  labelPre?: string;
  heroId?: string;
  ofertaId?: string;
  ctaFinalId?: string;
}) {
  const reduce = useReducedMotion();
  const [heroVisible, setHeroVisible] = useState(true);
  const [ofertaVisible, setOfertaVisible] = useState(false);
  const [ofertaVista, setOfertaVista] = useState(false);
  const [finalVisible, setFinalVisible] = useState(false);
  const [descartada, setDescartada] = useState(false);

  useEffect(() => {
    const observar = (id: string, onChange: (visible: boolean) => void): IntersectionObserver | null => {
      const el = document.getElementById(id);
      if (!el) return null;
      const io = new IntersectionObserver(
        (entries) => {
          const e = entries[0];
          if (e) onChange(e.isIntersecting);
        },
        { threshold: 0.1 }
      );
      io.observe(el);
      return io;
    };
    const a = observar(heroId, setHeroVisible);
    const b = observar(ofertaId, (v) => {
      setOfertaVisible(v);
      if (v) setOfertaVista(true);
    });
    const c = observar(ctaFinalId, setFinalVisible);
    return () => {
      a?.disconnect();
      b?.disconnect();
      c?.disconnect();
    };
  }, [heroId, ofertaId, ctaFinalId]);

  const visible = !heroVisible && !ofertaVisible && !finalVisible && !descartada;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          layout={!reduce}
          initial={{ y: reduce ? 0 : 88, opacity: reduce ? 0 : 1 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: reduce ? 0 : 88, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 border-t border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] bg-[var(--surface)] px-4 pt-2 pb-[max(12px,env(safe-area-inset-bottom))] md:hidden"
        >
          <motion.button
            type="button"
            aria-label="Volver arriba"
            onClick={() => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })}
            whileTap={{ scale: 0.92 }}
            className="flex size-[52px] shrink-0 items-center justify-center rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] text-[var(--text-secondary)] [touch-action:manipulation] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <ChevronUp size={20} strokeWidth={2} aria-hidden="true" />
          </motion.button>
          <motion.a
            whileTap={{ scale: 0.97 }}
            href={ofertaVista ? href : `#${ofertaId}`}
            className="flex min-h-[52px] flex-1 items-center justify-center text-balance rounded-[var(--radius-button)] bg-[var(--accent)] px-2 py-2 text-center text-[15px] font-semibold leading-snug text-[var(--bg)] [touch-action:manipulation] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            {ofertaVista ? labelComercial : labelPre}
          </motion.a>
          <motion.button
            type="button"
            aria-label="Cerrar esta barra"
            onClick={() => setDescartada(true)}
            whileTap={{ scale: 0.92 }}
            className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-button)] text-[var(--text-tertiary)] [touch-action:manipulation] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <X size={18} strokeWidth={2} aria-hidden="true" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── <BackToTop> — botón flotante circular, SOLO desktop (md:). En mobile
   el volver-arriba vive DENTRO de la barra de StickyCtaMobile (mismo fixed,
   sin duplicar): a 375px el contenido corre borde a borde y un círculo
   flotante independiente terminaba tapando texto centrado (headlines de
   Garantía/Casos) — en desktop el contenido tiene margen lateral de sobra
   y el círculo flota en el margen vacío, sin superponer nada. */
export function BackToTop({ heroId = 'hero' }: { heroId?: string }) {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = document.getElementById(heroId);
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e) setVisible(!e.isIntersecting);
      },
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [heroId]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-label="Volver arriba"
          onClick={() => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })}
          whileTap={{ scale: 0.92 }}
          initial={{ opacity: reduce ? 0 : 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduce ? 0 : 12 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="fixed right-6 bottom-6 z-30 hidden size-11 items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] bg-[var(--surface)] text-[var(--text-primary)] shadow-[var(--shadow-card)] [touch-action:manipulation] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] md:inline-flex"
        >
          <ArrowUp size={20} strokeWidth={2} aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
