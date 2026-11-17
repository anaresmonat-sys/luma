import { describe, it, expect } from 'vitest';
import { elegirVentaAReembolsar } from '@/lib/venta-a-reembolsar';

describe('venta a reembolsar', () => {
  it('con prueba gratis delante, elige el primer cobro real y no el inicio de la prueba (caso prueba6)', () => {
    const ventas = [
      { transaction_id: 'HP3693403302', amount_minor: null },
      { transaction_id: 'HP0170124640', amount_minor: 1000 },
    ];
    expect(elegirVentaAReembolsar(ventas)?.transaction_id).toBe('HP0170124640');
  });
  it('si hay varios cobros, el primero con importe', () => {
    const ventas = [
      { transaction_id: 'A', amount_minor: 0 },
      { transaction_id: 'B', amount_minor: 999 },
      { transaction_id: 'C', amount_minor: 999 },
    ];
    expect(elegirVentaAReembolsar(ventas)?.transaction_id).toBe('B');
  });
  it('si ninguna trae importe (datos antiguos), la más antigua', () => {
    expect(elegirVentaAReembolsar([{ transaction_id: 'X', amount_minor: null }, { transaction_id: 'Y', amount_minor: null }])?.transaction_id).toBe('X');
  });
  it('sin ventas, nada', () => {
    expect(elegirVentaAReembolsar([])).toBeUndefined();
    expect(elegirVentaAReembolsar(null)).toBeUndefined();
  });
});
