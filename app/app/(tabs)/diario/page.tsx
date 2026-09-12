'use client';

// APP INTERNA — DIARIO EMOCIONAL (blueprint: vista-previa-app.html frame 7,
// aprobado). Check-in + registro libre + detección de patrón (dato semilla — el
// cálculo real de patrones sobre el historial llega con backend, Sesión 6). El
// ícono de calendario y "Ver mi patrón" abren V2 (no construido aún: "Próximamente"
// honesto en vez de fingir que funciona — 11), igual que el mic.

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenHeader } from '@/components/app/ScreenHeader';
import { AppButton } from '@/components/app/AppButton';
import { MoodPicker } from '@/components/app/MoodPicker';
import { EMOCIONES_DIARIO, ENTRADA_DIARIO_EJEMPLO, PATRON_DIARIO_EJEMPLO } from '@/lib/seed-datos';
import { leerYLimpiarEntradaPendiente } from '@/lib/almacenamiento-diario';

const contenedor = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

export default function DiarioPage() {
  const [animo, setAnimo] = useState<string | null>('tranquila');
  const [texto, setTexto] = useState('');
  const [guardado, setGuardado] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  useEffect(() => {
    const pendiente = leerYLimpiarEntradaPendiente();
    if (pendiente) setTexto(pendiente);
  }, []);

  function guardar() {
    if (!texto.trim()) return;
    setGuardado(true);
    window.setTimeout(() => setGuardado(false), 2200);
  }

  function tocarProximamente(mensaje: string) {
    setAviso(mensaje);
    window.setTimeout(() => setAviso(null), 2200);
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto pb-4 pt-3">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(500px 40dvh at 50% 30%, color-mix(in oklab, var(--bloom-vino) 50%, transparent), transparent 68%), ' +
            'radial-gradient(480px 34dvh at 50% 100%, color-mix(in oklab, var(--bloom-vino) 40%, transparent), transparent 70%)',
        }}
      />
      <ScreenHeader
        titulo="Diario emocional"
        volverHref="/app"
        derecha={
          <button
            type="button"
            onClick={() => tocarProximamente('Próximamente: historial de tu diario')}
            aria-label="Historial del diario"
            className="flex size-11 items-center justify-center text-[16px]"
          >
            📅
          </button>
        }
      />

      <motion.div variants={contenedor} initial="hidden" animate="visible" className="flex flex-col">
        <div className="h-4 shrink-0 text-center">
          <AnimatePresence>
            {aviso && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[11px] font-semibold text-[var(--accent-lite)]">
                {aviso}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <motion.p variants={item} className="mt-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--accent)]">
          ¿Cómo te sientes hoy?
        </motion.p>

        <motion.div variants={item} className="mt-3">
          <MoodPicker emociones={EMOCIONES_DIARIO} seleccion={animo} onSeleccionar={setAnimo} />
        </motion.div>

        <motion.div
          variants={item}
          className="mt-4 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface-2)] p-3"
        >
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
              onClick={() => tocarProximamente('Próximamente: nota de voz')}
              className="flex size-11 items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[color-mix(in_oklab,var(--accent)_15%,transparent)] text-[15px]"
            >
              🎤
            </button>
            <span className="text-[11px] text-[var(--text-tertiary)]">o cuéntalo en voz alta</span>
          </div>
        </motion.div>

        <motion.div variants={item} className="mt-3">
          <AppButton onClick={guardar} disabled={!texto.trim()}>
            {guardado ? 'Guardado ✓' : 'Guardar'}
          </AppButton>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-4 flex items-start gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] p-3"
        >
          <span
            aria-hidden="true"
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_22%,transparent)] text-[13px] text-[var(--accent-lite)]"
          >
            ⚠️
          </span>
          <p className="text-[11.5px] leading-relaxed text-[var(--text-primary)]">
            <span className="font-bold text-[var(--accent-lite)]">LUMA:</span> {PATRON_DIARIO_EJEMPLO}
          </p>
        </motion.div>

        <motion.button
          variants={item}
          type="button"
          onClick={() => tocarProximamente('Próximamente: tu patrón completo')}
          className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_45%,transparent)] text-[12.5px] font-bold text-[var(--accent-lite)]"
        >
          Ver mi patrón →
        </motion.button>
      </motion.div>
    </div>
  );
}
