import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { verifyHotmart } from '@/lib/hotmart-verify';

const ORIGINAL = process.env.HOTMART_HOTTOK;
beforeEach(() => {
  process.env.HOTMART_HOTTOK = 'secreto-de-prueba';
});
afterEach(() => {
  if (ORIGINAL === undefined) delete process.env.HOTMART_HOTTOK;
  else process.env.HOTMART_HOTTOK = ORIGINAL;
});

describe('autenticidad del webhook de Hotmart', () => {
  it('acepta solo el hottok exacto', () => {
    expect(verifyHotmart({ hottok: 'secreto-de-prueba' })).toBe(true);
  });
  it('rechaza uno distinto, de otra longitud o ausente', () => {
    expect(verifyHotmart({ hottok: 'secreto-de-pruebX' })).toBe(false);
    expect(verifyHotmart({ hottok: 'corto' })).toBe(false);
    expect(verifyHotmart({ hottok: '' })).toBe(false);
    expect(verifyHotmart({})).toBe(false);
  });
  it('sin HOTMART_HOTTOK configurado falla en cerrado (nunca abre la puerta)', () => {
    delete process.env.HOTMART_HOTTOK;
    expect(() => verifyHotmart({ hottok: 'lo-que-sea' })).toThrow();
  });
});
