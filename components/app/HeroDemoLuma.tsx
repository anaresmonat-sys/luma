'use client';

// Visual del hero de la landing: la carta de tarot de pergamino que FLOTA
// (dispositivo ownable de FICHA-ARTE) + una demo estática rotulada "EJEMPLO"
// del mecanismo "descifra la conversación" — para la audiencia escéptica que
// pide "muéstrame el análisis real" (revisor-visual, defectos 2 y 3).
// Colores del pergamino y del analizador: tokens de components/landing/tokens.css.

import { Eye, AlertTriangle, MessageSquare } from 'lucide-react';

function CartaSacerdotisa() {
  return (
    <div className="relative shrink-0" style={{ perspective: '900px' }}>
      {/* resplandor ámbar detrás */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -z-10 h-[15rem] w-[15rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[2.5rem]"
        style={{
          background:
            'radial-gradient(circle, var(--accent), color-mix(in oklab, var(--accent-2) 60%, transparent) 55%, transparent 72%)',
          opacity: 0.5,
        }}
      />
      <div
        className="relative flex h-[13rem] w-[8.75rem] flex-col items-center justify-between rounded-[var(--radius-button)] px-3 py-4"
        style={{
          transform: 'rotateX(6deg) rotateY(-14deg) rotate(-3deg)',
          transformStyle: 'preserve-3d',
          background: 'linear-gradient(160deg, var(--card-paper), var(--card-paper-2))',
          color: 'var(--card-ink)',
          boxShadow:
            '0 30px 44px -14px rgb(10 5 8 / 0.6), 0 12px 18px -8px rgb(10 5 8 / 0.45), inset 0 1px 0 rgb(255 255 255 / 0.55), inset 0 0 0 1px rgb(255 255 255 / 0.28)',
        }}
      >
        <span
          className="text-[8.5px] font-bold uppercase tracking-[0.16em]"
          style={{ color: 'var(--card-label)' }}
        >
          II · La Sacerdotisa
        </span>
        <svg
          width="46"
          height="60"
          viewBox="0 0 46 60"
          fill="none"
          stroke="var(--card-line)"
          strokeWidth="1.4"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M7 58V8M39 58V8" />
          <circle cx="23" cy="17" r="5.5" />
          <path d="M23 23v22M14 45h18M16 34h14" />
          <path d="M18 12a6 6 0 0 1 10 0" />
        </svg>
        <span
          className="text-center text-[12px] font-medium leading-tight [font-family:var(--font-display)]"
          style={{ color: 'var(--card-title)' }}
        >
          &ldquo;Escucha antes<br />de responder.&rdquo;
        </span>
      </div>
      {/* sombra de contacto */}
      <div
        aria-hidden="true"
        className="absolute -bottom-4 left-1/2 h-8 w-[9.5rem] -translate-x-1/2 rounded-full blur-[1rem]"
        style={{ background: 'rgb(10 5 8 / 0.55)' }}
      />
    </div>
  );
}

function FilaDemo({
  icon: Icono,
  color,
  titulo,
  texto,
}: {
  icon: typeof Eye;
  color: string;
  titulo: string;
  texto: string;
}) {
  return (
    <div className="flex gap-3">
      <span
        aria-hidden="true"
        className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-[var(--radius-button)]"
        style={{
          background: `color-mix(in oklab, ${color} 20%, transparent)`,
          border: `1px solid color-mix(in oklab, ${color} 45%, transparent)`,
        }}
      >
        <Icono size={14} color={color} strokeWidth={2} aria-hidden="true" />
      </span>
      <div>
        <p className="text-[11.5px] font-bold text-[var(--text-primary)]">{titulo}</p>
        <p className="mt-0.5 text-[11.5px] leading-snug text-[var(--text-secondary)]">{texto}</p>
      </div>
    </div>
  );
}

export function HeroDemoLuma() {
  return (
    <div className="relative flex flex-col items-center gap-8 bg-[var(--bg)] px-6 py-8 sm:flex-row sm:items-center sm:justify-center sm:gap-10 sm:px-8 sm:py-12">
      <CartaSacerdotisa />

      <div
        className="w-full max-w-[21rem] rounded-[var(--radius-card)] p-4 text-left"
        style={{ background: 'var(--surface)', boxShadow: 'var(--shadow-card)' }}
      >
        <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-[var(--accent)]">Ejemplo</p>
        <p className="mt-2 rounded-[var(--radius-button)] bg-[var(--surface-2)] px-3 py-2 text-[11.5px] leading-snug text-[var(--text-primary)]">
          Él: no quiero nada serio ahora mismo. Pero el finde te veo, ¿no? Y no me gusta que salgas con
          el grupo ese.
        </p>
        <div className="my-3 h-px bg-[color-mix(in_oklab,var(--text-tertiary)_22%,transparent)]" />
        <div className="flex flex-col gap-3">
          <FilaDemo
            icon={Eye}
            color="var(--an-eye)"
            titulo="Lo que vemos"
            texto="Dice que no quiere nada y a la vez pide exclusividad."
          />
          <FilaDemo
            icon={AlertTriangle}
            color="var(--an-risk)"
            titulo="Posible riesgo"
            texto="Sus palabras y sus actos no coinciden."
          />
          <FilaDemo
            icon={MessageSquare}
            color="var(--accent)"
            titulo="Qué responder"
            texto="«Me gusta verte, pero necesito saber qué somos.»"
          />
        </div>
      </div>
    </div>
  );
}
