// Autenticidad del webhook de Hotmart (docs/sistema/18-VENTA-HOTMART.md → "SEGURIDAD DEL WEBHOOK
// DE HOTMART"). El hottok es un secreto compartido que viaja en cada petición: comparación en
// TIEMPO CONSTANTE, siempre — un `!==` normal filtra por temporización cuántos bytes acertó un
// atacante. Fail-secure: sin HOTMART_HOTTOK la app revienta al arrancar, nunca corre con un
// default de juguete (27-REVISION-SEGURIDAD.md).

import crypto from 'node:crypto';

function timingSafeEqualStr(a: string, b: string): boolean {
  const ba = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

// Fail-secure sin romper el build: leer la variable AQUÍ (en cada llamada, dentro del handler),
// no a nivel de módulo — un `throw` al importar el archivo tumba `next build` de TODA la app,
// no solo de esta ruta (comprobado: rompe "Collecting page data" del proyecto entero). Leída así,
// solo esta ruta falla (con 500, nunca abriéndose) mientras falte configurar HOTMART_HOTTOK.
export function verifyHotmart(opts: { hottok?: string }): boolean {
  const HOTTOK = process.env.HOTMART_HOTTOK;
  if (!HOTTOK) throw new Error('FALTA HOTMART_HOTTOK — el webhook no puede operar de forma segura');
  if (!opts.hottok) return false;
  return timingSafeEqualStr(opts.hottok, HOTTOK);
}
