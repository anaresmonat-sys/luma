// Vigilante de PROMESAS (docs/release/CLAIMS-LEDGER.md): frases que NO se pueden publicar porque la capacidad
// no existe o no es cierta. Si alguna vuelve a aparecer en el código, esta prueba falla.
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const RAIZ = path.resolve(__dirname, '..');
const CARPETAS = ['app', 'components', 'lib'];

// Solo cuenta el texto que ve la persona: los comentarios del código pueden explicar justo por qué NO se promete algo.
function sinComentarios(codigo: string): string {
  return codigo.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
}

function archivos(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === 'node_modules' ? [] : archivos(p);
    return /\.(tsx?|md)$/.test(e.name) && !p.includes('EJEMPLO-page') ? [p] : [];
  });
}

const PROHIBIDAS: { texto: RegExp; motivo: string }[] = [
  { texto: /te avisamos (antes|del cobro|el d[ií]a)/i, motivo: 'No existe aviso previo al cobro (no hay tarea programada ni correo). No prometerlo.' },
  { texto: /aviso antes de cualquier cobro/i, motivo: 'Mismo motivo: aviso previo al cobro inexistente.' },
  { texto: /desde (tu|el) primer cobro/i, motivo: 'La garantía de 15 días corre desde que empieza la prueba (día 0), no desde el primer cobro.' },
  { texto: /cancela(s)? (en un toque|con un clic|al instante)/i, motivo: 'La cancelación es manual (escribir a soporte), no de un toque.' },
  { texto: /ilimitad/i, motivo: 'Prohibido «ilimitado»: hay cuotas y tope de gasto de IA.' },
  { texto: /sabr[aá]s si (te|él|el) (quiere|vuelve)|te dir[eé]mos si volver[aá]/i, motivo: 'Promesa de adivinación prohibida por las plataformas de anuncios y por la ficha del avatar.' },
];

describe('promesas públicas prohibidas', () => {
  const lista = CARPETAS.flatMap((c) => archivos(path.join(RAIZ, c)));
  for (const { texto, motivo } of PROHIBIDAS) {
    it(`no aparece ${texto}`, () => {
      const encontrados = lista.filter((f) => texto.test(sinComentarios(fs.readFileSync(f, 'utf8'))) && !f.endsWith('claims.test.ts'));
      expect(encontrados.map((f) => path.relative(RAIZ, f)), motivo).toEqual([]);
    });
  }
});
