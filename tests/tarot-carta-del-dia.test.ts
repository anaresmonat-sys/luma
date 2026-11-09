import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { arcanoMayorAlAzar, cartaDelDia } from '@/lib/tarotDeck';

// La «Carta del día» de Tarot y la carta decorativa del Inicio no tienen ninguna relación (decisión de la dueña,
// 2026-11-09): la primera es determinista por fecha y puede ser cualquiera de las 78; la segunda es un arcano mayor al azar.

const dia = (n: number) => new Date(2026, 10, 1 + n, 12, 0, 0);

describe('cartaDelDia (Tarot)', () => {
  it('es la misma durante todo el día (de las 00:00:01 a las 23:59:59)', () => {
    const a = cartaDelDia(new Date(2026, 10, 9, 0, 0, 1));
    const b = cartaDelDia(new Date(2026, 10, 9, 12, 30, 0));
    const c = cartaDelDia(new Date(2026, 10, 9, 23, 59, 59));
    expect(a.carta.id).toBe(b.carta.id);
    expect(b.carta.id).toBe(c.carta.id);
    expect(a.invertida).toBe(c.invertida);
  });

  it('sigue pudiendo ser cualquiera de las 78 y salir invertida (no se limitó a arcanos mayores)', () => {
    const cartas = Array.from({ length: 400 }, (_, i) => cartaDelDia(dia(i)));
    expect(cartas.some((c) => c.carta.arcano === 'menor')).toBe(true);
    expect(cartas.some((c) => c.invertida)).toBe(true);
  });
});

describe('arcanoMayorAlAzar (adorno del Inicio)', () => {
  it('siempre es un arcano mayor (sin El Diablo, La Torre ni La Muerte) con su imagen en /public/tarot', () => {
    const vistas = new Set<string>();
    for (let i = 0; i < 300; i++) {
      const carta = arcanoMayorAlAzar();
      expect(carta.arcano).toBe('mayor');
      expect(['el-diablo', 'la-torre', 'la-muerte']).not.toContain(carta.id);
      expect(existsSync(path.join(process.cwd(), 'public', carta.image))).toBe(true);
      vistas.add(carta.id);
    }
    expect(vistas.size).toBeGreaterThanOrEqual(15);
    expect(vistas.size).toBeLessThanOrEqual(19);
  });
});
