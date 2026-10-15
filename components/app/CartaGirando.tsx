'use client';

// La carta del día del Inicio, como un gesto simbólico: aparece boca abajo (el reverso del mazo de LUMA),
// se da la vuelta sola y deja ver la carta. Sin texto, sin significado y sin que haya que tocarla: es
// ambiente, no función (la lectura con su explicación vive en Tarot → Carta del día).
// Con "reducir movimiento" la carta se muestra ya descubierta.

import { motion, useReducedMotion } from 'motion/react';

const RETARDO_S = 0.9;

export function CartaGirando({ imagen, invertida = false }: { imagen?: string; invertida?: boolean }) {
  const reducir = useReducedMotion();

  const tamano =
    'h-[15rem] w-[8.75rem] [@media(min-height:721px)_and_(max-height:840px)]:h-[12rem] [@media(min-height:721px)_and_(max-height:840px)]:w-[7rem] [@media(min-height:621px)_and_(max-height:720px)]:h-[10rem] [@media(min-height:621px)_and_(max-height:720px)]:w-[5.9rem] [@media(max-height:620px)]:h-[7.5rem] [@media(max-height:620px)]:w-[4.4rem]';

  return (
    <div className="relative flex shrink-0 items-center justify-center" style={{ perspective: '900px' }} aria-hidden="true">
      {/* resplandor que respira detrás de la carta */}
      <motion.div
        className="absolute left-1/2 top-1/2 -z-10 h-[15rem] w-[15rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[2.5rem]"
        style={{
          background:
            'radial-gradient(circle, var(--accent), color-mix(in oklab, var(--accent-2) 60%, transparent) 55%, transparent 72%)',
        }}
        animate={reducir ? { opacity: 0.5 } : { opacity: [0.35, 0.6, 0.35], scale: [1, 1.08, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* flota suavemente */}
      <motion.div
        animate={reducir ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* se da la vuelta una sola vez */}
        <motion.div
          className={`relative ${tamano}`}
          style={{ transformStyle: 'preserve-3d' }}
          initial={reducir ? false : { rotateY: 0, rotateZ: 0 }}
          animate={{ rotateY: 180, rotateZ: -3 }}
          transition={reducir ? { duration: 0 } : { delay: RETARDO_S, duration: 1.5, ease: [0.45, 0.05, 0.25, 1] }}
        >
          {/* reverso del mazo */}
          <div
            className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-[var(--radius-button)]"
            style={{
              backfaceVisibility: 'hidden',
              background: 'linear-gradient(160deg, color-mix(in oklab, var(--bloom-vino) 80%, var(--bg)), var(--bg) 78%)',
              boxShadow:
                '0 30px 44px -14px rgb(10 5 8 / 0.7), 0 12px 18px -8px rgb(10 5 8 / 0.5), inset 0 0 0 1.5px color-mix(in oklab, var(--accent-lite) 85%, transparent)',
            }}
          >
            <span
              className="absolute inset-2 rounded-xl"
              style={{ border: '1px solid color-mix(in oklab, var(--accent-lite) 45%, transparent)' }}
            />
            <span
              className="absolute inset-4 rounded-lg"
              style={{ border: '1px solid color-mix(in oklab, var(--accent-lite) 22%, transparent)' }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/luma-icon.png" alt="" className="relative h-[34%] w-auto brightness-125 drop-shadow-[0_0_14px_rgba(224,176,92,0.6)]" />
          </div>

          {/* cara de la carta */}
          <div
            className="absolute inset-0 overflow-hidden rounded-[var(--radius-button)]"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: 'linear-gradient(160deg, var(--card-paper), var(--card-paper-2))',
              boxShadow:
                '0 30px 44px -14px rgb(10 5 8 / 0.6), 0 12px 18px -8px rgb(10 5 8 / 0.45), inset 0 1px 0 rgb(255 255 255 / 0.55), inset 0 0 0 1px rgb(255 255 255 / 0.28)',
            }}
          >
            {imagen && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imagen}
                alt=""
                className="size-full object-cover"
                style={{ transform: invertida ? 'rotate(180deg)' : undefined }}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
