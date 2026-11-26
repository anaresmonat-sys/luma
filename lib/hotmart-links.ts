// Enlaces reales de la página de pago de Hotmart, uno por plan (docs/sistema/18-VENTA-HOTMART.md).
// No son secretos: son los mismos enlaces que verá cualquier compradora al pagar, así que no hay
// problema en que vivan en el código del cliente.
// `showOnlyTrial=1` fuerza que el checkout arranque directo en la opción de prueba gratis (ambos
// planes tienen el período de prueba de 3 días activado en Hotmart).

/** Código de la oferta de cada plan en Hotmart. El aviso de compra lo trae y así se sabe qué plan es. */
export const OFERTAS_HOTMART = {
  mensual: 'l96aiyz9',
  anual: '0zkut925',
} as const;

const PRODUCTO = 'https://pay.hotmart.com/F107797138N';

export function checkoutHotmart(plan: 'mensual' | 'anual'): string {
  const url = new URL(PRODUCTO);
  url.searchParams.set('off', OFERTAS_HOTMART[plan]);
  url.searchParams.set('showOnlyTrial', '1');
  return url.toString();
}
