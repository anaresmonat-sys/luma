import { describe, it, expect } from 'vitest';
import { esCompraNuevaTrasReembolso } from '@/lib/membership-fsm';
import { yaUsoSuGarantia } from '@/lib/garantia';

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

// Cliente de Supabase simulado: cada tabla devuelve un conteo fijo.
function clienteSimulado(conteos: Record<string, number>) {
  return {
    from(tabla: string) {
      const cadena: any = {
        select: () => cadena,
        eq: () => cadena,
        neq: () => cadena,
        then: (ok: (v: { count: number }) => unknown) => ok({ count: conteos[tabla] ?? 0 }),
      };
      return cadena;
    },
  } as any;
}

describe('una sola garantía por persona', () => {
  it('sin reembolsos previos, todavía tiene garantía', async () => {
    expect(await yaUsoSuGarantia(clienteSimulado({}), 'u1')).toBe(false);
  });
  it('con un reembolso hecho desde el panel, ya la usó', async () => {
    expect(await yaUsoSuGarantia(clienteSimulado({ cancel_requests: 1 }), 'u1')).toBe(true);
  });
  it('con un reembolso registrado por Hotmart, ya la usó', async () => {
    expect(await yaUsoSuGarantia(clienteSimulado({ payment_transactions: 1 }), 'u1')).toBe(true);
  });
});
