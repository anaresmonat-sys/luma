'use client';

// APP INTERNA — TAROT. Rediseño pedido por la dueña (2026-10-02): 7 temas en cuadritos
// (Amor, Ruptura, Decisión, Autoconocimiento, Relaciones, Salud y bienestar,
// Prosperidad) + la Carta del día. Al tocar un tema, LUMA pregunta "¿Cuál es tu
// pregunta sobre …?" (opcional: "Prefiero que hablen solo las cartas"); la lectura
// responde a esa pregunta. Las cartas salen al azar del mazo de 78 (lib/tarotDeck.ts)
// y la lectura la genera la IA real vía /api/tarot. Sobre las cartas NO va ningún
// texto (pedido explícito): las posiciones solo las usa la IA. La primera lectura
// real es gratis (lib/prueba-gratis.ts); la siguiente manda a elegir plan (402).

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ScreenHeader } from '@/components/app/ScreenHeader';
import { AppButton, AppLinkButton } from '@/components/app/AppButton';
import { AvisoIA } from '@/components/app/AvisoIA';
import { CartaSacerdotisa } from '@/components/app/HeroDemoLuma';
import { TIRADAS_TAROT, type TiradaTarot } from '@/lib/seed-datos';
import { guardarEntradaPendiente } from '@/lib/almacenamiento-diario';
import { consumirPruebaGratis } from '@/lib/prueba-gratis';
import { drawCards, cartaDelDia, citaDeCarta, POSICIONES_TIRADA } from '@/lib/tarotDeck';

const CLAVE_TIRADAS_GUARDADAS = 'luma_tiradas_guardadas';
const MAX_PREGUNTA = 200;

type Vista = 'lista' | 'pregunta' | 'leyendo' | 'resultado' | 'error';

interface CartaTirada {
  numero: string;
  nombre: string;
  invertida: boolean;
  cita: string;
  imagen?: string;
}

interface TiradaGuardada {
  cartas: CartaTirada[];
  texto: string;
  /** Solo para "carta-del-dia" (YYYY-M-D): si no es la de hoy se pide una lectura nueva. */
  fecha?: string;
}

function claveDelDia(fecha: Date = new Date()): string {
  return `${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}`;
}

function leerCartaDelDiaGuardada(): TiradaGuardada | null {
  try {
    const crudo = window.localStorage.getItem(CLAVE_TIRADAS_GUARDADAS);
    if (!crudo) return null;
    const datos = JSON.parse(crudo) as Record<string, unknown>;
    const d = datos['carta-del-dia'] as TiradaGuardada | undefined;
    return d && Array.isArray(d.cartas) && d.fecha === claveDelDia() ? d : null;
  } catch {
    return null;
  }
}

/** Mini carta de una tirada de 3: imagen + nombre debajo (nada de texto encima). */
function MiniCartaTirada({ imagen, nombre, invertida }: { imagen?: string; nombre: string; invertida: boolean }) {
  return (
    <div className="flex w-[92px] flex-col items-center gap-1.5">
      <div
        className="relative h-[124px] w-[80px] overflow-hidden rounded-[10px] border shadow-[0_10px_18px_-10px_rgb(10_5_8/0.6)] [@media(max-height:720px)]:h-24 [@media(max-height:720px)]:w-16"
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

/** Reverso del mazo, mientras LUMA lee. */
function CartaReverso({ retraso }: { retraso: number }) {
  return (
    <motion.div
      aria-hidden="true"
      animate={{ opacity: [0.55, 1, 0.55], y: [0, -4, 0] }}
      transition={{ duration: 1.6, repeat: Infinity, delay: retraso, ease: 'easeInOut' }}
      className="relative flex h-[124px] w-[80px] items-center justify-center rounded-[10px]"
      style={{
        background: 'linear-gradient(160deg, color-mix(in oklab, var(--bloom-vino) 75%, var(--bg)), var(--bg) 70%)',
        boxShadow: '0 10px 18px -10px rgb(10 5 8 / 0.6), inset 0 0 0 1px color-mix(in oklab, var(--accent) 85%, transparent)',
      }}
    >
      <span className="absolute inset-1 rounded-md" style={{ border: '1px solid color-mix(in oklab, var(--accent) 40%, transparent)' }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/luma-icon.png" alt="" className="relative h-9 w-auto brightness-125" />
    </motion.div>
  );
}

/** Mini carta con el reverso del mazo (ciruela, doble marco dorado y logo de LUMA) para los cuadritos de temas. */
function MiniReverso({ className = '' }: { className?: string }) {
  // Carta "flotando" en 3D: misma perspectiva que la carta del día de Inicio, brillo
  // diagonal, sombra de contacto y resplandor dorado tenue. Estática (sin animación
  // constante); solo se eleva al pasar o tocar el cuadrito padre (clase `group`).
  return (
    <span aria-hidden="true" className={`relative isolate inline-flex shrink-0 ${className}`} style={{ perspective: '240px' }}>
      <span className="absolute inset-0 -z-10 rounded-full opacity-40 blur-[10px]" style={{ background: 'var(--accent)' }} />
      <span className="absolute -bottom-1.5 left-1/2 -z-10 h-2 w-4/5 -translate-x-1/2 rounded-full blur-[4px]" style={{ background: 'rgb(10 5 8 / 0.7)' }} />
      <span
        className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-md transition-transform duration-150 group-hover:-translate-y-1 group-active:-translate-y-1.5"
        style={{
          transform: 'rotateX(8deg) rotateY(-16deg) rotate(-4deg)',
          transformStyle: 'preserve-3d',
          background: 'linear-gradient(160deg, color-mix(in oklab, var(--bloom-vino) 75%, var(--bg)), var(--bg) 70%)',
          boxShadow:
            '0 14px 16px -8px rgb(10 5 8 / 0.8), 0 4px 8px -4px rgb(10 5 8 / 0.55), inset 0 1px 0 rgb(255 255 255 / 0.3), inset 0 0 0 1px color-mix(in oklab, var(--accent) 85%, transparent)',
        }}
      >
        <span className="absolute inset-[3px] rounded-[4px]" style={{ border: '1px solid color-mix(in oklab, var(--accent) 40%, transparent)' }} />
        <span
          className="absolute inset-0"
          style={{ background: 'linear-gradient(125deg, transparent 30%, rgb(255 255 255 / 0.2) 48%, transparent 64%)' }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/luma-icon.png" alt="" className="relative h-5 w-auto brightness-125 [@media(max-height:720px)]:h-4" />
      </span>
    </span>
  );
}

function CabeceraVolver({ titulo, onVolver }: { titulo: string; onVolver: () => void }) {
  return (
    <div className="flex shrink-0 items-center justify-between py-2">
      <button
        type="button"
        onClick={onVolver}
        aria-label="Volver"
        className="flex size-11 shrink-0 items-center justify-center text-[var(--text-primary)]"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <h1 className="text-[15px] font-semibold text-[var(--text-primary)]">{titulo}</h1>
      <div className="size-11 shrink-0" />
    </div>
  );
}

const contenedor = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

export default function TarotPage() {
  const [vista, setVista] = useState<Vista>('lista');
  const [tema, setTema] = useState<TiradaTarot | null>(null);
  const [pregunta, setPregunta] = useState('');
  const [preguntaUsada, setPreguntaUsada] = useState('');
  const [tirada, setTirada] = useState<TiradaGuardada | null>(null);
  const [delDia, setDelDia] = useState<TiradaGuardada | null>(null);
  const ultimoIntento = useRef<{ tema: TiradaTarot; pregunta: string } | null>(null);

  useEffect(() => {
    setDelDia(leerCartaDelDiaGuardada());
  }, []);

  function volverALista() {
    setVista('lista');
    setTema(null);
    setTirada(null);
    setPregunta('');
  }

  function elegirTema(t: TiradaTarot) {
    if (t.id === 'carta-del-dia') {
      void sacarCartas(t, '');
      return;
    }
    setTema(t);
    setPregunta('');
    setVista('pregunta');
  }

  async function sacarCartas(t: TiradaTarot, preguntaUsuaria: string) {
    ultimoIntento.current = { tema: t, pregunta: preguntaUsuaria };
    setTema(t);
    setPreguntaUsada(preguntaUsuaria);

    // Carta del día: una por día (estándar del sector) — si ya salió hoy, se reabre.
    if (t.id === 'carta-del-dia' && delDia) {
      setTirada(delDia);
      setVista('resultado');
      return;
    }

    setVista('leyendo');
    const posiciones = POSICIONES_TIRADA[t.id];
    const extraidas = t.id === 'carta-del-dia' ? [cartaDelDia()] : drawCards(posiciones?.length ?? 3);

    // OJO: no cortar aquí mirando solo localStorage — no sabe si la persona tiene un
    // plan (pagado o de cortesía). La verdad la decide el servidor con el 402.
    try {
      const res = await fetch('/api/tarot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartas: extraidas.map((e, i) => ({
            posicion: posiciones?.[i],
            numero: e.carta.numero,
            nombre: e.carta.nombre,
            invertida: e.invertida,
            palabrasClave: e.invertida ? e.carta.invertido : e.carta.derecho,
          })),
          pregunta: t.pregunta,
          preguntaUsuaria,
          categoria: t.id,
        }),
      });
      if (res.status === 402) {
        window.location.href = '/paywall';
        return;
      }
      if (!res.ok) throw new Error('respuesta no OK');
      const datos: { texto?: string } = await res.json();
      if (!datos.texto) throw new Error('sin lectura');
      consumirPruebaGratis();
      const nueva: TiradaGuardada = {
        cartas: extraidas.map((e) => ({
          numero: e.carta.numero,
          nombre: e.carta.nombre,
          invertida: e.invertida,
          cita: citaDeCarta(e),
          imagen: e.carta.image,
        })),
        texto: datos.texto,
        fecha: t.id === 'carta-del-dia' ? claveDelDia() : undefined,
      };
      if (t.id === 'carta-del-dia') {
        setDelDia(nueva);
        try {
          window.localStorage.setItem(CLAVE_TIRADAS_GUARDADAS, JSON.stringify({ 'carta-del-dia': nueva }));
        } catch {
          // localStorage puede fallar (modo privado, cuota) — no bloquea el flujo.
        }
      }
      setTirada(nueva);
      setVista('resultado');
    } catch {
      setVista('error');
    }
  }

  const fondo = (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10"
      style={{
        background:
          'radial-gradient(ellipse 60% 42dvh at 50% 26%, color-mix(in oklab, var(--bloom-vino) 29%, transparent), transparent 70%), ' +
          'radial-gradient(ellipse 60% 46dvh at 50% 96%, color-mix(in oklab, var(--bloom-vino) 28%, transparent), transparent 74%)',
      }}
    />
  );

  // ── Vista: pregunta opcional ─────────────────────────────────────────────
  if (vista === 'pregunta' && tema) {
    return (
      <div className="relative flex min-h-min flex-1 flex-col pb-4 pt-3">
        {fondo}
        <CabeceraVolver titulo={tema.nombre} onVolver={volverALista} />
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="mt-4 flex flex-col">
          <p className="text-center text-[22px] font-semibold leading-snug text-[var(--accent-lite)] [font-family:var(--font-display)]">
            ¿Cuál es tu pregunta sobre {tema.sobre}?
          </p>
          <div className="mt-5 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface-2)] p-3">
            <textarea
              value={pregunta}
              onChange={(e) => setPregunta(e.target.value.slice(0, MAX_PREGUNTA))}
              placeholder="Escribe aquí tu pregunta…"
              aria-label={`Tu pregunta sobre ${tema.sobre}`}
              rows={4}
              className="min-h-24 w-full resize-none bg-transparent text-[14px] leading-relaxed text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none"
            />
          </div>
          <div className="mt-4">
            <AppButton onClick={() => void sacarCartas(tema, pregunta.trim())} disabled={!pregunta.trim()}>
              Sacar mis cartas
            </AppButton>
          </div>
          <button
            type="button"
            onClick={() => void sacarCartas(tema, '')}
            className="mt-3 flex h-11 w-full items-center justify-center rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_45%,transparent)] text-[13px] font-bold text-[var(--accent-lite)]"
          >
            Prefiero que hablen solo las cartas
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Vista: leyendo ───────────────────────────────────────────────────────
  if (vista === 'leyendo') {
    return (
      <div className="relative flex min-h-min flex-1 flex-col pb-4 pt-3">
        {fondo}
        <CabeceraVolver titulo={tema?.nombre ?? 'Tarot'} onVolver={volverALista} />
        <div className="flex flex-1 flex-col items-center justify-center gap-6">
          <div className="flex gap-3">
            {(tema?.id === 'carta-del-dia' ? [0] : [0, 1, 2]).map((i) => (
              <CartaReverso key={i} retraso={i * 0.25} />
            ))}
          </div>
          <p className="text-[13px] font-semibold text-[var(--accent-lite)]">LUMA está leyendo tus cartas…</p>
        </div>
      </div>
    );
  }

  // ── Vista: error ─────────────────────────────────────────────────────────
  if (vista === 'error') {
    return (
      <div className="relative flex min-h-min flex-1 flex-col pb-4 pt-3">
        {fondo}
        <CabeceraVolver titulo={tema?.nombre ?? 'Tarot'} onVolver={volverALista} />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <p className="max-w-[260px] text-[14px] leading-relaxed text-[var(--text-primary)]">
            No pudimos leer tus cartas ahora mismo. No se ha gastado tu lectura.
          </p>
          <div className="w-full max-w-[260px]">
            <AppButton
              onClick={() => {
                if (ultimoIntento.current) void sacarCartas(ultimoIntento.current.tema, ultimoIntento.current.pregunta);
              }}
            >
              Intentar de nuevo
            </AppButton>
          </div>
        </div>
      </div>
    );
  }

  // ── Vista: resultado ─────────────────────────────────────────────────────
  if (vista === 'resultado' && tirada) {
    const textoDiario = `${preguntaUsada ? `Mi pregunta: ${preguntaUsada}\n\n` : ''}${tirada.texto}`;
    return (
      <div className="relative flex min-h-min flex-1 flex-col pb-4 pt-3">
        {fondo}
        <CabeceraVolver titulo={tema?.nombre ?? 'Tarot'} onVolver={volverALista} />
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex flex-col items-center gap-3 pt-2">
          {tirada.cartas.length === 1 ? (
            <div className="scale-[0.72] [@media(max-height:720px)]:-my-6 [@media(max-height:720px)]:scale-[0.6]">
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
                <MiniCartaTirada key={i} imagen={c.imagen} nombre={c.nombre} invertida={c.invertida} />
              ))}
            </div>
          )}
          {preguntaUsada && (
            <p className="max-w-[300px] text-center text-[12px] italic leading-snug text-[var(--text-tertiary)]">
              Tu pregunta: {preguntaUsada}
            </p>
          )}
          <p className="max-w-[300px] whitespace-pre-line text-center text-[13px] leading-relaxed text-[var(--text-secondary)]">{tirada.texto}</p>
          <div className="mt-1 flex w-full flex-col gap-2">
            <AppLinkButton href="/app/diario" compact onClick={() => guardarEntradaPendiente(textoDiario)}>
              Guardar en mi diario
            </AppLinkButton>
            <button
              type="button"
              onClick={volverALista}
              className="flex h-11 w-full items-center justify-center rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_45%,transparent)] text-[13px] font-bold text-[var(--accent-lite)]"
            >
              Hacer otra tirada
            </button>
          </div>
          <AvisoIA className="text-center" />
        </motion.div>
      </div>
    );
  }

  // ── Vista: lista de temas ────────────────────────────────────────────────
  const cartaDia = TIRADAS_TAROT.find((t) => t.id === 'carta-del-dia');
  const temas = TIRADAS_TAROT.filter((t) => t.id !== 'carta-del-dia');
  return (
    <div className="relative flex min-h-min flex-1 flex-col pb-4 pt-3">
      {fondo}
      <ScreenHeader titulo="Tarot" volverHref="/app" />
      <h1 className="mt-1 text-[20px] font-semibold text-[var(--text-primary)] [font-family:var(--font-display)] [@media(max-height:720px)]:hidden">
        ¿Qué tipo de tirada necesitas?
      </h1>
      {/* Ritual antes de elegir — resaltado en dorado (pedido de la dueña, 2026-10-02). */}
      <p className="mt-2 text-[16px] italic leading-snug text-[var(--accent-lite)] [font-family:var(--font-display)] [@media(max-height:840px)]:text-[15px] [@media(max-height:720px)]:mt-1 [@media(max-height:720px)]:text-[14px]">
        <span aria-hidden="true">🕯️ </span>Haz una respiración profunda, cierra los ojos y conecta con la pregunta.
      </p>

      <motion.div variants={contenedor} initial="hidden" animate="visible" className="mt-4 flex flex-col gap-3 [@media(max-height:720px)]:mt-3 [@media(max-height:720px)]:gap-2">
        {cartaDia && (
          <motion.button
            variants={item}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => elegirTema(cartaDia)}
            className="group flex h-14 w-full items-center justify-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_55%,transparent)] bg-[color-mix(in_oklab,var(--accent)_14%,transparent)] text-[15px] font-semibold text-[var(--accent-lite)] [font-family:var(--font-display)] [@media(max-height:720px)]:h-11"
          >
            <MiniReverso className="h-10 w-7 [@media(max-height:720px)]:h-8 [@media(max-height:720px)]:w-6" />
            <span aria-hidden="true" className="text-[20px] leading-none">{cartaDia.emoji}</span>
            {cartaDia.nombre}
          </motion.button>
        )}
        <div className="grid grid-cols-2 gap-3 [@media(max-height:720px)]:gap-2">
          {temas.map((t) => (
            <motion.button
              key={t.id}
              variants={item}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => elegirTema(t)}
              className="group flex h-[72px] items-center gap-2 last:odd:col-span-2 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface)] px-3 [@media(max-height:720px)]:h-14 [@media(min-height:841px)]:h-20"
            >
              <MiniReverso className="h-[52px] w-9 [@media(max-height:720px)]:h-10 [@media(max-height:720px)]:w-7 [@media(min-height:841px)]:h-14 [@media(min-height:841px)]:w-10" />
              <span className="flex flex-1 flex-col items-center justify-center gap-1 text-center [@media(max-height:720px)]:gap-0">
                <span aria-hidden="true" className="text-[22px] leading-none [@media(max-height:720px)]:text-[18px]">{t.emoji}</span>
                <span className="text-[13px] font-semibold leading-tight text-[var(--text-primary)] [font-family:var(--font-display)]">{t.nombre}</span>
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--accent)] [@media(max-height:840px)]:mt-4 [@media(max-height:720px)]:mt-3">Más lecturas</p>

      <Link
        href="/app/compatibilidad"
        className="mt-2 flex items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_35%,transparent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] px-4 py-3 [@media(max-height:720px)]:py-2"
      >
        <span className="text-[17px] leading-none" aria-hidden="true">
          ✨
        </span>
        <span className="flex-1">
          <span className="block text-[13px] font-semibold text-[var(--accent-lite)]">Sinergia zodiacal</span>
          <span className="mt-0.5 block text-[11px] leading-snug text-[var(--text-secondary)] [@media(max-height:720px)]:hidden">
            Compara tu signo con el de alguien especial
          </span>
        </span>
        <span aria-hidden="true" className="text-[var(--accent-lite)]">
          →
        </span>
      </Link>
    </div>
  );
}
