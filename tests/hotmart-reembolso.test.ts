import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { reembolsarEnHotmart } from '@/lib/hotmart-api';

const json = (cuerpo: unknown, status = 200) => new Response(JSON.stringify(cuerpo), { status });

beforeEach(() => {
  process.env.HOTMART_CLIENT_ID = 'id';
  process.env.HOTMART_CLIENT_SECRET = 'secreto';
});
afterEach(() => {
  vi.restoreAllMocks();
  delete process.env.HOTMART_CLIENT_ID;
  delete process.env.HOTMART_CLIENT_SECRET;
});

describe('reembolso por la API de Hotmart', () => {
  it('sin credenciales no llama a nadie', async () => {
    delete process.env.HOTMART_CLIENT_SECRET;
    const f = vi.spyOn(globalThis, 'fetch');
    expect(await reembolsarEnHotmart('HP123')).toEqual({ ok: false, motivo: 'sin_credenciales' });
    expect(f).not.toHaveBeenCalled();
  });

  it('usa PUT sobre /sales/{código}/refund y da por bueno un 200', async () => {
    const llamadas: Array<{ url: string; metodo?: string }> = [];
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (entrada, init) => {
      const url = String(entrada);
      llamadas.push({ url, metodo: init?.method });
      return url.includes('/oauth/token') ? json({ access_token: 'tok', expires_in: 3600 }) : json({});
    });
    expect(await reembolsarEnHotmart('HP2229933160')).toEqual({ ok: true });
    const reembolso = llamadas.find((l) => l.url.includes('/refund'));
    expect(reembolso?.metodo).toBe('PUT');
    expect(reembolso?.url).toContain('/payments/api/v1/sales/HP2229933160/refund');
  });

  it('si Hotmart lo rechaza (4xx) lo dice con su mensaje y no finge éxito', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (entrada) =>
      String(entrada).includes('/oauth/token') ? json({ access_token: 'tok', expires_in: 3600 }) : json({ error: 'fuera de plazo' }, 400),
    );
    const r = await reembolsarEnHotmart('HP1');
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.motivo).toBe('rechazado');
      expect(r.estadoHttp).toBe(400);
      expect(r.detalle).toContain('fuera de plazo');
    }
  });

  it('si Hotmart falla (5xx) se distingue de un rechazo', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (entrada) =>
      String(entrada).includes('/oauth/token') ? json({ access_token: 'tok', expires_in: 3600 }) : json({}, 503),
    );
    const r = await reembolsarEnHotmart('HP1');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.motivo).toBe('error_hotmart');
  });
});
