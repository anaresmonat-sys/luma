'use client';

// Bienvenida de quien acaba de comprar (o ya tiene acceso completo): dos pasos, una sola vez.
// 1) cómo quiere que la llame (nombre o apodo) → 2) por dónde quiere empezar.
// Antes de pagar no se pregunta nada (decisión de la dueña, 2026-10-13: cada pregunta es
// fricción); después de pagar, la bienvenida activa a la persona y personaliza el saludo.
//
// Dónde vive el dato: metadatos de la propia cuenta (auth.user_metadata.apodo / bienvenida_hecha),
// sin tablas nuevas. `profiles.nombre` se deja intacto: lo usa la numerología con el nombre completo.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { BookOpen, MessageCircle, Search, Sparkles } from 'lucide-react';
import { crearClienteNavegador } from '@/lib/supabase/client';
import { OPCIONES_AYUDA, type OpcionAyuda } from '@/app/onboarding/flujo';

const CLAVE_LOCAL = 'luma_bienvenida_hecha';
const MAX_NOMBRE = 30;

const ICONOS: Record<OpcionAyuda, typeof Search> = {
  analizar: Search,
  tarot: Sparkles,
  coach: MessageCircle,
  diario: BookOpen,
};
const ORDEN: OpcionAyuda[] = ['analizar', 'tarot', 'coach', 'diario'];
const TITULOS: Record<OpcionAyuda, string> = {
  analizar: 'Descifrar una conversación',
  tarot: 'Una tirada de tarot',
  coach: 'Hablar con LUMA',
  diario: 'Escribir en mi diario',
};

function limpiarNombre(valor: string): string {
  return valor.replace(/[\u0000-\u001f\u007f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, MAX_NOMBRE);
}

export function BienvenidaCompra({ onNombre }: { onNombre?: (nombre: string) => void }) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [paso, setPaso] = useState<'nombre' | 'camino'>('nombre');
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

  async function guardar(datos: Record<string, unknown>) {
    try {
      await crearClienteNavegador().auth.updateUser({ data: datos });
    } catch {
      // si falla la cuenta, queda el respaldo local de abajo y no se bloquea a la persona.
    }
  }

  function marcarHecha() {
    try {
      window.localStorage.setItem(CLAVE_LOCAL, '1');
    } catch {
      // ídem.
    }
    void guardar({ bienvenida_hecha: true });
  }

  function continuarNombre() {
    const limpio = limpiarNombre(nombre);
    if (!limpio) {
      setAviso(true);
      return;
    }
    onNombre?.(limpio);
    void guardar({ apodo: limpio });
    setPaso('camino');
  }

  function elegir(id: OpcionAyuda) {
    marcarHecha();
    setVisible(false);
    router.push(OPCIONES_AYUDA[id].ruta);
  }

  function cerrar() {
    marcarHecha();
    setVisible(false);
  }

  if (!visible) return null;

  const nombreLimpio = limpiarNombre(nombre);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Bienvenida a LUMA"
      className="fixed inset-0 z-50 flex justify-center overflow-y-auto bg-[var(--bg)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 40dvh at 50% 20%, color-mix(in oklab, var(--bloom-vino) 34%, transparent), transparent 70%), ' +
            'radial-gradient(ellipse 60% 30dvh at 50% 100%, color-mix(in oklab, var(--bloom-vino) 24%, transparent), transparent 72%)',
        }}
      />
      <motion.div
        key={paso}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex min-h-dvh w-full max-w-[480px] flex-col px-6 pb-8 pt-12"
      >
        <p className="text-center text-xs font-semibold tracking-widest text-[var(--accent-lite)]">BIENVENIDA A LUMA</p>

        {paso === 'nombre' ? (
          <>
            <h1 className="mt-8 text-center text-[32px] font-semibold leading-tight text-[var(--text-primary)] [font-family:var(--font-display)]">
              ¿Cómo quieres que te llame?
            </h1>
            <p className="mt-3 text-center text-base text-[var(--text-secondary)]">Puede ser tu nombre o un apodo.</p>

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
                if (e.key === 'Enter') continuarNombre();
              }}
              autoComplete="given-name"
              autoCapitalize="words"
              placeholder="Tu nombre"
              className="mt-8 h-14 w-full rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_45%,transparent)] bg-[var(--surface-2)] px-4 text-center text-lg text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            />
            <p role="status" className="mt-2 h-5 text-center text-xs font-semibold text-[var(--an-risk)]">
              {aviso ? 'Escribe cómo quieres que te llame.' : ''}
            </p>

            <div className="mt-auto flex flex-col items-center gap-2 pt-8">
              <button
                type="button"
                onClick={continuarNombre}
                className="h-12 w-full rounded-[var(--radius-button)] bg-gradient-to-b from-[var(--accent-lite)] to-[var(--accent)] text-base font-bold text-[var(--on-accent)] [touch-action:manipulation]"
              >
                Continuar
              </button>
              <button
                type="button"
                onClick={() => setPaso('camino')}
                className="min-h-11 px-4 text-xs font-semibold text-[var(--text-secondary)] underline underline-offset-2"
              >
                Prefiero no decirlo
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="mt-8 text-center text-[32px] font-semibold leading-tight text-[var(--text-primary)] [font-family:var(--font-display)]">
              {nombreLimpio ? `Qué bien tenerte aquí, ${nombreLimpio}` : 'Qué bien tenerte aquí'}
            </h1>
            <p className="mt-3 text-center text-base text-[var(--text-secondary)]">¿Por dónde quieres empezar?</p>

            <div className="mt-8 flex flex-col gap-3">
              {ORDEN.map((id) => {
                const Icono = ICONOS[id];
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => elegir(id)}
                    className="flex min-h-[64px] w-full items-center gap-4 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_35%,transparent)] bg-[var(--surface-2)] px-4 text-left [touch-action:manipulation] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  >
                    <span
                      aria-hidden="true"
                      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)] text-[var(--accent-lite)]"
                    >
                      <Icono size={20} strokeWidth={1.75} />
                    </span>
                    <span className="text-base font-semibold text-[var(--text-primary)]">{TITULOS[id]}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-auto flex justify-center pt-8">
              <button
                type="button"
                onClick={cerrar}
                className="min-h-11 px-4 text-xs font-semibold text-[var(--text-secondary)] underline underline-offset-2"
              >
                Prefiero verlo yo
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
