// Avatar de LUMA como medallón de marca: el emblema (corazón con espada) sobre ciruela, con doble aro
// dorado. Con `luna`, una luna creciente envuelve el emblema y asoman un par de estrellas. Sin cara:
// LUMA es una IA y el emblema es lo que ya ve la persona en la bienvenida y en la carta del Inicio.

export function LumaMedallon({ size = 34, luna = false }: { size?: number; luna?: boolean }) {
  const aro = Math.max(1, Math.round(size / 40));
  return (
    <span
      aria-hidden="true"
      className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full"
      style={{
        width: size,
        height: size,
        background:
          'radial-gradient(circle at 50% 38%, color-mix(in oklab, var(--bloom-vino) 95%, var(--accent) 6%), color-mix(in oklab, var(--bloom-vino) 55%, var(--bg)) 62%, var(--bg) 100%)',
        boxShadow: `inset 0 0 0 ${aro}px color-mix(in oklab, var(--accent-lite) 90%, transparent), inset 0 0 0 ${aro * 3}px color-mix(in oklab, var(--bg) 85%, transparent), inset 0 0 0 ${aro * 3 + 1}px color-mix(in oklab, var(--accent-lite) 35%, transparent)`,
      }}
    >
      {luna && (
        <svg viewBox="0 0 40 40" className="absolute inset-0 size-full" fill="none">
          <path
            d="M27.5 5.2a15.5 15.5 0 1 0 8 25.6 12.8 12.8 0 0 1-8-25.6z"
            style={{ stroke: 'var(--accent-lite)', fill: 'color-mix(in oklab, var(--accent-lite) 12%, transparent)' }}
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
          <path d="M33 9l.7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1-2.1-.7 2.1-.7z" style={{ fill: 'var(--accent-lite)' }} />
          <circle cx="7.5" cy="12" r="0.9" style={{ fill: 'var(--accent-lite)' }} />
        </svg>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/luma-icon.png"
        alt=""
        className="relative w-auto brightness-125 drop-shadow-[0_0_6px_rgba(224,176,92,0.55)]"
        style={{ height: size * (luna ? 0.5 : 0.56) }}
      />
    </span>
  );
}
