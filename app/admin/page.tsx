// RESUMEN — lo primero que ve el dueño. Usa el cliente de SESIÓN (no el de
// servicio): así, aunque el guard del layout tuviera un fallo, la RLS
// (política "admin_lee_todo") sigue protegiendo los datos — defensa en
// profundidad (docs/sistema/09-SEGURIDAD.md).

import { crearClienteServidor } from '@/lib/supabase/server';
import { Tarjeta, SinDatos, Seccion } from '@/components/admin/Tarjeta';
import { BannerAvisos, type Aviso } from '@/components/admin/BannerAvisos';

export const dynamic = 'force-dynamic';

function formatearUsd(n: number): string {
  return `$${n.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default async function AdminResumenPage() {
  const supabase = await crearClienteServidor();

  const inicioHoy = new Date();
  inicioHoy.setHours(0, 0, 0, 0);
  const inicioMes = new Date(inicioHoy.getFullYear(), inicioHoy.getMonth(), 1);

  const [{ count: totalUsuarios }, iaHoy, iaMes, { count: erroresSemana }, { count: activaciones }] =
    await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('ai_calls').select('cost_usd').gte('created_at', inicioHoy.toISOString()),
      supabase.from('ai_calls').select('cost_usd').gte('created_at', inicioMes.toISOString()),
      supabase
        .from('error_log')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      supabase
        .from('event_log')
        .select('id', { count: 'exact', head: true })
        .eq('type', 'primera_accion')
        .gte('created_at', inicioMes.toISOString()),
    ]);

  const costoHoy = (iaHoy.data ?? []).reduce((sum, r) => sum + Number(r.cost_usd ?? 0), 0);
  const costoMes = (iaMes.data ?? []).reduce((sum, r) => sum + Number(r.cost_usd ?? 0), 0);
  const llamadasMes = (iaMes.data ?? []).length;

  const avisos: Aviso[] = [];
  if ((erroresSemana ?? 0) > 5) {
    avisos.push({
      emoji: '🐞',
      tono: 'alerta',
      texto: `${erroresSemana} errores en los últimos 7 días — revisa la sección "Errores" para ver cuáles se repiten más.`,
    });
  }
  if (costoMes > 0 && costoMes >= Number(process.env.AI_DAILY_BUDGET_USD ?? 20) * 20) {
    // Umbral simple: 20× el tope diario configurado ~ referencia de mes, hasta
    // que haya ventas reales para calcular el % de ingresos (regla de 30/40).
    avisos.push({
      emoji: '💸',
      tono: 'alerta',
      texto: `La IA lleva gastado ${formatearUsd(costoMes)} este mes — sin ventas conectadas todavía, no se puede saber qué % de tus ingresos es. Revísalo cuando conectes Hotmart.`,
    });
  }
  if (avisos.length === 0) {
    avisos.push({
      emoji: costoMes > 0 || (totalUsuarios ?? 0) > 0 ? '✅' : 'ℹ️',
      tono: 'bien',
      texto:
        costoMes > 0 || (totalUsuarios ?? 0) > 0
          ? '✅ Todo en orden este mes — sin incidencias detectadas.'
          : 'Todavía no hay suficiente actividad para calcular avisos — vuelve cuando haya algún uso real de la app.',
    });
  }

  return (
    <div>
      <BannerAvisos avisos={avisos} />

      <Seccion titulo="Ventas y suscripciones">
        <SinDatos>
          Sin datos todavía — el webhook de Hotmart no está conectado (ver docs/sistema/18-VENTA-HOTMART.md).
          Ingresos, MRR, cancelaciones y churn aparecerán aquí en cuanto empiecen a llegar ventas reales.
        </SinDatos>
      </Seccion>

      <Seccion titulo="Usuarios">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Tarjeta etiqueta="Total de usuarios" valor={totalUsuarios ?? 0} />
          <Tarjeta
            etiqueta="Activaron (este mes)"
            valor={activaciones ?? 0}
            insight="Usaron al menos una función real por primera vez"
          />
        </div>
      </Seccion>

      <Seccion titulo="Costo de IA">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Tarjeta etiqueta="Gastado hoy (estimado)" valor={formatearUsd(costoHoy)} />
          <Tarjeta
            etiqueta="Gastado este mes (estimado)"
            valor={formatearUsd(costoMes)}
            insight={llamadasMes > 0 ? `${llamadasMes} llamadas a la IA este mes` : 'Aún sin llamadas registradas'}
          />
        </div>
      </Seccion>

      <Seccion titulo="Salud">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Tarjeta
            etiqueta="Errores (7 días)"
            valor={erroresSemana ?? 0}
            tono={(erroresSemana ?? 0) > 5 ? 'alerta' : 'normal'}
          />
        </div>
      </Seccion>
    </div>
  );
}
