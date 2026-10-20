// REGLA ÚNICA de acceso al plan de pago. La usan /api/mi-plan (lo que ve la persona) y
// lib/prueba-servidor.ts (lo que decide el servidor antes de gastar IA), para que nunca se
// contradigan. Estados que guarda la base (tabla subscriptions): active · trialing · trial (antiguo)
// · past_due · cancelled · refunded · chargeback · expired.
//
//  - active / trialing: acceso hasta el fin del período + 24 h de tolerancia (el aviso de renovación de
//    Hotmart puede llegar con retraso). Sin fecha de fin (cortesía) = acceso sin límite.
//  - cancelled: la persona cancela pero YA PAGÓ ese período → conserva el acceso hasta su fin
//    (promesa pública de /app/cancelar: «sigues teniendo acceso hasta el final del período que ya pagaste»).
//  - past_due (cobro fallido): 3 días de margen desde el aviso mientras Hotmart reintenta el cobro.
//  - refunded / chargeback / expired: sin acceso.
//
// Cualquier cambio aquí cambia una promesa de dinero: actualizar también app/app/cancelar y /reembolsos.

export const GRACIA_PAGO_FALLIDO_DIAS = 3;
export const TOLERANCIA_RENOVACION_HORAS = 24;

const HORA_MS = 60 * 60 * 1000;
const DIA_MS = 24 * HORA_MS;

export interface FilaSuscripcion {
  estado: string;
  current_period_end?: string | null;
  updated_at?: string | null;
}

/** Estados que hay que pedirle a la base para poder decidir (el resto nunca da acceso). */
export const ESTADOS_A_CONSULTAR = ['active', 'trialing', 'trial', 'cancelled', 'past_due'] as const;

export function suscripcionDaAcceso(fila: FilaSuscripcion, ahora: Date = new Date()): boolean {
  const fin = fila.current_period_end ? new Date(fila.current_period_end).getTime() : null;
  const t = ahora.getTime();

  switch (fila.estado) {
    case 'active':
    case 'trialing':
    case 'trial':
      return fin === null || t < fin + TOLERANCIA_RENOVACION_HORAS * HORA_MS;
    case 'cancelled':
      return fin !== null && t < fin;
    case 'past_due': {
      const aviso = fila.updated_at ? new Date(fila.updated_at).getTime() : null;
      return aviso !== null && t < aviso + GRACIA_PAGO_FALLIDO_DIAS * DIA_MS;
    }
    default:
      return false;
  }
}

export function algunaSuscripcionDaAcceso(filas: FilaSuscripcion[] | null | undefined, ahora: Date = new Date()): boolean {
  return (filas ?? []).some((f) => suscripcionDaAcceso(f, ahora));
}
