'use client';

// APP INTERNA — COACH / chat con LUMA (blueprint: vista-previa-app.html frame 5,
// aprobado). Sin IA real aún (Sesión 6): al enviar, LUMA responde con un acuse
// breve tras un "escribiendo…" — dejando el LOOP de conversación probable sin
// fingir inteligencia real. LUMA = la tarotista/coach (persona, FICHA-ARTE).

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { LumaAvatar } from '@/components/app/LumaAvatar';
import { HILO_COACH_EJEMPLO, RESPUESTAS_RAPIDAS_COACH, type MensajeCoach } from '@/lib/seed-datos';

export default function CoachPage() {
  const [hilo, setHilo] = useState<MensajeCoach[]>(HILO_COACH_EJEMPLO);
  const [texto, setTexto] = useState('');
  const [escribiendo, setEscribiendo] = useState(false);
  const [avisoVoz, setAvisoVoz] = useState(false);

  function tocarMic() {
    setAvisoVoz(true);
    window.setTimeout(() => setAvisoVoz(false), 2200);
  }

  function enviar(contenido: string) {
    if (!contenido.trim()) return;
    const mensaje: MensajeCoach = { id: crypto.randomUUID(), autor: 'yo', texto: contenido.trim() };
    setHilo((h) => [...h, mensaje]);
    setTexto('');
    setEscribiendo(true);
    window.setTimeout(() => {
      setHilo((h) => [
        ...h,
        {
          id: crypto.randomUUID(),
          autor: 'luma',
          texto: 'Te escucho. Vamos paso a paso — cuéntame un poco más de lo que sientes ahora mismo.',
        },
      ]);
      setEscribiendo(false);
    }, 1100);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col pb-3 pt-3">
      <div className="flex shrink-0 items-center justify-between py-2">
        <Link href="/app" aria-label="Volver" className="flex size-11 shrink-0 items-center justify-center text-[var(--text-primary)]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <div className="flex flex-1 items-center gap-2.5">
          <LumaAvatar size={34} />
          <div>
            <p className="text-[14px] font-semibold text-[var(--text-primary)]">LUMA</p>
            <p className="text-[11px] text-[var(--text-secondary)]">tu tarotista y coach</p>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-end gap-3 overflow-y-auto py-2">
        {hilo.map((m) =>
          m.autor === 'yo' ? (
            <div
              key={m.id}
              className="max-w-[82%] self-end rounded-[15px_15px_5px_15px] border border-[color-mix(in_oklab,var(--accent)_25%,transparent)] bg-[color-mix(in_oklab,var(--accent)_16%,transparent)] px-3 py-2.5 text-[13px] leading-snug text-[var(--text-primary)]"
            >
              {m.texto}
              {m.hora && <span className="mt-1 block text-right text-[11px] text-[var(--text-tertiary)]">{m.hora}</span>}
            </div>
          ) : (
            <div
              key={m.id}
              className="max-w-[82%] self-start rounded-[15px_15px_15px_5px] border border-[color-mix(in_oklab,var(--accent)_24%,transparent)] bg-[var(--surface)] px-3 py-2.5 text-[13px] leading-snug text-[var(--text-primary)]"
            >
              {m.texto}
            </div>
          )
        )}

        <AnimatePresence>
          {escribiendo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="self-start rounded-[15px_15px_15px_5px] border border-[color-mix(in_oklab,var(--accent)_24%,transparent)] bg-[var(--surface)] px-3 py-2.5 text-[12px] text-[var(--text-tertiary)]"
            >
              LUMA está escribiendo…
            </motion.div>
          )}
        </AnimatePresence>

        {!escribiendo && hilo.length <= HILO_COACH_EJEMPLO.length && (
          <div className="flex flex-col items-start gap-2 pt-1">
            {RESPUESTAS_RAPIDAS_COACH.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => enviar(r)}
                className="rounded-full border border-[color-mix(in_oklab,var(--accent)_34%,transparent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] px-3 py-2 text-[11.5px] font-semibold text-[var(--accent-lite)]"
              >
                {r}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="h-4 shrink-0">
        <AnimatePresence>
          {avisoVoz && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[11px] font-semibold text-[var(--accent-lite)]"
            >
              Próximamente: nota de voz
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          enviar(texto);
        }}
        className="flex shrink-0 items-center gap-1.5 rounded-full border border-[color-mix(in_oklab,var(--accent)_34%,transparent)] bg-[var(--surface-2)] py-1 pl-2 pr-1"
      >
        <button
          type="button"
          onClick={tocarMic}
          aria-label="Grabar nota de voz"
          className="flex size-11 shrink-0 items-center justify-center rounded-full text-[15px] text-[var(--accent-lite)]"
        >
          🎤
        </button>
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe un mensaje…"
          aria-label="Mensaje para LUMA"
          className="h-11 flex-1 bg-transparent text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none"
        />
        <button
          type="submit"
          disabled={!texto.trim()}
          aria-label="Enviar mensaje"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[var(--accent-lite)] to-[var(--accent)] text-[var(--on-accent)] disabled:opacity-50"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 2 11 13M22 2l-7 20-4-9-9-4Z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
