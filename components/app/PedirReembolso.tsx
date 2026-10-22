'use client';

// Bloque «¿Ya te cobraron y quieres tu dinero?» de /app/cancelar. Llama a /api/pedir-reembolso, que guarda la hora
// de la petición, comprueba la garantía de 15 días (solo el primer cobro) y cancela para que no haya más cobros.
// El reembolso en sí lo aprueba la dueña en Hotmart (Hotmart no deja que lo pida el comprador).

import { useState } from 'react';

type Respuesta = {
  estado: 'recibida' | 'en_prueba' | 'fuera_de_plazo' | 'ya_reembolsada';
  solicitadaEn?: string;
};

function horaLocal(iso: string): string {
  return new Date(iso).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' });
}

const TEXTOS: Record<Respuesta['estado'], { titulo: string; cuerpo: (hora?: string) => string }> = {
  recibida: {
    titulo: 'Recibimos tu petición de reembolso',
    cuerpo: (hora) =>
      `Quedó registrada el ${hora}. Cancelamos tu plan para que no haya más cobros. La revisamos hoy y, como estás dentro de los 15 días de garantía, te devolvemos el primer pago.`,
  },
  en_prueba: {
    titulo: 'Todavía no se te ha cobrado nada',
    cuerpo: () =>
      'Sigues en tu prueba gratis, así que no hay nada que reembolsar. Si no quieres continuar, cancela tu plan aquí arriba antes de que termine y no pagas nada.',
  },
  fuera_de_plazo: {
    titulo: 'Ya pasó el plazo de reembolso',
    cuerpo: () =>
      'La garantía cubre los 15 días desde que empezó tu prueba y ese plazo ya terminó. Puedes cancelar para que no haya más cobros. Si crees que es un error, escribe a soporte@tuluma.app.',
  },
  ya_reembolsada: {
    titulo: 'Tu compra ya figura como reembolsada',
    cuerpo: () => 'No hace falta hacer nada más. Si no ves el dinero en unos días, escribe a soporte@tuluma.app.',
  },
};

export function PedirReembolso() {
  const [confirmando, setConfirmando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [respuesta, setRespuesta] = useState<Respuesta | null>(null);

  async function pedir() {
    if (enviando) return;
    setEnviando(true);
    setError(null);
    try {
      const r = await fetch('/api/pedir-reembolso', { method: 'POST' });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) {
        setError(r.status === 401 ? 'Entra con tu correo para pedir el reembolso.' : (j.error ?? 'No pudimos registrar tu petición. Inténtalo de nuevo.'));
        return;
      }
      setRespuesta(j as Respuesta);
    } catch {
      setError('Parece que no hay conexión. Inténtalo de nuevo.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="mt-8 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-4" aria-labelledby="titulo-reembolso">
      {respuesta ? (
        <div role="status">
          <p className="text-[16px] font-semibold text-[var(--text-primary)]">{TEXTOS[respuesta.estado].titulo}</p>
          <p className="mt-2 text-[14px] leading-relaxed text-[var(--text-secondary)]">
            {TEXTOS[respuesta.estado].cuerpo(respuesta.solicitadaEn ? horaLocal(respuesta.solicitadaEn) : undefined)}
          </p>
        </div>
      ) : (
        <>
          <h2 id="titulo-reembolso" className="text-[16px] font-semibold text-[var(--text-primary)]">
            ¿Ya te cobraron y quieres tu dinero?
          </h2>
          <p className="mt-1 text-[14px] leading-relaxed text-[var(--text-secondary)]">
            Tienes 15 días desde que empezó tu prueba para pedir el reembolso del primer pago.
          </p>
          {confirmando ? (
            <div className="mt-4 flex flex-col gap-3">
              <p className="text-[14px] font-semibold text-[var(--text-primary)]">Pediremos tu reembolso y cancelaremos tu plan. ¿Seguro?</p>
              <button
                type="button"
                onClick={pedir}
                disabled={enviando}
                className="flex h-12 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[14px] font-semibold text-[var(--on-accent)] disabled:opacity-60"
              >
                {enviando ? 'Enviando…' : 'Sí, pedir mi reembolso'}
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
              className="mt-4 flex h-12 w-full items-center justify-center rounded-[var(--radius-button)] border border-[var(--border)] text-[14px] font-semibold text-[var(--text-primary)]"
            >
              Pedir reembolso
            </button>
          )}
          {error && (
            <p className="mt-3 text-[14px] font-semibold leading-relaxed text-[var(--text-primary)]" role="alert">
              {error}
            </p>
          )}
        </>
      )}
    </section>
  );
}
