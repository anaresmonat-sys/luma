import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cancelarEnHotmart } from '@/lib/hotmart-api';

const json = (cuerpo: unknown, status = 200) => new Response(JSON.stringify(cuerpo), { status });

beforeEach(() => {
  process.env.HOTMART_CLIENT_ID = 'id';
  process.env.HOTMART_CLIENT_SECRET = 'secreto';
  process.env.HOTMART_BASIC = 'basic';
});
afterEach(() => {
  vi.restoreAllMocks();
  delete process.env.HOTMART_CLIENT_ID;
  delete process.env.HOTMART_CLIENT_SECRET;
  delete process.env.HOTMART_CLIENT_SECRET;
});

describe('cancelación automática en Hotmart', () => {
  it('sin credenciales no llama a nadie y avisa para cancelar a mano', async () => {
    delete process.env.HOTMART_CLIENT_SECRET;
    const f = vi.spyOn(globalThis, 'fetch');
    expect(await cancelarEnHotmart('a@b.com')).toEqual({ ok: false, motivo: 'sin_credenciales' });
    expect(f).not.toHaveBeenCalled();
  });

  it('con código conocido pide token y cancela esa suscripción', async () => {
    const f = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(json({ access_token: 'tok', expires_in: 3600 }))
      .mockResolvedValueOnce(json({ status: 'INACTIVE' }));
    const r = await cancelarEnHotmart('a@b.com', 'COD123');
    expect(r).toEqual({ ok: true, subscriberCode: 'COD123' });
    const url = String(f.mock.calls[1][0]);
    expect(url).toContain('/subscriptions/COD123/cancel');
    expect(f.mock.calls[1][1]?.method).toBe('POST');
  });

  it('sin código lo busca por correo y salta las suscripciones ya cerradas', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (entrada, init) => {
      const url = String(entrada);
      if (url.includes('/oauth/token')) return json({ access_token: 'tok2', expires_in: 3600 });
      if (init?.method === 'POST') return json({ status: 'INACTIVE' });
      return json({
        items: [
          { subscriber_code: 'VIEJA', status: 'CANCELLED_BY_CUSTOMER', subscriber: { email: 'a@b.com' } },
          { subscriber_code: 'AJENA', status: 'ACTIVE', subscriber: { email: 'otra@b.com' } },
          { subscriber_code: 'VIGENTE', status: 'ACTIVE', subscriber: { email: 'A@B.com' } },
        ],
      });
    });
    expect(await cancelarEnHotmart('a@b.com')).toEqual({ ok: true, subscriberCode: 'VIGENTE' });
  });

  it('si Hotmart falla, no inventa éxito', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('red caída'));
    expect(await cancelarEnHotmart('a@b.com', 'X')).toEqual({ ok: false, motivo: 'error_hotmart' });
  });
});
