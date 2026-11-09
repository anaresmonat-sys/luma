"use client";

// Pregunta UNA sola vez, dentro de las herramientas, cómo prefiere la persona que le hable LUMA (ella · él · sin género).
// Funciona con o sin cuenta: la elección va a la cookie `luma_trato` (la lee el servidor) y, si hay sesión, también a la
// cuenta. «Ahora no» deja el trato neutro y no vuelve a preguntar; se cambia siempre en Más. No aparece en Inicio ni en
// Más (ver RUTAS) y espera un momento para no competir con la primera carga.

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { crearClienteNavegador } from "@/lib/supabase/client";
import { SelectorTrato } from "@/components/app/SelectorTrato";
import {
  esTrato,
  guardarTratoLocal,
  marcarTratoPreguntado,
  tratoYaPreguntado,
  type Trato,
} from "@/lib/trato";

const RUTAS = [
  "/app/descifrar",
  "/app/tarot",
  "/app/coach",
  "/app/diario",
  "/app/compatibilidad",
  "/app/mapa-poder",
];
const ESPERA_MS = 1400;

export function PreguntaTrato() {
  const ruta = usePathname();
  const reducir = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [elegido, setElegido] = useState<Trato | null>(null);

  const enHerramienta = RUTAS.some((r) => ruta?.startsWith(r));

  useEffect(() => {
    if (!enHerramienta || tratoYaPreguntado()) return;
    let cancelado = false;
    let temporizador: number | undefined;
    (async () => {
      try {
        const {
          data: { user },
        } = await crearClienteNavegador().auth.getUser();
        const meta = user?.user_metadata as { trato?: unknown } | undefined;
        if (esTrato(meta?.trato)) {
          // Ya lo eligió en su cuenta (otro dispositivo): se copia a este navegador y no se pregunta.
          guardarTratoLocal(meta.trato);
          return;
        }
      } catch {
        // sin conexión o sin sesión: se pregunta igual.
      }
      if (cancelado) return;
      temporizador = window.setTimeout(() => {
        if (!cancelado) setVisible(true);
      }, ESPERA_MS);
    })();
    return () => {
      cancelado = true;
      if (temporizador !== undefined) window.clearTimeout(temporizador);
    };
  }, [enHerramienta]);

  async function elegir(trato: Trato) {
    setElegido(trato);
    guardarTratoLocal(trato);
    window.setTimeout(() => setVisible(false), reducir ? 300 : 650);
    try {
      await crearClienteNavegador().auth.updateUser({ data: { trato } });
    } catch {
      // sin sesión o sin conexión: queda guardado en el navegador.
    }
  }

  function ahoraNo() {
    marcarTratoPreguntado();
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && enHerramienta && (
        <motion.div
          role="dialog"
          aria-label="Cómo prefieres que te hable LUMA"
          initial={{ opacity: 0, y: reducir ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reducir ? 0 : 24 }}
          transition={{
            duration: reducir ? 0.15 : 0.3,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[480px] px-4 pb-4"
        >
          <div className="rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_35%,transparent)] bg-[var(--surface-2)] p-4 shadow-[0_-8px_32px_rgba(0,0,0,0.45)]">
            <p className="text-[15px] font-semibold text-[var(--text-primary)]">
              ¿Cómo prefieres que te hable LUMA?
            </p>
            <p className="mt-1 text-[13px] leading-snug text-[var(--text-secondary)]">
              Para tratarte en femenino, masculino o sin género. Lo cambias
              cuando quieras en Más.
            </p>
            <div className="mt-3">
              <SelectorTrato
                valor={elegido}
                onCambio={elegir}
                aria="Cómo prefieres que te hable LUMA"
              />
            </div>
            <button
              type="button"
              onClick={ahoraNo}
              className="mt-2 flex min-h-11 w-full items-center justify-center text-[13px] font-semibold text-[var(--text-secondary)] underline underline-offset-2"
            >
              Ahora no
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
