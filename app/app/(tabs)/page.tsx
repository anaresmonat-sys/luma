'use client';

// APP INTERNA — §3 INICIO (blueprint: vista-previa-app.html frame 3, aprobado).
// Protagonista: la carta del día (dispositivo ownable, se revela con resplandor +
// ascenso/rotación al abrir — firma de FICHA-ARTE). 1 acción primaria por acceso
// rápido, check-in de ánimo real (confirma guardado — cambia el diario, loop de
// retención). El avatar es el único punto de entrada a "Más" (cuenta/ajustes).

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { CartaSacerdotisa } from '@/components/app/HeroDemoLuma';
import { MoodPicker } from '@/components/app/MoodPicker';
import { AppLinkButton } from '@/components/app/AppButton';
import { USUARIA, EMOCIONES_INICIO } from '@/lib/seed-datos';
import { crearClienteNavegador } from '@/lib/supabase/client';
import { calcularRacha, calcularTermometro, type Checkin, type Termometro } from '@/lib/racha';
import { cartaDelDia, citaDeCarta } from '@/lib/tarotDeck';

const VENTANA_DIAS = 40;

export default function InicioPage() {
  const [saludo, setSaludo] = useState('Hola');
  const [animo, setAnimo] = useState<string | null>(null);
  const [guardado, setGuardado] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [racha, setRacha] = useState(0);
  const [termometro, setTermometro] = useState<Termometro>({ haceUnMes: null, estaSemana: null });

  useEffect(() => {
    const h = new Date().getHours();
    setSaludo(h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches');
  }, []);

  useEffect(() => {
    let cancelado = false;
    async function cargar() {
      const supabase = crearClienteNavegador();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || cancelado) return;
      setUserId(user.id);
      const desde = new Date();
      desde.setDate(desde.getDate() - VENTANA_DIAS);
      const { data } = await supabase
        .from('checkins')
        .select('animo, created_at')
        .gte('created_at', desde.toISOString())
        .order('created_at', { ascending: false });
      if (cancelado || !data) return;
      actualizarDerivados(data);
    }
    void cargar();
    return () => {
      cancelado = true;
    };
  }, []);

  function actualizarDerivados(checkins: Checkin[]) {
    setRacha(calcularRacha(checkins));
    setTermometro(calcularTermometro(checkins));
  }

  function elegirAnimo(id: string) {
    setAnimo(id);
    setGuardado(true);
    window.setTimeout(() => setGuardado(false), 2200);
    if (!userId) return;
    void (async () => {
      const supabase = crearClienteNavegador();
      const { error } = await supabase.from('checkins').insert({ user_id: userId, animo: id });
      if (error) return;
      const desde = new Date();
      desde.setDate(desde.getDate() - VENTANA_DIAS);
      const { data } = await supabase
        .from('checkins')
        .select('animo, created_at')
        .gte('created_at', desde.toISOString())
        .order('created_at', { ascending: false });
      if (data) actualizarDerivados(data);
    })();
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col pb-4 pt-3">
      {/* bloom local: los del body (globals.css) se apagan cerca del header y esta
          pantalla es larga — sin esto, la franja entre el ánimo y la carta se lee
          como fill plano (defecto de profundidad, revisor ronda 2). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/4 -z-10 h-[26rem]"
        style={{
          background:
            'radial-gradient(closest-side at 50% 50%, color-mix(in oklab, var(--bloom-vino) 32%, transparent), transparent)',
        }}
      />
      {/* header: wordmark + avatar → único punto de entrada a "Más" (cuenta) */}
      <div className="flex shrink-0 items-center justify-between py-2">
        <span className="flex items-center gap-2 text-[16px] font-semibold tracking-[0.24em] text-[var(--accent-lite)] [font-family:var(--font-display)]">
          <img src="/luma-icon.png" alt="" aria-hidden="true" className="h-6 w-auto" />
          LUMA
        </span>
        <Link href="/app/mas" aria-label="Tu cuenta" className="flex size-11 items-center justify-center">
          <span
            className="flex size-7 items-center justify-center rounded-full text-[12px] font-bold text-[var(--on-accent)]"
            style={{ background: 'linear-gradient(150deg, var(--accent-lite), var(--card-title))' }}
          >
            {USUARIA.nombre.charAt(0)}
          </span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex min-h-0 flex-1 flex-col justify-between gap-8 [@media(min-height:681px)_and_(max-height:760px)]:gap-4 [@media(max-height:680px)]:gap-3"
      >
        <div>
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--accent)]">
              {saludo}, {USUARIA.nombre}
            </p>
            {racha >= 2 && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-[var(--text-secondary)]">
                🔥 {racha} días
              </span>
            )}
          </div>
          <h1 className="mt-1 text-[20px] font-semibold text-[var(--text-primary)] [font-family:var(--font-display)]">
            ¿Cómo estás hoy?
          </h1>
          <div className="mt-4">
            <MoodPicker emociones={EMOCIONES_INICIO} seleccion={animo} onSeleccionar={elegirAnimo} />
          </div>
          <div className="mt-2 h-7 [@media(max-height:680px)]:h-3">
            <AnimatePresence>
              {guardado && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_oklab,var(--accent)_16%,transparent)] px-3 py-1 text-[11px] font-semibold text-[var(--accent-lite)]"
                >
                  ✓ Guardado en tu diario
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {termometro.haceUnMes && termometro.estaSemana && (
            <div className="mt-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface)] p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--accent)]">
                Tu progreso
              </p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--text-secondary)]">
                Hace 30 días sentiste ansiedad o tristeza{' '}
                <strong className="text-[var(--text-primary)]">
                  {termometro.haceUnMes.negativos} de {termometro.haceUnMes.total} días
                </strong>
                . Esta semana:{' '}
                <strong className="text-[var(--text-primary)]">
                  {termometro.estaSemana.negativos} de {termometro.estaSemana.total} días
                </strong>
                {termometro.estaSemana.negativos / termometro.estaSemana.total <
                  termometro.haceUnMes.negativos / termometro.haceUnMes.total && ' — vas mejorando 🌙'}
                .
              </p>
            </div>
          )}
        </div>

        <Link href="/app/tarot" className="flex flex-col items-center gap-2">
          {(() => {
            const hoy = cartaDelDia();
            return (
              <CartaSacerdotisa
                disparo="montaje"
                numero={hoy.carta.numero}
                nombre={hoy.carta.nombre}
                cita={citaDeCarta(hoy)}
                imagen={hoy.carta.image}
                invertida={hoy.invertida}
              />
            );
          })()}
          <span className="mt-6 text-[13px] font-bold text-[var(--accent-lite)] [@media(min-height:681px)_and_(max-height:760px)]:mt-3 [@media(max-height:680px)]:mt-2">Abrir mi lectura de hoy →</span>
        </Link>

        <div className="grid shrink-0 grid-cols-2 gap-3 pb-2">
          <AppLinkButton href="/app/descifrar" compact>
            <span aria-hidden="true">🔎</span>Descifrar un chat
          </AppLinkButton>
          <AppLinkButton href="/app/coach" compact>
            <span aria-hidden="true">💬</span>Hablar con mi coach
          </AppLinkButton>
        </div>
      </motion.div>
    </div>
  );
}
