import { describe, expect, it } from 'vitest';
import { checkoutHotmart, OFERTAS_HOTMART } from '../lib/hotmart-links';
import { planDeHotmart } from '../lib/plan-hotmart';

describe('plan comprado en Hotmart', () => {
  it('reconoce cada plan por el código de su oferta, aunque el nombre no ayude', () => {
    expect(planDeHotmart(OFERTAS_HOTMART.anual, 'LUMA')).toBe('anual');
    expect(planDeHotmart(OFERTAS_HOTMART.mensual, 'LUMA')).toBe('mensual');
  });

  it('usa el nombre del plan como respaldo', () => {
    expect(planDeHotmart(undefined, 'Plan Anual')).toBe('anual');
    expect(planDeHotmart('otra', 'Monthly')).toBe('mensual');
  });

  it('no inventa un plan si el aviso no lo dice', () => {
    expect(planDeHotmart(undefined, undefined)).toBeNull();
    expect(planDeHotmart('otra', 'LUMA')).toBeNull();
  });

  it('el enlace de pago usa el mismo código de oferta', () => {
    expect(new URL(checkoutHotmart('anual')).searchParams.get('off')).toBe(OFERTAS_HOTMART.anual);
    expect(new URL(checkoutHotmart('mensual')).searchParams.get('off')).toBe(OFERTAS_HOTMART.mensual);
  });
});
