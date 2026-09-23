// Tope mensual de personas nuevas en El Círculo — pedido del usuario,
// 2026-09-23 (cada persona agregada gasta una llamada real de IA, sin más
// freno hoy que la prueba gratis de una sola vez y el tope de gasto de
// Anthropic). Local-first, mismo patrón que lib/prueba-gratis.ts: se puede
// saltar borrando datos del navegador — cuando haya planes reales conectados
// (Hotmart), esto se vuelve el límite del plan gratis y se refuerza también
// en el servidor.

const CLAVE = 'luma_circulo_mes';
export const LIMITE_MENSUAL = 10;

interface Registro {
  mes: string; // "YYYY-M"
  cantidad: number;
}

function mesActual(): string {
  const hoy = new Date();
  return `${hoy.getFullYear()}-${hoy.getMonth()}`;
}

function leerRegistro(): Registro {
  try {
    const crudo = window.localStorage.getItem(CLAVE);
    const r = crudo ? (JSON.parse(crudo) as Registro) : null;
    if (r && r.mes === mesActual()) return r;
  } catch {
    // localStorage puede fallar (modo privado, cuota) — se trata como sin uso todavía.
  }
  return { mes: mesActual(), cantidad: 0 };
}

export function cupoRestante(): number {
  return Math.max(0, LIMITE_MENSUAL - leerRegistro().cantidad);
}

export function cupoDisponible(): boolean {
  return cupoRestante() > 0;
}

export function consumirCupo(): void {
  try {
    const r = leerRegistro();
    r.cantidad += 1;
    window.localStorage.setItem(CLAVE, JSON.stringify(r));
  } catch {
    // No bloquea el flujo si falla el guardado.
  }
}

/** Primer día del mes siguiente, para el mensaje "vuelve el…". */
export function proximoReinicio(): string {
  const hoy = new Date();
  const siguiente = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 1);
  return siguiente.toLocaleDateString('es', { day: 'numeric', month: 'long' });
}
