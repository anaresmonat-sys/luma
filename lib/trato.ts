// «Cómo prefieres que te hable LUMA»: la persona elige ella, él o sin género (2026-10-23, tras la prueba de Pedro,
// a quien la IA trataba en femenino). Se guarda en la cuenta (user_metadata.trato), junto al nombre/apodo.
// Nunca se deduce por el nombre. Sin elección = sin género (la IA usa fórmulas neutras).

export type Trato = 'ella' | 'el' | 'neutro';

export const TRATOS: ReadonlyArray<{ id: Trato; etiqueta: string }> = [
  { id: 'ella', etiqueta: 'Ella' },
  { id: 'el', etiqueta: 'Él' },
  { id: 'neutro', etiqueta: 'Sin género' },
];

export function esTrato(valor: unknown): valor is Trato {
  return valor === 'ella' || valor === 'el' || valor === 'neutro';
}

/** Frase que se añade al final del prompt de la IA. Sin elección (o «sin género») no añade nada: manda la regla neutra. */
export function instruccionDeTrato(trato: Trato | null | undefined): string {
  if (trato === 'ella') {
    return '\n\nTRATO ELEGIDO POR LA PERSONA (sustituye a la regla de GÉNERO anterior): háblale en FEMENINO. Usa adjetivos y participios en femenino para referirte a ella («segura», «tranquila», «cansada»).';
  }
  if (trato === 'el') {
    return '\n\nTRATO ELEGIDO POR LA PERSONA (sustituye a la regla de GÉNERO anterior): háblale en MASCULINO. Usa adjetivos y participios en masculino para referirte a él («seguro», «tranquilo», «cansado»).';
  }
  return '';
}
