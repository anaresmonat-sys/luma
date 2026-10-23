import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { esTrato, instruccionDeTrato, TRATOS } from '@/lib/trato';

const RAIZ = path.resolve(__dirname, '..');

describe('«cómo prefieres que te hable LUMA»', () => {
  it('solo acepta ella, él o neutro', () => {
    expect(TRATOS.map((t) => t.id)).toEqual(['ella', 'el', 'neutro']);
    expect(esTrato('ella')).toBe(true);
    expect(esTrato('el')).toBe(true);
    expect(esTrato('neutro')).toBe(true);
    expect(esTrato('otro')).toBe(false);
    expect(esTrato(undefined)).toBe(false);
  });

  it('sin elección o «sin género» no añade nada al prompt: manda la regla neutra', () => {
    expect(instruccionDeTrato(null)).toBe('');
    expect(instruccionDeTrato(undefined)).toBe('');
    expect(instruccionDeTrato('neutro')).toBe('');
  });

  it('ella → femenino y él → masculino', () => {
    expect(instruccionDeTrato('ella')).toContain('FEMENINO');
    expect(instruccionDeTrato('el')).toContain('MASCULINO');
  });

  it('las seis funciones de IA leen el trato elegido', () => {
    for (const ruta of ['coach', 'compatibilidad', 'descifrar', 'diario', 'numerologia', 'tarot']) {
      const codigo = fs.readFileSync(path.join(RAIZ, 'app', 'api', ruta, 'route.ts'), 'utf8');
      expect(codigo, ruta).toContain('instruccionDeTrato(await leerTrato())');
    }
  });

  it('la bienvenida y Más ofrecen el selector', () => {
    for (const f of [['components', 'app', 'BienvenidaCompra.tsx'], ['app', 'app', '(tabs)', 'mas', 'page.tsx']]) {
      expect(fs.readFileSync(path.join(RAIZ, ...f), 'utf8'), f.join('/')).toContain('SelectorTrato');
    }
  });
});
