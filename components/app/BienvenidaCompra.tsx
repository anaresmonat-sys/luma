'use client';

// Bienvenida de quien acaba de comprar (o ya tiene acceso completo): UN solo momento, una sola vez.
// Una antesala: el emblema de LUMA con su halo, "¿Cómo quieres que te llame?" y, al responder,
// un saludo con su nombre que se funde con el Inicio. Sin segundo paso: la persona ya compró y
// lo que quiere es ENTRAR (decisión de la dueña, 2026-10-15).
//
// Antes de pagar no se pregunta nada (decisión 2026-10-13: cada pregunta es fricción).
// Dónde vive el dato: metadatos de la propia cuenta (auth.user_metadata.apodo / bienvenida_hecha),
// sin tablas nuevas. `profiles.nombre` se deja intacto: lo usa la numerología con el nombre completo.

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { crearClienteNavegador } from '@/lib/supabase/client';

const CLAVE_LOCAL = 'luma_bienvenida_hecha';
const MAX_NOMBRE = 30;
const DURACION_SALUDO_MS = 2400;

// Motas de luz doradas: posiciones fijas (sin azar) para que el servidor y el navegador coincidan.
const MOTAS = [
  { x: 12, y: 18, t: 7, d: 0 },
  { x: 82, y: 12, t: 9, d: 1.2 },
  { x: 30, y: 34, t: 8, d: 2.1 },
  { x: 68, y: 40, t: 10, d: 0.6 },
  { x: 90, y: 58, t: 7, d: 1.8 },
  { x: 8, y: 66, t: 9, d: 2.6 },
  { x: 48, y: 78, t: 8, d: 0.9 },
  { x: 76, y: 84, t: 10, d: 1.5 },
  { x: 22, y: 90, t: 7, d: 2.3 },
] as const;

const MARCAS = Array.from({ length: 24 }, (_, i) => i);

function limpiarNombre(valor: string): string {
  return valor.replace(/[\u0000-\u001f\u007f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, MAX_NOMBRE);
}

function Emblema({ latido }: { latido: boolean }) {
  return (
    <div className="relative flex size-56 items-center justify-center" aria-hidden="true">
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(closest-side, color-mix(in oklab, var(--accent-lite) 38%, transparent), transparent 72%)',
        }}
        animate={latido ? { scale: [1, 1.16, 1], opacity: [0.75, 1, 0.75] } : undefined}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.svg
        viewBox="0 0 216 216"
        className="absolute inset-0 size-full"
        animate={latido ? { rotate: 360 } : undefined}
        transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
      >
        <circle cx="108" cy="108" r="104" fill="none" stroke="var(--accent-lite)" strokeOpacity="0.45" strokeWidth="1" />
        <circle
          cx="108"
          cy="108"
          r="88"
          fill="none"
          stroke="var(--accent-lite)"
          strokeOpacity="0.28"
          strokeWidth="1"
          strokeDasharray="2 7"
        />
        {MARCAS.map((i) => (
          <line
            key={i}
            x1="108"
            y1="4"
            x2="108"
            y2={i % 6 === 0 ? 16 : 10}
            stroke="var(--accent-lite)"
            strokeOpacity={i % 6 === 0 ? 0.85 : 0.4}
            strokeWidth={i % 6 === 0 ? 1.5 : 1}
            transform={`rotate(${i * 15} 108 108)`}
          />
        ))}
      </motion.svg>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/luma-icon.png" alt="" className="relative h-24 w-auto drop-shadow-[0_0_24px_rgba(224,176,92,0.55)]" />
    </div>
  );
}

export function BienvenidaCompra({ onNombre }: { onNombre?: (nombre: string) => void }) {
  const reducir = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [fase, setFase] = useState<'nombre' | 'saludo'>('nombre');
  const [nombre, setNombre] = useState('');
  const [aviso, setAviso] = useState(false);

  useEffect(() => {
    let cancelado = false;
    async function comprobar() {
      try {
        const supabase = crearClienteNavegador();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user || cancelado) return;
        const meta = (user.user_metadata ?? {}) as { apodo?: string; bienvenida_hecha?: boolean };
        if (meta.apodo) onNombre?.(meta.apodo);
        let hechaLocal = false;
        try {
          hechaLocal = window.localStorage.getItem(CLAVE_LOCAL) === '1';
        } catch {
          // sin almacenamiento local: se confía solo en la cuenta.
        }
        if (meta.bienvenida_hecha || hechaLocal) return;
        const res = await fetch('/api/mi-plan');
        const datos: { activo?: boolean } | null = res.ok ? await res.json() : null;
        if (!cancelado && datos?.activo) setVisible(true);
      } catch {
        // sin conexión o sin sesión: la bienvenida simplemente no aparece.
      }
    }
    void comprobar();
    return () => {
      cancelado = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tras el saludo, la pantalla se funde con el Inicio.
  useEffect(() => {
    if (fase !== 'saludo') return;
    const temporizador = window.setTimeout(() => setVisible(false), reducir ? 1200 : DURACION_SALUDO_MS);
    return () => window.clearTimeout(temporizador);
  }, [fase, reducir]);

  async function guardar(datos: Record<string, unknown>) {
    try {
      await crearClienteNavegador().auth.updateUser({ data: datos });
    } catch {
      // si falla la cuenta, queda el respaldo local y no se bloquea a la persona.
    }
  }

  function entrar(conNombre: boolean) {
    const limpio = conNombre ? limpiarNombre(nombre) : '';
    if (conNombre && !limpio) {
      setAviso(true);
      return;
    }
    try {
      window.localStorage.setItem(CLAVE_LOCAL, '1');
    } catch {
      // ídem.
    }
    if (limpio) {
      onNombre?.(limpio);
      void guardar({ apodo: limpio, bienvenida_hecha: true });
    } else {
      void guardar({ bienvenida_hecha: true });
    }
    setNombre(limpio);
    setFase('saludo');
  }

  const nombreFinal = limpiarNombre(nombre);
  const mov = !reducir;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="bienvenida"
          role="dialog"
          aria-modal="true"
          aria-label="Bienvenida a LUMA"
          className="fixed inset-0 z-50 flex justify-center overflow-y-auto bg-[var(--bg)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
            style={{
              background:
                'radial-gradient(ellipse 80% 46dvh at 50% 24%, color-mix(in oklab, var(--bloom-vino) 42%, transparent), transparent 70%), ' +
                'radial-gradient(ellipse 70% 34dvh at 50% 100%, color-mix(in oklab, var(--bloom-vino) 30%, transparent), transparent 72%)',
            }}
          >
            {mov &&
              MOTAS.map((m, i) => (
                <motion.span
                  key={i}
                  className="absolute size-1 rounded-full bg-[var(--accent-lite)]"
                  style={{ left: `${m.x}%`, top: `${m.y}%`, boxShadow: '0 0 8px 1px var(--accent-lite)' }}
                  animate={{ y: [0, -18, 0], opacity: [0.15, 0.85, 0.15] }}
                  transition={{ duration: m.t, delay: m.d, repeat: Infinity, ease: 'easeInOut' }}
                />
              ))}
          </div>

          <div className="relative flex min-h-dvh w-full max-w-[480px] flex-col items-center px-6 pb-8 pt-12">
            <AnimatePresence mode="wait">
              {fase === 'nombre' ? (
                <motion.div
                  key="nombre"
                  className="flex w-full flex-1 flex-col items-center"
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                >
                  <motion.div
                    initial={mov ? { opacity: 0, scale: 0.85 } : false}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Emblema latido={mov} />
                  </motion.div>

                  <motion.p
                    initial={mov ? { opacity: 0, y: 8 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    className="mt-8 text-center text-xs font-semibold tracking-widest text-[var(--accent-lite)]"
                  >
                    ANTES DE EMPEZAR
                  </motion.p>
                  <motion.h1
                    initial={mov ? { opacity: 0, y: 12 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.75 }}
                    className="mt-3 text-center text-[32px] font-semibold leading-tight text-[var(--text-primary)] [font-family:var(--font-display)]"
                  >
                    ¿Cómo quieres que te llame?
                  </motion.h1>

                  <motion.div
                    initial={mov ? { opacity: 0, y: 12 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.05 }}
                    className="mt-8 w-full"
                  >
                    <label htmlFor="bienvenida-nombre" className="sr-only">
                      Tu nombre o apodo
                    </label>
                    <input
                      id="bienvenida-nombre"
                      value={nombre}
                      onChange={(e) => {
                        setNombre(e.target.value.slice(0, MAX_NOMBRE));
                        setAviso(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') entrar(true);
                      }}
                      autoComplete="given-name"
                      autoCapitalize="words"
                      placeholder="Tu nombre"
                      className="h-16 w-full border-0 border-b border-[color-mix(in_oklab,var(--accent-lite)_55%,transparent)] bg-transparent text-center text-[32px] text-[var(--text-primary)] [font-family:var(--font-display)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent-lite)] focus:outline-none focus:[box-shadow:0_14px_24px_-18px_var(--accent-lite)]"
                    />
                    <p className="mt-3 text-center text-sm text-[var(--text-secondary)]">
                      Puede ser tu nombre o un apodo.
                    </p>
                    <p role="status" className="mt-1 h-5 text-center text-sm font-semibold text-[var(--an-risk)]">
                      {aviso ? 'Escribe cómo quieres que te llame.' : ''}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={mov ? { opacity: 0 } : false}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.35 }}
                    className="mt-auto flex w-full flex-col items-center gap-2 pt-8"
                  >
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={() => entrar(true)}
                      className="h-14 w-full rounded-[var(--radius-button)] bg-gradient-to-b from-[var(--accent-lite)] to-[var(--accent)] text-base font-bold text-[var(--on-accent)] shadow-[0_10px_24px_-10px_color-mix(in_oklab,var(--accent)_70%,transparent)] [touch-action:manipulation]"
                    >
                      Entrar a mi espacio
                    </motion.button>
                    <button
                      type="button"
                      onClick={() => entrar(false)}
                      className="min-h-11 px-4 text-sm font-semibold text-[var(--text-secondary)] underline underline-offset-2"
                    >
                      Prefiero no decirlo
                    </button>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="saludo"
                  className="flex w-full flex-1 flex-col items-center justify-center text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.div
                    initial={mov ? { scale: 0.9 } : false}
                    animate={mov ? { scale: [0.9, 1.12] } : undefined}
                    transition={{ duration: 2.2, ease: 'easeOut' }}
                  >
                    <Emblema latido={mov} />
                  </motion.div>
                  <h1 className="mt-8 text-[32px] font-semibold leading-tight text-[var(--text-primary)] [font-family:var(--font-display)]">
                    {nombreFinal ? (
                      <>
                        Hola, <span className="text-[var(--accent-lite)]">{nombreFinal}</span>
                      </>
                    ) : (
                      'Bienvenida'
                    )}
                  </h1>
                  <p className="mt-3 text-base text-[var(--text-secondary)]">Tu espacio ya está listo.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
