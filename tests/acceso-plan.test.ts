import { describe, expect, it } from 'vitest';
import { GRACIA_PAGO_FALLIDO_DIAS, algunaSuscripcionDaAcceso, suscripcionDaAcceso } from '@/lib/acceso-plan';

const AHORA = new Date('2026-10-20T12:00:00Z');
const enDias = (d: number) => new Date(AHORA.getTime() + d * 86_400_000).toISOString();

describe('regla de acceso al plan de pago', () => {
  it('active/trialing sin fecha de fin (cortesía) da acceso', () => {
    expect(suscripcionDaAcceso({ estado: 'active', current_period_end: null }, AHORA)).toBe(true);
    expect(suscripcionDaAcceso({ estado: 'trialing', current_period_end: null }, AHORA)).toBe(true);
  });

  it('active dentro del período da acceso', () => {
    expect(suscripcionDaAcceso({ estado: 'active', current_period_end: enDias(10) }, AHORA)).toBe(true);
  });

  it('active vencido hace menos de 24 h todavía da acceso (renovación con retraso)', () => {
    const hace12h = new Date(AHORA.getTime() - 12 * 3_600_000).toISOString();
    expect(suscripcionDaAcceso({ estado: 'active', current_period_end: hace12h }, AHORA)).toBe(true);
  });

  it('active vencido hace más de 24 h NO da acceso', () => {
    expect(suscripcionDaAcceso({ estado: 'active', current_period_end: enDias(-2) }, AHORA)).toBe(false);
  });

  it('cancelled conserva el acceso hasta el fin de lo ya pagado', () => {
    expect(suscripcionDaAcceso({ estado: 'cancelled', current_period_end: enDias(12) }, AHORA)).toBe(true);
  });

  it('cancelled sin fecha de fin da 3 días desde que canceló; con fecha pasada NO da acceso', () => {
    expect(suscripcionDaAcceso({ estado: 'cancelled', current_period_end: null, updated_at: enDias(-2) }, AHORA)).toBe(true);
    expect(suscripcionDaAcceso({ estado: 'cancelled', current_period_end: null, updated_at: enDias(-4) }, AHORA)).toBe(false);
    expect(suscripcionDaAcceso({ estado: 'cancelled', current_period_end: null }, AHORA)).toBe(false);
    expect(suscripcionDaAcceso({ estado: 'cancelled', current_period_end: enDias(-1) }, AHORA)).toBe(false);
  });

  it('past_due da acceso solo durante los días de gracia desde el aviso', () => {
    expect(suscripcionDaAcceso({ estado: 'past_due', updated_at: enDias(-1) }, AHORA)).toBe(true);
    expect(suscripcionDaAcceso({ estado: 'past_due', updated_at: enDias(-(GRACIA_PAGO_FALLIDO_DIAS + 1)) }, AHORA)).toBe(false);
    expect(suscripcionDaAcceso({ estado: 'past_due', updated_at: null }, AHORA)).toBe(false);
  });

  it('refunded, chargeback, expired y estados desconocidos NO dan acceso', () => {
    for (const estado of ['refunded', 'chargeback', 'expired', 'inventado']) {
      expect(suscripcionDaAcceso({ estado, current_period_end: enDias(30) }, AHORA)).toBe(false);
    }
  });

  it('con varias filas basta una válida; sin filas no hay acceso', () => {
    expect(algunaSuscripcionDaAcceso([{ estado: 'refunded' }, { estado: 'active', current_period_end: enDias(3) }], AHORA)).toBe(true);
    expect(algunaSuscripcionDaAcceso([], AHORA)).toBe(false);
    expect(algunaSuscripcionDaAcceso(null, AHORA)).toBe(false);
  });
});
