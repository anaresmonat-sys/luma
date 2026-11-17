// REGLA: la garantía de 15 días se aplica UNA SOLA VEZ por persona. Quien ya recibió un reembolso y vuelve a comprar
// con el mismo correo no tiene una segunda garantía (evita el ciclo comprar → usar la prueba → pedir el dinero → repetir).
// Se considera «ya usada» si hay un reembolso hecho desde el panel (detalle «reembolsado_por_api») o registrado por
// Hotmart (fila «refund» en payment_transactions). Cualquier excepción se hace a mano en Hotmart.

import type { SupabaseClient } from '@supabase/supabase-js';

export async function yaUsoSuGarantia(
  admin: SupabaseClient<any, any, any>,
  userId: string,
  excluirPeticionId?: string,
): Promise<boolean> {
  let consulta = admin
    .from('cancel_requests')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('tipo', 'reembolso')
    .eq('detalle', 'reembolsado_por_api');
  if (excluirPeticionId) consulta = consulta.neq('id', excluirPeticionId);
  const { count: porPanel } = await consulta;
  if ((porPanel ?? 0) > 0) return true;

  const { count: porHotmart } = await admin
    .from('payment_transactions')
    .select('transaction_id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('economic_kind', 'refund');
  return (porHotmart ?? 0) > 0;
}
