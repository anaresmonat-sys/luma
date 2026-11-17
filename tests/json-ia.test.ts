import { describe, expect, it } from 'vitest';
import { extraerJSON } from '@/lib/json-ia';

type R = { vemos?: string; riesgo?: string; pregunta?: string; no_conversacion?: string };
const valido = (o: R) => Boolean(o.no_conversacion || (o.vemos && o.riesgo && o.pregunta));

describe('extraerJSON', () => {
  it('un JSON limpio se lee tal cual', () => {
    expect(extraerJSON<R>('{"vemos":"a","riesgo":"b","pregunta":"c"}', valido)?.vemos).toBe('a');
  });

  it('con texto antes y después saca el objeto', () => {
    expect(extraerJSON<R>('Aquí va:\n{"no_conversacion":"hola"}\nGracias', valido)?.no_conversacion).toBe('hola');
  });

  it('si el modelo se corrige y escribe dos JSON, toma el último válido (caso real 2026-11-17)', () => {
    const texto = '{"vemos":"x","riesgo":"","pregunta":""}\n\nEspera, corrijo:\n\n{"no_conversacion":"Qué valiente."}';
    expect(extraerJSON<R>(texto, valido)?.no_conversacion).toBe('Qué valiente.');
  });

  it('las llaves dentro de un texto no rompen la cuenta', () => {
    const r = extraerJSON<R>('Nota {no es json} y luego {"vemos":"usa {llaves} en el texto","riesgo":"r","pregunta":"p"}', valido);
    expect(r?.vemos).toBe('usa {llaves} en el texto');
  });

  it('sin ningún JSON válido devuelve null', () => {
    expect(extraerJSON<R>('no hay nada', valido)).toBeNull();
    expect(extraerJSON<R>('{"vemos":"a"}', valido)).toBeNull();
  });
});
