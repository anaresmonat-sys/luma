'use client';

// Gráfico de barras horizontales para comparar categorías (costo por función,
// por ejemplo) — principio Tufte (17-VISUALIZACION-DATOS.md): máximo dato,
// mínima tinta. Sin rejilla, sin 3D, el valor se lee directo sobre la barra,
// un solo color (el acento), animado al cargar.

import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts';

// El formateo vive ACÁ (no como función recibida por prop): un componente
// 'use client' no puede recibir una función definida en un Server Component
// como prop — solo datos serializables. Por eso se pasa un modo simple.
function formatear(valor: number, formato: 'usd' | 'entero'): string {
  if (formato === 'usd') {
    return `$${valor.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
  }
  return valor.toLocaleString('es');
}

export function GraficoBarras({
  datos,
  formato = 'entero',
}: {
  datos: { nombre: string; valor: number }[];
  formato?: 'usd' | 'entero';
}) {
  const alto = Math.max(80, datos.length * 40);

  return (
    <div style={{ width: '100%', height: alto }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={datos} layout="vertical" margin={{ top: 0, right: 48, bottom: 0, left: 0 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="nombre"
            width={96}
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            className="capitalize"
          />
          <Bar dataKey="valor" radius={[0, 8, 8, 0]} animationDuration={500} maxBarSize={20}>
            {datos.map((d) => (
              <Cell key={d.nombre} fill="var(--accent)" />
            ))}
            <LabelList
              dataKey="valor"
              position="right"
              formatter={(v: unknown) => formatear(Number(v), formato)}
              style={{ fill: 'var(--text-primary)', fontSize: 12, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
