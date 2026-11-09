'use client';

// APP INTERNA — §3 INICIO (blueprint: vista-previa-app.html frame 3, aprobado).
// Protagonista: la carta del día (dispositivo ownable, se revela con resplandor +
// ascenso/rotación al abrir — firma de FICHA-ARTE). 1 acción primaria por acceso
// rápido, check-in de ánimo real (confirma guardado — cambia el diario, loop de
// retención). El avatar es el único punto de entrada a "Más" (cuenta/ajustes).

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, animate, useReducedMotion } from 'motion/react';
import { Flame, MessageCircle, Search, Sparkles, User } from 'lucide-react';
import { CartaGirando } from '@/components/app/CartaGirando';
import { arcanoMayorAlAzar } from '@/lib/tarotDeck';
import { MoodPicker } from '@/components/app/MoodPicker';
import { BienvenidaCompra } from '@/components/app/BienvenidaCompra';
import { EMOCIONES_INICIO } from '@/lib/seed-datos';
import { crearClienteNavegador } from '@/lib/supabase/client';
import { calcularRacha, calcularTermometro, type Checkin, type Termometro } from '@/lib/racha';

const VENTANA_DIAS = 40;

const MIN_REGISTROS = 3;

// Entrada escalonada: cada bloque entra 70 ms después del anterior.
const entrada = (i: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] as const },
});

export default function InicioPage() {
  const [saludo, setSaludo] = useState('Hola');
  const [apodo, setApodo] = useState('');
  const [animo, setAnimo] = useState<string | null>(null);
  const [aviso, setAviso] = useState<'guardando' | 'guardado' | 'error' | null>(null);
  const [animoGuardado, setAnimoGuardado] = useState<string | null>(null);
  const [pulso, setPulso] = useState(0);
  const reducir = useReducedMotion();
  const [rachaMostrada, setRachaMostrada] = useState(0);
  const temporizadorAviso = useRef<number | null>(null);
  useEffect(
    () => () => {
      if (temporizadorAviso.current !== null) window.clearTimeout(temporizadorAviso.current);
    },
    []
  );
  const [userId, setUserId] = useState<string | null>(null);
  const [racha, setRacha] = useState(0);
  const [termometro, setTermometro] = useState<Termometro>({ haceUnMes: null, estaSemana: null });
  // Con 1 o 2 registros una «mejora» no significa nada: la cajita pide al menos 3 días en cada ventana.
  const hayProgreso = Boolean(
    termometro.haceUnMes &&
    termometro.estaSemana &&
    termometro.haceUnMes.total >= MIN_REGISTROS &&
    termometro.estaSemana.total >= MIN_REGISTROS
  );
  // Carta decorativa: un arcano mayor al azar (sin relación con la «Carta del día» de Tarot). Se elige tras montar para no desajustar la hidratación.
  const [arcano, setArcano] = useState<{ nombre: string; image: string } | null>(null);
  useEffect(() => {
    const carta = arcanoMayorAlAzar();
    setArcano({ nombre: carta.nombre, image: carta.image });
  }, []);

  // La racha cuenta de 0 al valor real al llegar (con «reducir movimiento» aparece ya completa).
  useEffect(() => {
    if (racha < 2 || reducir) {
      setRachaMostrada(racha);
      return;
    }
    const control = animate(0, racha, { duration: 0.7, ease: 'easeOut', onUpdate: (v) => setRachaMostrada(Math.round(v)) });
    return () => control.stop();
  }, [racha, reducir]);

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
      // El ánimo de hoy ya marcado se recupera (el más reciente del día) para no volver a pedirlo ni duplicarlo.
      const hoy = new Date().toDateString();
      const deHoy = data.find((c) => new Date(c.created_at).toDateString() === hoy);
      if (deHoy && EMOCIONES_INICIO.some((e) => e.id === deHoy.animo)) {
        setAnimo(deHoy.animo);
        setAnimoGuardado(deHoy.animo);
      }
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

  function mostrarAviso(tipo: 'guardado' | 'error') {
    setAviso(tipo);
    if (temporizadorAviso.current !== null) window.clearTimeout(temporizadorAviso.current);
    temporizadorAviso.current = window.setTimeout(() => setAviso(null), tipo === 'error' ? 5000 : 2200);
  }

  function elegirAnimo(id: string) {
    // Sin cuenta el ánimo no se guarda en ninguna parte: tampoco se dice que sí.
    if (!userId) {
      setAnimo(id);
      return;
    }
    // Mientras se guarda no se admiten más toques, y volver a tocar el mismo ánimo ya guardado no crea otro registro.
    if (aviso === 'guardando') return;
    if (id === animoGuardado) {
      mostrarAviso('guardado');
      return;
    }
    const anterior = animoGuardado;
    setAnimo(id);
    setAviso('guardando');
    void (async () => {
      const supabase = crearClienteNavegador();
      let fallo = false;
      try {
        const { error } = await supabase.from('checkins').insert({ user_id: userId, animo: id });
        fallo = Boolean(error);
      } catch {
        fallo = true;
      }
      if (fallo) {
        // No se guardó: la selección vuelve a lo último que sí está guardado.
        setAnimo(anterior);
        mostrarAviso('error');
        return;
      }
      setAnimoGuardado(id);
      setPulso((n) => n + 1);
      mostrarAviso('guardado');
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
      <BienvenidaCompra onNombre={setApodo} />
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
          <img src="/luma-icon-sm.webp" alt="" aria-hidden="true" width={18} height={24} className="h-6 w-auto" />
          LUMA
        </span>
        <Link href="/app/mas" aria-label="Tu cuenta" className="flex size-11 items-center justify-center">
          <span
            className="flex size-7 items-center justify-center rounded-full"
            style={{ background: 'linear-gradient(150deg, var(--accent-lite), var(--card-title))' }}
          >
            <User size={14} strokeWidth={2.5} color="var(--on-accent)" aria-hidden="true" />
          </span>
        </Link>
      </div>

      <div
        className="flex min-h-0 flex-1 flex-col gap-8 [@media(min-height:721px)_and_(max-height:840px)]:gap-4 [@media(min-height:621px)_and_(max-height:720px)]:gap-3 [@media(max-height:620px)]:gap-2"
      >
        <motion.div {...entrada(0)}>
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[var(--accent)]">{apodo ? `${saludo}, ${apodo}` : saludo}</p>
            {racha >= 2 && (
              <span className="flex items-center gap-1 text-[12px] font-semibold text-[var(--text-secondary)]">
                <Flame size={13} strokeWidth={2} aria-hidden="true" className="text-[var(--accent-lite)]" />
                {rachaMostrada} días
              </span>
            )}
          </div>
          <h1 className="mt-1 text-[24px] [@media(max-height:660px)]:text-[20px] font-semibold text-[var(--text-primary)] [font-family:var(--font-display)]">
            ¿Cómo estás hoy?
          </h1>
          <div className="mt-4 [@media(max-height:620px)]:mt-2">
            <MoodPicker emociones={EMOCIONES_INICIO} seleccion={animo} onSeleccionar={elegirAnimo} bloqueado={aviso === 'guardando'} pulso={pulso} />
          </div>
          {/* Justo debajo de los emojis: el aviso «Guardado en tu diario» y la cajita «Tu progreso» comparten el mismo hueco
              (el aviso sustituye a la cajita 2 s) para que no cambie la altura de la pantalla. La cajita es de 2 líneas: la
              carta es lo importante y mantiene su tamaño. */}
          <div
            className={
              hayProgreso
                ? 'mt-1.5 min-h-[3rem]'
                : 'mt-2 h-7 [@media(min-height:621px)_and_(max-height:720px)]:h-3 [@media(max-height:620px)]:h-0'
            }
          >
            <AnimatePresence mode="wait" initial={false}>
              {aviso ? (
                <motion.p
                  key={aviso}
                  role={aviso === 'error' ? 'alert' : 'status'}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={
                    aviso === 'error'
                      ? 'inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_oklab,var(--an-risk)_70%,transparent)] bg-[color-mix(in_oklab,var(--an-risk)_26%,var(--bg))] px-3 py-1 text-[12px] font-semibold text-[var(--text-primary)]'
                      : 'inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_oklab,var(--accent)_16%,transparent)] px-3 py-1 text-[12px] font-semibold text-[var(--accent-lite)]'
                  }
                >
                  {aviso === 'error'
                    ? 'No pudimos guardar tu ánimo. Toca de nuevo.'
                    : aviso === 'guardando'
                      ? 'Guardando…'
                      : '✓ Guardado en tu diario'}
                </motion.p>
              ) : (
                hayProgreso &&
                termometro.haceUnMes &&
                termometro.estaSemana && (
                  <motion.div
                    key="progreso"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded-[var(--radius-card)] bg-[color-mix(in_oklab,var(--bg)_70%,black)] px-3 py-2"
                  >
                    <p className="text-[12px] leading-snug text-[var(--text-secondary)]">
                      <span className="font-semibold uppercase tracking-[0.06em] text-[var(--accent)]">Tu progreso</span> · Días con ansiedad o
                      tristeza: esta semana{' '}
                      <strong className="text-[var(--text-primary)]">
                        {termometro.estaSemana.negativos} de {termometro.estaSemana.total}
                      </strong>
                      , hace un mes{' '}
                      <strong className="text-[var(--text-primary)]">
                        {termometro.haceUnMes.negativos} de {termometro.haceUnMes.total}
                      </strong>
                      {termometro.estaSemana.negativos / termometro.estaSemana.total <
                        termometro.haceUnMes.negativos / termometro.haceUnMes.total && (
                        <span className="font-semibold text-[var(--accent-lite)]"> · vas mejorando</span>
                      )}
                    </p>
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div {...entrada(1)} className="flex min-h-0 flex-1 flex-col items-center gap-2">
          <Link
            href="/app/tarot"
            aria-label="Abrir mi lectura de tarot"
            className="flex min-h-0 flex-1 items-center justify-center"
          >
            <CartaGirando arcano={arcano ?? undefined} />
          </Link>
          <Link
            href="/app/tarot"
            className="mt-6 flex h-[48px] w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-gradient-to-b from-[var(--accent-lite)] to-[var(--accent)] text-[14px] font-bold text-[var(--on-accent)] shadow-[0_8px_16px_-10px_color-mix(in_oklab,var(--accent)_60%,transparent)] transition-transform duration-150 [touch-action:manipulation] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lite)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] [@media(min-height:721px)_and_(max-height:840px)]:mt-3 [@media(min-height:721px)_and_(max-height:840px)]:h-11 [@media(min-height:621px)_and_(max-height:720px)]:mt-2 [@media(min-height:621px)_and_(max-height:720px)]:h-9 [@media(min-height:621px)_and_(max-height:720px)]:text-[12.5px] [@media(max-height:620px)]:mt-1 [@media(max-height:620px)]:h-8 [@media(max-height:620px)]:text-[12px]"
          >
            <Sparkles size={16} strokeWidth={2} aria-hidden="true" />
            Abrir mi lectura de tarot hoy →
          </Link>
        </motion.div>

        <motion.div {...entrada(2)} className="grid shrink-0 grid-cols-2 gap-3 pb-2 [@media(max-height:620px)]:pb-0">
          <Link
            href="/app/descifrar"
            className="flex min-h-[48px] w-full items-center justify-center gap-1.5 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_55%,transparent)] bg-[color-mix(in_oklab,var(--accent)_8%,transparent)] px-3 py-2 text-center text-[12px] font-bold leading-snug text-[var(--accent-lite)] transition-transform duration-150 [touch-action:manipulation] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lite)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] [@media(max-height:620px)]:min-h-9 [@media(max-height:620px)]:py-1 [@media(max-height:620px)]:text-[11px]"
          >
            <Search size={15} strokeWidth={2} aria-hidden="true" />
            Descifrar un chat
          </Link>
          <Link
            href="/app/coach"
            className="flex min-h-[48px] w-full items-center justify-center gap-1.5 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_55%,transparent)] bg-[color-mix(in_oklab,var(--accent)_8%,transparent)] px-3 py-2 text-center text-[12px] font-bold leading-snug text-[var(--accent-lite)] transition-transform duration-150 [touch-action:manipulation] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lite)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] [@media(max-height:620px)]:min-h-9 [@media(max-height:620px)]:py-1 [@media(max-height:620px)]:text-[11px]"
          >
            <MessageCircle size={15} strokeWidth={2} aria-hidden="true" />
            Hablar con mi coach
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
