'use client';

// APP INTERNA — DIARIO EMOCIONAL (blueprint: vista-previa-app.html frame 7,
// aprobado). Check-in + registro libre + detección de patrón (dato semilla — el
// cálculo real de patrones sobre el historial llega con backend, Sesión 6). El
// ícono de calendario abre el historial en V2 (no construido aún: "Próximamente"
// honesto en vez de fingir que funciona — 11).

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenHeader } from '@/components/app/ScreenHeader';
import { AppButton } from '@/components/app/AppButton';
import { MoodPicker } from '@/components/app/MoodPicker';
import { EMOCIONES_DIARIO, ENTRADA_DIARIO_EJEMPLO, PATRON_DIARIO_EJEMPLO } from '@/lib/seed-datos';

export default function DiarioPage() {
  const [animo, setAnimo] = useState<string | null>('tranquila');
  const [texto, setTexto] = useState('');
  const [guardado, setGuardado] = useState(false);
  const [avisoCalendario, setAvisoCalendario] = useState(false);

  function guardar() {
    setGuardado(true);
    window.setTimeout(() => setGuardado(false), 2200);
  }

  function tocarCalendario() {
    setAvisoCalendario(true);
    window.setTimeout(() => setAvisoCalendario(false), 2200);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-4 pt-3">
      <ScreenHeader
        titulo="Diario emocional"
        volverHref="/app"
        derecha={
          <button
            type="button"
            onClick={tocarCalendario}
            aria-label="Historial del diario"
            className="flex size-11 items-center justify-center text-[16px]"
          >
            📅
          </button>
        }
      />

      <div className="h-4 shrink-0 text-center">
        <AnimatePresence>
          {avisoCalendario && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[11px] font-semibold text-[var(--accent-lite)]">
              Próximamente: historial de tu diario
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--accent)]">¿Cómo te sientes hoy?</p>

      <div className="mt-3">
        <MoodPicker emociones={EMOCIONES_DIARIO} seleccion={animo} onSeleccionar={setAnimo} />
      </div>

      <div className="mt-4 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface-2)] p-3">
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={ENTRADA_DIARIO_EJEMPLO}
          rows={4}
          className="w-full resize-none bg-transparent text-[13px] leading-relaxed text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none"
        />
        <div className="mt-2 flex items-center justify-between">
          <button
            type="button"
            aria-label="Grabar nota de voz"
            className="flex size-11 items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[color-mix(in_oklab,var(--accent)_15%,transparent)] text-[15px]"
          >
            🎤
          </button>
          <span className="text-[11px] text-[var(--text-tertiary)]">o cuéntalo en voz alta</span>
        </div>
      </div>

      <div className="mt-3">
        <AppButton onClick={guardar}>{guardado ? 'Guardado ✓' : 'Guardar'}</AppButton>
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] p-3">
        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_22%,transparent)] text-[13px] text-[var(--accent-lite)]"
        >
          ⚠️
        </span>
        <p className="text-[11.5px] leading-relaxed text-[var(--text-primary)]">
          <span className="font-bold text-[var(--accent-lite)]">LUMA:</span> {PATRON_DIARIO_EJEMPLO}
        </p>
      </div>

      <button
        type="button"
        className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_45%,transparent)] text-[12.5px] font-bold text-[var(--accent-lite)]"
      >
        Ver mi patrón →
      </button>
    </div>
  );
}
