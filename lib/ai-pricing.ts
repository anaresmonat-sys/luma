// Precio por millón de tokens, SOLO servidor — usado para calcular el costo
// ESTIMADO de cada llamada de IA (ai_calls.cost_usd). Es una estimación, no un
// hecho verificado contra tu factura real (docs/sistema/21-BACKOFFICE.md: "si
// faltan componentes reales, mostrar Estimación, nunca ganancia real"). Verifica
// el precio vigente en https://console.anthropic.com (Settings → Billing) y
// ajusta esta tabla si cambia — el panel siempre rotula esto como "Estimado".
const PRECIO_POR_MILLON_USD: Record<string, { entrada: number; salida: number }> = {
  'claude-sonnet-5': { entrada: 3, salida: 15 },
};

const PRECIO_POR_DEFECTO = { entrada: 3, salida: 15 };

export function calcularCostoUsd(modelo: string, tokensEntrada: number, tokensSalida: number): number {
  const precio = PRECIO_POR_MILLON_USD[modelo] ?? PRECIO_POR_DEFECTO;
  const costo = (tokensEntrada * precio.entrada + tokensSalida * precio.salida) / 1_000_000;
  return Math.round(costo * 1_000_000) / 1_000_000;
}
