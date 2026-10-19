'use client';

// "Cómo cancelar" — pieza obligatoria de la capa legal de suscripción
// (docs/sistema/47-LEGAL-FISCAL-Y-PRIVACIDAD.md §2): una cancelación difícil
// es un dark pattern prohibido por el propio SO. Auditoría legal 2026-09-23:
// esta pantalla no existía.
// 2026-10-19: con una compra real de prueba se comprobó que el portal de compradoras de Hotmart
// ("Mis compras") NO muestra ningún botón de cancelar. Por eso el camino principal es escribirnos
// (botón que abre el correo ya preparado) y cancelamos nosotros desde el panel de Hotmart.
// Cuando exista la cancelación automática (fase 3, ver ESTADO.md) este texto se actualiza.

import { ScreenHeader } from '@/components/app/ScreenHeader';

const PASOS = [
  {
    titulo: 'Escríbenos desde el botón de abajo',
    texto: 'Se abre un correo ya preparado: solo añade el correo con el que compraste y envíalo.',
  },
  {
    titulo: 'La cancelamos nosotras, sin preguntas',
    texto: 'En menos de 24 horas (normalmente el mismo día) y te avisamos cuando esté hecha.',
  },
  {
    titulo: 'No se te cobra si estás en la prueba',
    texto: 'Si nos escribes antes de que terminen tus 3 días de prueba, no pagas nada.',
  },
];

const CORREO_CANCELAR =
  'mailto:soporte@tuluma.app?subject=' +
  encodeURIComponent('Quiero cancelar mi plan de LUMA') +
  '&body=' +
  encodeURIComponent('Hola, quiero cancelar mi plan de LUMA.\n\nCorreo con el que compré: ');

export default function CancelarPage() {
  return (
    <div className="flex min-h-min flex-1 flex-col px-5 pb-6 pt-3">
      <ScreenHeader titulo="Cómo cancelar" volverHref="/app/mas" />

      <p className="mt-3 text-[13px] leading-relaxed text-[var(--text-secondary)]">
        Puedes cancelar tu plan cuando quieras — sin preguntas ni pasos escondidos. Sigues teniendo acceso hasta
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
        href={CORREO_CANCELAR}
        className="mt-6 flex h-12 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[14px] font-semibold text-[var(--on-accent)]"
      >
        Escribir para cancelar
      </a>

      <p className="mt-4 text-[12px] leading-relaxed text-[var(--text-tertiary)]">
        Si prefieres, escribe tú a{' '}
        <a href="mailto:soporte@tuluma.app" className="underline underline-offset-2">
          soporte@tuluma.app
        </a>
        . En{' '}
        <a href="https://consumer.hotmart.com" target="_blank" rel="noreferrer" className="underline underline-offset-2">
          consumer.hotmart.com
        </a>{' '}
        puedes ver tus compras y recibos con el mismo correo.
      </p>
    </div>
  );
}
