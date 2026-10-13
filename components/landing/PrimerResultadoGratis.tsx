import { MessagesSquare, Sparkles } from 'lucide-react';

// Bloque bajo el carrusel: el primer resultado gratis con DOS formas de usarlo.
// Es UN solo resultado gratis en total (lib/prueba-servidor.ts), por eso el texto
// dice "elige cuál" y no promete uno por función. Ambos enlaces entran por el
// recorrido de inicio (que confirma la mayoría de edad) con la pregunta "¿qué te
// ayudaría?" ya respondida.

const OPCIONES = [
  {
    ayuda: 'analizar',
    titulo: 'Descifrar una conversación',
    detalle: 'Pega el mensaje y mira hechos, riesgo y qué responder.',
    Icono: MessagesSquare,
  },
  {
    ayuda: 'tarot',
    titulo: 'Sacar mis cartas',
    detalle: 'Haz tu pregunta y recibe una lectura para tu caso.',
    Icono: Sparkles,
  },
] as const;

export function PrimerResultadoGratis() {
  return (
    <div className="w-full max-w-[560px] text-center">
      <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--accent)]">Tu primera lectura es gratis</p>
      <p className="mt-1 text-[15px] text-[var(--text-secondary)]">Elige cuál quieres probar. Sin tarjeta y sin registro.</p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {OPCIONES.map(({ ayuda, titulo, detalle, Icono }) => (
          <a
            key={ayuda}
            href={`/onboarding?ayuda=${ayuda}`}
            className="flex items-start gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] bg-[var(--surface)] p-4 text-left shadow-[var(--shadow-1)] transition-colors duration-150 [touch-action:manipulation] hover:border-[color-mix(in_oklab,var(--accent)_45%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-[var(--accent)]">
              <Icono size={20} strokeWidth={1.75} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-[16px] font-semibold leading-snug text-[var(--text-primary)]">{titulo}</span>
              <span className="mt-0.5 block text-[13px] leading-snug text-[var(--text-secondary)]">{detalle}</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
