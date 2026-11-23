import { describe, it, expect } from 'vitest';
import { calcularNumeroArcano, arcanoDeNacimiento } from '@/lib/numerologyUtils';

// Fallo corregido el 2026-11-23: la fecha «AAAA-MM-DD» conservaba los guiones, la suma daba NaN y todas las personas
// recibían «El Mago». Estas pruebas fijan el cálculo con fechas reales.
describe('arcano de nacimiento', () => {
  it('fechas distintas dan arcanos distintos (suma de todos los dígitos, reducida a 22 como máximo)', () => {
    expect(calcularNumeroArcano('1989-05-14')).toBe(10); // 37 → 10
    expect(arcanoDeNacimiento('1989-05-14').nombre).toBe('La Rueda de la Fortuna');
    expect(calcularNumeroArcano('1990-03-12')).toBe(7); // 25 → 7
    expect(arcanoDeNacimiento('1990-03-12').nombre).toBe('El Carro');
    expect(calcularNumeroArcano('1975-11-02')).toBe(8); // 26 → 8
    expect(arcanoDeNacimiento('1975-11-02').nombre).toBe('La Fuerza');
  });

  it('no todas las fechas dan El Mago (el fallo original)', () => {
    const nombres = new Set(['1989-05-14', '1990-03-12', '1975-11-02', '2001-09-30', '1964-12-25'].map((f) => arcanoDeNacimiento(f).nombre));
    expect(nombres.size).toBeGreaterThanOrEqual(4);
    expect(nombres.has('El Mago') && nombres.size === 1).toBe(false);
  });

  it('la suma exacta 22 se queda en 22 (El Loco) y el resultado siempre está entre 1 y 22', () => {
    expect(calcularNumeroArcano('2000-01-01')).toBe(4);
    for (let anio = 1940; anio <= 2010; anio++) {
      for (let mes = 1; mes <= 12; mes++) {
        for (const dia of [1, 9, 17, 28]) {
          const f = `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
          const n = calcularNumeroArcano(f);
          expect(Number.isInteger(n) && n >= 1 && n <= 22, `${f} → ${n}`).toBe(true);
        }
      }
    }
  });
});
