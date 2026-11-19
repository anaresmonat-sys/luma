import { describe, it, expect } from 'vitest';
import { normalizarCodigo } from '@/lib/fuente-visita';

describe('código de origen del enlace (?f=)', () => {
  it('acepta etiquetas cortas y las pasa a minúsculas', () => {
    expect(normalizarCodigo('TikTok')).toBe('tiktok');
    expect(normalizarCodigo('insta_reel-3')).toBe('insta_reel-3');
  });
  it('rechaza lo que no es una etiqueta corta limpia', () => {
    expect(normalizarCodigo('')).toBeNull();
    expect(normalizarCodigo(null)).toBeNull();
    expect(normalizarCodigo('<script>')).toBeNull();
    expect(normalizarCodigo('con espacios')).toBeNull();
    expect(normalizarCodigo('a'.repeat(21))).toBeNull();
    expect(normalizarCodigo('correo@ejemplo.com')).toBeNull();
  });
});
