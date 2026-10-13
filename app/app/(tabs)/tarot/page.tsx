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
import { motion, useReducedMotion } from 'motion/react';
import { ScreenHeader } from '@/components/app/ScreenHeader';
import { AppButton, AppLinkButton } from '@/components/app/AppButton';
import { AvisoIA } from '@/components/app/AvisoIA';
import { InvitacionPlan } from '@/components/app/InvitacionPlan';
import { usePruebaDisponible } from '@/lib/use-prueba-gratis';
import { modoPersonaNueva } from '@/lib/modo-revision';
import { CartaSacerdotisa } from '@/components/app/HeroDemoLuma';
import { TIRADAS_TAROT, type TiradaTarot } from '@/lib/seed-datos';
import { guardarEntradaPendiente } from '@/lib/almacenamiento-diario';
import { consumirPruebaGratis, pruebaGratisDisponible } from '@/lib/prueba-gratis';
import { drawCards, cartaDelDia, citaDeCarta, POSICIONES_TIRADA, type CartaExtraida } from '@/lib/tarotDeck';

const CLAVE_TIRADAS_GUARDADAS = 'luma_tiradas_guardadas';
const MAX_PREGUNTA = 200;

type Vista = 'lista' | 'ritual' | 'pregunta' | 'leyendo' | 'resultado' | 'error';

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
  const [mensajeTope, setMensajeTope] = useState<string | null>(null);
  const [preguntaUsada, setPreguntaUsada] = useState('');
  const [tirada, setTirada] = useState<TiradaGuardada | null>(null);
  const [delDia, setDelDia] = useState<TiradaGuardada | null>(null);
  const ultimoIntento = useRef<{ tema: TiradaTarot; pregunta: string; forzada?: CartaExtraida[] } | null>(null);
  // Ritual "Elige tus cartas" (llega desde la página de ventas con ?ritual=1): 6 reversos,
  // la persona elige 3 y esas son las cartas que se leen (tirada de 3, como Autoconocimiento).
  // No es la Carta del día.
  const [cartasRitual, setCartasRitual] = useState<CartaExtraida[]>([]);
  const [elegidas, setElegidas] = useState<number[]>([]);
  // Orden del ritual: primero la pregunta (opcional), luego elegir las 3 cartas, luego se revelan.
  const [ritualPreguntada, setRitualPreguntada] = useState(false);
  // Las cartas se revelan un instante DESPUÉS de elegir la tercera (continuidad, no salto brusco).
  const [ritualReveladas, setRitualReveladas] = useState(false);
  const [desdeRitual, setDesdeRitual] = useState(false);
  const reduce = useReducedMotion();
  const { disponible, conPlan } = usePruebaDisponible();
  // Evita el parpadeo de la lista de temas antes de saltar al ritual (localStorage solo existe en el navegador).
  const [listo, setListo] = useState(false);

  useEffect(() => {
    setDelDia(leerCartaDelDiaGuardada());
    const quiereRitual = new URLSearchParams(window.location.search).get('ritual') === '1';
    if (quiereRitual && pruebaGratisDisponible()) {
      setCartasRitual(drawCards(6));
      setVista('ritual');
      setListo(true);
      return;
    }
    if (quiereRitual) {
      // Llegó por "Tu primera lectura de tarot gratis" pero este navegador ya la gastó: se le dice claro
      // en vez de dejarla en la lista de temas. Con plan o administradora, la lista de siempre.
      let cancelado = false;
      fetch('/api/mi-plan')
        .then((r) => (r.ok ? r.json() : null))
        .then((d: { activo?: boolean } | null) => {
          if (cancelado) return;
          if (d?.activo && !modoPersonaNueva()) setListo(true);
          else window.location.href = '/paywall?motivo=lectura-usada';
        })
        .catch(() => {
          if (!cancelado) setListo(true);
        });
      return () => {
        cancelado = true;
      };
    }
    setListo(true);
  }, []);

  useEffect(() => {
    if (elegidas.length !== 3) {
      setRitualReveladas(false);
      return;
    }
    const t = window.setTimeout(() => setRitualReveladas(true), reduce ? 0 : 750);
    return () => window.clearTimeout(t);
  }, [elegidas, reduce]);

  function volverALista() {
    setDesdeRitual(false);
    setElegidas([]);
    setRitualPreguntada(false);
    setRitualReveladas(false);
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

  async function sacarCartas(t: TiradaTarot, preguntaUsuaria: string, forzada?: CartaExtraida[]) {
    ultimoIntento.current = { tema: t, pregunta: preguntaUsuaria, forzada };
    setDesdeRitual(Boolean(forzada));
    setTema(t);
    setPreguntaUsada(preguntaUsuaria);
    setMensajeTope(null);

    // Carta del día: una por día (estándar del sector) — si ya salió hoy, se reabre.
    if (t.id === 'carta-del-dia' && delDia && !forzada) {
      setTirada(delDia);
      setVista('resultado');
      return;
    }

    setVista('leyendo');
    const posiciones = POSICIONES_TIRADA[t.id];
    const extraidas = forzada ?? (t.id === 'carta-del-dia' ? [cartaDelDia()] : drawCards(posiciones?.length ?? 3));

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
        window.location.href = '/paywall?motivo=lectura-usada';
        return;
      }
      if (res.status === 429) {
        const tope: { error?: string; motivo?: string } | null = await res.json().catch(() => null);
        if (tope?.motivo === 'tope_persona' && tope.error) {
          setMensajeTope(tope.error);
          setVista('error');
          return;
        }
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
        fecha: t.id === 'carta-del-dia' && !forzada ? claveDelDia() : undefined,
      };
      if (t.id === 'carta-del-dia' && !forzada) {
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

  if (!listo) return <div className="flex-1" aria-hidden="true" />;

  // ── Vista: ritual "Elige tus cartas" ─────────────────────────────────────
  if (vista === 'ritual' && cartasRitual.length === 6) {
    const temaRitual: TiradaTarot = {
      id: 'ritual',
      emoji: '🔮',
      nombre: 'Tus cartas',
      sobre: '',
      pregunta: 'Lectura libre: lo que la persona lleva dentro y necesita ver ahora',
    };
    const paso: 'pregunta' | 'elegir' | 'reveladas' = !ritualPreguntada
      ? 'pregunta'
      : !ritualReveladas
        ? 'elegir'
        : 'reveladas';
    const sacadas = paso === 'reveladas' ? elegidas.map((i) => cartasRitual[i]) : [];

    function tocarCarta(i: number) {
      if (elegidas.length === 3) return;
      // Tocar una carta ya elegida la des-elige.
      setElegidas((prev) => (prev.includes(i) ? prev.filter((n) => n !== i) : prev.length >= 3 ? prev : [...prev, i]));
    }
    function elegirPorMi() {
      const orden = [0, 1, 2, 3, 4, 5].sort(() => Math.random() - 0.5);
      setElegidas(orden.slice(0, 3));
    }
    // "Volver" retrocede un paso del ritual; solo sale del ritual desde el primero.
    function volverRitual() {
      if (paso === 'reveladas') {
        setElegidas([]);
        return;
      }
      if (paso === 'elegir') {
        if (elegidas.length > 0) setElegidas([]);
        else setRitualPreguntada(false);
        return;
      }
      volverALista();
    }

    const fraseRitual = (
      <p className="max-w-[320px] text-center text-[22px] font-semibold leading-snug text-[var(--accent-lite)] [font-family:var(--font-display)]">
        Haz una respiración profunda, cierra los ojos y conecta con la pregunta.
      </p>
    );
    const ecoPregunta = pregunta.trim() ? (
      <p className="mt-2 max-w-[300px] text-center text-[13px] italic leading-snug text-[var(--text-secondary)]">
        Tu pregunta: {pregunta.trim()}
      </p>
    ) : null;

    return (
      <div className="relative flex min-h-min flex-1 flex-col pb-4 pt-3">
        {fondo}
        <CabeceraVolver titulo="Tus cartas" onVolver={volverRitual} />
        <motion.div
          key={paso}
          initial={{ opacity: 0, y: reduce ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-3 flex flex-1 flex-col items-center"
        >
          {paso === 'pregunta' && (
            <>
              <div className="flex w-full flex-1 flex-col items-center justify-center">
                {fraseRitual}
                <label htmlFor="ritual-pregunta" className="mt-6 text-center text-[16px] font-semibold text-[var(--text-primary)]">
                  ¿Cuál es tu pregunta? <span className="font-normal text-[var(--text-tertiary)]">(opcional)</span>
                </label>
                <div className="mt-3 w-full rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface-2)] p-3">
                  <textarea
                    id="ritual-pregunta"
                    value={pregunta}
                    onChange={(e) => setPregunta(e.target.value.slice(0, MAX_PREGUNTA))}
                    placeholder="Escribe aquí tu pregunta, o déjalo en blanco y que hablen las cartas…"
                    rows={4}
                    className="h-28 w-full resize-none bg-transparent text-[14px] leading-relaxed text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none"
                  />
                </div>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {['¿Debería escribirle?', '¿Cómo va mi dinero?', '¿Qué decisión me conviene?'].map((ej) => (
                    <button
                      key={ej}
                      type="button"
                      onClick={() => setPregunta(ej)}
                      className="min-h-11 rounded-full border border-[color-mix(in_oklab,var(--accent)_40%,transparent)] px-3.5 text-[13px] font-semibold text-[var(--accent-lite)] [touch-action:manipulation]"
                    >
                      {ej}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-4 w-full">
                <AppButton onClick={() => setRitualPreguntada(true)}>Elegir mis cartas</AppButton>
              </div>
            </>
          )}

          {paso === 'elegir' && (
            <>
              <div className="flex w-full flex-1 flex-col items-center justify-center">
                <p className="max-w-[300px] text-center text-[22px] font-semibold leading-snug text-[var(--accent-lite)] [font-family:var(--font-display)]">
                  Elige tres cartas
                </p>
                <p className="mt-1.5 text-center text-[14px] text-[var(--text-secondary)]">
                  {elegidas.length === 0 ? 'Deja que tu intuición decida.' : `${elegidas.length} de 3 · toca una para quitarla`}
                </p>
                {ecoPregunta}
                <div className="mt-6 grid w-full grid-cols-3 gap-x-3 gap-y-5 [@media(max-height:720px)]:mt-4 [@media(max-height:720px)]:gap-y-3">
                  {cartasRitual.map((_, i) => {
                    const orden = elegidas.indexOf(i);
                    const marcada = orden >= 0;
                    return (
                      <motion.button
                        key={i}
                        type="button"
                        aria-label={`Carta ${i + 1} de 6${marcada ? ', elegida' : ''}`}
                        aria-pressed={marcada}
                        onClick={() => tocarCarta(i)}
                        whileTap={{ scale: 0.95 }}
                        animate={reduce ? undefined : { y: marcada ? -10 : [0, -3, 0] }}
                        transition={marcada ? { duration: 0.25 } : { duration: 3.4, repeat: Infinity, delay: (i % 3) * 0.4, ease: 'easeInOut' }}
                        className="group relative flex min-h-[124px] justify-center rounded-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                      >
                        <MiniReverso className="h-[118px] w-[76px] [@media(max-height:720px)]:h-[96px] [@media(max-height:720px)]:w-[62px]" />
                        {marcada && (
                          <span
                            aria-hidden="true"
                            className="absolute -top-2 left-1/2 flex size-6 -translate-x-1/2 items-center justify-center rounded-full bg-[var(--accent)] text-[12px] font-bold text-[var(--on-accent)] shadow-[0_0_14px_color-mix(in_oklab,var(--accent)_70%,transparent)]"
                          >
                            {orden + 1}
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
              <button
                type="button"
                onClick={elegirPorMi}
                className="mt-3 flex min-h-11 items-center px-4 text-[14px] font-semibold text-[var(--text-secondary)] underline underline-offset-4"
              >
                Prefiero que LUMA elija por mí
              </button>
            </>
          )}

          {paso === 'reveladas' && (
            <>
              <div className="flex w-full flex-1 flex-col items-center justify-center">
                <p className="mb-4 text-center text-[20px] font-semibold text-[var(--accent-lite)] [font-family:var(--font-display)]">
                  Estas son tus cartas
                </p>
                <div className="flex justify-center gap-3">
                  {sacadas.map((c, i) => (
                    <motion.div
                      key={i}
                      initial={{ rotateY: reduce ? 0 : 90, opacity: 0, scale: reduce ? 1 : 0.92 }}
                      animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                      transition={{ duration: reduce ? 0.2 : 0.7, delay: reduce ? 0 : i * 0.35, ease: [0.16, 1, 0.3, 1] }}
                      style={{ perspective: 600 }}
                    >
                      <div className="flex w-[100px] flex-col items-center gap-1.5">
                        <div
                          className="relative h-[156px] w-[100px] overflow-hidden rounded-[10px] border shadow-[0_0_26px_-4px_color-mix(in_oklab,var(--accent)_60%,transparent)] [@media(max-height:720px)]:h-[120px] [@media(max-height:720px)]:w-[76px]"
                          style={{ borderColor: 'color-mix(in oklab, var(--accent) 65%, transparent)' }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={c.carta.image}
                            alt={c.carta.nombre}
                            className="h-full w-full object-cover"
                            style={{ transform: c.invertida ? 'rotate(180deg)' : undefined }}
                          />
                        </div>
                        <span className="text-center text-[11px] font-semibold leading-tight text-[var(--text-primary)]">
                          {c.carta.nombre}
                          {c.invertida ? ' (invertida)' : ''}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {sacadas.some((c) => c.invertida) && (
                  <p className="mt-3 max-w-[300px] text-center text-[11.5px] leading-snug text-[var(--text-tertiary)]">
                    Invertida: la carta salió al revés y suele hablar de lo que está bloqueado o guardado por dentro.
                  </p>
                )}
                {ecoPregunta}
                <p className="mt-4 max-w-[300px] text-center text-[16px] italic leading-snug text-[var(--accent-lite)] [font-family:var(--font-display)]">
                  {pregunta.trim()
                    ? 'Estas cartas tienen algo que decirte sobre eso que preguntas.'
                    : 'Estas cartas tienen algo que decirte.'}
                </p>
              </div>
              <div className="mt-4 w-full">
                <AppButton onClick={() => void sacarCartas(temaRitual, pregunta.trim(), sacadas)}>
                  Ver mi lectura
                </AppButton>
              </div>
            </>
          )}
        </motion.div>
      </div>
    );
  }

  // ── Vista: pregunta opcional ─────────────────────────────────────────────
  if (vista === 'pregunta' && tema) {
    return (
      <div className="relative flex min-h-min flex-1 flex-col pb-4 pt-3">
        {fondo}
        <CabeceraVolver titulo={tema.nombre} onVolver={volverALista} />
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="mt-4 flex flex-1 flex-col">
          <p className="text-center text-[22px] font-semibold leading-snug text-[var(--accent-lite)] [font-family:var(--font-display)]">
            ¿Cuál es tu pregunta sobre {tema.sobre}?
          </p>
          <div className="mt-5 flex flex-1 flex-col rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface-2)] p-3">
            <textarea
              value={pregunta}
              onChange={(e) => setPregunta(e.target.value.slice(0, MAX_PREGUNTA))}
              placeholder="Escribe aquí tu pregunta…"
              aria-label={`Tu pregunta sobre ${tema.sobre}`}
              rows={4}
              className="min-h-24 w-full flex-1 resize-none bg-transparent text-[14px] leading-relaxed text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none"
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
            {mensajeTope ?? 'No pudimos leer tus cartas ahora mismo. No se ha gastado tu lectura.'}
          </p>
          <div className="w-full max-w-[260px]">
            <AppButton
              onClick={() => {
                if (ultimoIntento.current) void sacarCartas(ultimoIntento.current.tema, ultimoIntento.current.pregunta, ultimoIntento.current.forzada);
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
          {desdeRitual && (
            <div className="w-full rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_45%,transparent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] p-3 text-center">
              <p className="text-[14px] font-semibold leading-snug text-[var(--text-primary)]">
                Tu tirada de hoy es solo el principio. Mañana, LUMA te espera con tu carta del día.
              </p>
              <div className="mt-2.5">
                <AppLinkButton href="/paywall" compact>
                  Quiero mis 3 días gratis
                </AppLinkButton>
              </div>
              <p className="mt-2 text-[11.5px] leading-snug text-[var(--text-secondary)]">
                Después, $9,99 al mes o $89,99 al año. Cancelas cuando quieras y tienes 15 días de garantía.
              </p>
            </div>
          )}
          <div className="mt-1 flex w-full flex-col gap-2">
            <AppLinkButton href="/app/diario" compact onClick={() => guardarEntradaPendiente(textoDiario)}>
              Guardar en mi diario
            </AppLinkButton>
            {!desdeRitual && (
            <button
              type="button"
              onClick={volverALista}
              className="flex h-11 w-full items-center justify-center rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_45%,transparent)] text-[13px] font-bold text-[var(--accent-lite)]"
            >
              Hacer otra tirada
            </button>
            )}
          </div>
          {!desdeRitual && !disponible && conPlan === false && <InvitacionPlan className="w-full" />}
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
            <span aria-hidden="true" className="text-[15px] leading-none">{cartaDia.emoji}</span>
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
              className="group flex h-[72px] items-center gap-2 last:odd:col-span-2 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface)] px-2.5 [@media(max-height:720px)]:h-14 [@media(min-height:841px)]:h-20"
            >
              <MiniReverso className="h-[52px] w-9 [@media(max-height:720px)]:h-10 [@media(max-height:720px)]:w-7 [@media(min-height:841px)]:h-14 [@media(min-height:841px)]:w-10" />
              <span className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5">
                <span aria-hidden="true" className="shrink-0 text-[14px] leading-none">{t.emoji}</span>
                <span className="text-center text-[13px] font-semibold leading-tight text-[var(--text-primary)] [font-family:var(--font-display)] max-[380px]:text-[12px]">{t.nombre}</span>
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
