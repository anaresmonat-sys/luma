// ERRORES — de error_log (docs/sistema/21-BACKOFFICE.md), agrupados por
// frecuencia primero (los que más se repiten son los que más urge arreglar).

import { crearClienteServidor } from '@/lib/supabase/server';
import { Tarjeta, Seccion, SinDatos } from '@/components/admin/Tarjeta';
import { GraficoTendencia } from '@/components/admin/GraficoTendencia';

export const dynamic = 'force-dynamic';

function formatearFechaHora(iso: string): string {
  return new Date(iso).toLocaleString('es', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

// Los mensajes de error vienen tal cual de Supabase/Anthropic (a propósito —
// nunca se inventa un "listo" falso), pero llegan en inglés. Traducción de los
// más frecuentes para que se entiendan sin buscar nada; el resto se muestra
// como llega, sin esconder información real.
const TRADUCCION_ERRORES: Record<string, string> = {
  'Error sending invite email':
    'No se pudo enviar el correo de invitación — normalmente porque el remitente de correo (Resend) todavía está en modo de prueba y solo puede escribirle a tu propia cuenta.',
};

export default async function AdminErroresPage() {
  const supabase = await crearClienteServidor();
  const desde7dias = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: errores, error } = await supabase
    .from('error_log')
    .select('message, context, created_at')
    .gte('created_at', desde7dias)
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    return (
      <Seccion titulo="Errores">
        <SinDatos>No se pudo leer el registro de errores: {error.message}</SinDatos>
      </Seccion>
    );
  }

  if (!errores || errores.length === 0) {
    return (
      <Seccion titulo="Errores (últimos 7 días)">
        <SinDatos>✅ Sin errores registrados en los últimos 7 días.</SinDatos>
      </Seccion>
    );
  }

  const porMensaje = new Map<string, { veces: number; contexto: string; ultima: string }>();
  for (const e of errores) {
    const actual = porMensaje.get(e.message) ?? { veces: 0, contexto: e.context, ultima: e.created_at };
    actual.veces += 1;
    if (e.created_at > actual.ultima) actual.ultima = e.created_at;
    porMensaje.set(e.message, actual);
  }
  const agrupados = [...porMensaje.entries()].sort((a, b) => b[1].veces - a[1].veces);

  // Un punto por día de los últimos 7 (incluye los días en 0 para ver la forma real).
  const porDia = new Map<string, number>();
  for (const e of errores) {
    const dia = e.created_at.slice(0, 10);
    porDia.set(dia, (porDia.get(dia) ?? 0) + 1);
  }
  const tendencia = Array.from({ length: 7 }, (_, i) => {
    const fecha = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000);
    const clave = fecha.toISOString().slice(0, 10);
    return {
      etiqueta: fecha.toLocaleDateString('es', { day: '2-digit', month: 'short' }),
      valor: porDia.get(clave) ?? 0,
    };
  });

  return (
    <div>
      <Seccion titulo="Errores (últimos 7 días)">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Tarjeta icono="🐞" etiqueta="Errores totales" valor={errores.length} tono="alerta" />
          <Tarjeta icono="🗂️" etiqueta="Tipos distintos" valor={agrupados.length} />
        </div>
        <div className="mt-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--an-risk)_22%,transparent)] bg-[var(--surface)] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
            Cuándo pasaron
          </p>
          <GraficoTendencia datos={tendencia} color="var(--an-risk)" />
        </div>
      </Seccion>

      <Seccion titulo="Los que más se repiten">
        <div className="flex flex-col gap-2">
          {agrupados.map(([mensaje, datos], i) => (
            <div
              key={i}
              className="rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--an-risk)_25%,transparent)] bg-[var(--surface)] p-3.5"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-[13px] font-semibold text-[var(--text-primary)]">{mensaje}</p>
                <span className="shrink-0 rounded-full bg-[color-mix(in_oklab,var(--an-risk)_16%,transparent)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--an-risk)]">
                  {datos.veces}×
                </span>
              </div>
              {TRADUCCION_ERRORES[mensaje] && (
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--text-secondary)]">
                  {TRADUCCION_ERRORES[mensaje]}
                </p>
              )}
              <p className="mt-1 text-[11.5px] text-[var(--text-tertiary)]">
                {datos.contexto} · última vez {formatearFechaHora(datos.ultima)}
              </p>
            </div>
          ))}
        </div>
      </Seccion>
    </div>
  );
}
