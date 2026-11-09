import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { cartaDelDia } from '@/lib/tarotDeck';

// La carta del día se descubre en el Inicio y la lee Tarot: tiene que ser la misma carta para todas ese día, un arcano
// mayor y al derecho (si no, la persona vería una carta y leería otra).

const dia = (n: number) => new Date(2026, 10, 1 + n, 12, 0, 0);

describe('cartaDelDia', () => {
  it('es la misma durante todo el día (de las 00:00:01 a las 23:59:59)', () => {
    const a = cartaDelDia(new Date(2026, 10, 9, 0, 0, 1));
    const b = cartaDelDia(new Date(2026, 10, 9, 12, 30, 0));
    const c = cartaDelDia(new Date(2026, 10, 9, 23, 59, 59));
    expect(a.carta.id).toBe(b.carta.id);
    expect(b.carta.id).toBe(c.carta.id);
  });

  it('siempre es un arcano mayor y nunca sale invertida', () => {
    for (let i = 0; i < 400; i++) {
      const { carta, invertida } = cartaDelDia(dia(i));
      expect(carta.arcano).toBe('mayor');
      expect(invertida).toBe(false);
    }
  });

  it('cambia con los días y reparte entre varios arcanos', () => {
    const distintas = new Set(Array.from({ length: 120 }, (_, i) => cartaDelDia(dia(i)).carta.id));
    expect(distintas.size).toBeGreaterThanOrEqual(12);
  });

  it('cada arcano mayor tiene su imagen en /public/tarot', () => {
    const ids = new Set(Array.from({ length: 400 }, (_, i) => cartaDelDia(dia(i)).carta));
    for (const carta of ids) {
      expect(existsSync(path.join(process.cwd(), 'public', carta.image))).toBe(true);
    }
  });
});
