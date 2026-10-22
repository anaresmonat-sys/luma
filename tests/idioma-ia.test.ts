// La IA hablaba en argentino (voseo) cuando la persona escribía así. Toda llamada a la IA debe llevar la regla de idioma
// y el texto fijo de la app no debe contener voseo.
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { REGLA_DE_IDIOMA, REGLA_DE_IDIOMA_DESCIFRAR } from '@/lib/anthropic';

const RAIZ = path.resolve(__dirname, '..');
const RUTAS_CON_IA = ['coach', 'compatibilidad', 'descifrar', 'diario', 'numerologia', 'tarot'];

describe('idioma de la IA: español latino neutro, tuteo', () => {
  for (const ruta of RUTAS_CON_IA) {
    it(`/api/${ruta} añade la regla de idioma al prompt de sistema`, () => {
      const codigo = fs.readFileSync(path.join(RAIZ, 'app', 'api', ruta, 'route.ts'), 'utf8');
      expect(codigo).toMatch(/system:[^\n]*REGLA_DE_IDIOMA/);
    });
  }

  it('la regla prohíbe el voseo y pide tuteo', () => {
    for (const regla of [REGLA_DE_IDIOMA, REGLA_DE_IDIOMA_DESCIFRAR]) {
      expect(regla).toContain('JAMÁS uses voseo');
      expect(regla).toContain('TÚ');
    }
  });

  it('el texto fijo de la app no usa voseo', () => {
    const voseo = /\b(tenés|podés|querés|sabés|mirá|contame|decime|pensá|andá|vení|sentís|necesitás)\b/i;
    const archivos = ['app', 'components'].flatMap((c) => listar(path.join(RAIZ, c)));
    const malos = archivos.filter((f) => voseo.test(fs.readFileSync(f, 'utf8')) && !f.endsWith('.test.ts'));
    expect(malos.map((f) => path.relative(RAIZ, f))).toEqual([]);
  });
});

function listar(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? (e.name === 'node_modules' ? [] : listar(p)) : /\.(tsx?)$/.test(e.name) ? [p] : [];
  });
}
