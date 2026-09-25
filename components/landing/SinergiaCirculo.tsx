'use client';

// KIT DE LANDING — §5B SINERGIA + EL CÍRCULO (gancho de curiosidad, sutil).
// Idea del usuario (2026-09-25): usar la compatibilidad de signos y El Círculo
// —lo más "compartible" de la app— para enganchar sin quitarle protagonismo al
// mensaje principal (descifrar conversaciones). Decisiones de honestidad:
//  · el % sale de un cálculo fijo (lib/sinergia-signos.ts), no de la IA: cuesta
//    cero y una pareja da siempre el mismo número;
//  · lo borroso es TEXTO DE RELLENO, nunca el análisis real (un desenfoque de CSS
//    se puede leer desde el navegador);
//  · no se promete "ilimitado" (el tope real es 10 personas nuevas al mes) ni
//    compartir por WhatsApp (no existe todavía).
// Spec: pantalla=sección 5B · objeto principal=el % de sinergia (dato héroe) ·
// acento solo en el % y el botón · baseline: entrada escalonada, conteo del
// número, barra que se llena, tap 0.97 · estados: sin calcular / calculado /
// reduced-motion (el número aparece directo).

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { CtaButton, Kicker, SectionShell, useReveal, VIEWPORT_ONCE } from './ui';
import { SIGNOS_ZODIACO } from '@/lib/zodiaco';
import { sinergiaEntre, type SinergiaSignos } from '@/lib/sinergia-signos';
import { registrarEventoUnaVez } from '@/lib/registrar-evento';

const CAMPO =
  'h-12 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface-2)] px-3 text-[16px] text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]';

const PERSONAS_EJEMPLO = [
  {
    emoji: '💞',
    etiqueta: 'Mi pareja',
    signo: '♎︎ Libra',
    arcano: 'Los Enamorados',
    linea: 'Busca equilibrio. Su punto ciego: evitar el conflicto.',
  },
  {
    emoji: '🌸',
    etiqueta: 'Mi mejor amiga',
    signo: '♓︎ Piscis',
    arcano: 'La Sacerdotisa',
    linea: 'Intuitiva y leal. Su punto ciego: absorber lo ajeno.',
  },
  {
    emoji: '✨',
    etiqueta: 'Mi cita',
    signo: '♈︎ Aries',
    arcano: 'El Emperador',
    linea: 'Directo y con iniciativa. Su punto ciego: la impaciencia.',
  },
];

export function SinergiaCirculo({ ctaLabel, ctaHref }: { ctaLabel: string; ctaHref: string }) {
  const { contenedor, item } = useReveal();
  const reduce = useReducedMotion();
  // Ejemplo precargado: quien llega puede tocar "Calcular" al instante, sin elegir nada.
  const [signoA, setSignoA] = useState('leo');
  const [signoB, setSignoB] = useState('sagitario');
  // Arranca ya calculado con el ejemplo: el número héroe se ve sin tocar nada. Es determinista,
  // así que servidor y cliente coinciden (sin desajuste de hidratación).
  const [resultado, setResultado] = useState<SinergiaSignos | null>(() => sinergiaEntre('leo', 'sagitario'));
  const [mostrado, setMostrado] = useState(0);
  const [aviso, setAviso] = useState(false);

  function calcular() {
    const r = signoA && signoB ? sinergiaEntre(signoA, signoB) : null;
    if (!r) {
      setAviso(true);
      return;
    }
    setAviso(false);
    setResultado(r);
    registrarEventoUnaVez('sinergia_calculada');
  }

  // Conteo animado del número héroe (0 → %). Con reduced-motion aparece directo.
  useEffect(() => {
    if (!resultado) return;
    if (reduce) {
      setMostrado(resultado.porcentaje);
      return;
    }
    const inicio = performance.now();
    const duracion = 900;
    let cuadro: number;
    function paso(ahora: number) {
      const progreso = Math.min(1, (ahora - inicio) / duracion);
      const suave = 1 - Math.pow(1 - progreso, 3);
      setMostrado(Math.round(suave * (resultado?.porcentaje ?? 0)));
      if (progreso < 1) cuadro = requestAnimationFrame(paso);
    }
    setMostrado(0);
    cuadro = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(cuadro);
  }, [resultado, reduce]);

  return (
    <SectionShell id="sinergia" elevacion="elevada" compacta degradadoSuperior ariaLabel="Sinergia de signos y El Círculo">
      <motion.div
        variants={contenedor}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="mx-auto max-w-[780px]"
      >
        <motion.div variants={item}>
          <Kicker>PARA JUGAR Y COMPARTIR</Kicker>
          <h2 className="text-balance text-[30px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)] md:text-[40px]">
            ¿Qué tan <span className="text-[var(--accent)]">compatibles</span> son sus signos?
          </h2>
          <p className="mt-4 max-w-[620px] text-[17px] leading-relaxed text-[var(--text-secondary)]">
            Elige dos signos y mira su sinergia simbólica. Es un juego para reflexionar, no una predicción.
          </p>
        </motion.div>

        {/* Mini-calculadora */}
        <motion.div
          variants={item}
          className="mt-8 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--bg)] p-4 md:p-6"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-[13px] font-medium text-[var(--text-secondary)]">
              Tu signo
              <select
                value={signoA}
                onChange={(e) => {
                  setSignoA(e.target.value);
                  setAviso(false);
                }}
                className={CAMPO}
              >
                <option value="">Elige un signo</option>
                {SIGNOS_ZODIACO.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.simbolo} {s.nombre}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-[13px] font-medium text-[var(--text-secondary)]">
              Su signo
              <select
                value={signoB}
                onChange={(e) => {
                  setSignoB(e.target.value);
                  setAviso(false);
                }}
                className={CAMPO}
              >
                <option value="">Elige un signo</option>
                {SIGNOS_ZODIACO.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.simbolo} {s.nombre}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <motion.button
            type="button"
            onClick={calcular}
            whileTap={{ scale: 0.97 }}
            className="mt-4 flex min-h-[52px] w-full items-center justify-center rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_75%,transparent)] px-8 text-[17px] font-semibold text-[var(--accent)] transition-colors duration-150 hover:bg-[var(--chip-bg)] [touch-action:manipulation] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            Calcular sinergia
          </motion.button>
          {aviso && (
            <p role="status" className="mt-2 text-center text-[13px] font-semibold text-[var(--accent-2)]">
              Elige los dos signos para calcular.
            </p>
          )}

          {resultado && (
            <div className="mt-6" aria-live="polite">
              <p className="text-center text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                Sinergia simbólica
              </p>
              <p className="mt-1 text-center text-[56px] font-bold leading-none tabular-nums text-[var(--accent)] [font-family:var(--font-display)]">
                {mostrado}%
              </p>
              <div className="mx-auto mt-3 h-2 max-w-[320px] rounded-full bg-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)]">
                <div
                  className="h-2 rounded-full bg-[var(--accent)] transition-[width] duration-100"
                  style={{ width: `${mostrado}%` }}
                />
              </div>
              <p className="mx-auto mt-4 max-w-[520px] text-center text-[16px] leading-relaxed text-[var(--text-primary)]">
                {resultado.frase}
              </p>

              {/* Zona "bloqueada": el texto de abajo es de RELLENO, no el análisis real. */}
              <div className="relative mt-5 min-h-48 overflow-hidden rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_22%,transparent)]">
                <div aria-hidden="true" className="select-none space-y-3 p-4 blur-sm">
                  <p className="text-[14px] leading-relaxed text-[var(--text-secondary)]">
                    Química y atracción: lo que los acerca, lo que sienten cuando están juntos y por qué se quedan
                    pensando el uno en el otro incluso cuando no hablan durante horas.
                  </p>
                  <p className="text-[14px] leading-relaxed text-[var(--text-secondary)]">
                    Consejo para cuidar tus límites: una idea concreta para hoy, sin perder tu dignidad.
                  </p>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[color-mix(in_oklab,var(--bg)_42%,transparent)] p-4 text-center">
                  <p className="max-w-[420px] text-[16px] font-semibold leading-snug text-[var(--text-primary)]">
                    Tu análisis completo —química, fricciones y consejo para cuidar tus límites— te espera dentro de
                    LUMA.
                  </p>
                  <CtaButton href={ctaHref} fullMobile>
                    Ver mi análisis completo
                  </CtaButton>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* El Círculo */}
        <motion.div variants={item} className="mt-14">
          <h3 className="text-balance text-[24px] font-bold leading-[1.2] text-[var(--text-primary)] [font-family:var(--font-display)] md:text-[30px]">
            Tu círculo, <span className="text-[var(--accent)]">en un solo lugar</span>
          </h3>
          <p className="mt-3 max-w-[620px] text-[17px] leading-relaxed text-[var(--text-secondary)]">
            Guarda hasta <strong className="font-semibold text-[var(--text-primary)]">10 personas al mes</strong> y
            descubre su arcano, su superpoder y su punto ciego.
          </p>
        </motion.div>

        <motion.ul
          variants={item}
          className="-mx-5 mt-6 flex snap-x snap-mandatory scroll-pl-5 gap-3 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0"
        >
          {PERSONAS_EJEMPLO.map((p) => (
            <li
              key={p.etiqueta}
              className="w-56 shrink-0 snap-start rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_40%,transparent)] bg-[var(--bg)] p-4 md:w-auto"
            >
              <p className="text-[16px] font-semibold text-[var(--text-primary)]">
                <span aria-hidden="true" className="mr-1.5">
                  {p.emoji}
                </span>
                {p.etiqueta}
              </p>
              <p className="mt-2 text-[14px] font-semibold text-[var(--accent)]">
                {p.signo} · {p.arcano}
              </p>
              <p className="mt-2 text-[14px] leading-snug text-[var(--text-secondary)]">{p.linea}</p>
            </li>
          ))}
        </motion.ul>
        <motion.p variants={item} className="mt-3 text-[12px] text-[var(--text-tertiary)]">
          Ejemplos ilustrativos. <span className="md:hidden">Desliza para ver más →</span>
        </motion.p>
      </motion.div>
    </SectionShell>
  );
}
