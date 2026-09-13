'use client';

// APP INTERNA — TAROT (blueprint: vista-previa-app.html frame 6, aprobado). Lista de
// 5 tiradas; tocar una revela la carta + lectura in situ (acordeón) — sin inventar
// una ruta nueva no aprobada en el mockup. Reutiliza CartaSacerdotisa con props.

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenHeader } from '@/components/app/ScreenHeader';
import { AppLinkButton } from '@/components/app/AppButton';
import { CartaSacerdotisa } from '@/components/app/HeroDemoLuma';
import { TIRADAS_TAROT, LECTURAS_TAROT } from '@/lib/seed-datos';
import { guardarEntradaPendiente } from '@/lib/almacenamiento-diario';

const CLAVE_ULTIMA_TIRADA = 'luma_ultima_tirada';

const contenedor = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

export default function TarotPage() {
  const [abierta, setAbierta] = useState<string | null>(null);
  const [ultima, setUltima] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      setUltima(window.localStorage.getItem(CLAVE_ULTIMA_TIRADA));
    } catch {
      // localStorage puede fallar (modo privado, cuota) — sin acceso rápido, no bloquea el flujo.
    }
  }, []);

  function alternar(id: string) {
    const abrir = abierta !== id;
    setAbierta(abrir ? id : null);
    if (abrir) {
      try {
        window.localStorage.setItem(CLAVE_ULTIMA_TIRADA, id);
      } catch {
        // ver nota de arriba.
      }
      window.setTimeout(() => panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 320);
    }
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col pb-4 pt-3">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(520px 42dvh at 50% 26%, color-mix(in oklab, var(--bloom-vino) 52%, transparent), transparent 70%), ' +
            'radial-gradient(560px 46dvh at 50% 96%, color-mix(in oklab, var(--bloom-vino) 50%, transparent), transparent 74%)',
        }}
      />
      <ScreenHeader titulo="Tarot" volverHref="/app" />
      <h1 className="mt-1 text-[20px] font-semibold text-[var(--text-primary)] [font-family:var(--font-display)]">
        ¿Qué tipo de tirada necesitas?
      </h1>

      {ultima && LECTURAS_TAROT[ultima] && (
        <button
          type="button"
          onClick={() => alternar(ultima)}
          className="mt-3 flex items-center justify-between rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_35%,transparent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] px-4 py-3 text-left"
        >
          <span className="text-[12.5px] font-semibold text-[var(--accent-lite)]">
            Repetir tu última tirada: {TIRADAS_TAROT.find((t) => t.id === ultima)?.nombre}
          </span>
          <span aria-hidden="true" className="text-[var(--accent-lite)]">
            →
          </span>
        </button>
      )}

      <motion.div variants={contenedor} initial="hidden" animate="visible" className="mt-4 flex flex-col">
        {TIRADAS_TAROT.map((t, i) => {
          const abierto = abierta === t.id;
          const lectura = LECTURAS_TAROT[t.id];
          return (
            <motion.div key={t.id} variants={item}>
              {i > 0 && <div className="h-px bg-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)]" />}
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => alternar(t.id)}
                aria-expanded={abierto}
                className="flex w-full items-center gap-3 py-4 text-left"
              >
                <span
                  aria-hidden="true"
                  className="h-[52px] w-10 shrink-0 rounded-[12px]"
                  style={{
                    background: 'linear-gradient(160deg, var(--card-paper), var(--card-paper-2))',
                    boxShadow: '0 8px 16px -8px rgb(10 5 8 / 0.5), inset 0 1px 0 rgb(255 255 255 / 0.5)',
                  }}
                />
                <span className="text-[15px] leading-none text-[var(--accent-lite)]" aria-hidden="true">
                  {t.emoji}
                </span>
                <span className="flex-1">
                  <span className="block text-[15px] font-semibold text-[var(--text-primary)] [font-family:var(--font-display)]">
                    {t.nombre}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-[var(--text-secondary)]">{t.pregunta}</span>
                </span>
              </motion.button>

              <AnimatePresence>
                {abierto && lectura && (
                  <motion.div
                    ref={panelRef}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col items-center gap-3 pb-5 pt-2">
                      <div className="scale-[0.72]">
                        <CartaSacerdotisa disparo="montaje" numero={lectura.numero} nombre={lectura.nombre} cita={lectura.cita} />
                      </div>
                      <p className="max-w-[280px] text-center text-[13px] leading-relaxed text-[var(--text-secondary)]">
                        {lectura.lectura}
                      </p>
                      <div className="w-full">
                        <AppLinkButton
                          href="/app/diario"
                          compact
                          onClick={() => guardarEntradaPendiente(lectura.lectura)}
                        >
                          Guardar en mi diario
                        </AppLinkButton>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
