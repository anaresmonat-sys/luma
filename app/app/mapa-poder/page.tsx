'use client';

// APP INTERNA — MAPA DE PODER ("Conócete a ti misma": numerología + arcano
// personal). Pantalla propia, sin pestaña nueva — vive principalmente en Más
// (donde se guarda el resultado de forma permanente) y también se enlaza desde
// Tarot para quien lo descubra por ahí (decisión de ubicación, 2026-09-18). El
// número y el arcano se calculan con matemática pura (lib/numerologyUtils.ts,
// sin API externa); solo la interpretación la escribe la IA real. Se calcula
// UNA sola vez — la fecha de nacimiento no cambia — y desde entonces el Coach
// también lee este dato para personalizar mejor sus respuestas (ver
// lib/almacenamiento-numerologia.ts). Sin bloqueo de pago: a diferencia de
// Compatibilidad, aquí no se pidió freemium.
// Conectado a Supabase (columnas nuevas en `profiles`, pedido explícito del
// usuario, 2026-09-18: "conéctalo a Supabase" — antes solo vivía en el celular
// y no sobrevivía a cambiar de dispositivo). Con sesión real: se lee primero
// de Supabase; si no hay nada ahí pero sí en localStorage (se calculó antes de
// iniciar sesión), se sube sola una vez. Sin sesión, sigue funcionando igual
// que antes, solo en localStorage — el login no es obligatorio todavía.

import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenHeader } from '@/components/app/ScreenHeader';
import { AppButton } from '@/components/app/AppButton';
import { CartaSacerdotisa } from '@/components/app/HeroDemoLuma';
import { calcularNumeroVida, arcanoDeNacimiento } from '@/lib/numerologyUtils';
import { calcularNumeroExpresion, calcularNumeroAlma, calcularNumeroPersonalidad } from '@/lib/numerologiaNombre';
import { signoDeFecha } from '@/lib/zodiaco';
import { imagenDeCarta } from '@/lib/tarotDeck';
import { guardarMapaPoder, leerMapaPoder, type MapaPoder } from '@/lib/almacenamiento-numerologia';
import { crearClienteNavegador } from '@/lib/supabase/client';
import { leerPerfilSupabase, guardarPerfilSupabase } from '@/lib/supabase/perfilNumerologia';

export default function MapaPoderPage() {
  const [mapa, setMapa] = useState<MapaPoder | null>(null);
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [estado, setEstado] = useState<'reposo' | 'cargando' | 'error'>('reposo');
  const [editando, setEditando] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  // El botón atrás vuelve a la pantalla desde la que se entró (Diario por defecto, o Tarot).
  const [volverHref, setVolverHref] = useState('/app/diario');

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('desde') === 'tarot') setVolverHref('/app/tarot');
  }, []);

  useEffect(() => {
    if (mapa && mapa.version !== 2) {
      setNombre((previo) => previo || mapa.nombre);
      setFecha((previo) => previo || mapa.fecha);
    }
  }, [mapa]);

  useEffect(() => {
    let cancelado = false;
    void (async () => {
      const local = leerMapaPoder();
      if (!cancelado && local) setMapa(local);

      const supabase = crearClienteNavegador();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (cancelado || !user) return;
      setUserId(user.id);

      const remoto = await leerPerfilSupabase(user.id);
      if (cancelado) return;
      if (remoto) {
        guardarMapaPoder(remoto);
        setMapa(remoto);
      } else if (local) {
        // Se calculó antes de iniciar sesión — se sube una sola vez.
        void guardarPerfilSupabase(user.id, local);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, []);

  async function calcular(nombreArg?: string, fechaArg?: string) {
    const nombreUsado = (nombreArg ?? nombre).trim();
    const fechaUsada = fechaArg ?? fecha;
    if (!fechaUsada || !nombreUsado) return;
    setEstado('cargando');
    try {
      const numero = calcularNumeroVida(fechaUsada);
      const arcano = arcanoDeNacimiento(fechaUsada);
      const signo = signoDeFecha(fechaUsada);
      const numeroExpresion = calcularNumeroExpresion(nombreUsado);
      const numeroAlma = calcularNumeroAlma(nombreUsado);
      const numeroPersonalidad = calcularNumeroPersonalidad(nombreUsado);
      const res = await fetch('/api/numerologia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numero,
          arcano: arcano.nombre,
          expresion: numeroExpresion,
          alma: numeroAlma,
          personalidad: numeroPersonalidad,
        }),
      });
      if (!res.ok) throw new Error('respuesta no OK');
      const datos: {
        esencia?: string;
        reto?: string;
        proposito?: string;
        talentos?: string;
        deseos?: string;
        imagen?: string;
      } = await res.json();
      if (!datos.esencia) throw new Error('sin lectura');
      const nuevo: MapaPoder = {
        nombre: nombreUsado,
        fecha: fechaUsada,
        numero,
        arcanoId: arcano.id,
        arcanoNombre: arcano.nombre,
        signoId: signo.id,
        signoNombre: signo.nombre,
        numeroExpresion,
        numeroAlma,
        // Compatibilidad: el Coach y los mapas guardados antes leen estos nombres.
        arquetipo: datos.esencia!,
        superpoder: datos.talentos!,
        puntoCiego: datos.reto!,
        consejo: '',
        numeroPersonalidad,
        proposito: datos.proposito!,
        deseos: datos.deseos!,
        imagen: datos.imagen!,
        version: 2,
      };
      guardarMapaPoder(nuevo);
      if (userId) void guardarPerfilSupabase(userId, nuevo);
      setMapa(nuevo);
      setEditando(false);
      setEstado('reposo');
    } catch {
      setEstado('error');
    }
  }

  // Un mapa de la versión anterior (4 tarjetas solo de amor) se trata como "sin calcular": se enseña el
  // formulario ya con su nombre y fecha, y un toque genera el mapa completo.
  const mapaVigente = mapa && mapa.version === 2 ? mapa : null;
  const mostrarFormulario = !mapaVigente || editando;

  return (
    <div className="relative flex min-h-dvh flex-col px-5 pb-6 pt-3">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 60% 40dvh at 50% 32%, color-mix(in oklab, var(--bloom-vino) 30%, transparent), transparent 68%), ' +
            'radial-gradient(ellipse 60% 36dvh at 50% 78%, color-mix(in oklab, var(--bloom-vino) 23%, transparent), transparent 70%)',
        }}
      />
      <ScreenHeader titulo="Mapa de poder" volverHref={volverHref} tituloDisplay />

      {mostrarFormulario ? (
        <div className="mt-4 flex flex-col gap-4">
          <p className="text-[13px] leading-relaxed text-[var(--text-secondary)]">
            Con tu nombre y tu fecha de nacimiento calculamos tu Arcano de nacimiento, tu Camino de Vida y
            los números de tu nombre — la base de tu autoconocimiento en LUMA.
          </p>
          <div>
            <label htmlFor="nombre-completo" className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--accent)]">
              Tu nombre completo
            </label>
            <input
              id="nombre-completo"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Como te llamas de verdad"
              className="mt-2 h-14 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface)] px-4 text-[15px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)] focus-visible:border-[var(--accent)]"
            />
          </div>
          <div>
            <label htmlFor="fecha-nacimiento" className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--accent)]">
              Tu fecha de nacimiento
            </label>
            <input
              id="fecha-nacimiento"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              max={new Date().toISOString().slice(0, 10)}
              className="mt-2 h-14 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface)] px-4 text-[15px] text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]"
            />
          </div>
          <AppButton onClick={() => void calcular()} disabled={!fecha || !nombre.trim() || estado === 'cargando'} busy={estado === 'cargando'}>
            {estado === 'cargando' ? 'Calculando…' : 'Descubrir mi Arcano'}
          </AppButton>
          {estado === 'error' && (
            <p className="text-center text-[11px] font-semibold text-[var(--an-risk)]">
              No se pudo calcular — inténtalo de nuevo.
            </p>
          )}
        </div>
      ) : (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col items-center gap-3">
              <CartaSacerdotisa disparo="montaje" numero={String(mapa!.numero)} nombre={mapa!.arcanoNombre} cita="Tu arcano de nacimiento" imagen={imagenDeCarta(mapa!.arcanoId)} />
              <p className="text-center text-[13px] font-semibold leading-relaxed text-[var(--text-secondary)]">
                {mapa!.signoNombre} · Camino de Vida <span className="text-[var(--accent-lite)]">{mapa!.numero}</span> ·
                Alma <span className="text-[var(--accent-lite)]">{mapa!.numeroAlma}</span>
                {mapa!.version === 2 && mapa!.numeroPersonalidad ? (
                  <>
                    {' '}
                    · Personalidad <span className="text-[var(--accent-lite)]">{mapa!.numeroPersonalidad}</span>
                  </>
                ) : null}
              </p>
            </div>

            {[
              { titulo: 'Tu esencia', texto: mapa!.arquetipo, extra: mapa!.puntoCiego },
              { titulo: 'Tu propósito', texto: mapa!.proposito ?? '' },
              { titulo: 'Tus talentos', texto: mapa!.superpoder },
              { titulo: 'Lo que de verdad deseas', texto: mapa!.deseos ?? '' },
              { titulo: 'Cómo te ven', texto: mapa!.imagen ?? '' },
            ].map((b: { titulo: string; texto: string; extra?: string }) => (
              <div
                key={b.titulo}
                className="rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface)] p-4"
              >
                <h3 className="text-[12px] font-bold uppercase tracking-[0.06em] text-[var(--accent)]">{b.titulo}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--text-primary)]">{b.texto}</p>
                {b.extra && (
                  <p className="mt-3 border-t border-[color-mix(in_oklab,var(--accent)_20%,transparent)] pt-3 text-[12.5px] leading-relaxed text-[var(--text-secondary)]">
                    <span className="font-bold text-[var(--accent-lite)]">Tu reto: </span>
                    {b.extra}
                  </p>
                )}
              </div>
            ))}

            <p className="text-center text-[11.5px] leading-snug text-[var(--text-tertiary)]">
              Es simbolismo para reflexionar sobre ti, no una predicción.
            </p>

            <Link
              href="/app/circulo"
              className="mt-1 flex items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_35%,transparent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] px-4 py-3"
            >
              <Sparkles size={18} strokeWidth={1.75} aria-hidden="true" className="shrink-0 text-[var(--accent-lite)]" />
              <span className="flex-1">
                <span className="block text-[13px] font-semibold text-[var(--accent-lite)]">Descubre tu círculo</span>
                <span className="mt-0.5 block text-[11px] leading-snug text-[var(--text-secondary)]">
                  Pon la fecha de tu amiga o tu crush y mira qué dice de ella
                </span>
              </span>
              <span aria-hidden="true" className="text-[var(--accent-lite)]">
                →
              </span>
            </Link>

            <button
              type="button"
              onClick={() => {
                setNombre(mapa!.nombre);
                setFecha(mapa!.fecha);
                setEditando(true);
              }}
              className="mt-1 self-center text-[12px] font-semibold text-[var(--text-tertiary)] underline underline-offset-2"
            >
              Corregir mis datos
            </button>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
