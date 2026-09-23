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
import { AvisoIA } from '@/components/app/AvisoIA';
import { CartaSacerdotisa } from '@/components/app/HeroDemoLuma';
import { TIRADAS_TAROT } from '@/lib/seed-datos';
import { guardarEntradaPendiente } from '@/lib/almacenamiento-diario';
import { pruebaGratisDisponible, consumirPruebaGratis } from '@/lib/prueba-gratis';
import { drawCards, cartaDelDia, citaDeCarta, POSICIONES_TIRADA, type CartaExtraida } from '@/lib/tarotDeck';

const CLAVE_ULTIMA_TIRADA = 'luma_ultima_tirada';
const CLAVE_TIRADAS_GUARDADAS = 'luma_tiradas_guardadas';

interface CartaTirada {
  posicion?: string;
  numero: string;
  nombre: string;
  invertida: boolean;
  cita: string;
  imagen?: string;
}

interface TiradaGuardada {
  cartas: CartaTirada[];
  texto: string;
  /** Solo para "carta-del-dia" (YYYY-M-D): si la fecha guardada no es la de hoy,
   * se pide una lectura nueva en vez de mostrar la de un día anterior — antes se
   * guardaba para siempre y "hoy" se quedaba congelado en el primer día que se abrió. */
  fecha?: string;
}

function claveDelDia(fecha: Date = new Date()): string {
  return `${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}`;
}

/** Mini carta de una tirada de 3 — a diferencia de CartaSacerdotisa (pensada
 * para UNA carta protagonista), aquí el tamaño va fijo en px, no por escala,
 * para que las 3 quepan en fila sin dejar hueco de más en el acordeón. */
function MiniCartaTirada({
  posicion,
  imagen,
  nombre,
  invertida,
}: {
  posicion?: string;
  imagen?: string;
  nombre: string;
  invertida: boolean;
}) {
  return (
    <div className="flex w-[92px] flex-col items-center gap-1.5">
      {posicion && (
        <span className="text-center text-[9.5px] font-semibold uppercase leading-tight tracking-[0.04em] text-[var(--accent)]">
          {posicion}
        </span>
      )}
      <div
        className="relative h-[124px] w-[80px] overflow-hidden rounded-[10px] border shadow-[0_10px_18px_-10px_rgb(10_5_8/0.6)]"
        style={{ borderColor: 'color-mix(in oklab, var(--accent) 55%, transparent)' }}
      >
        {imagen && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imagen}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
            style={{ transform: invertida ? 'rotate(180deg)' : undefined }}
          />
        )}
      </div>
      <span className="text-center text-[10px] font-semibold leading-tight text-[var(--text-primary)]">
        {nombre}
        {invertida ? ' (invertida)' : ''}
      </span>
    </div>
  );
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
    if (!crudo) return {};
    const datos = JSON.parse(crudo) as Record<string, unknown>;
    // Descarta tiradas guardadas con el formato de antes de las tiradas de 3 cartas
    // (2026-09-22) — sin esto, una tirada vieja en el navegador rompía la pantalla.
    const validas: Record<string, TiradaGuardada> = {};
    for (const [id, v] of Object.entries(datos)) {
      if (v && typeof v === 'object' && Array.isArray((v as TiradaGuardada).cartas)) {
        validas[id] = v as TiradaGuardada;
      }
    }
    return validas;
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

    // "Carta del día" se renueva sola cada día: si la guardada es de una fecha
    // anterior, se trata como si no hubiera nada guardado y se pide una lectura
    // nueva (antes se quedaba congelada en la primera vez que se abrió).
    const desactualizada = id === 'carta-del-dia' && guardadas[id]?.fecha !== claveDelDia();
    if (!guardadas[id] || desactualizada) {
      if (!pruebaGratisDisponible()) {
        window.location.href = '/paywall';
        return;
      }
      const pregunta = TIRADAS_TAROT.find((t) => t.id === id)?.pregunta ?? '';
      // Carta del día: 1 sola carta (estándar del sector). El resto: 3 cartas con
      // posición propia, leídas por la IA como una sola historia conectada.
      const posiciones = POSICIONES_TIRADA[id];
      const extraidas: CartaExtraida[] = id === 'carta-del-dia' ? [cartaDelDia()] : drawCards(posiciones?.length ?? 1);
      setCargando(id);
      try {
        const res = await fetch('/api/tarot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cartas: extraidas.map((extraida, i) => ({
              posicion: posiciones?.[i],
              numero: extraida.carta.numero,
              nombre: extraida.carta.nombre,
              invertida: extraida.invertida,
              palabrasClave: extraida.invertida ? extraida.carta.invertido : extraida.carta.derecho,
            })),
            pregunta,
            categoria: id,
          }),
        });
        if (!res.ok) throw new Error('respuesta no OK');
        const datos: { texto?: string } = await res.json();
        if (!datos.texto) throw new Error('sin lectura');
        consumirPruebaGratis();
        const nueva: TiradaGuardada = {
          cartas: extraidas.map((extraida, i) => ({
            posicion: posiciones?.[i],
            numero: extraida.carta.numero,
            nombre: extraida.carta.nombre,
            invertida: extraida.invertida,
            cita: citaDeCarta(extraida),
            imagen: extraida.carta.image,
          })),
          texto: datos.texto,
          fecha: id === 'carta-del-dia' ? claveDelDia() : undefined,
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
    <div className="relative flex min-h-min flex-1 flex-col pb-4 pt-3">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 60% 42dvh at 50% 26%, color-mix(in oklab, var(--bloom-vino) 29%, transparent), transparent 70%), ' +
            'radial-gradient(ellipse 60% 46dvh at 50% 96%, color-mix(in oklab, var(--bloom-vino) 28%, transparent), transparent 74%)',
        }}
      />
      <ScreenHeader titulo="Tarot" volverHref="/app" />
      <h1 className="mt-1 text-[20px] font-semibold text-[var(--text-primary)] [font-family:var(--font-display)]">
        ¿Qué tipo de tirada necesitas?
      </h1>
      {/* Ritual antes de elegir (pedido del usuario, 2026-09-22; acortada a pedido suyo). */}
      <p className="mt-1.5 text-[12px] italic leading-relaxed text-[var(--text-secondary)]">
        Haz una respiración profunda, cierra los ojos y conecta con la pregunta.
      </p>

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
                {tirada?.cartas[0]?.imagen ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={tirada.cartas[0].imagen.replace('/tarot/', '/tarot/mini/')}
                    alt=""
                    aria-hidden="true"
                    className="h-16 w-11 shrink-0 rounded-md object-cover shadow-[0_8px_16px_-8px_rgb(10_5_8/0.6)]"
                    style={{ transform: tirada.cartas[0].invertida ? 'rotate(180deg)' : undefined }}
                  />
                ) : (
                  // Reverso en miniatura: la carta que saldrá es al azar, así que no se anticipa ninguna.
                  <span
                    aria-hidden="true"
                    className="relative flex h-16 w-11 shrink-0 items-center justify-center rounded-md"
                    style={{
                      background: 'linear-gradient(160deg, color-mix(in oklab, var(--bloom-vino) 75%, var(--bg)), var(--bg) 70%)',
                      boxShadow:
                        '0 8px 16px -8px rgb(10 5 8 / 0.6), inset 0 0 0 1px color-mix(in oklab, var(--accent) 85%, transparent)',
                    }}
                  >
                    <span
                      className="absolute inset-1 rounded-sm"
                      style={{ border: '1px solid color-mix(in oklab, var(--accent) 40%, transparent)' }}
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/luma-icon.png" alt="" className="relative h-9 w-auto brightness-125 [filter:drop-shadow(0_0_5px_color-mix(in_oklab,var(--accent)_55%,transparent))]" />
                  </span>
                )}
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
                      {tirada.cartas.length === 1 ? (
                        <div className="scale-[0.72]">
                          <CartaSacerdotisa
                            disparo="montaje"
                            numero={tirada.cartas[0].numero}
                            nombre={
                              tirada.cartas[0].imagen || !tirada.cartas[0].invertida
                                ? tirada.cartas[0].nombre
                                : `${tirada.cartas[0].nombre} (invertida)`
                            }
                            cita={tirada.cartas[0].cita}
                            imagen={tirada.cartas[0].imagen}
                            invertida={tirada.cartas[0].invertida}
                          />
                        </div>
                      ) : (
                        <div className="flex justify-center gap-3">
                          {tirada.cartas.map((c, i) => (
                            <MiniCartaTirada
                              key={i}
                              posicion={c.posicion}
                              imagen={c.imagen}
                              nombre={c.nombre}
                              invertida={c.invertida}
                            />
                          ))}
                        </div>
                      )}
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
                      <AvisoIA className="text-center" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Carta del día ya se renueva sola y es la última de la lista: repetirla
          aparte sería idéntico a tocarla ahí arriba, sin aportar nada. */}
      {ultima && ultima !== 'carta-del-dia' && guardadas[ultima] && (
        <button
          type="button"
          onClick={() => alternar(ultima)}
          className="mt-4 flex items-center justify-between rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_35%,transparent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] px-4 py-3 text-left"
        >
          <span className="text-[12.5px] font-semibold text-[var(--accent-lite)]">
            Repetir tu última tirada: {TIRADAS_TAROT.find((t) => t.id === ultima)?.nombre}
          </span>
          <span aria-hidden="true" className="text-[var(--accent-lite)]">
            →
          </span>
        </button>
      )}

      <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--accent)]">Más lecturas</p>

      <Link
        href="/app/compatibilidad"
        className="mt-2 flex items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_35%,transparent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] px-4 py-3"
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
        href="/app/mapa-poder?desde=tarot"
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
    </div>
  );
}
