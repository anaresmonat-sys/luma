// Máquina de estados de la membresía (docs/sistema/18-VENTA-HOTMART.md). Cada evento de Hotmart
// mueve al usuario entre estados; 'trialing' y 'active' dan acceso COMPLETO (la diferencia es solo
// de medición: conversión = count(first_paid_at) / count(trial_ends_at)).
//
// ⚠️ PLACEHOLDER — VERIFICAR antes de confiar en la métrica trial→pago: hacer una compra sandbox
// CON el período de prueba activado y capturar el JSON real del webhook al iniciar el trial. Es
// plausible que Hotmart mande PURCHASE_APPROVED con valor 0, no un evento propio — si es así, este
// nombre no dispara nunca y todos los trials arrancan directo en 'active' (protocolo de
// verificación de 5 pasos en 18-VENTA-HOTMART.md → "El evento de inicio de trial es un PLACEHOLDER").
const TRIAL_START_EVENT = 'SUBSCRIPTION_TRIAL_START'; // (verificar contra el panel real de Hotmart)

export type EstadoMembresia =
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'cancelled'
  | 'expired'
  | 'refunded'
  | 'chargeback';

// Nombres verificados en el panel de Hotmart de esta cuenta (2026-09-28, catálogo real de la
// pantalla "Registrar Webhook" — no todos los que aparecen en la doc genérica de Hotmart existen
// aquí). No hay un evento propio de "expiración" en esta lista: si aparece más adelante, se agrega.
const EVENTO_A_ESTADO: Record<string, EstadoMembresia> = {
  [TRIAL_START_EVENT]: 'trialing',
  PURCHASE_APPROVED: 'active',
  PURCHASE_COMPLETE: 'active',
  PURCHASE_DELAYED: 'past_due',
  SUBSCRIPTION_CANCELLATION: 'cancelled',
  PURCHASE_CANCELED: 'cancelled', // "Compra cancelada" — evento distinto de SUBSCRIPTION_CANCELLATION
  PURCHASE_REFUNDED: 'refunded',
  PURCHASE_CHARGEBACK: 'chargeback',
};

// SWITCH_PLAN (mensual↔anual) no transiciona de estado — se maneja aparte en el handler.
export const PLAN_CHANGE_EVENT = 'SWITCH_PLAN';

const TERMINAL_NEGATIVO: EstadoMembresia[] = ['refunded', 'chargeback'];
const ACCESO_COMPLETO: EstadoMembresia[] = ['trialing', 'active'];

export function estadoParaEvento(event: string): EstadoMembresia | null {
  return EVENTO_A_ESTADO[event] ?? null;
}

/** ¿Es legal pasar de `from` a `to`? Bloquea reactivar un refund/chargeback con un evento viejo. */
export function transicionValida(from: EstadoMembresia | null, to: EstadoMembresia): boolean {
  if (from === null) return true;
  if (TERMINAL_NEGATIVO.includes(from) && (to === 'active' || to === 'trialing')) return false;
  return true;
}

export function tieneAccesoCompleto(
  estado: EstadoMembresia,
  ahora: Date,
  accessUntil?: Date | null,
  graceEndsAt?: Date | null
): boolean {
  if (ACCESO_COMPLETO.includes(estado)) return true;
  if (estado === 'cancelled') return !!accessUntil && ahora < accessUntil;
  if (estado === 'past_due') return !!graceEndsAt && ahora < graceEndsAt;
  return false;
}
