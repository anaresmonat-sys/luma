'use client';

// Pregunta de COMPROMISO (commitment device — A6): el usuario fija un número
// que la app reutiliza en el loading y la revelación del plan (el eco es lo
// que convierte el dato en compromiso).

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { MarkedCopy } from '@/components/landing/MarkedCopy';

export function PreguntaSlider({
  pregunta,
  min,
  max,
  inicial,
  sufijo,
  feedback,
  ctaLabel,
  onResponder,
}: {
  pregunta: string;
  min: number;
  max: number;
  inicial: number;
  sufijo: string;
  /** Devuelve el texto de feedback contextual según el valor actual. */
  feedback: (valor: number) => string;
  ctaLabel: string;
  onResponder: (valor: number) => void;
}) {
  const [valor, setValor] = useState(inicial);
  const reduce = useReducedMotion();
  const [mostrado, setMostrado] = useState(reduce ? inicial : min);
  const pct = ((valor - min) / (max - min)) * 100;

  // Conteo héroe al montar (baseline #2): el valor inicial cuenta desde el
  // piso en vez de aparecer estático. Tras el conteo, refleja el arrastre 1:1.
  useEffect(() => {
    if (reduce) return;
    let cancelado = false;
    const pasos = inicial - min;
    if (pasos <= 0) return;
    const duracionMs = 500;
    const porPaso = duracionMs / pasos;
    let actual = min;
    const id = window.setInterval(() => {
      if (cancelado) return;
      actual += 1;
      setMostrado(actual);
      if (actual >= inicial) window.clearInterval(id);
    }, porPaso);
    return () => {
      cancelado = true;
      window.clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onArrastrar(v: number) {
    setValor(v);
    setMostrado(v);
  }

  return (
    <div className="flex flex-1 flex-col justify-center">
      <h1 className="text-balance text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--text-primary)] [font-family:var(--font-display)]">
        <MarkedCopy text={pregunta} />
      </h1>

      <div className="mt-10 flex flex-col items-center">
        <motion.span
          key={mostrado}
          initial={{ opacity: 0.4, y: reduce ? 0 : 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="text-[44px] font-bold leading-none tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]"
        >
          {mostrado}
        </motion.span>
        <span className="mt-1 text-[14px] text-[var(--text-secondary)]">{sufijo}</span>

        <div className="mt-8 w-full px-2">
          <input
            type="range"
            min={min}
            max={max}
            step={1}
            value={valor}
            onChange={(e) => onArrastrar(Number(e.target.value))}
            className="onboarding-slider h-8 w-full cursor-pointer appearance-none bg-transparent"
            style={{ ['--slider-pct' as string]: `${pct}%` }}
            aria-label={pregunta}
          />
          <div className="mt-1 flex justify-between text-[12px] text-[var(--text-tertiary)]">
            <span>{min}</span>
            <span>{max}</span>
          </div>
        </div>

        <p className="mt-6 text-center text-[14px] font-medium text-[var(--accent)]">{feedback(valor)}</p>
      </div>

      <div className="mt-10">
        <motion.button
          type="button"
          onClick={() => onResponder(valor)}
          whileTap={{ scale: 0.97 }}
          className="flex h-[52px] w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] [touch-action:manipulation] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          {ctaLabel}
        </motion.button>
      </div>
    </div>
  );
}
