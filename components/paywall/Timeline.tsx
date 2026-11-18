'use client';

// TIMELINE DEL TRIAL (50 → C4) — el visual DEFAULT de todo paywall CON trial.
// Responde "¿puedo cancelar?" y "¿por qué ahora?" de un vistazo (patrón Blinkist:
// +23% inicios de trial, −55% quejas). La línea se dibuja de arriba a abajo.
// Si este timeline se muestra, NO se duplican los 3 bullets de C4bis aparte —
// los 3 nodos YA son la verdad del puente (02C).

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

const DURACION_CONTEO_MS = 400;

/** Separa «US$89,99/año*» en prefijo, número y sufijo; si no tiene número, devuelve null. */
function partirPrecio(texto: string): { antes: string; valor: number; despues: string } | null {
  const m = texto.match(/^(.*?)(\d+),(\d{2})(.*)$/);
  if (!m) return null;
  return { antes: m[1], valor: Number(`${m[2]}.${m[3]}`), despues: m[4] };
}

/** El precio «cuenta» hasta el nuevo valor cada vez que cambia de plan; con reduced-motion aparece directo. */
function PrecioAnimado({ texto }: { texto: string }) {
  const reduce = useReducedMotion();
  const partes = partirPrecio(texto);
  const destino = partes?.valor ?? null;
  const [mostrado, setMostrado] = useState(destino ?? 0);
  const actual = useRef(destino ?? 0);

  useEffect(() => {
    if (destino === null) return;
    if (reduce) {
      actual.current = destino;
      setMostrado(destino);
      return;
    }
    const desde = actual.current;
    if (desde === destino) return;
    const t0 = performance.now();
    let raf = 0;
    const paso = (t: number) => {
      const k = Math.min(1, (t - t0) / DURACION_CONTEO_MS);
      const suave = 1 - Math.pow(1 - k, 3);
      actual.current = desde + (destino - desde) * suave;
      setMostrado(actual.current);
      if (k < 1) raf = window.requestAnimationFrame(paso);
    };
    raf = window.requestAnimationFrame(paso);
    return () => window.cancelAnimationFrame(raf);
  }, [destino, reduce]);

  if (!partes) return <>{texto}</>;
  return (
    <span className="inline-block tabular-nums">
      {partes.antes}
      {mostrado.toFixed(2).replace('.', ',')}
      {partes.despues}
    </span>
  );
}

export function TimelineTrial({ diasPrueba, precioTexto }: { diasPrueba: number; precioTexto: string }) {
  const reduce = useReducedMotion();
  const nodos = [
    { estado: 'hecho' as const, titulo: 'Hoy — acceso completo', detalle: 'Todo LUMA, desde hoy' },
    // Honesto: no se promete ningún aviso por correo mientras no exista (2026-10-18). Solo lo que es cierto: no se cobra nada durante la prueba y se puede cancelar.
    { estado: 'hecho' as const, titulo: `Hasta el día ${diasPrueba} — sin cobro`, detalle: `Cancela cuando quieras: sigues con tu prueba hasta el día ${diasPrueba}` },
    { estado: 'pendiente' as const, titulo: (
        <>
          Día {diasPrueba} — 1er cobro: <PrecioAnimado texto={precioTexto} />
        </>
      ), detalle: 'Si no cancelas antes' },
  ];

  return (
    <div className="relative flex flex-col gap-5 py-1">
      {nodos.map((n, i) => (
        <div key={i} className="relative flex items-start gap-3 pl-0">
          {/* Tramo de línea del círculo al siguiente: termina EXACTAMENTE en el último punto (sin cabo suelto) */}
          {i < nodos.length - 1 && (
            <motion.span
              aria-hidden="true"
              className="absolute left-[11px] top-[24px] -bottom-[22px] w-[2px] origin-top bg-[color-mix(in_oklab,var(--accent)_45%,transparent)]"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : i * 0.25, ease: [0.16, 1, 0.3, 1] }}
            />
          )}
          <span
            aria-hidden="true"
            className={`z-10 mt-0.5 flex size-[22px] shrink-0 items-center justify-center rounded-full ${
              n.estado === 'hecho' ? 'bg-[var(--accent)]' : 'border-2 border-[var(--accent)] bg-[var(--bg)]'
            }`}
          >
            {n.estado === 'hecho' && <span className="size-2 rounded-full bg-[var(--bg)]" />}
          </span>
          <div>
            <p className="text-[15px] font-semibold text-[var(--text-primary)]">{n.titulo}</p>
            <p className="text-sm text-[var(--text-secondary)]">{n.detalle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
