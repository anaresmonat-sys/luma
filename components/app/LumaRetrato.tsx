// Retrato de LUMA (propuesta, 2026-10-15): una mujer serena con velo oscuro, ojos cerrados, una luna
// creciente dorada en la frente y estrellas. Línea y color de la marca (ciruela, oro, rosa). Se dibuja
// con trazos vectoriales: nítido a cualquier tamaño, sin imagen externa que cargar.

export function LumaRetrato({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="18 14 84 84" aria-hidden="true" className="shrink-0 rounded-full">
      <defs>
        <clipPath id="luma-retrato-clip">
          <circle cx="60" cy="56" r="42" />
        </clipPath>
        <radialGradient id="luma-retrato-fondo" cx="50%" cy="38%" r="70%">
          <stop offset="0%" style={{ stopColor: 'var(--luma-retrato-fondo-1)' }} />
          <stop offset="60%" style={{ stopColor: 'var(--luma-retrato-fondo-2)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--luma-retrato-fondo-3)' }} />
        </radialGradient>
        <linearGradient id="luma-retrato-piel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: 'var(--luma-retrato-piel-1)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--luma-retrato-piel-2)' }} />
        </linearGradient>
      </defs>

      <g clipPath="url(#luma-retrato-clip)">
        <rect width="120" height="120" fill="url(#luma-retrato-fondo)" />

        {/* halo y estrellas */}
        <circle cx="60" cy="52" r="40" style={{ fill: 'var(--luma-retrato-oro-linea)' }} opacity="0.12" />
        <path d="M22 28l1.3 4.2 4.2 1.3-4.2 1.3L22 39l-1.3-4.2-4.2-1.3 4.2-1.3z" style={{ fill: 'var(--luma-retrato-oro)' }} opacity="0.9" />
        <path d="M99 24l1 3.3 3.3 1-3.3 1-1 3.3-1-3.3-3.3-1 3.3-1z" style={{ fill: 'var(--luma-retrato-oro)' }} opacity="0.8" />
        <path d="M101 56l.8 2.6 2.6.8-2.6.8-.8 2.6-.8-2.6-2.6-.8 2.6-.8z" style={{ fill: 'var(--luma-retrato-oro)' }} opacity="0.65" />
        <circle cx="16" cy="64" r="1.1" style={{ fill: 'var(--luma-retrato-oro)' }} opacity="0.7" />

        {/* manto / hombros */}
        <path d="M14 122c3-19 20-28 46-28s43 9 46 28z" style={{ fill: 'var(--luma-retrato-manto)' }} />
        <path d="M30 122c4-12 14-18 30-18s26 6 30 18" fill="none" style={{ stroke: 'var(--luma-retrato-oro-linea)' }} strokeWidth="1.2" opacity="0.75" />

        {/* cuello */}
        <path d="M51 78v15c3 4 15 4 18 0V78z" style={{ fill: 'var(--luma-retrato-cuello)' }} />

        {/* velo / cabello por detrás */}
        <path
          d="M60 10C34 10 20 32 20 62c0 24 7 41 17 54h46c10-13 17-30 17-54 0-30-14-52-40-52z"
          style={{ fill: 'var(--luma-retrato-velo)' }}
        />
        <path
          d="M60 10C40 14 27 33 27 62c0 22 6 38 14 50M60 10c20 4 33 23 33 52 0 22-6 38-14 50"
          fill="none"
          style={{ stroke: 'var(--luma-retrato-oro-linea)' }}
          strokeWidth="1.1"
          opacity="0.55"
        />

        {/* rostro */}
        <ellipse cx="60" cy="58" rx="19" ry="24" fill="url(#luma-retrato-piel)" />

        {/* flequillo partido al medio */}
        <path
          d="M60 32c-14 0-20 11-20 24 2-9 8-15 20-17 12 2 18 8 20 17 0-13-6-24-20-24z"
          style={{ fill: 'var(--luma-retrato-velo)' }}
        />

        {/* luna creciente dorada en la frente */}
        <path
          d="M60 35.6a5.4 5.4 0 1 0 3.6 9.5 4.4 4.4 0 0 1-3.6-9.5z"
          style={{ fill: 'var(--luma-retrato-oro)', stroke: 'var(--luma-retrato-oro-borde)' }}
          strokeWidth="0.5"
        />

        {/* cejas, ojos cerrados con pestañas */}
        <path d="M47.5 52.5q5-2.2 10.5-.4M62 52.1q5.5-1.8 10.5.4" fill="none" style={{ stroke: 'var(--luma-retrato-ceja)' }} strokeWidth="1.1" strokeLinecap="round" />
        <path d="M47.8 58.4q5 4 10.2 0M62 58.4q5.2 4 10.2 0" fill="none" style={{ stroke: 'var(--luma-retrato-ojo)' }} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M48.6 60l-1.4 1.5M52.6 61.3l-.4 1.9M67.4 61.3l.4 1.9M71.4 60l1.4 1.5" fill="none" style={{ stroke: 'var(--luma-retrato-ojo)' }} strokeWidth="0.9" strokeLinecap="round" />

        {/* nariz y labios */}
        <path d="M60.4 60.5c-.6 3-1.8 5.2-3 6.4 1.6 1 4 1 5.6 0" fill="none" style={{ stroke: 'var(--luma-retrato-nariz)' }} strokeWidth="1" strokeLinecap="round" />
        <path d="M54.2 73.4q2.8-2.5 5.8-1.4 3-1.1 5.8 1.4-2.8 3.7-5.8 3.7-3 0-5.8-3.7z" style={{ fill: 'var(--luma-retrato-labio)' }} />

        {/* rubor suave y pendientes */}
        <ellipse cx="50" cy="68" rx="4.2" ry="2.6" style={{ fill: 'var(--luma-retrato-rubor)' }} opacity="0.28" />
        <ellipse cx="70" cy="68" rx="4.2" ry="2.6" style={{ fill: 'var(--luma-retrato-rubor)' }} opacity="0.28" />
        <circle cx="40.8" cy="67" r="1.7" style={{ fill: 'var(--luma-retrato-oro)' }} />
        <circle cx="79.2" cy="67" r="1.7" style={{ fill: 'var(--luma-retrato-oro)' }} />
        <path d="M40.8 69l.1 4M79.2 69l-.1 4" style={{ stroke: 'var(--luma-retrato-oro)' }} strokeWidth="1" strokeLinecap="round" />
      </g>
      <circle cx="60" cy="56" r="41.3" fill="none" style={{ stroke: 'var(--luma-retrato-oro-linea)' }} strokeWidth="1.3" opacity="0.9" />
    </svg>
  );
}
