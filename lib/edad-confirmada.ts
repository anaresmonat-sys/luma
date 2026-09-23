// Confirmación real de mayoría de edad (auditoría de seguridad, 2026-09-23):
// antes solo existía una frase fija en las páginas legales ("Solo para
// mayores de 18 años"), sin ningún control real — la columna
// `profiles.edad_confirmada` nunca se llenaba. Persistencia local-first, igual
// que el resto de la app (docs/sistema regla del stack); se sincroniza a
// Supabase cuando hay sesión real (ver app/app/mapa-poder/page.tsx para el
// mismo patrón de guardado con/sin sesión).

const CLAVE = 'luma_edad_confirmada';

export function edadConfirmada(): boolean {
  try {
    return window.localStorage.getItem(CLAVE) === '1';
  } catch {
    return false;
  }
}

export function confirmarEdad(): void {
  try {
    window.localStorage.setItem(CLAVE, '1');
  } catch {
    // localStorage puede fallar (modo privado, cuota) — no bloquea el flujo.
  }
}
