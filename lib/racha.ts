// Cálculo de racha de constancia + termómetro de ánimo (30 días atrás vs esta
// semana), a partir del historial real de check-ins del usuario en Supabase.
// Funciones puras — se computan en el navegador porque no hay ninguna
// recompensa de dinero atada a esto (a diferencia de 24-GAMIFICACION.md, que
// exige cálculo server-side cuando SÍ hay premio en juego).

export interface Checkin {
  animo: string;
  created_at: string;
}

const ANIMOS_NEGATIVOS = new Set(['ansiosa', 'triste']);

function comoFechaLocal(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/** Días consecutivos (hasta hoy o ayer) con al menos un check-in. */
export function calcularRacha(checkins: Checkin[], ahora: Date = new Date()): number {
  const dias = new Set(checkins.map((c) => comoFechaLocal(c.created_at)));
  let racha = 0;
  const cursor = new Date(ahora);
  // Si hoy todavía no registró, la racha puede seguir viva por lo de ayer —
  // arranca el conteo en hoy y, si falta, seguimos probando desde ayer.
  if (!dias.has(comoFechaLocal(cursor.toISOString()))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (dias.has(comoFechaLocal(cursor.toISOString()))) {
    racha += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return racha;
}

export interface BucketTermometro {
  negativos: number;
  total: number;
}

export interface Termometro {
  haceUnMes: BucketTermometro | null;
  estaSemana: BucketTermometro | null;
}

function contarBucket(checkins: Checkin[], ahora: Date, diasDesde: number, diasHasta: number): BucketTermometro | null {
  const dias = new Map<string, string[]>();
  for (const c of checkins) {
    const fecha = new Date(c.created_at);
    const diff = Math.floor((ahora.getTime() - fecha.getTime()) / 86_400_000);
    if (diff >= diasDesde && diff < diasHasta) {
      const clave = comoFechaLocal(c.created_at);
      const lista = dias.get(clave) ?? [];
      lista.push(c.animo);
      dias.set(clave, lista);
    }
  }
  if (dias.size === 0) return null;
  let negativos = 0;
  for (const animosDelDia of dias.values()) {
    if (animosDelDia.some((a) => ANIMOS_NEGATIVOS.has(a))) negativos += 1;
  }
  return { negativos, total: dias.size };
}

/** Compara la ventana de "hace ~30 días" (23-37 días atrás) contra "esta semana" (últimos 7). */
export function calcularTermometro(checkins: Checkin[], ahora: Date = new Date()): Termometro {
  return {
    haceUnMes: contarBucket(checkins, ahora, 23, 38),
    estaSemana: contarBucket(checkins, ahora, 0, 7),
  };
}
