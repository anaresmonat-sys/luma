'use client';

// "Cómo cancelar" — pieza obligatoria de la capa legal de suscripción
// (docs/sistema/47-LEGAL-FISCAL-Y-PRIVACIDAD.md §2): una cancelación difícil es un dark pattern.
// 2026-10-22: el botón cancela desde la app (POST /api/cancelar-plan): guarda la HORA EXACTA de la petición
// (prueba ante el cambio horario) y cancela en Hotmart por API. Si la API no está disponible, la petición queda
// registrada y se cancela a mano ese mismo día; el correo a soporte sigue como plan B.
// Regla: si la petición se hizo ANTES del cobro, se reembolsa el cobro aunque se haya adelantado.

import { useState } from 'react';
import { ScreenHeader } from '@/components/app/ScreenHeader';

type Resultado = { estado: 'cancelada' | 'manual' | 'pendiente'; solicitadaEn: string };

const CORREO_CANCELAR =
  'mailto:soporte@tuluma.app?subject=' +
  encodeURIComponent('Quiero cancelar mi plan de LUMA') +
  '&body=' +
  encodeURIComponent('Hola, quiero cancelar mi plan de LUMA.\n\nCorreo con el que compré: ');

function horaLocal(iso: string): string {
  return new Date(iso).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' });
}

export default function CancelarPage() {
  const [confirmando, setConfirmando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<Resultado | null>(null);

  async function cancelar() {
    if (enviando) return;
    setEnviando(true);
    setError(null);
    try {
      const r = await fetch('/api/cancelar-plan', { method: 'POST' });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) {
        setError(r.status === 401 ? 'Entra con tu correo para cancelar.' : (j.error ?? 'No pudimos cancelar. Inténtalo de nuevo.'));
        return;
      }
      setResultado(j as Resultado);
    } catch {
      setError('Parece que no hay conexión. Inténtalo de nuevo.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex min-h-min flex-1 flex-col px-5 pb-6 pt-3">
      <ScreenHeader titulo="Cancelar mi plan" volverHref="/app/mas" />

      {resultado ? (
        <div className="mt-6 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5" role="status">
          <p className="text-[16px] font-semibold text-[var(--text-primary)]">
            {resultado.estado === 'cancelada' ? 'Tu plan está cancelado' : 'Recibimos tu petición'}
          </p>
          <p className="mt-2 text-[14px] leading-relaxed text-[var(--text-secondary)]">
            Quedó registrada el {horaLocal(resultado.solicitadaEn)}.{' '}
            {resultado.estado === 'cancelada'
              ? 'No se te cobrará de nuevo y sigues teniendo acceso hasta el final de lo que ya pagaste.'
              : 'La cancelamos hoy mismo. Si por la diferencia horaria se te cobrara el primer pago antes, te lo devolvemos completo.'}
          </p>
        </div>
      ) : (
        <>
          <p className="mt-3 text-[14px] leading-relaxed text-[var(--text-secondary)]">
            Puedes cancelar cuando quieras, sin preguntas. Sigues teniendo acceso hasta el final del período que ya
            pagaste. Si estás en la prueba gratis, cancela antes de que termine y no pagas nada.
          </p>

          <div className="mt-5 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="text-[14px] font-semibold text-[var(--text-primary)]">La hora de tu petición es la que cuenta</p>
            <p className="mt-1 text-[14px] leading-relaxed text-[var(--text-secondary)]">
              Guardamos el momento exacto en que lo pides. Si pediste cancelar antes del primer cobro y aun así se cobra, te lo
              devolvemos entero.
            </p>
          </div>

          {confirmando ? (
            <div className="mt-6 flex flex-col gap-3">
              <p className="text-[14px] font-semibold text-[var(--text-primary)]">¿Seguro que quieres cancelar tu plan?</p>
              <button
                type="button"
                onClick={cancelar}
                disabled={enviando}
                className="flex h-12 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[14px] font-semibold text-[var(--on-accent)] disabled:opacity-60"
              >
                {enviando ? 'Cancelando…' : 'Sí, cancelar mi plan'}
              </button>
              <button
                type="button"
                onClick={() => setConfirmando(false)}
                disabled={enviando}
                className="flex h-12 w-full items-center justify-center rounded-[var(--radius-button)] border border-[var(--border)] text-[14px] font-semibold text-[var(--text-primary)]"
              >
                No, mantenerlo
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmando(true)}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[14px] font-semibold text-[var(--on-accent)]"
            >
              Cancelar mi plan
            </button>
          )}

          {error && (
            <p className="mt-3 text-[14px] leading-relaxed font-semibold text-[var(--text-primary)]" role="alert">
              {error}
            </p>
          )}

          <p className="mt-4 text-[14px] leading-relaxed text-[var(--text-tertiary)]">
            Si el botón no funciona, escribe a{' '}
            <a href={CORREO_CANCELAR} className="underline underline-offset-2">
              soporte@tuluma.app
            </a>
            : la hora de tu correo también cuenta. Tus compras y recibos están en{' '}
            <a href="https://consumer.hotmart.com" target="_blank" rel="noreferrer" className="underline underline-offset-2">
              consumer.hotmart.com
            </a>
            .
          </p>
        </>
      )}
    </div>
  );
}
