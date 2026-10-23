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
import { leerContextoCoach } from '@/lib/almacenamiento-contexto-coach';
import { leerMapaPoder } from '@/lib/almacenamiento-numerologia';

const CLAVE_LOCAL = 'luma_bienvenida_hecha';
const MAX_NOMBRE = 30;
const DURACION_SALUDO_MS = 2400;

// Motas de luz doradas: posiciones fijas (sin azar) para que el servidor y el navegador coincidan.
// "g" = tamaño (px) del punto; el brillo (resplandor) crece con él.
const MOTAS = [
  { x: 10, y: 14, t: 6, d: 0, g: 6 },
  { x: 84, y: 10, t: 8, d: 1.2, g: 5 },
  { x: 26, y: 30, t: 7, d: 2.1, g: 4 },
  { x: 72, y: 26, t: 9, d: 0.6, g: 7 },
  { x: 92, y: 48, t: 6, d: 1.8, g: 5 },
  { x: 6, y: 54, t: 8, d: 2.6, g: 6 },
  { x: 18, y: 72, t: 7, d: 0.9, g: 4 },
  { x: 50, y: 82, t: 9, d: 1.5, g: 6 },
  { x: 80, y: 74, t: 6, d: 2.3, g: 7 },
  { x: 36, y: 92, t: 8, d: 0.3, g: 5 },
  { x: 62, y: 6, t: 7, d: 1.9, g: 4 },
  { x: 94, y: 88, t: 9, d: 0.8, g: 5 },
  { x: 4, y: 90, t: 6, d: 2.8, g: 4 },
  { x: 56, y: 58, t: 10, d: 1.1, g: 4 },
] as const;

function limpiarNombre(valor: string): string {
  return valor.replace(/[\u0000-\u001f\u007f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, MAX_NOMBRE);
}

/** La carta de LUMA flotando: reverso del mazo (ciruela, doble marco dorado, emblema) con balanceo 3D,
 *  un destello que la cruza y un resplandor que respira debajo. */
function CartaFlotante({ vivo }: { vivo: boolean }) {
  return (
    <div className="relative flex h-[272px] w-full items-center justify-center" aria-hidden="true" style={{ perspective: '900px' }}>
      <motion.div
        className="absolute size-[260px] rounded-full"
        style={{
          background:
            'radial-gradient(closest-side, color-mix(in oklab, var(--accent-lite) 46%, transparent), transparent 72%)',
        }}
        animate={vivo ? { scale: [1, 1.18, 1], opacity: [0.7, 1, 0.7] } : undefined}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1 h-4 w-28 rounded-full blur-md"
        style={{ background: 'color-mix(in oklab, var(--accent-lite) 55%, transparent)' }}
        animate={vivo ? { scaleX: [1, 0.75, 1], opacity: [0.55, 0.25, 0.55] } : undefined}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="relative flex h-[232px] w-[148px] items-center justify-center overflow-hidden rounded-2xl"
        style={{
          transformStyle: 'preserve-3d',
          background: 'linear-gradient(160deg, color-mix(in oklab, var(--bloom-vino) 80%, var(--bg)), var(--bg) 78%)',
          boxShadow:
            '0 24px 36px -16px rgb(10 5 8 / 0.85), 0 0 40px -6px color-mix(in oklab, var(--accent-lite) 55%, transparent), inset 0 1px 0 rgb(255 255 255 / 0.28), inset 0 0 0 1.5px color-mix(in oklab, var(--accent-lite) 90%, transparent)',
        }}
        animate={vivo ? { y: [0, -14, 0], rotateZ: [-3, 3, -3], rotateY: [-12, 12, -12] } : undefined}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span
          className="absolute inset-2 rounded-xl"
          style={{ border: '1px solid color-mix(in oklab, var(--accent-lite) 50%, transparent)' }}
        />
        <span
          className="absolute inset-4 rounded-lg"
          style={{ border: '1px solid color-mix(in oklab, var(--accent-lite) 24%, transparent)' }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/luma-icon.png" alt="" className="relative h-24 w-auto brightness-125 drop-shadow-[0_0_18px_rgba(224,176,92,0.7)]" />
        {vivo && (
          <motion.span
            className="absolute inset-y-0 -left-1/2 w-1/2"
            style={{ background: 'linear-gradient(105deg, transparent 20%, rgb(255 255 255 / 0.32) 50%, transparent 80%)' }}
            animate={{ x: ['0%', '420%'] }}
            transition={{ duration: 3.4, repeat: Infinity, repeatDelay: 2.2, ease: 'easeInOut' }}
          />
        )}
      </motion.div>
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
        if (!cancelado && datos?.activo) {
          // Si la persona ya dijo su nombre antes (al Coach, en su lectura gratis, o en el Mapa de Poder),
          // llega escrito: solo tiene que confirmarlo.
          try {
            const previo = leerContextoCoach()?.nombre ?? leerMapaPoder()?.nombre ?? '';
            const primero = previo.trim().split(/s+/)[0] ?? '';
            if (primero) setNombre(limpiarNombre(primero));
          } catch {
            // sin almacenamiento local: el campo queda vacío.
          }
          setVisible(true);
        }
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
                  className="absolute rounded-full bg-[var(--accent-lite)]"
                  style={{
                    left: `${m.x}%`,
                    top: `${m.y}%`,
                    width: m.g,
                    height: m.g,
                    boxShadow: `0 0 ${m.g * 3}px ${m.g / 2}px var(--accent-lite)`,
                  }}
                  animate={{ y: [0, -22, 0], x: [0, 6, 0], opacity: [0.35, 1, 0.35] }}
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
                    <CartaFlotante vivo={mov} />
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
                    <CartaFlotante vivo={mov} />
                  </motion.div>
                  <h1 className="mt-8 text-[32px] font-semibold leading-tight text-[var(--text-primary)] [font-family:var(--font-display)]">
                    {nombreFinal ? (
                      <>
                        Hola, <span className="text-[var(--accent-lite)]">{nombreFinal}</span>
                      </>
                    ) : (
                      'Te damos la bienvenida'
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
