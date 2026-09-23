'use client';

// "Cómo cancelar" — pieza obligatoria de la capa legal de suscripción
// (docs/sistema/47-LEGAL-FISCAL-Y-PRIVACIDAD.md §2): una cancelación difícil
// es un dark pattern prohibido por el propio SO. Auditoría legal 2026-09-23:
// esta pantalla no existía. El enlace directo al portal de Hotmart se activa
// cuando Hotmart esté conectado (todavía no, ver ESTADO.md) — mientras tanto
// se explica el camino real y se ofrece el correo de soporte como respaldo.

import { ScreenHeader } from '@/components/app/ScreenHeader';

const PASOS = [
  {
    titulo: 'Entra al portal de compras de Hotmart',
    texto: 'Con el mismo correo con el que compraste tu plan, en hotmart.com/es/sign-in.',
  },
  {
    titulo: 'Busca tu suscripción a LUMA',
    texto: 'En "Mis compras", verás el plan activo con la fecha de tu próximo cobro.',
  },
  {
    titulo: 'Toca "Cancelar suscripción"',
    texto: 'Se cancela al instante — no necesitas escribirle a nadie ni dar explicaciones.',
  },
];

export default function CancelarPage() {
  return (
    <div className="flex min-h-min flex-1 flex-col pb-6 pt-3">
      <ScreenHeader titulo="Cómo cancelar" volverHref="/app/mas" />

      <p className="mt-3 text-[13px] leading-relaxed text-[var(--text-secondary)]">
        Puedes cancelar tu plan cuando quieras — no hay preguntas ni pasos escondidos. Sigues teniendo acceso hasta
        el final del período que ya pagaste.
      </p>

      <div className="mt-5 flex flex-col gap-4">
        {PASOS.map((p, i) => (
          <div key={p.titulo} className="flex items-start gap-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_16%,transparent)] text-[12px] font-bold text-[var(--accent-lite)]">
              {i + 1}
            </span>
            <div>
              <p className="text-[13.5px] font-semibold text-[var(--text-primary)]">{p.titulo}</p>
              <p className="mt-0.5 text-[12.5px] leading-relaxed text-[var(--text-secondary)]">{p.texto}</p>
            </div>
          </div>
        ))}
      </div>

      <a
        href="https://hotmart.com/es/sign-in"
        target="_blank"
        rel="noreferrer"
        className="mt-6 flex h-12 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[14px] font-semibold text-[var(--on-accent)]"
      >
        Ir al portal de Hotmart
      </a>

      <p className="mt-4 text-[12px] leading-relaxed text-[var(--text-tertiary)]">
        ¿No encuentras tu compra o algo no funciona? Escríbenos a{' '}
        <a href="mailto:anares.monat@gmail.com" className="underline underline-offset-2">
          anares.monat@gmail.com
        </a>{' '}
        y te ayudamos directamente.
      </p>
    </div>
  );
}
