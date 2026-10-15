'use client';

// La carta de LUMA del Inicio: un gesto simbólico y de marca. Aparece boca abajo (el reverso del mazo),
// se da la vuelta sola y descubre "la carta de LUMA" — una carta propia, siempre la misma, con la luna,
// el emblema y el nombre. Sin texto explicativo, sin significado y sin que haya que tocarla: es ambiente,
// no función (las lecturas, con su explicación, viven en Tarot). No se parece a ninguna carta real del
// mazo, así que no choca con la Carta del día ni con las tiradas.
// Con "reducir movimiento" la carta se muestra ya descubierta.

import { motion, useReducedMotion } from 'motion/react';

const RETARDO_S = 0.9;

const TAMANO =
  'h-[15rem] w-[8.75rem] [@media(min-height:721px)_and_(max-height:840px)]:h-[12rem] [@media(min-height:721px)_and_(max-height:840px)]:w-[7rem] [@media(min-height:621px)_and_(max-height:720px)]:h-[10rem] [@media(min-height:621px)_and_(max-height:720px)]:w-[5.9rem] [@media(max-height:620px)]:h-[7.5rem] [@media(max-height:620px)]:w-[4.4rem]';

const SOMBRA_REVERSO =
  '0 30px 44px -14px rgb(10 5 8 / 0.7), 0 12px 18px -8px rgb(10 5 8 / 0.5), inset 0 0 0 1.5px color-mix(in oklab, var(--accent-lite) 85%, transparent)';

const DORADO = 'var(--accent-lite)';

function Estrella({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={DORADO} aria-hidden="true">
      <path d="M12 1.5l1.9 7.1 7.1 1.9-7.1 1.9L12 19.5l-1.9-7.1L3 10.5l7.1-1.9z" />
    </svg>
  );
}

export function CartaGirando() {
  const reducir = useReducedMotion();

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
          className={`relative ${TAMANO}`}
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
              boxShadow: SOMBRA_REVERSO,
            }}
          >
            <span className="absolute inset-2 rounded-xl" style={{ border: `1px solid color-mix(in oklab, ${DORADO} 45%, transparent)` }} />
            <span className="absolute inset-4 rounded-lg" style={{ border: `1px solid color-mix(in oklab, ${DORADO} 22%, transparent)` }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/luma-icon.png" alt="" className="relative h-[34%] w-auto brightness-125 drop-shadow-[0_0_14px_rgba(224,176,92,0.6)]" />
          </div>

          {/* la carta de LUMA */}
          <div
            className="absolute inset-0 overflow-hidden rounded-[var(--radius-button)]"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              containerType: 'inline-size',
              background:
                'radial-gradient(ellipse at 50% 42%, color-mix(in oklab, var(--bloom-vino) 92%, var(--accent) 8%), color-mix(in oklab, var(--bloom-vino) 55%, var(--bg)) 55%, var(--bg) 100%)',
              boxShadow: `${SOMBRA_REVERSO}, 0 0 36px -8px color-mix(in oklab, ${DORADO} 55%, transparent)`,
            }}
          >
            <span className="absolute inset-2 rounded-xl" style={{ border: `1px solid color-mix(in oklab, ${DORADO} 60%, transparent)` }} />
            <span className="absolute inset-[0.9rem] rounded-lg" style={{ border: `1px solid color-mix(in oklab, ${DORADO} 26%, transparent)` }} />

            {/* arriba: la luna y dos estrellas */}
            <div className="absolute left-0 right-0 top-[11%] flex items-center justify-center gap-[9%]">
              <Estrella className="w-[7%] opacity-70" />
              <svg viewBox="0 0 24 24" className="w-[17%]" fill="none" stroke={DORADO} strokeWidth="1.6" strokeLinejoin="round">
                <path d="M15.5 3.2a9 9 0 1 0 5.3 14.6A7.6 7.6 0 0 1 15.5 3.2z" fill="color-mix(in oklab, var(--accent-lite) 22%, transparent)" />
              </svg>
              <Estrella className="w-[7%] opacity-70" />
            </div>

            {/* centro: el emblema, con halo */}
            <div className="absolute inset-x-0 top-[26%] flex h-[42%] items-center justify-center">
              <span
                className="absolute size-[70%] rounded-full"
                style={{ background: `radial-gradient(circle, color-mix(in oklab, ${DORADO} 30%, transparent), transparent 70%)` }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/luma-icon.png" alt="" className="relative h-[88%] w-auto brightness-125 drop-shadow-[0_0_14px_rgba(224,176,92,0.65)]" />
            </div>

            {/* abajo: el nombre, como el título de una carta */}
            <div className="absolute inset-x-0 bottom-[10%] flex flex-col items-center gap-[6%]">
              <span className="h-px w-[46%]" style={{ background: `linear-gradient(90deg, transparent, ${DORADO}, transparent)` }} />
              <span
                className="font-semibold uppercase [font-family:var(--font-display)]"
                style={{ color: DORADO, fontSize: '13cqw', letterSpacing: '0.34em', paddingLeft: '0.34em' }}
              >
                Luma
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
