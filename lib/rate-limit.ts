// Límite de velocidad SOLO servidor — ventana deslizante en memoria por IP +
// ruta. Auditoría de seguridad, 2026-09-23: ninguna ruta de IA tenía freno
// más allá de la prueba gratis del navegador (se salta borrando localStorage)
// y el tope de gasto en la consola de Anthropic.
//
// LÍMITE HONESTO: en Vercel serverless cada instancia tiene su propia memoria,
// así que esto NO es un límite global perfecto (varias instancias en paralelo
// podrían sumar más peticiones de las que dice el número). Para una app con
// tráfico real conviene un límite distribuido (Upstash Redis + @upstash/
// ratelimit) — eso requiere crear una cuenta nueva y no se agregó aquí sin
// preguntar. Mientras la app no reciba tráfico real, esto SÍ frena abusos
// obvios (un script pegado enviando cientos de peticiones seguidas) — ver
// docs/sistema/09-SEGURIDAD.md.

const ventanas = new Map<string, number[]>();

export function limiteExcedido(clave: string, maxPeticiones: number, ventanaMs: number): boolean {
  const ahora = Date.now();
  const marcas = (ventanas.get(clave) ?? []).filter((t) => ahora - t < ventanaMs);
  if (marcas.length >= maxPeticiones) {
    ventanas.set(clave, marcas);
    return true;
  }
  marcas.push(ahora);
  ventanas.set(clave, marcas);
  // Poda ocasional para no acumular memoria indefinidamente.
  if (ventanas.size > 5000) {
    for (const [k, v] of ventanas) {
      if (v.every((t) => ahora - t > ventanaMs)) ventanas.delete(k);
    }
  }
  return false;
}

export function identificadorDePeticion(request: Request): string {
  const xff = request.headers.get('x-forwarded-for');
  return xff?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'desconocido';
}
