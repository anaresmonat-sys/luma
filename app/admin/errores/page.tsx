// ERRORES — de error_log (docs/sistema/21-BACKOFFICE.md), agrupados por
// frecuencia primero (los que más se repiten son los que más urge arreglar).

import { crearClienteServidor } from '@/lib/supabase/server';
import { Tarjeta, Seccion, SinDatos } from '@/components/admin/Tarjeta';

export const dynamic = 'force-dynamic';

function formatearFechaHora(iso: string): string {
  return new Date(iso).toLocaleString('es', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

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

  return (
    <div>
      <Seccion titulo="Errores (últimos 7 días)">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Tarjeta etiqueta="Errores totales" valor={errores.length} tono="alerta" />
          <Tarjeta etiqueta="Tipos distintos" valor={agrupados.length} />
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
