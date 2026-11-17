'use client';

// «Enviar una sugerencia»: la clienta cuenta qué le gusta, qué falta o qué falla. Se guarda y la administradora lo lee en el panel.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ScreenHeader } from '@/components/app/ScreenHeader';
import { AppButton, AppLinkButton } from '@/components/app/AppButton';

const TIPOS = [
  { id: 'mejora', etiqueta: 'Una mejora' },
  { id: 'falta', etiqueta: 'Algo que echo en falta' },
  { id: 'falla', etiqueta: 'Algo falla' },
  { id: 'otro', etiqueta: 'Otra cosa' },
] as const;

export default function SugerenciasPage() {
  const [tipo, setTipo] = useState<(typeof TIPOS)[number]['id']>('mejora');
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // ?desde=cancelar: la persona venía de «Cancelar mi plan»; al terminar se le lleva de vuelta para que siga con su cancelación.
  const [desdeCancelar, setDesdeCancelar] = useState(false);
  useEffect(() => {
    setDesdeCancelar(new URLSearchParams(window.location.search).get('desde') === 'cancelar');
  }, []);

  async function enviar() {
    if (enviando || mensaje.trim().length < 3) return;
    setEnviando(true);
    setError(null);
    try {
      const r = await fetch('/api/sugerencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo, mensaje }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) {
        setError(j.error ?? 'No pudimos enviar tu mensaje. Inténtalo de nuevo.');
        return;
      }
      setEnviado(true);
    } catch {
      setError('Parece que no hay conexión. Inténtalo de nuevo.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col px-5 pb-6 pt-3">
      <ScreenHeader titulo="Tu opinión" volverHref={desdeCancelar ? '/app/cancelar' : '/app/mas'} />
      {enviado ? (
        <div className="mt-8 flex flex-1 flex-col items-center gap-4 text-center">
          <p className="text-xl font-semibold text-[var(--text-primary)] [font-family:var(--font-display)]">¡Gracias! Lo leemos todo.</p>
          <p className="max-w-xs text-sm leading-relaxed text-[var(--text-secondary)]">
            Tu mensaje ya está con nosotras. Cada sugerencia ayuda a que LUMA mejore para ti y para más personas.
          </p>
          <div className="mt-2 flex w-full max-w-xs flex-col gap-3">
            {desdeCancelar ? (
              <>
                <AppLinkButton href="/app/cancelar">Seguir con mi cancelación</AppLinkButton>
                <Link href="/app" className="flex min-h-11 items-center justify-center text-sm font-semibold text-[var(--accent-lite)] underline underline-offset-2">
                  Prefiero seguir en LUMA
                </Link>
              </>
            ) : (
              <>
                <AppLinkButton href="/app">Volver al inicio</AppLinkButton>
                <Link href="/app/mas" className="flex min-h-11 items-center justify-center text-sm font-semibold text-[var(--accent-lite)] underline underline-offset-2">
                  Volver a Más
                </Link>
              </>
            )}
          </div>
        </div>
      ) : (
        <>
          <h1 className="mt-3 text-xl font-semibold text-[var(--text-primary)] [font-family:var(--font-display)]">¿Cómo podemos mejorar LUMA?</h1>
          <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
            Cuéntanos qué te gusta, qué echas en falta o qué no funciona bien. Lo leemos nosotras, una por una.
          </p>
          <div className="mt-4 flex flex-wrap gap-2" role="radiogroup" aria-label="Tipo de mensaje">
            {TIPOS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={tipo === t.id}
                onClick={() => setTipo(t.id)}
                className={`min-h-11 rounded-full border px-4 text-sm font-semibold ${
                  tipo === t.id
                    ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_16%,transparent)] text-[var(--accent-lite)]'
                    : 'border-[var(--border)] text-[var(--text-secondary)]'
                }`}
              >
                {t.etiqueta}
              </button>
            ))}
          </div>
          <label htmlFor="sugerencia" className="sr-only">
            Tu mensaje
          </label>
          <textarea
            id="sugerencia"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value.slice(0, 1000))}
            rows={6}
            placeholder="Escribe aquí con tus palabras…"
            className="mt-4 w-full resize-none rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-3 text-base leading-relaxed text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
          />
          <p className="mt-1 text-right text-xs text-[var(--text-tertiary)]">{mensaje.length}/1000</p>
          {error && (
            <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]" role="alert">
              {error}
            </p>
          )}
          <div className="mt-auto pt-4">
            <AppButton onClick={enviar} disabled={mensaje.trim().length < 3 || enviando} busy={enviando}>
              {enviando ? 'Enviando…' : 'Enviar mi mensaje'}
            </AppButton>
          </div>
        </>
      )}
    </div>
  );
}
