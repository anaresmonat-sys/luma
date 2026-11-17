// Qué transacción se reembolsa: el PRIMER COBRO REAL (con importe). Quien empieza con prueba gratis tiene antes una «venta»
// de importe vacío (el inicio de la prueba): reembolsar esa no devuelve nada y Hotmart la rechaza (error 400).
// Si ninguna trae importe (datos antiguos), se usa la más antigua, como antes.

export interface VentaFila {
  transaction_id: string | null;
  amount_minor: number | string | null;
}

/** `ventas` debe venir ordenada de la más antigua a la más reciente. */
export function elegirVentaAReembolsar(ventas: VentaFila[] | null | undefined): VentaFila | undefined {
  const lista = ventas ?? [];
  return lista.find((v) => Number(v.amount_minor) > 0) ?? lista[0];
}
