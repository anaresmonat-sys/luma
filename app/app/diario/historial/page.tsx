'use client';

// APP INTERNA — HISTORIAL DEL DIARIO. Construida por pedido explícito del
// usuario, 2026-09-29 ("prefiero que lo construyas antes de vender"): antes el
// botón de calendario de /app/diario era un "Próximamente" honesto, porque el
// diario no guardaba nada en la base de datos (defecto real corregido en
// app/api/diario/route.ts, mismo día). Navegación día por día con fechas
// reales, nunca solo "hoy" (regla UX #13 — no es una vista de calendario si no
// se puede ver el pasado).

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ScreenHeader } from '@/components/app/ScreenHeader';
import { EMOCIONES_DIARIO } from '@/lib/seed-datos';

interface EntradaHistorial {
  id: string;
  texto: string;
  animo: string | null;
  patron: string | null;
  created_at: string;
}

function claveDeFecha(fecha: Date): string {
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
}

function tituloDeFecha(fecha: Date): string {
  const hoy = claveDeFecha(new Date());
  const ayer = claveDeFecha(new Date(Date.now() - 86_400_000));
  const clave = claveDeFecha(fecha);
  if (clave === hoy) return 'Hoy';
  if (clave === ayer) return 'Ayer';
  return fecha.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' });
}

function emojiDeAnimo(id: string | null): string {
  return EMOCIONES_DIARIO.find((e) => e.id === id)?.emoji ?? '📝';
}

export default function HistorialDiarioPage() {
  const [fecha, setFecha] = useState(() => new Date());
  const [entradas, setEntradas] = useState<EntradaHistorial[]>([]);
  const [diasConEntradas, setDiasConEntradas] = useState<Set<string>>(new Set());
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  const cargar = useCallback(async (f: Date) => {
    setCargando(true);
    setError(false);
    try {
      const res = await fetch(`/api/diario/historial?fecha=${claveDeFecha(f)}`);
      if (!res.ok) throw new Error('respuesta no OK');
      const datos: { entradas: EntradaHistorial[]; diasConEntradas: string[] } = await res.json();
      setEntradas(datos.entradas);
      setDiasConEntradas(new Set(datos.diasConEntradas));
    } catch {
      setError(true);
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    cargar(fecha);
  }, [fecha, cargar]);

  const clave = claveDeFecha(fecha);
  const esHoy = clave === claveDeFecha(new Date());
  const hayAlgunaEntrada = diasConEntradas.size > 0;

  return (
    <div className="flex min-h-dvh flex-col px-5 pb-6 pt-3 [font-family:var(--font-body)]">
      <ScreenHeader titulo="Historial" volverHref="/app/diario" />

      {/* Navegación entre días — regla UX #13: fechas reales, nunca solo "hoy" */}
      <div className="mt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setFecha((f) => new Date(f.getTime() - 86_400_000))}
          aria-label="Día anterior"
          className="flex size-11 items-center justify-center rounded-[var(--radius-button)] text-[var(--text-secondary)]"
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <p className="text-[15px] font-semibold capitalize text-[var(--text-primary)] [font-family:var(--font-display)]">
          {tituloDeFecha(fecha)}
        </p>
        <button
          type="button"
          onClick={() => setFecha((f) => new Date(f.getTime() + 86_400_000))}
          aria-label="Día siguiente"
          disabled={esHoy}
          className="flex size-11 items-center justify-center rounded-[var(--radius-button)] text-[var(--text-secondary)] disabled:opacity-30"
        >
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-5 flex flex-1 flex-col">
        {cargando && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-[13px] text-[var(--text-tertiary)]">Cargando…</p>
          </div>
        )}

        {!cargando && error && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
            <p className="text-[13px] font-semibold text-[var(--text-primary)]">No se pudo cargar tu historial</p>
            <button type="button" onClick={() => cargar(fecha)} className="text-[13px] font-semibold text-[var(--accent-lite)] underline-offset-4 hover:underline">
              Reintentar
            </button>
          </div>
        )}

        {!cargando && !error && entradas.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-1.5 px-4 text-center">
            <span aria-hidden="true" className="text-[28px]">🕊️</span>
            <p className="text-[13.5px] font-semibold text-[var(--text-primary)]">
              {esHoy ? 'Todavía no escribiste hoy' : 'Sin registro este día'}
            </p>
            {!hayAlgunaEntrada && esHoy && (
              <p className="max-w-[240px] text-[12px] leading-snug text-[var(--text-tertiary)]">
                Cuando guardes tu primera entrada en el diario, va a aparecer aquí.
              </p>
            )}
          </div>
        )}

        {!cargando && !error && entradas.length > 0 && (
          <AnimatePresence mode="popLayout">
            <motion.ul
              key={clave}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-3"
            >
              {entradas.map((e) => (
                <li
                  key={e.id}
                  className="rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_22%,transparent)] bg-[var(--surface)] p-4"
                >
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true" className="text-[17px] leading-none">
                      {emojiDeAnimo(e.animo)}
                    </span>
                    <span className="text-[11px] font-semibold text-[var(--text-tertiary)]">
                      {new Date(e.created_at).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--text-primary)]">{e.texto}</p>
                  {e.patron && (
                    <p className="mt-2.5 border-t border-[color-mix(in_oklab,var(--accent)_16%,transparent)] pt-2.5 text-[12.5px] leading-relaxed text-[var(--text-secondary)]">
                      <span className="font-semibold text-[var(--accent-lite)]">LUMA:</span> {e.patron}
                    </p>
                  )}
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
