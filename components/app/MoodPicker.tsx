'use client';

// Fila de emociones (FICHA-ARTE §dispositivo ownable #2): aro fino + emoji + color
// propio por emoción, funcional (marca selección) no decorativo. Reutilizada en
// Inicio (check-in del día) y Diario (registro emocional) con distintos sets.

import { motion, useReducedMotion } from 'motion/react';

export interface Emocion {
  id: string;
  emoji: string;
  label: string;
  /** Token de color CSS, ej. 'var(--mood-bien)'. */
  color: string;
}

export function MoodPicker({
  emociones,
  seleccion,
  onSeleccionar,
  bloqueado = false,
  pulso = 0,
}: {
  emociones: Emocion[];
  seleccion: string | null;
  onSeleccionar: (id: string) => void;
  /** Mientras se guarda: no admite más toques (cada toque guardaría un registro nuevo). */
  bloqueado?: boolean;
  /** Sube cada vez que se confirma un guardado: el aro elegido da un pequeño pulso (celebración mínima). */
  pulso?: number;
}) {
  const reducir = useReducedMotion();
  return (
    <div className="flex justify-between gap-1" role="radiogroup" aria-label="¿Cómo te sientes?" aria-busy={bloqueado}>
      {emociones.map((e) => {
        const sel = e.id === seleccion;
        return (
          <button
            key={e.id}
            type="button"
            role="radio"
            aria-checked={sel}
            disabled={bloqueado}
            onClick={() => onSeleccionar(e.id)}
            className={`flex flex-col items-center gap-1.5 text-[12px] font-semibold transition-colors duration-150 disabled:cursor-wait ${
              sel ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
            }`}
          >
            <motion.span
              key={sel ? `${e.id}-${pulso}` : e.id}
              animate={sel && pulso > 0 && !reducir ? { scale: [1, 1.18, 1] } : undefined}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              whileTap={{ scale: 0.92 }}
              className="flex size-11 items-center justify-center rounded-full text-[20px] leading-none"
              style={{
                border: `2px solid color-mix(in oklab, ${e.color} ${sel ? '100%' : '55%'}, transparent)`,
                background: `color-mix(in oklab, ${e.color} ${sel ? '24%' : '12%'}, transparent)`,
                boxShadow: sel ? `0 0 12px -3px color-mix(in oklab, ${e.color} 55%, transparent)` : 'none',
              }}
              aria-hidden="true"
            >
              {e.emoji}
            </motion.span>
            {e.label}
          </button>
        );
      })}
    </div>
  );
}
