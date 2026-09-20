'use client';

// Visual del hero de la landing: la carta de tarot de pergamino que FLOTA
// (dispositivo ownable de FICHA-ARTE) + una demo estática rotulada "EJEMPLO"
// del mecanismo "descifra la conversación". Colores del pergamino y del
// analizador: tokens de components/landing/tokens.css.

import { motion, useReducedMotion } from 'motion/react';

export function CartaSacerdotisa({
  animar = true,
  disparo = 'scroll',
  numero = 'II',
  nombre = 'La Sacerdotisa',
  cita = 'Escucha antes de responder.',
  imagen,
  invertida = false,
}: {
  animar?: boolean;
  /** 'scroll' = revela al entrar en viewport (landing) · 'montaje' = revela al abrir la pantalla (Inicio, sin scroll de por medio). */
  disparo?: 'scroll' | 'montaje';
  numero?: string;
  nombre?: string;
  cita?: string;
  /** Ilustración real de la carta (/public/tarot). Sin ella, se dibuja el pergamino de siempre. */
  imagen?: string;
  /** Con `imagen`, gira la ilustración 180° como en una tirada real. */
  invertida?: boolean;
}) {
  const reduce = useReducedMotion();
  const anim = animar && !reduce;
  const props =
    disparo === 'montaje'
      ? { initial: anim ? { opacity: 0, y: 26, rotate: -8 } : false, animate: { opacity: 1, y: 0, rotate: 0 } }
      : {
          initial: anim ? { opacity: 0, y: 26, rotate: -8 } : false,
          whileInView: anim ? { opacity: 1, y: 0, rotate: 0 } : undefined,
          viewport: { once: true, amount: 0.3 },
        };
  return (
    <div className="flex shrink-0 flex-col items-center">
    <motion.div
      className="relative shrink-0"
      style={{ perspective: '900px' }}
      {...props}
      transition={{ type: 'spring', stiffness: 90, damping: 14 }}
    >
      {/* resplandor ámbar detrás (firma de FICHA-ARTE) */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -z-10 h-[15rem] w-[15rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[2.5rem]"
        style={{
          background:
            'radial-gradient(circle, var(--accent), color-mix(in oklab, var(--accent-2) 60%, transparent) 55%, transparent 72%)',
          opacity: 0.5,
        }}
      />
      <div
        className="relative flex h-[15rem] w-[8.75rem] flex-col items-center justify-center overflow-hidden rounded-[var(--radius-button)] [@media(min-height:681px)_and_(max-height:760px)]:h-[12rem] [@media(min-height:681px)_and_(max-height:760px)]:w-[7rem] [@media(max-height:680px)]:h-[10rem] [@media(max-height:680px)]:w-[5.9rem]"
        style={{
          transform: 'rotateX(6deg) rotateY(-14deg) rotate(-3deg)',
          transformStyle: 'preserve-3d',
          background: imagen
            ? 'linear-gradient(160deg, var(--card-paper), var(--card-paper-2))'
            : 'linear-gradient(160deg, color-mix(in oklab, var(--bloom-vino) 75%, var(--bg)), var(--bg) 70%)',
          boxShadow: imagen
            ? '0 30px 44px -14px rgb(10 5 8 / 0.6), 0 12px 18px -8px rgb(10 5 8 / 0.45), inset 0 1px 0 rgb(255 255 255 / 0.55), inset 0 0 0 1px rgb(255 255 255 / 0.28)'
            : '0 30px 44px -14px rgb(10 5 8 / 0.7), 0 12px 18px -8px rgb(10 5 8 / 0.5), inset 0 0 0 1.5px color-mix(in oklab, var(--accent) 85%, transparent)',
        }}
      >
        {imagen ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imagen}
            alt={invertida ? `${nombre} (invertida)` : nombre}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ transform: invertida ? 'rotate(180deg)' : undefined }}
          />
        ) : (
          // Reverso del mazo: fondo ciruela, doble marco dorado y el logo de LUMA al centro.
          <>
            <div
              aria-hidden="true"
              className="absolute inset-2 rounded-[var(--radius-button)]"
              style={{ border: '1px solid color-mix(in oklab, var(--accent) 55%, transparent)' }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-3.5 rounded-md"
              style={{ border: '1px solid color-mix(in oklab, var(--accent) 28%, transparent)' }}
            />
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[1.25rem]"
              style={{ background: 'color-mix(in oklab, var(--accent) 30%, transparent)' }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/luma-icon.png" alt="" aria-hidden="true" className="relative h-16 w-auto" />
            <span
              className="relative mt-3 text-[12px] font-semibold tracking-[0.3em] text-[var(--accent-lite)] [font-family:var(--font-display)]"
            >
              LUMA
            </span>
          </>
        )}
      </div>
      {/* sombra de contacto */}
      <div
        aria-hidden="true"
        className="absolute -bottom-4 left-1/2 h-8 w-[9.5rem] -translate-x-1/2 rounded-full blur-[1rem]"
        style={{ background: 'rgb(10 5 8 / 0.55)' }}
      />
    </motion.div>
    {imagen && (
      <div className="mt-8 max-w-[16rem] text-center [@media(min-height:681px)_and_(max-height:760px)]:mt-5 [@media(max-height:680px)]:mt-3">
        <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[var(--accent)]">
          {numero} · {nombre}
          {invertida ? ' (invertida)' : ''}
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-[var(--text-secondary)]">{cita}</p>
      </div>
    )}
    </div>
  );
}

export function FilaAnalisis({ color, titulo, texto }: { color: string; titulo: string; texto: string }) {
  return (
    <div className="flex gap-2.5">
      <span
        aria-hidden="true"
        className="mt-1.5 size-2 shrink-0 rounded-full"
        style={{ background: color, boxShadow: `0 0 8px color-mix(in oklab, ${color} 60%, transparent)` }}
      />
      <div>
        <p className="text-[11.5px] font-bold text-[var(--text-primary)]">{titulo}</p>
        <p className="mt-0.5 text-[11.5px] leading-snug text-[var(--text-secondary)]">{texto}</p>
      </div>
    </div>
  );
}

export function TarjetaEjemplo({
  rotulo = 'Ejemplo',
  mensaje,
  filas,
}: {
  rotulo?: string;
  mensaje: string;
  filas: { color: string; titulo: string; texto: string }[];
}) {
  return (
    <div
      className="w-full max-w-[21rem] rounded-[var(--radius-card)] p-4 text-left"
      style={{ background: 'var(--surface)', boxShadow: 'var(--shadow-card)' }}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--accent)]">{rotulo}</p>
      <p className="mt-2 rounded-[var(--radius-button)] bg-[var(--surface-2)] px-3 py-2 text-[11.5px] leading-snug text-[var(--text-primary)]">
        {mensaje}
      </p>
      <div className="my-3 h-px bg-[color-mix(in_oklab,var(--text-tertiary)_22%,transparent)]" />
      <div className="flex flex-col gap-3">
        {filas.map((f) => (
          <FilaAnalisis key={f.titulo} {...f} />
        ))}
      </div>
    </div>
  );
}

const FILAS_HERO = [
  { color: 'var(--an-eye)', titulo: 'Lo que vemos', texto: 'Dice que no quiere nada y a la vez pide exclusividad.' },
  { color: 'var(--an-risk)', titulo: 'Posible riesgo', texto: 'Sus palabras y sus actos no coinciden.' },
  { color: 'var(--accent)', titulo: 'Qué responder', texto: '«Me gusta verte, pero necesito saber qué somos.»' },
];

export function HeroDemoLuma() {
  return (
    <div className="relative flex flex-col items-center gap-8 bg-[var(--bg)] px-6 py-8 sm:flex-row sm:items-center sm:justify-center sm:gap-10 sm:px-8 sm:py-12">
      <CartaSacerdotisa />
      <TarjetaEjemplo
        mensaje="Él: no quiero nada serio ahora mismo. Pero el finde te veo, ¿no? Y no me gusta que salgas con el grupo ese."
        filas={FILAS_HERO}
      />
    </div>
  );
}
