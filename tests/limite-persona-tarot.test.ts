import { beforeEach, describe, expect, it, vi } from 'vitest';

// Quien tiene un plan activo (incluida la prueba gratis de Hotmart, que lleva tarjeta) tiene las 3 tiradas de tarot al
// día desde el primer día (decisión de la dueña, 2026-11-13). La prueba sigue acotada por su tope de coste.

const datos: Record<string, unknown> = {};

vi.mock('@/lib/supabase/admin', () => ({
  clienteAdminSupabase: () => ({
    from: (tabla: string) => {
      const respuesta = () => ({ data: datos[tabla] ?? null, error: null });
      const b: Record<string, unknown> = {
        select: () => b,
        eq: () => b,
        in: () => b,
        gte: () => b,
        maybeSingle: async () => respuesta(),
        then: (ok: (v: unknown) => unknown) => Promise.resolve(respuesta()).then(ok),
      };
      return b;
    },
  }),
}));

import { topePersonaExcedido } from '@/lib/limite-persona';

const hace = (min: number) => new Date(Date.now() - min * 60_000).toISOString();
const lecturas = (n: number, coste = 0.01) => Array.from({ length: n }, (_, i) => ({ feature: 'tarot', cost_usd: coste, created_at: hace(5 + i) }));

beforeEach(() => {
  for (const k of Object.keys(datos)) delete datos[k];
  datos.profiles = { role: 'user' };
  // suscripción creada hace 1 h: está dentro de su prueba gratis
  datos.subscriptions = [{ estado: 'active', created_at: hace(60) }];
});

describe('tiradas de tarot con plan activo en su prueba', () => {
  it('la primera tirada del día pasa', async () => {
    datos.ai_calls = [];
    expect(await topePersonaExcedido('u1', 'tarot')).toBeNull();
  });

  it('la segunda y la tercera pasan: ya no es «una al día» en la prueba', async () => {
    datos.ai_calls = lecturas(1);
    expect(await topePersonaExcedido('u1', 'tarot')).toBeNull();
    datos.ai_calls = lecturas(2);
    expect(await topePersonaExcedido('u1', 'tarot')).toBeNull();
  });

  it('a la cuarta dice que ya hizo sus 3 tiradas de hoy', async () => {
    datos.ai_calls = lecturas(3);
    expect(await topePersonaExcedido('u1', 'tarot')).toContain('3 tiradas de hoy');
  });

  it('la prueba sigue acotada por su tope de coste', async () => {
    datos.ai_calls = lecturas(1, 0.45);
    expect(await topePersonaExcedido('u1', 'tarot')).toContain('Ya probaste mucho');
  });

  it('la administradora no tiene tope', async () => {
    datos.profiles = { role: 'admin' };
    datos.ai_calls = lecturas(10);
    expect(await topePersonaExcedido('u1', 'tarot')).toBeNull();
  });
});
