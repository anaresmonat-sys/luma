import { describe, expect, it } from 'vitest';
import { msDesdeMedianoche } from '@/lib/limite-persona';

const HORA = 3_600_000;
const INSTANTE = Date.UTC(2026, 9, 22, 3, 30, 0); // 22-oct-2026 03:30 UTC

describe('el día de las tiradas empieza a medianoche de la persona', () => {
  it('en Bogotá (UTC-5) son las 22:30 del día anterior', () => {
    expect(msDesdeMedianoche('America/Bogota', INSTANTE)).toBe(22.5 * HORA);
  });
  it('en Madrid (UTC+2 en octubre) son las 05:30', () => {
    expect(msDesdeMedianoche('Europe/Madrid', INSTANTE)).toBe(5.5 * HORA);
  });
  it('una zona inventada o ausente devuelve null (se usan las últimas 24 h)', () => {
    expect(msDesdeMedianoche('Mi/Ciudad', INSTANTE)).toBeNull();
    expect(msDesdeMedianoche(undefined, INSTANTE)).toBeNull();
  });
});
