'use client';

// APP INTERNA — DIARIO EMOCIONAL (blueprint: vista-previa-app.html frame 7,
// aprobado). Check-in + registro libre + reflexión generada por IA real vía
// /api/diario (antes mostraba SIEMPRE la misma frase fija sin importar lo que
// la usuaria escribiera — defecto real reportado por el usuario en la
// auditoría 2026-09-18). El ícono de calendario y "Ver mi patrón" abren V2 (no
// construido aún: "Próximamente" honesto en vez de fingir que funciona — 11),
// igual que el mic.

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenHeader } from '@/components/app/ScreenHeader';
import { AppButton } from '@/components/app/AppButton';
import { MoodPicker } from '@/components/app/MoodPicker';
import { EMOCIONES_DIARIO, ENTRADA_DIARIO_EJEMPLO } from '@/lib/seed-datos';
import { leerYLimpiarEntradaPendiente } from '@/lib/almacenamiento-diario';
import { pruebaGratisDisponible, consumirPruebaGratis } from '@/lib/prueba-gratis';

const CLAVE_ULTIMO_PATRON = 'luma_diario_ultimo_patron';

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
  const [trajoLectura, setTrajoLectura] = useState(false);
  const [errorVacio, setErrorVacio] = useState(false);
  const [registros, setRegistros] = useState(0);
  const [registrosMostrados, setRegistrosMostrados] = useState(0);
  const [patron, setPatron] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [errorPatron, setErrorPatron] = useState(false);

  useEffect(() => {
    const pendiente = leerYLimpiarEntradaPendiente();
    if (pendiente) {
      setTexto(pendiente);
      setTrajoLectura(true);
    }
    try {
      setRegistros(Number(window.localStorage.getItem('luma_diario_contador') ?? 0));
      setPatron(window.localStorage.getItem(CLAVE_ULTIMO_PATRON));
    } catch {
      // localStorage puede fallar (modo privado, cuota) — no bloquea el flujo.
    }
  }, []);

  useEffect(() => {
    if (registros === 0) {
      setRegistrosMostrados(0);
      return;
    }
    const prefiereReducido = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefiereReducido) {
      setRegistrosMostrados(registros);
      return;
    }
    const inicio = performance.now();
    const duracion = 700;
    let cuadro: number;
    function paso(ahora: number) {
      const progreso = Math.min(1, (ahora - inicio) / duracion);
      setRegistrosMostrados(Math.round(progreso * registros));
      if (progreso < 1) cuadro = requestAnimationFrame(paso);
    }
    cuadro = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(cuadro);
  }, [registros]);

  async function guardar() {
    if (!texto.trim()) {
      setErrorVacio(true);
      window.setTimeout(() => setErrorVacio(false), 2200);
      return;
    }
    if (!pruebaGratisDisponible()) {
      window.location.href = '/paywall';
      return;
    }
    setGuardando(true);
    setErrorPatron(false);
    try {
      const res = await fetch('/api/diario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto, animo }),
      });
      if (!res.ok) throw new Error('respuesta no OK');
      const datos: { patron?: string } = await res.json();
      if (!datos.patron) throw new Error('sin patrón');
      consumirPruebaGratis();
      setPatron(datos.patron);
      try {
        window.localStorage.setItem(CLAVE_ULTIMO_PATRON, datos.patron);
      } catch {
        // ver nota de abajo.
      }
    } catch {
      setErrorPatron(true);
    }
    setGuardando(false);
    try {
      window.localStorage.setItem('luma_diario_ultima_entrada', JSON.stringify({ texto, animo, fecha: Date.now() }));
      const nuevoContador = registros + 1;
      window.localStorage.setItem('luma_diario_contador', String(nuevoContador));
      setRegistros(nuevoContador);
    } catch {
      // localStorage puede fallar (modo privado, cuota) — no bloquea el flujo.
    }
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
            'radial-gradient(480px 30dvh at 50% 78%, color-mix(in oklab, var(--bloom-vino) 36%, transparent), transparent 68%), ' +
            'radial-gradient(480px 34dvh at 50% 100%, color-mix(in oklab, var(--bloom-vino) 40%, transparent), transparent 70%)',
        }}
      />

      <motion.div variants={contenedor} initial="hidden" animate="visible" className="flex flex-col">
        <motion.div variants={item}>
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
        </motion.div>
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

        {trajoLectura && (
          <motion.p
            variants={item}
            className="mt-3 rounded-full bg-[color-mix(in_oklab,var(--accent)_14%,transparent)] px-3 py-2 text-center text-[11px] font-semibold text-[var(--accent-lite)]"
          >
            Trajimos tu lectura de tarot — edítala y guarda cuando quieras
          </motion.p>
        )}

        <motion.div
          variants={item}
          className="mt-4 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface-2)] p-3"
        >
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') guardar();
            }}
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
          <AppButton onClick={guardar} disabled={guardando} busy={guardando}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={guardado ? 'ok' : guardando ? 'guardando' : 'guardar'}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {guardado ? 'Guardado ✓' : guardando ? 'Guardando…' : 'Guardar'}
              </motion.span>
            </AnimatePresence>
          </AppButton>
          <div className="mt-1.5 h-4 text-center">
            <AnimatePresence>
              {errorVacio && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[11px] font-semibold text-[var(--an-risk)]">
                  Escribe algo antes de guardar
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {patron && (
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
              <span className="font-bold text-[var(--accent-lite)]">LUMA:</span> {patron}
            </p>
          </motion.div>
        )}

        {errorPatron && (
          <motion.p variants={item} className="mt-4 text-center text-[11px] font-semibold text-[var(--an-risk)]">
            Guardamos tu registro, pero no pudimos generar la reflexión esta vez.
          </motion.p>
        )}

        <motion.button
          variants={item}
          type="button"
          onClick={() => tocarProximamente('Próximamente: tu patrón completo')}
          className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_45%,transparent)] text-[12.5px] font-bold text-[var(--accent-lite)]"
        >
          Ver mi patrón →
        </motion.button>

        {registros > 0 ? (
          <motion.div
            variants={item}
            className="mt-8 flex flex-col items-center gap-1 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface)] px-4 py-5 text-center"
          >
            <span className="text-[28px] font-bold tabular-nums text-[var(--accent-lite)] [font-family:var(--font-display)]">
              {registrosMostrados}
            </span>
            <span className="text-[11px] leading-relaxed text-[var(--text-secondary)]">
              {registros === 1 ? 'registro guardado en tu diario' : 'registros guardados en tu diario'}
            </span>
          </motion.div>
        ) : (
          <motion.p variants={item} className="mt-8 text-center text-[11px] leading-relaxed text-[var(--text-tertiary)]">
            💡 Escribir aunque sean 2 líneas ayuda a que LUMA vea tus patrones con el tiempo.
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
