'use client';

// Sección "casos" de la landing: 3 mini-casos reales del mecanismo
// (mensaje → Lo que vemos / Posible riesgo / Qué responder). Sustituye
// el carrusel de screenshots del kit (AppPorDentro) mientras no exista la
// app interna — es la PRUEBA concreta para la audiencia escéptica
// (revisor-visual, defecto #1). Repite el motivo firma (carta + análisis).

import { SectionShell, Kicker, useReveal, VIEWPORT_ONCE, CtaButton } from '@/components/landing/ui';
import { motion } from 'motion/react';
import { CartaSacerdotisa, TarjetaEjemplo } from './HeroDemoLuma';

const CASOS = [
  {
    mensaje: 'Ella: llevas 3 días sin contestar y hoy me pones un like a una story. ¿Qué se supone que haga con eso?',
    filas: [
      { color: 'var(--an-eye)', titulo: 'Lo que vemos', texto: 'Te busca en bajo compromiso, sin conversación real.' },
      { color: 'var(--an-risk)', titulo: 'Posible riesgo', texto: 'Migajas: contacto suficiente para que no te vayas.' },
      { color: 'var(--accent)', titulo: 'Qué responder', texto: '«Si quieres hablar, aquí estoy. Los likes no me dicen nada.»' },
    ],
  },
  {
    mensaje: 'Él (tu ex): te pienso mucho estos días. ¿Cómo estás? Sin segundas, de verdad.',
    filas: [
      { color: 'var(--an-eye)', titulo: 'Lo que vemos', texto: 'Vuelve en un momento de duda suya, no de plan contigo.' },
      { color: 'var(--an-risk)', titulo: 'Posible riesgo', texto: 'Abrir la puerta por costumbre y repetir el ciclo.' },
      { color: 'var(--accent)', titulo: 'Qué responder', texto: '«Estoy bien. Prefiero que no retomemos el contacto por ahora.»' },
    ],
  },
  {
    mensaje: 'Él: perdona por lo de anoche, es que me pongo así cuando bebo. Sabes que no lo digo en serio.',
    filas: [
      { color: 'var(--an-eye)', titulo: 'Lo que vemos', texto: 'Minimiza y traslada la responsabilidad al alcohol.' },
      { color: 'var(--an-risk)', titulo: 'Posible riesgo', texto: 'Patrón que se normaliza si se acepta la disculpa fácil.' },
      { color: 'var(--accent)', titulo: 'Qué responder', texto: '«Lo de anoche me dolió. Necesito hablarlo en frío, no dejarlo pasar.»' },
    ],
  },
];

export function CasosLuma({ ctaLabel, ctaHref }: { ctaLabel: string; ctaHref: string }) {
  const { contenedor, item } = useReveal();
  return (
    <SectionShell id="casos" elevacion="elevada" ariaLabel="Ejemplos del análisis">
      <motion.div variants={contenedor} initial="hidden" whileInView="visible" viewport={VIEWPORT_ONCE}>
        <motion.div variants={item} className="mx-auto max-w-[720px] text-center">
          <Kicker>Cómo se ve en la práctica</Kicker>
          <h2 className="text-balance text-[28px] font-medium leading-tight text-[var(--text-primary)] [font-family:var(--font-display)] md:text-[38px]">
            Un mensaje confuso, <span className="text-[var(--accent)]">tres respuestas claras</span>
          </h2>
          <p className="mx-auto mt-3 max-w-[520px] text-[15px] leading-relaxed text-[var(--text-secondary)]">
            Pega lo que te escribieron. Esto es lo que recibes de vuelta. (Ejemplos ilustrativos del mecanismo.)
          </p>
        </motion.div>

        <motion.div variants={item} className="mt-8 flex justify-center">
          <CartaSacerdotisa animar={false} />
        </motion.div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {CASOS.map((c) => (
            <motion.div key={c.mensaje} variants={item} className="flex justify-center">
              <TarjetaEjemplo mensaje={c.mensaje} filas={c.filas} />
            </motion.div>
          ))}
        </div>

        <motion.div variants={item} className="mt-10 flex justify-center">
          <CtaButton href={ctaHref}>{ctaLabel}</CtaButton>
        </motion.div>
      </motion.div>
    </SectionShell>
  );
}
