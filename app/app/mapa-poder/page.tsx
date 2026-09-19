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
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenHeader } from '@/components/app/ScreenHeader';
import { AppButton } from '@/components/app/AppButton';
import { CartaSacerdotisa } from '@/components/app/HeroDemoLuma';
import { calcularNumeroVida, arcanoDeNumero } from '@/lib/numerologyUtils';
import { calcularNumeroExpresion, calcularNumeroAlma } from '@/lib/numerologiaNombre';
import { signoDeFecha } from '@/lib/zodiaco';
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

  async function calcular() {
    if (!fecha || !nombre.trim()) return;
    setEstado('cargando');
    try {
      const numero = calcularNumeroVida(fecha);
      const arcano = arcanoDeNumero(numero);
      const signo = signoDeFecha(fecha);
      const numeroExpresion = calcularNumeroExpresion(nombre);
      const numeroAlma = calcularNumeroAlma(nombre);
      const res = await fetch('/api/numerologia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numero, arcano: arcano.nombre }),
      });
      if (!res.ok) throw new Error('respuesta no OK');
      const datos: Partial<MapaPoder> = await res.json();
      if (!datos.arquetipo) throw new Error('sin lectura');
      const nuevo: MapaPoder = {
        nombre: nombre.trim(),
        fecha,
        numero,
        arcanoId: arcano.id,
        arcanoNombre: arcano.nombre,
        signoId: signo.id,
        signoNombre: signo.nombre,
        numeroExpresion,
        numeroAlma,
        arquetipo: datos.arquetipo!,
        superpoder: datos.superpoder!,
        puntoCiego: datos.puntoCiego!,
        consejo: datos.consejo!,
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

  const mostrarFormulario = !mapa || editando;

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
      <ScreenHeader titulo="Mapa de poder" volverHref="/app/mas" tituloDisplay />

      {mostrarFormulario ? (
        <div className="mt-4 flex flex-col gap-4">
          <p className="text-[13px] leading-relaxed text-[var(--text-secondary)]">
            Con tu nombre y tu fecha de nacimiento calculamos tu Número de Camino de Vida, tu Arcano
            Mayor y tu Número del Alma — la base de tu autoconocimiento en LUMA.
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
          <AppButton onClick={calcular} disabled={!fecha || !nombre.trim() || estado === 'cargando'} busy={estado === 'cargando'}>
            {estado === 'cargando' ? 'Calculando…' : 'Descubrir mi Arcano ✨'}
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
              <CartaSacerdotisa disparo="montaje" numero={String(mapa!.numero)} nombre={mapa!.arcanoNombre} cita="Tu arcano de nacimiento" />
              <p className="text-center text-[13px] font-semibold text-[var(--text-secondary)]">
                {mapa!.signoNombre} · Camino de Vida <span className="text-[var(--accent-lite)]">{mapa!.numero}</span> ·
                Número del Alma <span className="text-[var(--accent-lite)]">{mapa!.numeroAlma}</span>
              </p>
            </div>

            {[
              { titulo: 'Tu arquetipo emocional', texto: mapa!.arquetipo },
              { titulo: 'Tu superpoder en las relaciones', texto: mapa!.superpoder },
              { titulo: 'Tu punto ciego', texto: mapa!.puntoCiego },
              { titulo: 'Tu consejo de soberanía', texto: mapa!.consejo },
            ].map((b) => (
              <div
                key={b.titulo}
                className="rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface)] p-4"
              >
                <h3 className="text-[12px] font-bold uppercase tracking-[0.06em] text-[var(--accent)]">{b.titulo}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--text-primary)]">{b.texto}</p>
              </div>
            ))}

            <Link
              href="/app/circulo"
              className="mt-1 flex items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_35%,transparent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] px-4 py-3"
            >
              <span className="text-[17px] leading-none" aria-hidden="true">
                💫
              </span>
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
