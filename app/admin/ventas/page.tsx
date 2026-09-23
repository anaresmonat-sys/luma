// VENTAS Y NEGOCIO — sin webhook de Hotmart conectado todavía, esta sección
// no inventa cifras. Ingresos, MRR, churn (voluntario/involuntario), LTV, CAC,
// ratio LTV:CAC, payback y ganancia real (docs/sistema/21-BACKOFFICE.md +
// 40-UNIT-ECONOMICS.md) se calculan sobre `subscriptions` y una futura tabla
// `acquisition_spend` — ambas listas de estructura, vacías de datos reales.

import { SinDatos, Seccion } from '@/components/admin/Tarjeta';

export const dynamic = 'force-dynamic';

export default function AdminVentasPage() {
  return (
    <div>
      <Seccion titulo="Ingresos y suscripciones">
        <SinDatos>
          Sin datos — el webhook de Hotmart todavía no está conectado. En cuanto exista, aquí aparecen ingresos del
          mes, MRR, nuevas compras y cancelaciones (ver docs/sistema/18-VENTA-HOTMART.md).
        </SinDatos>
      </Seccion>

      <Seccion titulo="Churn: voluntario vs involuntario">
        <SinDatos>
          Sin datos — se calcula del estado de las suscripciones tras conectar Hotmart. Se separan porque se arreglan
          distinto: el voluntario con retención, el involuntario con el cobro (dunning).
        </SinDatos>
      </Seccion>

      <Seccion titulo="LTV, CAC y ganancia real">
        <SinDatos>
          Sin datos — el LTV y el CAC necesitan al menos un par de meses de ventas reales, y el CAC además requiere
          que ingreses el gasto en publicidad por canal. La ganancia real se calcula descontando Hotmart, afiliados,
          impuestos, el costo de IA (ya se está midiendo en "Costo de IA") e infraestructura de lo que factures. Todo
          esto se activa solo cuando haya datos de verdad — nunca se muestra un número inventado.
        </SinDatos>
      </Seccion>
    </div>
  );
}
