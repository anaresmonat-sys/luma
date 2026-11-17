// «La compra actual» de una cuenta. Hotmart da SIEMPRE garantía en cada compra, también si la persona ya recibió un
// reembolso antes y vuelve a comprar (no se puede quitar). Por eso, para calcular el plazo de 15 días y elegir qué
// cobro reembolsar, hay que mirar solo las ventas POSTERIORES al último reembolso: la compra nueva, no la antigua.

import type { SupabaseClient } from '@supabase/supabase-js';

export interface VentaFila {
  transaction_id: string | null;
  amount_minor: number | string | null;
  occurred_at: string;
}

/** Ventas posteriores al último reembolso (si no hubo reembolsos, todas). `ventas` en cualquier orden. */
export function ventasDeLaCompraActual<T extends { occurred_at: string }>(ventas: T[], fechasReembolso: string[]): T[] {
  if (fechasReembolso.length === 0) return ventas;
  const ultimo = Math.max(...fechasReembolso.map((f) => new Date(f).getTime()));
  return ventas.filter((v) => new Date(v.occurred_at).getTime() > ultimo);
}

/** Cuándo empezó la compra actual: con reembolsos previos, su primera venta posterior; si no, la fecha de alta de la cuenta. */
export function inicioDeLaCompraActual(actuales: { occurred_at: string }[], huboReembolsos: boolean, creadaEn: string): string {
  if (!huboReembolsos) return creadaEn;
  const orden = [...actuales].sort((a, b) => new Date(a.occurred_at).getTime() - new Date(b.occurred_at).getTime());
  return orden[0]?.occurred_at ?? creadaEn;
}

export async function datosCompraActual(admin: SupabaseClient<any, any, any>, userId: string, creadaEn: string) {
  const { data: porPanel } = await admin
    .from('cancel_requests')
    .select('resolved_at')
    .eq('user_id', userId)
    .eq('tipo', 'reembolso')
    .eq('detalle', 'reembolsado_por_api');
  const { data: porHotmart } = await admin
    .from('payment_transactions')
    .select('occurred_at')
    .eq('user_id', userId)
    .eq('economic_kind', 'refund');
  const fechas = [
    ...((porPanel ?? []) as { resolved_at: string | null }[]).map((r) => r.resolved_at).filter((f): f is string => Boolean(f)),
    ...((porHotmart ?? []) as { occurred_at: string }[]).map((r) => r.occurred_at),
  ];

  const { data: ventas } = await admin
    .from('payment_transactions')
    .select('transaction_id, amount_minor, occurred_at')
    .eq('user_id', userId)
    .eq('economic_kind', 'sale')
    .order('occurred_at', { ascending: true });
  const actuales = ventasDeLaCompraActual((ventas ?? []) as VentaFila[], fechas);
  return { ventas: actuales, inicio: inicioDeLaCompraActual(actuales, fechas.length > 0, creadaEn) };
}
