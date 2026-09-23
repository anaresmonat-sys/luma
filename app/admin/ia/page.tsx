// COSTO DE IA — de la tabla ai_calls (docs/sistema/31-EVALS-OBSERVABILIDAD-
// OPERACION.md), no de una estimación de negocio. Se rotula "Estimado" en todo
// el panel porque el precio por token es una tabla de referencia
// (lib/ai-pricing.ts), no una factura conciliada.

import { crearClienteServidor } from '@/lib/supabase/server';
import { Tarjeta, Seccion, SinDatos } from '@/components/admin/Tarjeta';

export const dynamic = 'force-dynamic';

function formatearUsd(n: number): string {
  return `$${n.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
}

export default async function AdminIaPage() {
  const supabase = await crearClienteServidor();
  const desde30dias = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data: llamadas, error } = await supabase
    .from('ai_calls')
    .select('feature, cost_usd, input_tokens, output_tokens, user_id, created_at')
    .gte('created_at', desde30dias)
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <Seccion titulo="Costo de IA">
        <SinDatos>No se pudo leer el costo de IA: {error.message}</SinDatos>
      </Seccion>
    );
  }

  if (!llamadas || llamadas.length === 0) {
    return (
      <Seccion titulo="Costo de IA (últimos 30 días)">
        <SinDatos>
          Sin datos todavía — apenas se empezó a registrar el costo de cada llamada hoy (2026-09-22). Vuelve en unos
          días para ver el gasto real por función.
        </SinDatos>
      </Seccion>
    );
  }

  const totalCosto = llamadas.reduce((s, l) => s + Number(l.cost_usd ?? 0), 0);
  const usuariosUnicos = new Set(llamadas.map((l) => l.user_id).filter(Boolean)).size;

  const porFeature = new Map<string, { costo: number; llamadas: number; tokens: number }>();
  for (const l of llamadas) {
    const actual = porFeature.get(l.feature) ?? { costo: 0, llamadas: 0, tokens: 0 };
    actual.costo += Number(l.cost_usd ?? 0);
    actual.llamadas += 1;
    actual.tokens += Number(l.input_tokens ?? 0) + Number(l.output_tokens ?? 0);
    porFeature.set(l.feature, actual);
  }
  const featuresOrdenadas = [...porFeature.entries()].sort((a, b) => b[1].costo - a[1].costo);

  return (
    <div>
      <Seccion titulo="Costo de IA — últimos 30 días (estimado)">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Tarjeta etiqueta="Gasto total (estimado)" valor={formatearUsd(totalCosto)} />
          <Tarjeta etiqueta="Llamadas" valor={llamadas.length} />
          <Tarjeta
            etiqueta="Costo por usuario (estimado)"
            valor={usuariosUnicos > 0 ? formatearUsd(totalCosto / usuariosUnicos) : 'Sin datos'}
            insight={usuariosUnicos > 0 ? `${usuariosUnicos} usuarios con sesión hicieron alguna llamada` : undefined}
          />
        </div>
      </Seccion>

      <Seccion titulo="Por función">
        <div className="overflow-x-auto rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_22%,transparent)]">
          <table className="w-full min-w-[480px] text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] text-[11px] uppercase tracking-[0.04em] text-[var(--text-tertiary)]">
                <th className="px-3 py-2.5">Función</th>
                <th className="px-3 py-2.5">Llamadas</th>
                <th className="px-3 py-2.5">Tokens</th>
                <th className="px-3 py-2.5">Costo (estimado)</th>
              </tr>
            </thead>
            <tbody>
              {featuresOrdenadas.map(([feature, datos]) => (
                <tr key={feature} className="border-b border-[color-mix(in_oklab,var(--text-tertiary)_10%,transparent)] last:border-0">
                  <td className="px-3 py-2.5 capitalize text-[var(--text-primary)]">{feature}</td>
                  <td className="px-3 py-2.5 text-[var(--text-secondary)]">{datos.llamadas}</td>
                  <td className="px-3 py-2.5 text-[var(--text-secondary)]">{datos.tokens.toLocaleString('es')}</td>
                  <td className="px-3 py-2.5 text-[var(--text-secondary)]">{formatearUsd(datos.costo)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Seccion>
    </div>
  );
}
