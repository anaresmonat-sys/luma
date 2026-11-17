// VENTAS Y NEGOCIO — lee reembolsos, cancelaciones y suscripciones y los pasa a la vista (components/admin/VentasVista.tsx).
// No inventa cifras: ingresos, MRR, churn, LTV y CAC se muestran cuando haya ventas suficientes (docs/sistema/21 y 40).

import { clienteAdminSupabase } from '@/lib/supabase/admin';
import { suscripcionDaAcceso } from '@/lib/acceso-plan';
import { VentasVista, type PeticionVista } from '@/components/admin/VentasVista';

export const dynamic = 'force-dynamic';

export default async function AdminVentasPage() {
  const admin = clienteAdminSupabase();
  const { data: filas } = await admin
    .from('cancel_requests')
    .select('id, user_id, email, requested_at, estado, detalle, tipo')
    .order('requested_at', { ascending: false })
    .limit(60);
  const todas = (filas ?? []) as (PeticionVista & { tipo: string | null })[];
  const peticiones = todas.filter((p) => p.tipo !== 'reembolso').slice(0, 30);
  const reembolsos = todas.filter((p) => p.tipo === 'reembolso');

  // Un reembolso queda hecho cuando Hotmart avisa (PURCHASE_REFUNDED) y la suscripción pasa a «refunded»,
  // o cuando se hizo desde el botón del panel (detalle «reembolsado_por_api»).
  const idsReembolso = reembolsos.map((r) => r.user_id);
  const { data: subs } = idsReembolso.length
    ? await admin.from('subscriptions').select('user_id, estado').in('user_id', idsReembolso)
    : { data: [] as { user_id: string; estado: string }[] };
  const reembolsados = new Set((subs ?? []).filter((s) => s.estado === 'refunded' || s.estado === 'chargeback').map((s) => s.user_id as string));
  for (const r of reembolsos) if (r.detalle === 'reembolsado_por_api') reembolsados.add(r.user_id);

  // Reparto de suscripciones: cada una cuenta en UN solo grupo (así la barra suma el total).
  const { data: subsTodas } = await admin.from('subscriptions').select('estado, plan, current_period_end, updated_at');
  const filasSub = subsTodas ?? [];
  const activasFilas = filasSub.filter(
    (f) => (f.estado === 'active' || f.estado === 'trialing' || f.estado === 'trial') && suscripcionDaAcceso(f), // misma regla que usa la app
  );
  const activas = activasFilas.length;
  const canceladas = filasSub.filter((f) => f.estado === 'cancelled').length;
  const reembolsadas = filasSub.filter((f) => f.estado === 'refunded' || f.estado === 'chargeback').length;

  return (
    <VentasVista
      d={{
        reembolsos,
        peticiones,
        reembolsados: [...reembolsados],
        activas,
        mensuales: activasFilas.filter((f) => f.plan === 'mensual').length,
        anuales: activasFilas.filter((f) => f.plan === 'anual').length,
        cortesias: activasFilas.filter((f) => f.plan === 'cortesia').length,
        canceladas,
        reembolsadas,
        sinAcceso: filasSub.length - activas - canceladas - reembolsadas,
      }}
    />
  );
}
