'use client';

// APP INTERNA — EL CÍRCULO (perfiles de amigas/crush con la misma numerología
// que Mapa de Poder, pero para OTRAS personas). Idea del usuario, 2026-09-18:
// convertir "conócete a ti misma" en algo social — "pon la fecha de tu amiga y
// mira qué dice LUMA de ella". Fase 1 de 2 (aprobada): guardar y ver perfiles
// ilimitados. La tarjeta gráfica para compartir por WhatsApp/Instagram queda
// para una segunda vuelta (pieza técnica nueva, no construida hoy).
// Reutiliza EXACTAMENTE el mismo cálculo que Mapa de Poder (numerología +
// arcano + signo, sin costo de API adicional — cada perfil solo cuesta la
// interpretación de IA, igual que las otras funciones). Persistencia: con
// sesión real, sincroniza a Supabase (`circulo_perfiles`); sin sesión, sigue
// funcionando en localStorage. Sin gate de plan todavía — la pregunta de qué
// es exactamente "LUMA VIP" sigue sin resolver (ver ESTADO.md); cuando se
// decida, aquí es donde se aplicaría el límite para el plan gratuito.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { planActivo } from '@/lib/prueba-gratis';
import { ScreenHeader } from '@/components/app/ScreenHeader';
import { AppButton } from '@/components/app/AppButton';
import { CartaSacerdotisa } from '@/components/app/HeroDemoLuma';
import { calcularNumeroVida, arcanoDeNumero } from '@/lib/numerologyUtils';
import { calcularNumeroExpresion, calcularNumeroAlma } from '@/lib/numerologiaNombre';
import { signoDeFecha } from '@/lib/zodiaco';
import { imagenDeCarta } from '@/lib/tarotDeck';
import { leerCirculo, agregarAlCirculo, quitarDelCirculo, type PersonaCirculo } from '@/lib/almacenamiento-circulo';
import { crearClienteNavegador } from '@/lib/supabase/client';
import { leerCirculoSupabase, agregarAlCirculoSupabase, quitarDelCirculoSupabase } from '@/lib/supabase/circulo';

const RELLENO_DIFUMINADO =
  'Aquí va la lectura completa de esta persona, con su forma de vincularse y lo que conviene tener presente.';

export default function CirculoPage() {
  const [personas, setPersonas] = useState<PersonaCirculo[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [estado, setEstado] = useState<'reposo' | 'cargando' | 'error'>('reposo');
  const [abierta, setAbierta] = useState<string | null>(null);
  const [conPlan, setConPlan] = useState(false);

  useEffect(() => {
    let cancelado = false;
    setPersonas(leerCirculo());
    setConPlan(planActivo());
    void (async () => {
      const supabase = crearClienteNavegador();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (cancelado || !user) return;
      setUserId(user.id);
      const remoto = await leerCirculoSupabase(user.id);
      if (!cancelado && remoto.length > 0) {
        guardarLocalYEstado(remoto);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, []);

  // Sin plan, solo la PRIMERA persona agregada (la más antigua, al final de la
  // lista) se ve completa; las demás muestran solo el arquetipo emocional.
  // Decisión del usuario, 2026-09-20. Sin plan real todavía (Hotmart pendiente):
  // `planActivo` es la simulación de /paywall.
  function bloqueada(indice: number): boolean {
    return !conPlan && indice !== personas.length - 1;
  }

  function guardarLocalYEstado(lista: PersonaCirculo[]) {
    setPersonas(lista);
  }

  async function agregar() {
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
      const datos: { arquetipo?: string; superpoder?: string; puntoCiego?: string; consejo?: string } = await res.json();
      if (!datos.arquetipo) throw new Error('sin lectura');

      const base = {
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

      let nueva: PersonaCirculo;
      if (userId) {
        const insertada = await agregarAlCirculoSupabase(userId, base);
        nueva = insertada ?? { ...base, id: crypto.randomUUID() };
      } else {
        nueva = { ...base, id: crypto.randomUUID() };
      }

      const siguiente = agregarAlCirculo(nueva);
      setPersonas(siguiente);
      setNombre('');
      setFecha('');
      setMostrarForm(false);
      setEstado('reposo');
    } catch {
      setEstado('error');
    }
  }

  async function eliminar(id: string) {
    setPersonas(quitarDelCirculo(id));
    if (userId) void quitarDelCirculoSupabase(userId, id);
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
      <ScreenHeader titulo="Tu círculo" volverHref="/app/mapa-poder" tituloDisplay />
      <p className="mt-1 text-[13px] leading-relaxed text-[var(--text-secondary)]">
        Pon el nombre y la fecha de nacimiento de alguien especial — una amiga, tu crush — y descubre
        su arcano y su forma de amar.
      </p>

      {!mostrarForm && (
        <button
          type="button"
          onClick={() => setMostrarForm(true)}
          className="mt-4 flex h-[46px] w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-dashed border-[color-mix(in_oklab,var(--accent)_45%,transparent)] text-[13px] font-bold text-[var(--accent-lite)]"
        >
          + Agregar a alguien
        </button>
      )}

      <AnimatePresence>
        {mostrarForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 flex flex-col gap-3 overflow-hidden rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface)] p-4"
          >
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Su nombre completo"
              className="h-12 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface-2)] px-3 text-[14px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)] focus-visible:border-[var(--accent)]"
            />
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              max={new Date().toISOString().slice(0, 10)}
              className="h-12 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface-2)] px-3 text-[14px] text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]"
            />
            <AppButton onClick={agregar} disabled={!fecha || !nombre.trim() || estado === 'cargando'} busy={estado === 'cargando'}>
              {estado === 'cargando' ? 'Calculando…' : 'Descubrir su Arcano ✨'}
            </AppButton>
            {estado === 'error' && (
              <p className="text-center text-[11px] font-semibold text-[var(--an-risk)]">
                No se pudo calcular — inténtalo de nuevo.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-5 flex flex-col gap-3">
        {personas.length === 0 && !mostrarForm && (
          <p className="mt-6 text-center text-[12px] leading-relaxed text-[var(--text-tertiary)]">
            💡 Todavía no agregaste a nadie — empieza con tu mejor amiga o esa persona que te trae de
            cabeza.
          </p>
        )}
        {personas.map((p, i) => {
          const abierto = abierta === p.id;
          return (
            <div key={p.id} className="rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface)]">
              <div className="flex w-full items-center gap-3 p-4">
                <button
                  type="button"
                  onClick={() => setAbierta(abierto ? null : p.id)}
                  aria-expanded={abierto}
                  className="flex-1 text-left"
                >
                  <span className="block text-[14px] font-semibold text-[var(--text-primary)]">{p.nombre}</span>
                  <span className="mt-0.5 block text-[11px] text-[var(--text-secondary)]">
                    {p.signoNombre} · {p.arcanoNombre}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => void eliminar(p.id)}
                  aria-label={`Quitar a ${p.nombre} del círculo`}
                  className="flex size-9 shrink-0 items-center justify-center text-[13px] text-[var(--text-tertiary)]"
                >
                  ✕
                </button>
              </div>

              <AnimatePresence>
                {abierto && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col items-center gap-3 px-4 pb-5">
                      <div className="scale-[0.7]">
                        <CartaSacerdotisa disparo="montaje" numero={String(p.numero)} nombre={p.arcanoNombre} cita={`Camino de Vida ${p.numero}`} imagen={imagenDeCarta(p.arcanoId)} />
                      </div>
                      {[
                        { titulo: 'Su arquetipo emocional', texto: p.arquetipo, libre: true },
                        { titulo: 'Su superpoder en las relaciones', texto: p.superpoder, libre: false },
                        { titulo: 'Su punto ciego', texto: p.puntoCiego, libre: false },
                        { titulo: 'Consejo para ti', texto: p.consejo, libre: false },
                      ].map((b) => (
                        <div key={b.titulo} className="w-full">
                          <h3 className="text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--accent)]">{b.titulo}</h3>
                          {b.libre || !bloqueada(i) ? (
                            <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--text-primary)]">{b.texto}</p>
                          ) : (
                            // Texto de relleno, NO el real: difuminado a propósito para que ni acercando la pantalla se lea.
                            <p aria-hidden="true" className="mt-1 select-none text-[12.5px] leading-relaxed text-[var(--text-primary)] blur-[6px]">
                              {RELLENO_DIFUMINADO}
                            </p>
                          )}
                        </div>
                      ))}
                      {bloqueada(i) && (
                        <Link
                          href="/paywall"
                          className="mt-1 flex h-[46px] w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_45%,transparent)] bg-[color-mix(in_oklab,var(--accent)_12%,transparent)] text-[13px] font-bold text-[var(--accent-lite)]"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <rect x="4" y="11" width="16" height="10" rx="2" />
                            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                          </svg>
                          Desbloquea su lectura completa
                        </Link>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
