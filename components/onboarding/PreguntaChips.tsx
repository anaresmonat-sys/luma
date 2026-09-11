'use client';

// Pantalla de pregunta de selección única con chips de ancho completo.
// Auto-avanza 300ms después de marcar el chip (A3 — selección única).

import { useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { ChipOpcion, EscapeHatchInput } from './ui';
import { MarkedCopy } from '@/components/landing/MarkedCopy';

const contenedorChips: Variants = {
  oculto: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const itemChip: Variants = {
  oculto: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
};

export interface OpcionChip {
  id: string;
  emoji: string;
  label: string;
}

export function PreguntaChips({
  pregunta,
  microcopy,
  opciones,
  otraCosa,
  valorInicial,
  skipLabel,
  onSkip,
  onResponder,
}: {
  pregunta: string;
  microcopy?: string;
  opciones: OpcionChip[];
  /** Si existe, agrega el último chip "Otra cosa" con campo de texto propio. */
  otraCosa?: boolean;
  /** Respuesta ya guardada (al volver con "Atrás" a una pregunta ya contestada). */
  valorInicial?: string;
  /** Paso NO crítico (regla 7 de 02B): texto terciario de salida bajo las opciones. */
  skipLabel?: string;
  onSkip?: () => void;
  onResponder: (id: string, labelLibre?: string) => void;
}) {
  const [seleccionado, setSeleccionado] = useState<string | null>(valorInicial ?? null);
  const [mostrarLibre, setMostrarLibre] = useState(false);
  const [textoLibre, setTextoLibre] = useState('');
  const reduce = useReducedMotion();

  function elegir(id: string) {
    if (seleccionado) return;
    if (id === '__otra__') {
      setMostrarLibre(true);
      return;
    }
    setSeleccionado(id);
    window.setTimeout(() => onResponder(id), 300);
  }

  return (
    <div className="flex flex-1 flex-col justify-center">
      <h1 className="text-balance text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--text-primary)] [font-family:var(--font-display)]">
        <MarkedCopy text={pregunta} />
      </h1>
      {microcopy && <p className="mt-2 text-[14px] leading-snug text-[var(--text-secondary)]">{microcopy}</p>}

      <motion.div
        variants={reduce ? undefined : contenedorChips}
        initial={reduce ? undefined : 'oculto'}
        animate={reduce ? undefined : 'visible'}
        className="mt-7 flex flex-col gap-3"
      >
        {opciones.map((op) => (
          <motion.div key={op.id} variants={reduce ? undefined : itemChip}>
            <ChipOpcion
              emoji={op.emoji}
              label={op.label}
              seleccionado={seleccionado === op.id}
              onClick={() => elegir(op.id)}
            />
          </motion.div>
        ))}
        {otraCosa && !mostrarLibre && (
          <motion.div variants={reduce ? undefined : itemChip}>
            <ChipOpcion emoji="✍️" label="Otra cosa (cuéntamelo)" seleccionado={false} onClick={() => elegir('__otra__')} />
          </motion.div>
        )}
        {mostrarLibre && (
          <EscapeHatchInput
            valor={textoLibre}
            onChange={setTextoLibre}
            onContinuar={() => onResponder('__otra__', textoLibre.trim())}
          />
        )}
      </motion.div>

      {skipLabel && onSkip && !seleccionado && !mostrarLibre && (
        <button
          type="button"
          onClick={onSkip}
          className="mt-5 self-center text-[13px] font-medium text-[var(--text-tertiary)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          {skipLabel}
        </button>
      )}
    </div>
  );
}
