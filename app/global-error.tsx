'use client';

// Red de seguridad para errores en el layout raíz mismo (rarísimo, pero sin
// esto ahí sí se ve una pantalla blanca real — regla UX #18). app/error.tsx
// cubre todo lo demás, este archivo necesita su propio <html><body> —
// reemplaza TODO el layout, así que globals.css (donde viven los tokens
// var(--bg) etc.) puede no estar disponible; por eso los colores van
// hardcodeados aquí a propósito, copiados 1:1 de --bg/--accent/--on-accent
// de components/landing/tokens.css, no inventados.

export default function ErrorRaiz({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="es">
      <body style={{ background: '#1a0d13', color: '#f4e7db', minHeight: '100dvh' }}>
        <div
          style={{
            display: 'flex',
            minHeight: '100dvh',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            padding: 24,
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: 14 }}>Algo no salió bien. Vuelve a intentarlo.</p>
          <button
            type="button"
            onClick={reset}
            style={{
              height: 44,
              padding: '0 20px',
              borderRadius: 14,
              background: '#d8a441',
              color: '#2a140f',
              fontWeight: 700,
              border: 'none',
            }}
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
