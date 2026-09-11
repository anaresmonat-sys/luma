'use client';

// Pantalla de pregunta de selección única con chips de ancho completo.
// Auto-avanza 300ms después de marcar el chip (A3 — selección única).

import { useState } from 'react';
import { ChipOpcion, EscapeHatchInput } from './ui';

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
  skipLabel,
  onSkip,
  onResponder,
}: {
  pregunta: string;
  microcopy?: string;
  opciones: OpcionChip[];
  /** Si existe, agrega el último chip "Otra cosa" con campo de texto propio. */
  otraCosa?: boolean;
  /** Paso NO crítico (regla 7 de 02B): texto terciario de salida bajo las opciones. */
  skipLabel?: string;
  onSkip?: () => void;
  onResponder: (id: string, labelLibre?: string) => void;
}) {
  const [seleccionado, setSeleccionado] = useState<string | null>(null);
  const [mostrarLibre, setMostrarLibre] = useState(false);
  const [textoLibre, setTextoLibre] = useState('');

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
    <div className="flex flex-1 flex-col">
      <h1 className="text-balance text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--text-primary)] [font-family:var(--font-display)]">
        {pregunta}
      </h1>
      {microcopy && <p className="mt-2 text-[14px] leading-snug text-[var(--text-secondary)]">{microcopy}</p>}

      <div className="mt-7 flex flex-col gap-3">
        {opciones.map((op) => (
          <ChipOpcion
            key={op.id}
            emoji={op.emoji}
            label={op.label}
            seleccionado={seleccionado === op.id}
            onClick={() => elegir(op.id)}
          />
        ))}
        {otraCosa && !mostrarLibre && (
          <ChipOpcion emoji="✍️" label="Otra cosa (cuéntamelo)" seleccionado={false} onClick={() => elegir('__otra__')} />
        )}
        {mostrarLibre && (
          <EscapeHatchInput
            valor={textoLibre}
            onChange={setTextoLibre}
            onContinuar={() => onResponder('__otra__', textoLibre.trim())}
          />
        )}
      </div>

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
