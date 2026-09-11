'use client';

// TIMELINE DEL TRIAL (50 → C4) — el visual DEFAULT de todo paywall CON trial.
// Responde "¿puedo cancelar?" y "¿por qué ahora?" de un vistazo (patrón Blinkist:
// +23% inicios de trial, −55% quejas). La línea se dibuja de arriba a abajo.
// Si este timeline se muestra, NO se duplican los 3 bullets de C4bis aparte —
// los 3 nodos YA son la verdad del puente (02C).

import { motion, useReducedMotion } from 'motion/react';

export function TimelineTrial({ diasPrueba, precioTexto }: { diasPrueba: number; precioTexto: string }) {
  const reduce = useReducedMotion();
  const nodos = [
    { estado: 'hecho' as const, titulo: 'Hoy — acceso completo', detalle: 'Todo LUMA, sin límites' },
    { estado: 'hecho' as const, titulo: `Día ${diasPrueba - 1} — te avisamos`, detalle: 'Aviso antes de cualquier cobro' },
    { estado: 'pendiente' as const, titulo: `Día ${diasPrueba} — 1er cobro: ${precioTexto}`, detalle: 'Cancela antes sin costo' },
  ];

  return (
    <div className="relative flex flex-col gap-5 py-1">
      <motion.div
        aria-hidden="true"
        className="absolute left-[11px] top-3 w-[2px] origin-top bg-[color-mix(in_oklab,var(--accent)_45%,transparent)]"
        initial={{ height: reduce ? '85%' : 0 }}
        animate={{ height: '85%' }}
        transition={{ duration: reduce ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
      {nodos.map((n, i) => (
        <div key={i} className="relative flex items-start gap-3 pl-0">
          <span
            aria-hidden="true"
            className={`z-10 mt-0.5 flex size-[22px] shrink-0 items-center justify-center rounded-full ${
              n.estado === 'hecho' ? 'bg-[var(--accent)]' : 'border-2 border-[var(--accent)] bg-[var(--bg)]'
            }`}
          >
            {n.estado === 'hecho' && <span className="size-2 rounded-full bg-[var(--bg)]" />}
          </span>
          <div>
            <p className="text-[15px] font-semibold text-[var(--text-primary)]">{n.titulo}</p>
            <p className="text-[13px] text-[var(--text-secondary)]">{n.detalle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
