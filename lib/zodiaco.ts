// Los 12 signos zodiacales — símbolos Unicode estándar (sin necesidad de arte
// propio: mismo criterio ya acordado con el usuario para el mazo de tarot).
// El selector de variación ︎ fuerza presentación de TEXTO (monocromo,
// hereda el color dorado del acento) en vez de EMOJI a color — sin él, Windows
// los pintaba de morado y no de dorado (defecto real visto al probar).

export interface SignoZodiacal {
  id: string;
  nombre: string;
  simbolo: string;
  elemento: 'fuego' | 'tierra' | 'aire' | 'agua';
}

export const SIGNOS_ZODIACO: SignoZodiacal[] = [
  { id: 'aries', nombre: 'Aries', simbolo: '♈︎', elemento: 'fuego' },
  { id: 'tauro', nombre: 'Tauro', simbolo: '♉︎', elemento: 'tierra' },
  { id: 'geminis', nombre: 'Géminis', simbolo: '♊︎', elemento: 'aire' },
  { id: 'cancer', nombre: 'Cáncer', simbolo: '♋︎', elemento: 'agua' },
  { id: 'leo', nombre: 'Leo', simbolo: '♌︎', elemento: 'fuego' },
  { id: 'virgo', nombre: 'Virgo', simbolo: '♍︎', elemento: 'tierra' },
  { id: 'libra', nombre: 'Libra', simbolo: '♎︎', elemento: 'aire' },
  { id: 'escorpio', nombre: 'Escorpio', simbolo: '♏︎', elemento: 'agua' },
  { id: 'sagitario', nombre: 'Sagitario', simbolo: '♐︎', elemento: 'fuego' },
  { id: 'capricornio', nombre: 'Capricornio', simbolo: '♑︎', elemento: 'tierra' },
  { id: 'acuario', nombre: 'Acuario', simbolo: '♒︎', elemento: 'aire' },
  { id: 'piscis', nombre: 'Piscis', simbolo: '♓︎', elemento: 'agua' },
];

/** Signo zodiacal a partir de una fecha "AAAA-MM-DD" — evita pedirle el signo
 * a la usuaria si ya tenemos su fecha de nacimiento (Mapa de Poder). */
export function signoDeFecha(fechaISO: string): SignoZodiacal {
  const [, mesStr, diaStr] = fechaISO.split('-');
  const mes = Number(mesStr);
  const dia = Number(diaStr);
  const idPorRango: [number, number, number, number, string][] = [
    [3, 21, 4, 19, 'aries'],
    [4, 20, 5, 20, 'tauro'],
    [5, 21, 6, 20, 'geminis'],
    [6, 21, 7, 22, 'cancer'],
    [7, 23, 8, 22, 'leo'],
    [8, 23, 9, 22, 'virgo'],
    [9, 23, 10, 22, 'libra'],
    [10, 23, 11, 21, 'escorpio'],
    [11, 22, 12, 21, 'sagitario'],
    [1, 20, 2, 18, 'acuario'],
    [2, 19, 3, 20, 'piscis'],
  ];
  for (const [m1, d1, m2, d2, id] of idPorRango) {
    const dentro = (mes === m1 && dia >= d1) || (mes === m2 && dia <= d2);
    if (dentro) return SIGNOS_ZODIACO.find((s) => s.id === id)!;
  }
  // Capricornio cruza el año (22 dic - 19 ene) — caso aparte.
  return SIGNOS_ZODIACO.find((s) => s.id === 'capricornio')!;
}
