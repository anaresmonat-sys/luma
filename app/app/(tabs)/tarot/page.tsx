'use client';

// APP INTERNA — TAROT (blueprint: vista-previa-app.html frame 6, aprobado). Lista de
// 5 tiradas; tocar una revela la carta + lectura in situ (acordeón) — sin inventar
// una ruta nueva no aprobada en el mockup. Reutiliza CartaSacerdotisa con props.
// La carta sale de verdad al azar del mazo completo de 78 (lib/tarotDeck.ts,
// con estado invertida) y la lectura la genera la IA real vía /api/tarot — antes
// cada tirada mostraba SIEMPRE la misma carta fija para siempre (defecto real de
// la auditoría 2026-09-18). La tirada completa (carta + lectura) se guarda en
// localStorage: "repetir tirada" ahora sí repite lo que salió, sin volver a
// llamar a la IA ni gastar otra prueba gratis (antes "repetía" solo el ID y
// volvía a pedir una lectura nueva). La primera tirada real es gratis
// (lib/prueba-gratis.ts); la siguiente manda a elegir plan.

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenHeader } from '@/components/app/ScreenHeader';
import { AppLinkButton } from '@/components/app/AppButton';
import { CartaSacerdotisa } from '@/components/app/HeroDemoLuma';
import { TIRADAS_TAROT } from '@/lib/seed-datos';
import { guardarEntradaPendiente } from '@/lib/almacenamiento-diario';
import { pruebaGratisDisponible, consumirPruebaGratis } from '@/lib/prueba-gratis';
import { drawCards, cartaDelDia, citaDeCarta, type CartaExtraida } from '@/lib/tarotDeck';

const CLAVE_ULTIMA_TIRADA = 'luma_ultima_tirada';
const CLAVE_TIRADAS_GUARDADAS = 'luma_tiradas_guardadas';

interface TiradaGuardada {
  numero: string;
  nombre: string;
  invertida: boolean;
  cita: string;
  texto: string;
  imagen?: string;
}

const contenedor = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

function leerGuardadas(): Record<string, TiradaGuardada> {
  try {
    const crudo = window.localStorage.getItem(CLAVE_TIRADAS_GUARDADAS);
    return crudo ? (JSON.parse(crudo) as Record<string, TiradaGuardada>) : {};
  } catch {
    return {};
  }
}

export default function TarotPage() {
  const [abierta, setAbierta] = useState<string | null>(null);
  const [ultima, setUltima] = useState<string | null>(null);
  const [cargando, setCargando] = useState<string | null>(null);
  const [guardadas, setGuardadas] = useState<Record<string, TiradaGuardada>>({});
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setGuardadas(leerGuardadas());
    try {
      setUltima(window.localStorage.getItem(CLAVE_ULTIMA_TIRADA));
    } catch {
      // localStorage puede fallar (modo privado, cuota) — sin acceso rápido, no bloquea el flujo.
    }
  }, []);

  async function alternar(id: string) {
    const abrir = abierta !== id;
    if (!abrir) {
      setAbierta(null);
      return;
    }

    if (!guardadas[id]) {
      if (!pruebaGratisDisponible()) {
        window.location.href = '/paywall';
        return;
      }
      const pregunta = TIRADAS_TAROT.find((t) => t.id === id)?.pregunta ?? '';
      const extraida: CartaExtraida = id === 'carta-del-dia' ? cartaDelDia() : drawCards(1)[0];
      setCargando(id);
      try {
        const res = await fetch('/api/tarot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            numero: extraida.carta.numero,
            nombre: extraida.carta.nombre,
            invertida: extraida.invertida,
            palabrasClave: extraida.invertida ? extraida.carta.invertido : extraida.carta.derecho,
            pregunta,
          }),
        });
        if (!res.ok) throw new Error('respuesta no OK');
        const datos: { texto?: string } = await res.json();
        if (!datos.texto) throw new Error('sin lectura');
        consumirPruebaGratis();
        const nueva: TiradaGuardada = {
          numero: extraida.carta.numero,
          nombre: extraida.carta.nombre,
          invertida: extraida.invertida,
          cita: citaDeCarta(extraida),
          texto: datos.texto,
          imagen: extraida.carta.image,
        };
        setGuardadas((g) => {
          const siguiente = { ...g, [id]: nueva };
          try {
            window.localStorage.setItem(CLAVE_TIRADAS_GUARDADAS, JSON.stringify(siguiente));
          } catch {
            // ver nota de arriba.
          }
          return siguiente;
        });
      } catch {
        setCargando(null);
        return;
      }
      setCargando(null);
    }

    setAbierta(id);
    try {
      window.localStorage.setItem(CLAVE_ULTIMA_TIRADA, id);
    } catch {
      // ver nota de arriba.
    }
    setUltima(id);
    window.setTimeout(() => panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 320);
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col pb-4 pt-3">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(520px 42dvh at 50% 26%, color-mix(in oklab, var(--bloom-vino) 52%, transparent), transparent 70%), ' +
            'radial-gradient(560px 46dvh at 50% 96%, color-mix(in oklab, var(--bloom-vino) 50%, transparent), transparent 74%)',
        }}
      />
      <ScreenHeader titulo="Tarot" volverHref="/app" />
      <h1 className="mt-1 text-[20px] font-semibold text-[var(--text-primary)] [font-family:var(--font-display)]">
        ¿Qué tipo de tirada necesitas?
      </h1>

      <Link
        href="/app/compatibilidad"
        className="mt-3 flex items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_35%,transparent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] px-4 py-3"
      >
        <span className="text-[17px] leading-none" aria-hidden="true">
          ✨
        </span>
        <span className="flex-1">
          <span className="block text-[13px] font-semibold text-[var(--accent-lite)]">Sinergia zodiacal</span>
          <span className="mt-0.5 block text-[11px] leading-snug text-[var(--text-secondary)]">
            Compara tu signo con el de alguien especial
          </span>
        </span>
        <span aria-hidden="true" className="text-[var(--accent-lite)]">
          →
        </span>
      </Link>

      <Link
        href="/app/mapa-poder"
        className="mt-2 flex items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_35%,transparent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] px-4 py-3"
      >
        <span className="text-[17px] leading-none" aria-hidden="true">
          🔮
        </span>
        <span className="flex-1">
          <span className="block text-[13px] font-semibold text-[var(--accent-lite)]">Conócete a ti misma</span>
          <span className="mt-0.5 block text-[11px] leading-snug text-[var(--text-secondary)]">
            Tu arcano de nacimiento, con tu fecha
          </span>
        </span>
        <span aria-hidden="true" className="text-[var(--accent-lite)]">
          →
        </span>
      </Link>

      {ultima && guardadas[ultima] && (
        <button
          type="button"
          onClick={() => alternar(ultima)}
          className="mt-3 flex items-center justify-between rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_35%,transparent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] px-4 py-3 text-left"
        >
          <span className="text-[12.5px] font-semibold text-[var(--accent-lite)]">
            Repetir tu última tirada: {TIRADAS_TAROT.find((t) => t.id === ultima)?.nombre}
          </span>
          <span aria-hidden="true" className="text-[var(--accent-lite)]">
            →
          </span>
        </button>
      )}

      <motion.div variants={contenedor} initial="hidden" animate="visible" className="mt-4 flex flex-col">
        {TIRADAS_TAROT.map((t, i) => {
          const abierto = abierta === t.id;
          const tirada = guardadas[t.id];
          return (
            <motion.div key={t.id} variants={item}>
              {i > 0 && <div className="h-px bg-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)]" />}
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => alternar(t.id)}
                aria-expanded={abierto}
                disabled={cargando === t.id}
                className="flex w-full items-center gap-3 py-4 text-left disabled:opacity-70"
              >
                <span
                  aria-hidden="true"
                  className="h-[52px] w-10 shrink-0 rounded-[12px]"
                  style={{
                    background: 'linear-gradient(160deg, var(--card-paper), var(--card-paper-2))',
                    boxShadow: '0 8px 16px -8px rgb(10 5 8 / 0.5), inset 0 1px 0 rgb(255 255 255 / 0.5)',
                  }}
                />
                <span className="text-[15px] leading-none text-[var(--accent-lite)]" aria-hidden="true">
                  {t.emoji}
                </span>
                <span className="flex-1">
                  <span className="block text-[15px] font-semibold text-[var(--text-primary)] [font-family:var(--font-display)]">
                    {t.nombre}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-[var(--text-secondary)]">
                    {cargando === t.id ? 'Leyendo tu carta…' : t.pregunta}
                  </span>
                </span>
              </motion.button>

              <AnimatePresence>
                {abierto && tirada && (
                  <motion.div
                    ref={panelRef}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col items-center gap-3 pb-5 pt-2">
                      <div className="scale-[0.72]">
                        <CartaSacerdotisa
                          disparo="montaje"
                          numero={tirada.numero}
                          nombre={tirada.imagen || !tirada.invertida ? tirada.nombre : `${tirada.nombre} (invertida)`}
                          cita={tirada.cita}
                          imagen={tirada.imagen}
                          invertida={tirada.invertida}
                        />
                      </div>
                      <p className="max-w-[280px] text-center text-[13px] leading-relaxed text-[var(--text-secondary)]">
                        {tirada.texto}
                      </p>
                      <div className="w-full">
                        <AppLinkButton
                          href="/app/diario"
                          compact
                          onClick={() => guardarEntradaPendiente(tirada.texto)}
                        >
                          Guardar en mi diario
                        </AppLinkButton>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>

      {!abierta && !ultima && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="mt-6 flex flex-col items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface)] px-4 py-6 text-center"
        >
          <div className="scale-[0.6]">
            {(() => {
              const previa = cartaDelDia();
              return (
                <CartaSacerdotisa
                  animar={false}
                  numero={previa.carta.numero}
                  nombre={previa.carta.nombre}
                  cita={citaDeCarta(previa)}
                  imagen={previa.carta.image}
                  invertida={previa.invertida}
                />
              );
            })()}
          </div>
          <p className="text-[12.5px] leading-relaxed text-[var(--text-secondary)]">
            ¿Primera vez aquí? Empieza con tu carta del día — es la tirada más corta y no necesita contexto previo.
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => alternar('carta-del-dia')}
            className="flex min-h-11 items-center justify-center px-4 text-[12.5px] font-bold text-[var(--accent-lite)]"
          >
            Ver mi carta del día →
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
