// VENTAS Y NEGOCIO — sin webhook de Hotmart conectado todavía, esta sección
// no inventa cifras. Ingresos, MRR, churn (voluntario/involuntario), LTV, CAC,
// ratio LTV:CAC, payback y ganancia real (docs/sistema/21-BACKOFFICE.md +
// 40-UNIT-ECONOMICS.md) se calculan sobre `subscriptions` y una futura tabla
// `acquisition_spend` — ambas listas de estructura, vacías de datos reales.

import { SinDatos, Seccion } from '@/components/admin/Tarjeta';
import { Glosa } from '@/components/admin/Glosa';
import { clienteAdminSupabase } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export default async function AdminVentasPage() {
  const admin = clienteAdminSupabase();
  const { data: filas } = await admin
    .from('cancel_requests')
    .select('id, user_id, email, requested_at, estado, detalle, tipo')
    .order('requested_at', { ascending: false })
    .limit(60);
  const peticiones = (filas ?? []).filter((p) => p.tipo !== 'reembolso').slice(0, 30);
  const reembolsos = (filas ?? []).filter((p) => p.tipo === 'reembolso');
  const porAtender = peticiones.filter((p) => p.estado !== 'cancelada');

  // Un reembolso queda hecho cuando Hotmart avisa (PURCHASE_REFUNDED) y la suscripción pasa a «refunded».
  const idsReembolso = reembolsos.map((r) => r.user_id as string);
  const { data: subs } = idsReembolso.length
    ? await admin.from('subscriptions').select('user_id, estado').in('user_id', idsReembolso)
    : { data: [] as { user_id: string; estado: string }[] };
  const reembolsados = new Set((subs ?? []).filter((s) => s.estado === 'refunded' || s.estado === 'chargeback').map((s) => s.user_id));
  const reembolsosPendientes = reembolsos.filter((r) => !reembolsados.has(r.user_id as string));

  const hora = (iso: string) => new Date(iso).toLocaleString('es-ES', { timeZone: 'Europe/Madrid' });

  return (
    <div>
      <Seccion titulo="Peticiones de reembolso">
        {reembolsos.length === 0 ? (
          <SinDatos>Nadie ha pedido reembolso todavía.</SinDatos>
        ) : (
          <div className="flex flex-col gap-2 text-sm">
            <p className="font-semibold">
              {reembolsosPendientes.length === 0
                ? 'Todos los reembolsos están hechos.'
                : `${reembolsosPendientes.length} por reembolsar en Hotmart (Ventas → Mis ventas → buscar el correo → tres puntos → Reembolsar al comprador). Ya se canceló su plan:`}
            </p>
            {reembolsos.map((r) => (
              <p key={r.id}>
                {reembolsados.has(r.user_id as string) ? '✓' : '•'} {r.email} — pidió el {hora(r.requested_at as string)} (hora de España) —{' '}
                {reembolsados.has(r.user_id as string) ? 'reembolsado' : 'pendiente de reembolsar'}
              </p>
            ))}
          </div>
        )}
      </Seccion>
      <Seccion titulo="Peticiones de cancelación">
        {peticiones.length === 0 ? (
          <SinDatos>Nadie ha pedido cancelar todavía.</SinDatos>
        ) : (
          <div className="flex flex-col gap-2 text-sm">
            <p className="font-semibold">
              {porAtender.length === 0
                ? 'Todo atendido: Hotmart canceló las peticiones solo.'
                : `${porAtender.length} por cancelar a mano en Hotmart:`}
            </p>
            {peticiones.map((p) => (
              <p key={p.id}>
                {p.estado === 'cancelada' ? '✓' : '•'} {p.email} — pidió el {hora(p.requested_at as string)} (hora de España) —{' '}
                {p.estado === 'cancelada' ? 'cancelada en Hotmart' : `pendiente (${p.detalle ?? 'sin detalle'})`}
              </p>
            ))}
          </div>
        )}
      </Seccion>
      <Seccion titulo="Ingresos y suscripciones">
        <SinDatos>
          Sin datos — el webhook
          <Glosa termino="webhook">
            El aviso automático que Hotmart le manda a tu app cada vez que alguien paga, cancela o se le vence la
            tarjeta — así la app se entera sola, sin que nadie tenga que avisarle.
          </Glosa>{' '}
          de Hotmart todavía no está conectado. En cuanto exista, aquí aparecen ingresos del mes, MRR
          <Glosa termino="MRR">
            "Monthly Recurring Revenue": cuánto dinero entra cada mes de forma repetida por las suscripciones
            activas.
          </Glosa>
          , nuevas compras y cancelaciones (ver docs/sistema/18-VENTA-HOTMART.md).
        </SinDatos>
      </Seccion>

      <Seccion titulo="Cancelaciones: por decisión propia vs por tarjeta rechazada">
        <SinDatos>
          Sin datos — se calcula del estado de las suscripciones tras conectar Hotmart. Se separan porque se arreglan
          distinto: cuando alguien decide irse, se recupera mostrándole valor de nuevo; cuando le falla la tarjeta, se
          recupera con reintentos automáticos de cobro (lo que en inglés se llama dunning
          <Glosa termino="dunning">
            reintentos automáticos de cobro y un aviso para que actualice su tarjeta — antes de darla de baja del
            todo.
          </Glosa>
          ) y un aviso para que actualice su tarjeta.
        </SinDatos>
      </Seccion>

      <Seccion titulo="Cuánto vale cada clienta y cuánto cuesta conseguirla">
        <SinDatos>
          Sin datos — el LTV
          <Glosa termino="LTV">
            "Lifetime Value": cuánto dinero deja en total una clienta durante todo el tiempo que se queda pagando.
          </Glosa>{' '}
          y el CAC
          <Glosa termino="CAC">
            "Costo de Adquisición de Clientes": cuánto cuesta en publicidad conseguir a cada nueva clienta que paga.
          </Glosa>{' '}
          necesitan al menos un par de meses de ventas reales, y el CAC además requiere que ingreses el gasto en
          publicidad por canal. La ganancia real se calcula descontando Hotmart, afiliados, impuestos, el costo de IA
          (ya se está midiendo en "Costo de IA") e infraestructura de lo que factures. Todo esto se activa solo
          cuando haya datos de verdad — nunca se muestra un número inventado.
        </SinDatos>
      </Seccion>
    </div>
  );
}
