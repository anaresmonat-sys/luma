'use client';

// APP INTERNA — DESCIFRA LA CONVERSACIÓN (blueprint: vista-previa-app.html frame 4,
// aprobado). La función estrella. Sin nav inferior (flujo dedicado, no es pestaña).
// Sin backend aún (Sesión 6 conecta IA real): "Analizar" simula el análisis con un
// breve loading y muestra el resultado de ejemplo — deja el LOOP completo probable
// sin fingir que ya hay IA real. Captura/Voz muestran "Próximamente" honesto (11:
// nunca un elemento tocable sin respuesta) hasta que OCR/voz→texto estén conectados.
// El CTA "Analizar" NUNCA se deshabilita (ancla de craft): si el texto es muy corto
// para decir algo real, se explica por qué en vez de apagar el botón.

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenHeader } from '@/components/app/ScreenHeader';
import { AppButton, AppLinkButton } from '@/components/app/AppButton';
import { CONVERSACION_EJEMPLO, ANALISIS_EJEMPLO } from '@/lib/seed-datos';

type Modo = 'texto' | 'captura' | 'voz';
type Estado = 'reposo' | 'cargando' | 'error' | 'resultado';

const MIN_CARACTERES = 15;

const MODOS: { id: Modo; emoji: string; label: string }[] = [
  { id: 'texto', emoji: '📋', label: 'Pega texto' },
  { id: 'captura', emoji: '📸', label: 'Captura' },
  { id: 'voz', emoji: '🎤', label: 'Voz' },
];

const contenedor = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

export default function DescifrarPage() {
  const [modo, setModo] = useState<Modo>('texto');
  const [texto, setTexto] = useState('');
  const [estado, setEstado] = useState<Estado>('reposo');

  function analizar() {
    if (texto.trim().length < MIN_CARACTERES) {
      setEstado('error');
      return;
    }
    setEstado('cargando');
    window.setTimeout(() => setEstado('resultado'), 900);
  }

  return (
    <div className="relative flex min-h-dvh flex-col px-5 pb-6 pt-3">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/4 -z-10 h-[30rem]"
        style={{
          background:
            'radial-gradient(520px 380px at 50% 45%, color-mix(in oklab, var(--bloom-vino) 55%, transparent), transparent 68%)',
        }}
      />
      <ScreenHeader titulo="Descifra la conversación" tituloDisplay />

      <div className="flex flex-1 flex-col justify-center">
        <div className="grid grid-cols-3 gap-2">
          {MODOS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setModo(m.id)}
              aria-pressed={modo === m.id}
              className={`flex flex-col items-center gap-1 rounded-[var(--radius-button)] border py-2.5 text-[11px] font-semibold transition-colors duration-150 ${
                modo === m.id
                  ? 'border-[color-mix(in_oklab,var(--accent)_70%,transparent)] bg-[color-mix(in_oklab,var(--accent)_14%,transparent)] text-[var(--accent-lite)]'
                  : 'border-[color-mix(in_oklab,var(--accent)_28%,transparent)] text-[var(--text-secondary)]'
              }`}
            >
              <span className="text-[17px] leading-none" aria-hidden="true">
                {m.emoji}
              </span>
              {m.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {modo === 'texto' ? (
            <motion.div
              key="texto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mt-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface-2)] p-3">
                <textarea
                  value={texto}
                  onChange={(e) => {
                    setTexto(e.target.value);
                    if (estado !== 'cargando') setEstado('reposo');
                  }}
                  placeholder="Pega aquí la conversación…"
                  rows={4}
                  className="w-full resize-none bg-transparent text-[13px] leading-relaxed text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none"
                />
                <div className="mt-2 flex items-center justify-between">
                  <button
                    type="button"
                    aria-label="Grabar nota de voz"
                    onClick={() => setModo('voz')}
                    className="flex size-11 items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[color-mix(in_oklab,var(--accent)_15%,transparent)] text-[15px]"
                  >
                    🎤
                  </button>
                  <span className="text-[11px] text-[var(--text-tertiary)]">o mantén pulsado para hablar</span>
                </div>
              </div>

              <AnimatePresence>
                {estado === 'error' && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 overflow-hidden text-[11px] font-semibold leading-snug text-[var(--an-risk)]"
                  >
                    Necesito un poco más de contexto — pega al menos un par de mensajes.
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="mt-3">
                <AppButton onClick={analizar} disabled={estado === 'cargando'}>
                  {estado === 'cargando' ? 'Analizando…' : 'Analizar'}
                </AppButton>
              </div>

              {texto.trim() === '' && (
                <button
                  type="button"
                  onClick={() => {
                    setTexto(CONVERSACION_EJEMPLO);
                    setEstado('reposo');
                  }}
                  className="mt-2 self-start text-[11px] font-semibold text-[var(--accent-lite)]"
                >
                  Probar con un ejemplo
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="otro-modo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 flex flex-col items-center gap-2 rounded-[var(--radius-card)] border border-dashed border-[color-mix(in_oklab,var(--accent)_35%,transparent)] px-4 py-10 text-center"
            >
              <span className="text-[26px]" aria-hidden="true">
                {modo === 'captura' ? '📸' : '🎤'}
              </span>
              <p className="text-[13px] font-semibold text-[var(--text-primary)]">Próximamente</p>
              <p className="text-[11.5px] text-[var(--text-secondary)]">
                {modo === 'captura'
                  ? 'Vas a poder subir una captura del chat y LUMA la va a leer por ti.'
                  : 'Vas a poder contarlo en voz alta y LUMA lo transcribe por ti.'}
              </p>
              <button type="button" onClick={() => setModo('texto')} className="mt-1 text-[11px] font-bold text-[var(--accent-lite)]">
                Volver a pegar texto
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {estado === 'resultado' && (
            <motion.div
              variants={contenedor}
              initial="hidden"
              animate="visible"
              className="mt-6 flex flex-col gap-4"
            >
              <motion.p
                variants={item}
                className="text-[15px] font-semibold text-[var(--text-primary)] [font-family:var(--font-display)]"
              >
                Lo que hemos detectado
              </motion.p>
              {ANALISIS_EJEMPLO.map((a) => (
                <motion.div key={a.id} variants={item} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="flex size-8 shrink-0 items-center justify-center rounded-full text-[15px]"
                    style={{
                      background: `color-mix(in oklab, ${a.color} 24%, transparent)`,
                      border: `1px solid color-mix(in oklab, ${a.color} 55%, transparent)`,
                      boxShadow: `0 0 16px -4px color-mix(in oklab, ${a.color} 55%, transparent)`,
                    }}
                  >
                    {a.emoji}
                  </span>
                  <div>
                    <h3 className="text-[11px] font-bold text-[var(--text-primary)]">{a.titulo}</h3>
                    <p className="mt-0.5 text-[11.5px] leading-snug text-[var(--text-secondary)]">{a.texto}</p>
                  </div>
                </motion.div>
              ))}
              <motion.div variants={item} className="mt-1 flex flex-col gap-2">
                <AppLinkButton href="/app/tarot">Explorar con tarot</AppLinkButton>
                <Link
                  href="/app/coach"
                  className="flex h-[46px] w-full items-center justify-center rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_45%,transparent)] text-[13px] font-semibold text-[var(--accent-lite)]"
                >
                  ¿Qué podría responderle?
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
