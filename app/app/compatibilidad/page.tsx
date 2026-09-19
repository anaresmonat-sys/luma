'use client';

// APP INTERNA — COMPATIBILIDAD ZODIACAL ("Escáner de Sinergia Zodiacal").
// Pantalla propia (como Descifrar), sin pestaña nueva en el menú inferior —
// se entra desde una tarjeta en Tarot y desde una sugerencia del Coach
// (decisión de ubicación, 2026-09-18: ni la usuaria daría uso diario a esto
// como para merecer una pestaña fija, ni conviene restarle protagonismo a
// las 5 funciones que sí se usan seguido). Sin API externa de efemérides —
// la IA genera el análisis directo a partir de los 2 signos (decisión
// explícita del usuario). Freemium por bloque: % y "Química" SIEMPRE
// gratis (no gasta la prueba gratis global de lib/prueba-gratis.ts, es un
// mecanismo de cobro aparte); "Fricción" y "Consejo" se ven borrosos con un
// botón para desbloquear — ese botón hoy lleva a /paywall de forma honesta
// (no hay todavía cobro suelto de $1,99 ni plan VIP conectado; el usuario
// no confirmó ese cobro real, ver ESTADO.md).

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock } from 'lucide-react';
import { ScreenHeader } from '@/components/app/ScreenHeader';
import { AppButton } from '@/components/app/AppButton';
import { SIGNOS_ZODIACO } from '@/lib/zodiaco';

interface Resultado {
  porcentaje: number;
  quimica: string;
  friccion: string;
  arcano: string;
  consejo: string;
}

function SelectorSigno({
  etiqueta,
  seleccion,
  onSeleccionar,
}: {
  etiqueta: string;
  seleccion: string | null;
  onSeleccionar: (id: string) => void;
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--accent)]">{etiqueta}</p>
      <div className="mt-2 grid grid-cols-4 gap-2">
        {SIGNOS_ZODIACO.map((s) => {
          const sel = s.id === seleccion;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSeleccionar(s.id)}
              aria-pressed={sel}
              className={`flex flex-col items-center gap-1 rounded-[var(--radius-button)] border py-2.5 text-[10.5px] font-semibold transition-colors duration-150 ${
                sel
                  ? 'border-[var(--accent)] bg-[var(--chip-bg)] text-[var(--accent-lite)]'
                  : 'border-[color-mix(in_oklab,var(--accent)_28%,transparent)] text-[var(--text-secondary)]'
              }`}
            >
              <span className="text-[18px] leading-none text-[var(--accent-lite)]" aria-hidden="true">
                {s.simbolo}
              </span>
              {s.nombre}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function CompatibilidadPage() {
  const [signo1, setSigno1] = useState<string | null>(null);
  const [signo2, setSigno2] = useState<string | null>(null);
  const [estado, setEstado] = useState<'reposo' | 'cargando' | 'error' | 'resultado'>('reposo');
  const [resultado, setResultado] = useState<Resultado | null>(null);

  async function calcular() {
    if (!signo1 || !signo2) return;
    setEstado('cargando');
    try {
      const nombre1 = SIGNOS_ZODIACO.find((s) => s.id === signo1)?.nombre ?? signo1;
      const nombre2 = SIGNOS_ZODIACO.find((s) => s.id === signo2)?.nombre ?? signo2;
      const res = await fetch('/api/compatibilidad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signo1: nombre1, signo2: nombre2 }),
      });
      if (!res.ok) throw new Error('respuesta no OK');
      const datos: Partial<Resultado> = await res.json();
      if (!datos.quimica) throw new Error('sin resultado');
      setResultado(datos as Resultado);
      setEstado('resultado');
    } catch {
      setEstado('error');
    }
  }

  return (
    <div className="relative flex min-h-dvh flex-col px-5 pb-6 pt-3">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(520px 40dvh at 50% 32%, color-mix(in oklab, var(--bloom-vino) 55%, transparent), transparent 68%), ' +
            'radial-gradient(480px 36dvh at 50% 78%, color-mix(in oklab, var(--bloom-vino) 42%, transparent), transparent 70%)',
        }}
      />
      <ScreenHeader titulo="Sinergia zodiacal" volverHref="/app/tarot" tituloDisplay />

      <div className="mt-3 flex flex-col gap-4">
        <SelectorSigno etiqueta="Tu signo" seleccion={signo1} onSeleccionar={setSigno1} />
        <SelectorSigno etiqueta="Su signo" seleccion={signo2} onSeleccionar={setSigno2} />
      </div>

      <div className="mt-4">
        <AppButton onClick={calcular} disabled={!signo1 || !signo2 || estado === 'cargando'} busy={estado === 'cargando'}>
          {estado === 'cargando' ? 'Calculando…' : 'Calcular Sinergia de Amor ✨'}
        </AppButton>
        {estado === 'error' && (
          <p className="mt-2 text-center text-[11px] font-semibold text-[var(--an-risk)]">
            No se pudo calcular — inténtalo de nuevo.
          </p>
        )}
      </div>

      <AnimatePresence>
        {estado === 'resultado' && resultado && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex flex-col gap-4"
          >
            <div className="flex flex-col items-center gap-1 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_35%,transparent)] bg-[var(--surface)] py-5">
              <span className="text-[40px] font-bold tabular-nums text-[var(--accent-lite)] [font-family:var(--font-display)]">
                {resultado.porcentaje}%
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)]">
                de sinergia
              </span>
            </div>

            <div className="rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface)] p-4">
              <h3 className="text-[12px] font-bold uppercase tracking-[0.06em] text-[var(--accent)]">
                Química y atracción
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--text-primary)]">{resultado.quimica}</p>
            </div>

            <div className="relative rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface)] p-4">
              <div className="pointer-events-none select-none blur-[6px]">
                <h3 className="text-[12px] font-bold uppercase tracking-[0.06em] text-[var(--accent)]">
                  Puntos de fricción
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--text-primary)]">{resultado.friccion}</p>
                <h3 className="mt-4 text-[12px] font-bold uppercase tracking-[0.06em] text-[var(--accent)]">
                  Arcano combinado
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--text-primary)]">{resultado.arcano}</p>
                <h3 className="mt-4 text-[12px] font-bold uppercase tracking-[0.06em] text-[var(--accent)]">
                  Consejo de dignidad
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--text-primary)]">{resultado.consejo}</p>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-[var(--radius-card)] bg-[color-mix(in_oklab,var(--bg)_55%,transparent)] p-4 text-center">
                <Lock size={18} className="text-[var(--accent-lite)]" aria-hidden="true" />
                <p className="text-[12.5px] font-semibold text-[var(--text-primary)]">
                  Desbloquea el reporte completo
                </p>
                <a
                  href="/paywall"
                  className="mt-1 flex h-[42px] items-center justify-center rounded-[var(--radius-button)] bg-gradient-to-b from-[var(--accent-lite)] to-[var(--accent)] px-5 text-[13px] font-bold text-[var(--on-accent)]"
                >
                  Ver planes
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
