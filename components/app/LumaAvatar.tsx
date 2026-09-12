// Retrato ilustrado PROVISIONAL de LUMA (persona) — aprobado en vista-previa-app.html
// como placeholder hasta el retrato final de la sesión de assets (FICHA-ARTE.md,
// archivo 20 — no bloquea la construcción). Colores en tokens.css (--luma-avatar-*):
// son el pigmento del personaje, no color de UI, pero igual viven en el token file.

export function LumaAvatar({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" className="shrink-0 rounded-full">
      <defs>
        <clipPath id="luma-avatar-clip">
          <circle cx="20" cy="20" r="19" />
        </clipPath>
      </defs>
      <g clipPath="url(#luma-avatar-clip)">
        <rect width="40" height="40" style={{ fill: 'var(--luma-avatar-bg)' }} />
        <path d="M6 40c0-18 5-27 14-27s14 9 14 27H6z" style={{ fill: 'var(--luma-avatar-hair)' }} />
        <path d="M8 40c0-15 3-24 12-24s12 9 12 24" style={{ fill: 'var(--luma-avatar-hair-dark)' }} />
        <ellipse cx="20" cy="21" rx="7.6" ry="9.2" style={{ fill: 'var(--luma-avatar-skin)' }} />
        <path
          d="M12.4 15.5c1-4.6 3.6-7.5 7.6-7.5s6.6 2.9 7.6 7.5c-2.1-2.2-4.6-3.3-7.6-3.3s-5.5 1.1-7.6 3.3z"
          style={{ fill: 'var(--luma-avatar-hair-dark)' }}
        />
        <path
          d="M12.6 17c-.4 6 .4 10 2 13-3-2.2-4.6-7-4-13zM27.4 17c.4 6-.4 10-2 13 3-2.2 4.6-7 4-13z"
          style={{ fill: 'var(--luma-avatar-hair)' }}
        />
        <path
          d="M15.6 20.4c1-1 2.6-1 3.6 0M20.8 20.4c1-1 2.6-1 3.6 0"
          style={{ stroke: 'var(--luma-avatar-eyeline)' }}
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M18.6 25c.9.7 1.9.7 2.8 0"
          style={{ stroke: 'var(--luma-avatar-mouth)' }}
          strokeWidth="1.1"
          fill="none"
          strokeLinecap="round"
        />
        <path d="M20 11.4a2.1 2.1 0 1 0 1.5 3.6 2.5 2.5 0 0 1-1.5-3.6z" style={{ fill: 'var(--accent-lite)' }} />
        <circle cx="26" cy="10" r=".8" style={{ fill: 'var(--accent-lite)' }} />
        <circle cx="14.5" cy="9.5" r=".6" style={{ fill: 'var(--accent-lite)' }} />
      </g>
    </svg>
  );
}
