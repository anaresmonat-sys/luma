'use client';

// APP INTERNA — COACH / chat con LUMA (blueprint: vista-previa-app.html frame 5,
// aprobado). Conectado a IA real vía /api/coach (patrón BFF — la clave vive en
// el servidor). LUMA = la tarotista/coach (persona, FICHA-ARTE). El primer
// mensaje real es gratis (lib/prueba-gratis.ts); al segundo se manda a elegir
// un plan antes de seguir la conversación.

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { LumaAvatar } from '@/components/app/LumaAvatar';
import type { MensajeCoach } from '@/lib/seed-datos';
import { aperturaCoach } from '@/lib/coach-saludo';
import { leerRespuestas } from '@/lib/almacenamiento-onboarding';
import { pruebaGratisDisponible, consumirPruebaGratis } from '@/lib/prueba-gratis';
import { leerYLimpiarMensajePendiente } from '@/lib/almacenamiento-coach';
import { leerMapaPoder } from '@/lib/almacenamiento-numerologia';

export default function CoachPage() {
  const [hilo, setHilo] = useState<MensajeCoach[]>([]);
  const [apertura, setApertura] = useState(() => aperturaCoach(undefined, undefined));
  const [texto, setTexto] = useState('');
  const chatRef = useRef<HTMLDivElement | null>(null);
  const [escribiendo, setEscribiendo] = useState(false);
  const [avisoVoz, setAvisoVoz] = useState(false);
  const [error, setError] = useState(false);

  // El hilo arranca vacío: LUMA abre con un saludo según el motivo elegido en el
  // onboarding (y el nombre del Mapa de Poder, si existe). Si llega un mensaje
  // real pendiente (ej. desde "¿Qué podría responderle?" en Descifrar), se
  // prellena la caja. Se lee en efecto, no en el estado inicial: localStorage es
  // client-only y leerlo de forma síncrona en el primer render rompe la
  // hidratación (mismo problema ya resuelto en /paywall).
  useEffect(() => {
    setApertura(aperturaCoach(leerRespuestas()?.motivo, leerMapaPoder()?.nombre));
    const pendiente = leerYLimpiarMensajePendiente();
    if (pendiente) setTexto(pendiente);
  }, []);

  // Mantiene visible lo último de la charla al llegar un mensaje o la respuesta de LUMA.
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [hilo, escribiendo, error]);

  function tocarMic() {
    setAvisoVoz(true);
    window.setTimeout(() => setAvisoVoz(false), 2200);
  }

  async function pedirRespuesta(hiloActual: MensajeCoach[]) {
    try {
      const mapaPoder = leerMapaPoder();
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          perfil: mapaPoder
            ? {
                nombre: mapaPoder.nombre,
                signo: mapaPoder.signoNombre,
                arcano: mapaPoder.arcanoNombre,
                numeroAlma: mapaPoder.numeroAlma,
                patronSombra: mapaPoder.puntoCiego,
              }
            : undefined,
          messages: hiloActual.map((m) => ({
            role: m.autor === 'yo' ? 'user' : 'assistant',
            content: m.texto,
          })),
        }),
      });
      if (!res.ok) throw new Error('respuesta no OK');
      const datos: { texto?: string } = await res.json();
      if (!datos.texto) throw new Error('sin texto');
      setHilo((h) => [...h, { id: crypto.randomUUID(), autor: 'luma', texto: datos.texto! }]);
      setEscribiendo(false);
    } catch {
      setError(true);
      setEscribiendo(false);
    }
  }

  function enviar(contenido: string) {
    const texto = contenido.trim();
    if (!texto) return;
    if (!pruebaGratisDisponible()) {
      window.location.href = '/paywall';
      return;
    }
    consumirPruebaGratis();
    const mensaje: MensajeCoach = { id: crypto.randomUUID(), autor: 'yo', texto };
    const nuevoHilo = [...hilo, mensaje];
    setHilo(nuevoHilo);
    setTexto('');
    setError(false);
    setEscribiendo(true);
    void pedirRespuesta(nuevoHilo);
  }

  function reintentar() {
    setError(false);
    setEscribiendo(true);
    void pedirRespuesta(hilo);
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col pb-3 pt-3">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 60% 36dvh at 50% 22%, color-mix(in oklab, var(--bloom-vino) 23%, transparent), transparent 66%), ' +
            'radial-gradient(ellipse 60% 40dvh at 50% 96%, color-mix(in oklab, var(--bloom-vino) 25%, transparent), transparent 72%)',
        }}
      />
      <div className="flex shrink-0 items-center justify-between py-2">
        <Link href="/app" aria-label="Volver" className="flex size-11 shrink-0 items-center justify-center text-[var(--text-primary)]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <div className="flex flex-1 items-center gap-2.5">
          <LumaAvatar size={34} />
          <div>
            <p className="text-[14px] font-semibold text-[var(--accent-lite)]">LUMA</p>
            <p className="text-[11px] text-[var(--text-secondary)]">tu tarotista y coach</p>
          </div>
        </div>
      </div>

      <div ref={chatRef} role="log" aria-live="polite" className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto py-2">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="max-w-[82%] self-start rounded-[15px_15px_15px_5px] border border-[color-mix(in_oklab,var(--accent)_24%,transparent)] bg-[var(--surface)] px-3 py-2.5 text-[14px] leading-snug text-[var(--text-primary)]"
        >
          {apertura.saludo}
        </motion.div>

        <AnimatePresence>
          {hilo.map((m, i) =>
            m.autor === 'yo' ? (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                className="max-w-[82%] self-end rounded-[15px_15px_5px_15px] border border-[color-mix(in_oklab,var(--accent)_25%,transparent)] bg-[color-mix(in_oklab,var(--accent)_16%,transparent)] px-3 py-2.5 text-[14px] leading-snug text-[var(--text-primary)]"
              >
                {m.texto}
                {m.hora && <span className="mt-1 block text-right text-[11px] text-[var(--text-tertiary)]">{m.hora}</span>}
              </motion.div>
            ) : (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                className="max-w-[82%] self-start rounded-[15px_15px_15px_5px] border border-[color-mix(in_oklab,var(--accent)_24%,transparent)] bg-[var(--surface)] px-3 py-2.5 text-[14px] leading-snug text-[var(--text-primary)]"
              >
                {m.texto}
              </motion.div>
            )
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 self-start rounded-[15px_15px_15px_5px] border border-[color-mix(in_oklab,var(--an-risk)_45%,transparent)] bg-[color-mix(in_oklab,var(--an-risk)_14%,transparent)] px-3 py-2.5 text-[13px] text-[var(--text-primary)]"
            >
              No se pudo enviar.
              <button type="button" onClick={reintentar} className="font-bold text-[var(--accent-lite)] underline">
                Reintentar
              </button>
            </motion.div>
          )}
        </AnimatePresence>

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

        {!escribiendo && hilo.length === 0 && (
          <div className="flex flex-col items-start gap-2 pt-1">
            {apertura.arranques.map((r) => (
              <motion.button
                key={r}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => setTexto(r + ' ')}
                className="rounded-full border border-[color-mix(in_oklab,var(--accent)_34%,transparent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] px-3 py-2 text-left text-[12.5px] font-semibold text-[var(--accent-lite)]"
              >
                {r}
              </motion.button>
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
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={tocarMic}
          aria-label="Grabar nota de voz"
          className="flex size-12 shrink-0 items-center justify-center rounded-full text-[15px] text-[var(--accent-lite)]"
        >
          🎤
        </motion.button>
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Cuéntame qué pasó…"
          aria-label="Mensaje para LUMA"
          className="h-11 flex-1 bg-transparent text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none"
        />
        <motion.button
          whileTap={texto.trim() ? { scale: 0.9 } : undefined}
          type="submit"
          disabled={!texto.trim()}
          aria-label="Enviar mensaje"
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[var(--accent-lite)] to-[var(--accent)] text-[var(--on-accent)] disabled:opacity-50"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 2 11 13M22 2l-7 20-4-9-9-4Z" />
          </svg>
        </motion.button>
      </form>
    </div>
  );
}
