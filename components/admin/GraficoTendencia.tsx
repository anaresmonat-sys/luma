'use client';

// Gráfico de área para ver una tendencia día a día (errores por día, cuentas
// nuevas por día) — se dibuja solo al cargar (17-VISUALIZACION-DATOS.md:
// "gráficos animados al cargar"). Incluye los días sin datos como 0 para que
// la forma real de la tendencia se vea, no solo los días con actividad.

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

export function GraficoTendencia({
  datos,
  color = 'var(--accent)',
}: {
  datos: { etiqueta: string; valor: number }[];
  color?: string;
}) {
  return (
    <div style={{ width: '100%', height: 120 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={datos} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
          <defs>
            <linearGradient id="rellenoTendencia" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="etiqueta"
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
            interval="preserveStartEnd"
          />
          <Tooltip
            cursor={{ stroke: 'var(--text-tertiary)', strokeDasharray: '3 3' }}
            contentStyle={{
              background: 'var(--surface)',
              border: '1px solid color-mix(in oklab, var(--accent) 30%, transparent)',
              borderRadius: 10,
              fontSize: 12,
              color: 'var(--text-primary)',
            }}
            labelStyle={{ color: 'var(--text-secondary)' }}
          />
          <Area
            type="monotone"
            dataKey="valor"
            stroke={color}
            strokeWidth={2}
            fill="url(#rellenoTendencia)"
            animationDuration={600}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
