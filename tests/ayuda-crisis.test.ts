import { describe, expect, it } from 'vitest';
import { completarAyuda, LINEAS_DE_AYUDA } from '@/lib/ayuda-crisis';

describe('completarAyuda (aviso de crisis de Descifrar)', () => {
  it('si no es crisis no toca el mensaje', () => {
    expect(completarAyuda('Hola', false)).toBe('Hola');
  });

  it('si es crisis y la IA se olvidó de las líneas, las añade (caso real de un único mensaje de maltrato)', () => {
    const r = completarAyuda('Lo que describes es grave, no te quedes sola con esto.', true);
    expect(r).toContain('800 911 2000');
    expect(r).toContain('016');
    expect(r).toContain('024');
    expect(r.endsWith(LINEAS_DE_AYUDA)).toBe(true);
  });

  it('si la IA ya puso las líneas no las repite', () => {
    const ya = 'Habla hoy con alguien: México 800 911 2000, Colombia 106, Chile *4141, España 024.';
    expect(completarAyuda(ya, true)).toBe(ya);
  });
});
