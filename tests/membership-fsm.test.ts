import { describe, expect, it } from 'vitest';
import { PLAN_CHANGE_EVENT, estadoParaEvento, transicionValida } from '@/lib/membership-fsm';

describe('máquina de estados de la membresía (eventos de Hotmart)', () => {
  it('traduce los eventos reales a estados', () => {
    expect(estadoParaEvento('PURCHASE_APPROVED')).toBe('active');
    expect(estadoParaEvento('PURCHASE_COMPLETE')).toBe('active');
    expect(estadoParaEvento('PURCHASE_DELAYED')).toBe('past_due');
    expect(estadoParaEvento('SUBSCRIPTION_CANCELLATION')).toBe('cancelled');
    expect(estadoParaEvento('PURCHASE_CANCELED')).toBe('cancelled');
    expect(estadoParaEvento('PURCHASE_REFUNDED')).toBe('refunded');
    expect(estadoParaEvento('PURCHASE_CHARGEBACK')).toBe('chargeback');
  });

  it('ignora eventos desconocidos y trata el cambio de plan aparte', () => {
    expect(estadoParaEvento('EVENTO_INVENTADO')).toBeNull();
    expect(estadoParaEvento(PLAN_CHANGE_EVENT)).toBeNull();
  });

  it('un evento viejo NO resucita un reembolso ni un contracargo', () => {
    expect(transicionValida('refunded', 'active')).toBe(false);
    expect(transicionValida('refunded', 'trialing')).toBe(false);
    expect(transicionValida('chargeback', 'active')).toBe(false);
  });

  it('las transiciones normales son válidas', () => {
    expect(transicionValida(null, 'active')).toBe(true);
    expect(transicionValida('active', 'cancelled')).toBe(true);
    expect(transicionValida('active', 'refunded')).toBe(true);
    expect(transicionValida('past_due', 'active')).toBe(true);
    expect(transicionValida('refunded', 'chargeback')).toBe(true);
  });
});
