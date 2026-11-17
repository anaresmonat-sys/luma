import { describe, it, expect } from 'vitest';
import { esCompraNuevaTrasReembolso } from '@/lib/membership-fsm';
import { ventasDeLaCompraActual, inicioDeLaCompraActual } from '@/lib/compra-actual';
import { elegirVentaAReembolsar } from '@/lib/venta-a-reembolsar';

describe('compra nueva tras un reembolso', () => {
  it('una transacción nueva de una cuenta reembolsada la reactiva', () => {
    expect(esCompraNuevaTrasReembolso('refunded', 'PURCHASE_APPROVED', false, true)).toBe(true);
  });
  it('un aviso viejo o repetido (transacción ya conocida) sigue bloqueado', () => {
    expect(esCompraNuevaTrasReembolso('refunded', 'PURCHASE_APPROVED', true, true)).toBe(false);
  });
  it('el fin de garantía (PURCHASE_COMPLETE) no reactiva a nadie', () => {
    expect(esCompraNuevaTrasReembolso('refunded', 'PURCHASE_COMPLETE', false, true)).toBe(false);
  });
  it('un chargeback no se reactiva solo', () => {
    expect(esCompraNuevaTrasReembolso('chargeback', 'PURCHASE_APPROVED', false, true)).toBe(false);
  });
  it('sin código de transacción no se reactiva', () => {
    expect(esCompraNuevaTrasReembolso('refunded', 'PURCHASE_APPROVED', false, false)).toBe(false);
  });
  it('cuentas que no están reembolsadas no cambian', () => {
    expect(esCompraNuevaTrasReembolso('active', 'PURCHASE_APPROVED', false, true)).toBe(false);
    expect(esCompraNuevaTrasReembolso(null, 'PURCHASE_APPROVED', false, true)).toBe(false);
  });
});

// Hotmart da garantía en CADA compra: tras un reembolso previo, el plazo y el cobro a reembolsar son los de la compra nueva.
describe('compra actual (tras un reembolso previo)', () => {
  const ventas = [
    { transaction_id: 'VIEJA-PRUEBA', amount_minor: null, occurred_at: '2026-11-13T08:55:00Z' },
    { transaction_id: 'VIEJA-COBRO', amount_minor: 1000, occurred_at: '2026-11-16T14:10:00Z' },
    { transaction_id: 'NUEVA-PRUEBA', amount_minor: null, occurred_at: '2026-11-20T10:00:00Z' },
    { transaction_id: 'NUEVA-COBRO', amount_minor: 1000, occurred_at: '2026-11-23T10:00:00Z' },
  ];
  const reembolso = ['2026-11-17T11:45:00Z'];

  it('sin reembolsos previos, todas las ventas cuentan', () => {
    expect(ventasDeLaCompraActual(ventas, [])).toHaveLength(4);
  });
  it('con un reembolso previo, solo cuentan las ventas posteriores', () => {
    expect(ventasDeLaCompraActual(ventas, reembolso).map((v) => v.transaction_id)).toEqual(['NUEVA-PRUEBA', 'NUEVA-COBRO']);
  });
  it('el cobro a reembolsar es el de la compra nueva y no el viejo ya reembolsado', () => {
    const actuales = ventasDeLaCompraActual(ventas, reembolso);
    expect(elegirVentaAReembolsar(actuales)?.transaction_id).toBe('NUEVA-COBRO');
  });
  it('el plazo de 15 días cuenta desde el inicio de la compra nueva', () => {
    const actuales = ventasDeLaCompraActual(ventas, reembolso);
    expect(inicioDeLaCompraActual(actuales, true, '2026-11-13T08:55:00Z')).toBe('2026-11-20T10:00:00Z');
  });
  it('sin reembolsos previos, el plazo cuenta desde el alta de la cuenta, como siempre', () => {
    expect(inicioDeLaCompraActual(ventas, false, '2026-11-13T08:55:00Z')).toBe('2026-11-13T08:55:00Z');
  });
});
