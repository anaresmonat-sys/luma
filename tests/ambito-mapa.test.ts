import { describe, it, expect, vi } from 'vitest';

// prueba-servidor.ts importa cosas solo de servidor: se simulan para probar únicamente la función pura.
vi.mock('next/headers', () => ({ cookies: async () => ({ get: () => undefined, set: () => {} }) }));
vi.mock('@/lib/supabase/admin', () => ({ clienteAdminSupabase: () => ({}) }));

import { derivarAnonDeAmbito } from '@/lib/prueba-servidor';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ANON = '3f2504e0-4f89-41d3-9a0c-0305e82c3301';

describe('contador propio del Mapa de poder', () => {
  it('genera un UUID válido (la base de datos lo exige)', () => {
    expect(derivarAnonDeAmbito(ANON, 'mapa-poder')).toMatch(UUID);
  });
  it('es estable para la misma persona y ámbito', () => {
    expect(derivarAnonDeAmbito(ANON, 'mapa-poder')).toBe(derivarAnonDeAmbito(ANON, 'mapa-poder'));
  });
  it('es distinto del identificador original y entre ámbitos (no se mezcla con la primera lectura gratis)', () => {
    expect(derivarAnonDeAmbito(ANON, 'mapa-poder')).not.toBe(ANON);
    expect(derivarAnonDeAmbito(ANON, 'mapa-poder')).not.toBe(derivarAnonDeAmbito(ANON, 'otro'));
  });
  it('personas distintas tienen contadores distintos', () => {
    expect(derivarAnonDeAmbito(ANON, 'mapa-poder')).not.toBe(derivarAnonDeAmbito('11111111-2222-4333-8444-555555555555', 'mapa-poder'));
  });
});
