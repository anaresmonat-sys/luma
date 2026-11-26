// ¿Qué plan compró? Lo dice el código de la oferta de Hotmart (el «off=» del enlace de pago); el nombre del plan es
// solo el respaldo. Si no se puede saber, devuelve null: la base de datos conserva el plan que ya estaba guardado
// (un aviso de cancelación o reembolso sin oferta no debe convertir un anual en mensual).

import { OFERTAS_HOTMART } from './hotmart-links';

export type PlanLuma = 'mensual' | 'anual';

export function planDeHotmart(codigoOferta?: string | null, nombrePlan?: string | null): PlanLuma | null {
  if (codigoOferta === OFERTAS_HOTMART.anual) return 'anual';
  if (codigoOferta === OFERTAS_HOTMART.mensual) return 'mensual';
  const nombre = nombrePlan ?? '';
  if (/anual|annual|yearly/i.test(nombre)) return 'anual';
  if (/mensual|monthly/i.test(nombre)) return 'mensual';
  return null;
}
