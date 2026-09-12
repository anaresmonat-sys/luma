'use client';

// APP INTERNA — TAROT (blueprint: vista-previa-app.html frame 6, aprobado). Lista de
// 5 tiradas; tocar una revela la carta + lectura in situ (acordeón) — sin inventar
// una ruta nueva no aprobada en el mockup. Reutiliza CartaSacerdotisa con props.

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenHeader } from '@/components/app/ScreenHeader';
import { AppLinkButton } from '@/components/app/AppButton';
import { CartaSacerdotisa } from '@/components/app/HeroDemoLuma';
import { TIRADAS_TAROT, LECTURAS_TAROT } from '@/lib/seed-datos';

export default function TarotPage() {
  const [abierta, setAbierta] = useState<string | null>(null);

  return (
    <div className="flex min-h-0 flex-1 flex-col pb-4 pt-3">
      <ScreenHeader titulo="Tarot" volverHref="/app" />
      <h1 className="mt-1 text-[20px] font-semibold text-[var(--text-primary)] [font-family:var(--font-display)]">
        ¿Qué tipo de tirada necesitas?
      </h1>

      <div className="mt-4 flex flex-col">
        {TIRADAS_TAROT.map((t, i) => {
          const abierto = abierta === t.id;
          const lectura = LECTURAS_TAROT[t.id];
          return (
            <div key={t.id}>
              {i > 0 && <div className="h-px bg-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)]" />}
              <button
                type="button"
                onClick={() => setAbierta(abierto ? null : t.id)}
                aria-expanded={abierto}
                className="flex w-full items-center gap-3 py-3 text-left"
              >
                <span
                  aria-hidden="true"
                  className="h-[52px] w-10 shrink-0 rounded-[7px]"
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
              </button>

              <AnimatePresence>
                {abierto && lectura && (
                  <motion.div
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
                        <AppLinkButton href="/app/diario" compact>
                          Guardar en mi diario
                        </AppLinkButton>
                      </div>
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
