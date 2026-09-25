// RESUMEN — lo primero que ve el dueño. Usa el cliente de SESIÓN (no el de
// servicio): así, aunque el guard del layout tuviera un fallo, la RLS
// (política "admin_lee_todo") sigue protegiendo los datos — defensa en
// profundidad (docs/sistema/09-SEGURIDAD.md).

import { crearClienteServidor } from '@/lib/supabase/server';
import { Tarjeta, SinDatos, Seccion } from '@/components/admin/Tarjeta';
import { BannerAvisos, type Aviso } from '@/components/admin/BannerAvisos';
import { Glosa } from '@/components/admin/Glosa';
import { GraficoTendencia } from '@/components/admin/GraficoTendencia';

export const dynamic = 'force-dynamic';

// Camino de compra — conteos anónimos de event_log (sin cookies). Orden = orden real del camino.
const PASOS_EMBUDO = [
  { tipo: 'landing_vista', etiqueta: 'Vieron la página de ventas' },
  { tipo: 'onboarding_iniciado', etiqueta: 'Empezaron el recorrido de inicio' },
  { tipo: 'onboarding_completado', etiqueta: 'Terminaron el recorrido' },
  { tipo: 'paywall_visto', etiqueta: 'Vieron los planes' },
  { tipo: 'plan_elegido', etiqueta: 'Tocaron "Empezar mis 3 días gratis"' },
] as const;

function formatearUsd(n: number): string {
  return `$${n.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default async function AdminResumenPage() {
  const supabase = await crearClienteServidor();

  const inicioHoy = new Date();
  inicioHoy.setHours(0, 0, 0, 0);
  const inicioMes = new Date(inicioHoy.getFullYear(), inicioHoy.getMonth(), 1);

  const desde30dias = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [{ count: totalUsuarios }, iaHoy, iaMes, { count: erroresSemana }, { count: activaciones }, cuentas30dias] =
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
      supabase.from('profiles').select('created_at').gte('created_at', desde30dias.toISOString()),
    ]);

  const costoHoy = (iaHoy.data ?? []).reduce((sum, r) => sum + Number(r.cost_usd ?? 0), 0);
  const costoMes = (iaMes.data ?? []).reduce((sum, r) => sum + Number(r.cost_usd ?? 0), 0);
  const llamadasMes = (iaMes.data ?? []).length;

  // Un punto por día de los últimos 30 (incluye los días en 0 para ver la forma real de la curva).
  const cuentasPorDia = new Map<string, number>();
  for (const c of cuentas30dias.data ?? []) {
    const dia = String(c.created_at).slice(0, 10);
    cuentasPorDia.set(dia, (cuentasPorDia.get(dia) ?? 0) + 1);
  }
  const tendenciaUsuarios = Array.from({ length: 30 }, (_, i) => {
    const fecha = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000);
    const clave = fecha.toISOString().slice(0, 10);
    return {
      etiqueta: fecha.toLocaleDateString('es', { day: '2-digit', month: 'short' }),
      valor: cuentasPorDia.get(clave) ?? 0,
    };
  });

  const desde7dias = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const conteosEmbudo = await Promise.all(
    PASOS_EMBUDO.map((p) =>
      supabase
        .from('event_log')
        .select('id', { count: 'exact', head: true })
        .eq('type', p.tipo)
        .gte('created_at', desde7dias)
    )
  );
  const embudo = PASOS_EMBUDO.map((p, i) => ({ ...p, total: conteosEmbudo[i].count ?? 0 }));
  const maximoEmbudo = Math.max(embudo[0].total, 1);

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
          Sin datos todavía — el webhook
          <Glosa termino="webhook">
            El aviso automático que Hotmart le manda a tu app cada vez que alguien paga, cancela o se le vence la
            tarjeta — así la app se entera sola, sin que nadie tenga que avisarle.
          </Glosa>{' '}
          de Hotmart no está conectado (ver docs/sistema/18-VENTA-HOTMART.md). Ingresos, MRR
          <Glosa termino="MRR">
            "Monthly Recurring Revenue": cuánto dinero entra cada mes de forma repetida por las suscripciones
            activas — el número que mejor resume si el negocio está creciendo.
          </Glosa>
          , cancelaciones y churn
          <Glosa termino="churn">
            El porcentaje de clientas que se dan de baja en un período — cuanto más bajo, mejor.
          </Glosa>{' '}
          aparecerán aquí en cuanto empiecen a llegar ventas reales.
        </SinDatos>
      </Seccion>

      <Seccion titulo="Camino de compra (últimos 7 días)">
        {embudo[0].total === 0 && embudo[3].total === 0 ? (
          <SinDatos>
            Aún sin visitas registradas — aparecerán aquí en cuanto alguien entre a la página de ventas. Así vas a ver
            en qué paso se cae la gente antes de pagar.
          </SinDatos>
        ) : (
          <div className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_22%,transparent)] bg-[var(--surface)] p-4">
            {embudo.map((p, i) => {
              const anterior = i > 0 ? embudo[i - 1].total : 0;
              const porcentaje = i > 0 && anterior > 0 ? Math.round((p.total / anterior) * 100) : null;
              return (
                <div key={p.tipo}>
                  <div className="flex items-baseline justify-between gap-3 text-[12.5px]">
                    <span className="text-[var(--text-secondary)]">{p.etiqueta}</span>
                    <span className="shrink-0 font-semibold tabular-nums text-[var(--text-primary)]">
                      {p.total}
                      {porcentaje !== null && (
                        <span className="ml-1.5 font-normal text-[var(--text-tertiary)]">· {porcentaje}%</span>
                      )}
                    </span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)]">
                    <div
                      className="h-2 rounded-full bg-[var(--accent)]"
                      style={{ width: `${Math.min(100, (p.total / maximoEmbudo) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
            <p className="text-[11.5px] leading-snug text-[var(--text-tertiary)]">
              Cada porcentaje es de quienes llegaron al paso anterior. Donde el número cae más, ahí está el problema
              (la página de ventas, el recorrido o la pantalla de planes).
            </p>
          </div>
        )}
      </Seccion>

      <Seccion titulo="Usuarios">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Tarjeta icono="👥" etiqueta="Total de usuarios" valor={totalUsuarios ?? 0} />
          <Tarjeta
            icono="✨"
            etiqueta="Activaron (este mes)"
            valor={activaciones ?? 0}
            insight="Usaron al menos una función real por primera vez"
          />
        </div>
        <div className="mt-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_22%,transparent)] bg-[var(--surface)] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
            Cuentas nuevas por día (30 días)
          </p>
          <GraficoTendencia datos={tendenciaUsuarios} />
        </div>
      </Seccion>

      <Seccion titulo="Costo de IA">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Tarjeta
            icono="🤖"
            etiqueta="Gastado hoy"
            glosa="Es un cálculo aproximado (no la factura real) a partir de lo que cobra Anthropic por cada mensaje que la IA lee y responde. Sirve para tener una idea, no como número exacto."
            valor={formatearUsd(costoHoy)}
          />
          <Tarjeta
            icono="🤖"
            etiqueta="Gastado este mes"
            glosa="Igual que arriba: un estimado, no la factura real de Anthropic."
            valor={formatearUsd(costoMes)}
            insight={llamadasMes > 0 ? `${llamadasMes} llamadas a la IA este mes` : 'Aún sin llamadas registradas'}
          />
        </div>
      </Seccion>

      <Seccion titulo="Salud">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Tarjeta
            icono="🐞"
            etiqueta="Errores (7 días)"
            valor={erroresSemana ?? 0}
            tono={(erroresSemana ?? 0) > 5 ? 'alerta' : 'normal'}
          />
        </div>
      </Seccion>
    </div>
  );
}
