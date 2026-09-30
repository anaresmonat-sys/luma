'use client';

// Las preguntas antes del primer mensaje del Coach (idea del usuario,
// 2026-09-30: "que sepa de la persona, sutil, fácil de responder"). Pregunta 1
// es el NOMBRE (pedido explícito del usuario: "como pregunta número 1 y que
// la coach la responda con un saludo afectuoso") — si ya lo sabemos por el
// Mapa de Poder, se salta este paso. Luego 5 de Sí/No por área de vida (amor,
// dinero, salud, trabajo, apoyo). Se responde una sola vez.

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LumaAvatar } from '@/components/app/LumaAvatar';
import { guardarContextoCoach, type ContextoCoach } from '@/lib/almacenamiento-contexto-coach';

const PREGUNTAS: Array<{ clave: keyof Omit<ContextoCoach, 'nombre'>; texto: string }> = [
  { clave: 'pareja', texto: '¿Tienes pareja ahora mismo?' },
  { clave: 'dineroPreocupa', texto: '¿El dinero es algo que te preocupa últimamente?' },
  { clave: 'saludBien', texto: '¿Sientes que has estado cuidando bien tu salud últimamente?' },
  { clave: 'trabajoLlena', texto: '¿Sientes que lo que haces día a día te llena?' },
  { clave: 'apoyo', texto: '¿Sientes que tienes con quién hablar cuando algo te pesa?' },
];

function primerNombre(nombre: string): string {
  const limpio = nombre.trim().split(/\s+/)[0] ?? '';
  return limpio.charAt(0).toUpperCase() + limpio.slice(1);
}

export function ContextoCoachPaso({
  nombrePrellenado,
  onListo,
}: {
  nombrePrellenado?: string;
  onListo: (contexto: ContextoCoach) => void;
}) {
  const [etapa, setEtapa] = useState<'nombre' | 'saludo' | 'preguntas'>(nombrePrellenado ? 'preguntas' : 'nombre');
  const [nombreCampo, setNombreCampo] = useState('');
  const [nombreFinal, setNombreFinal] = useState(nombrePrellenado ?? '');
  const [respuestas, setRespuestas] = useState<Partial<Record<keyof Omit<ContextoCoach, 'nombre'>, boolean>>>({});

  const totalPreguntas = PREGUNTAS.length;
  const contestadas = Object.keys(respuestas).length;

  function confirmarNombre() {
    const limpio = nombreCampo.trim();
    if (!limpio) return;
    setNombreFinal(primerNombre(limpio));
    setEtapa('saludo');
    window.setTimeout(() => setEtapa('preguntas'), 1600);
  }

  function responder(clave: keyof Omit<ContextoCoach, 'nombre'>, valor: boolean) {
    const siguiente = { ...respuestas, [clave]: valor };
    setRespuestas(siguiente);
    if (Object.keys(siguiente).length === totalPreguntas) {
      const completo = { ...(siguiente as Omit<ContextoCoach, 'nombre'>), nombre: nombreFinal || undefined };
      guardarContextoCoach(completo);
      onListo(completo);
    }
  }

  function omitir() {
    onListo({
      nombre: nombreFinal || undefined,
      pareja: false,
      dineroPreocupa: false,
      saludBien: true,
      trabajoLlena: true,
      apoyo: true,
    });
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-2 py-8 text-center">
      <AnimatePresence mode="wait">
        {etapa === 'nombre' && (
          <motion.div
            key="nombre"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex w-full max-w-xs flex-col items-center"
          >
            <span aria-hidden="true" className="text-3xl">💬</span>
            <h1 className="mt-4 text-xl font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
              Antes de empezar, ¿cómo te llamas?
            </h1>
            <p className="mt-2 text-sm leading-snug text-[var(--text-secondary)]">
              Así puedo dirigirme a ti como se debe, de persona a persona.
            </p>
            <input
              value={nombreCampo}
              onChange={(e) => setNombreCampo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && confirmarNombre()}
              placeholder="Tu nombre"
              aria-label="Tu nombre"
              autoFocus
              className="mt-6 h-12 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_34%,transparent)] bg-[var(--surface-2)] px-4 text-center text-base text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none"
            />
            <button
              type="button"
              onClick={confirmarNombre}
              disabled={!nombreCampo.trim()}
              className="mt-4 flex h-12 w-full items-center justify-center rounded-[var(--radius-button)] bg-gradient-to-b from-[var(--accent-lite)] to-[var(--accent)] text-sm font-semibold text-[var(--on-accent)] disabled:opacity-50"
            >
              Continuar
            </button>
            <button
              type="button"
              onClick={omitir}
              className="mt-4 flex min-h-11 items-center px-3 text-xs font-medium text-[var(--text-tertiary)] underline-offset-4 hover:underline"
            >
              Prefiero saltarme esto
            </button>
          </motion.div>
        )}

        {etapa === 'saludo' && (
          <motion.div
            key="saludo"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex w-full max-w-xs flex-col items-center"
          >
            <LumaAvatar size={56} />
            <p className="mt-4 text-lg font-semibold text-[var(--text-primary)] [font-family:var(--font-display)]">
              Un placer conocerte, {nombreFinal} 💛
            </p>
            <p className="mt-2 text-sm leading-snug text-[var(--text-secondary)]">
              Ahora sí, déjame conocerte un poco más antes de empezar.
            </p>
          </motion.div>
        )}

        {etapa === 'preguntas' && (
          <motion.div
            key="preguntas"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="flex w-full max-w-xs flex-col items-center"
          >
            <span aria-hidden="true" className="text-3xl">✨</span>
            <h1 className="mt-4 text-xl font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
              {nombreFinal ? `${nombreFinal}, cuéntame un poco de ti` : 'Conozcámonos un poco'}
            </h1>
            <p className="mt-2 text-sm leading-snug text-[var(--text-secondary)]">
              5 preguntas rápidas de Sí o No, para que mis respuestas se ajusten mejor a tu momento. Nadie más las ve.
            </p>

            <div className="mt-8 flex w-full flex-col gap-4">
              {PREGUNTAS.map((p, i) => {
                const yaRespondida = respuestas[p.clave] !== undefined;
                const esActual = i === contestadas;
                if (i > contestadas) return null;
                return (
                  <motion.div
                    key={p.clave}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`rounded-[var(--radius-card)] border p-4 text-left ${
                      esActual
                        ? 'border-[color-mix(in_oklab,var(--accent)_45%,transparent)] bg-[var(--surface)]'
                        : 'border-[color-mix(in_oklab,var(--accent)_18%,transparent)] bg-transparent opacity-60'
                    }`}
                  >
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{p.texto}</p>
                    {esActual && !yaRespondida ? (
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => responder(p.clave, true)}
                          className="flex h-10 flex-1 items-center justify-center rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_45%,transparent)] text-sm font-semibold text-[var(--accent-lite)]"
                        >
                          Sí
                        </button>
                        <button
                          type="button"
                          onClick={() => responder(p.clave, false)}
                          className="flex h-10 flex-1 items-center justify-center rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] text-sm font-semibold text-[var(--text-secondary)]"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      yaRespondida && (
                        <p className="mt-1 text-xs font-semibold text-[var(--accent-lite)]">
                          {respuestas[p.clave] ? 'Sí' : 'No'}
                        </p>
                      )
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-4 flex w-full items-center gap-2">
              {PREGUNTAS.map((p, i) => (
                <span
                  key={p.clave}
                  className={`h-1.5 flex-1 rounded-full ${i < contestadas ? 'bg-[var(--accent)]' : 'bg-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)]'}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={omitir}
              className="mt-4 flex min-h-11 items-center px-3 text-xs font-medium text-[var(--text-tertiary)] underline-offset-4 hover:underline"
            >
              Prefiero saltarme esto
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
