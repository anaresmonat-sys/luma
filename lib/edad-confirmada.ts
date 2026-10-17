// Confirmación real de mayoría de edad (auditoría de seguridad, 2026-09-23):
// antes solo existía una frase fija en las páginas legales ("Solo para
// mayores de 18 años"), sin ningún control real — la columna
// `profiles.edad_confirmada` nunca se llenaba. Persistencia local-first, igual
// que el resto de la app (docs/sistema regla del stack); se sincroniza a
// Supabase cuando hay sesión real (ver app/app/mapa-poder/page.tsx para el
// mismo patrón de guardado con/sin sesión).

import { crearClienteNavegador } from '@/lib/supabase/client';

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

/** ¿Hay una sesión abierta en este navegador? */
export async function haySesion(): Promise<boolean> {
  try {
    const {
      data: { user },
    } = await crearClienteNavegador().auth.getUser();
    return Boolean(user);
  } catch {
    return false;
  }
}

/** Con sesión: ¿esta cuenta ya confirmó su edad en otro navegador o dispositivo? */
export async function edadConfirmadaEnCuenta(): Promise<boolean> {
  try {
    const supabase = crearClienteNavegador();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;
    const { data } = await supabase.from('profiles').select('edad_confirmada').eq('id', user.id).maybeSingle();
    return data?.edad_confirmada === true;
  } catch {
    return false;
  }
}

/** Con sesión: deja la confirmación guardada en la cuenta para no volver a pedirla en otros dispositivos. */
export async function guardarEdadEnCuenta(): Promise<void> {
  try {
    const supabase = crearClienteNavegador();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('profiles').update({ edad_confirmada: true }).eq('id', user.id);
  } catch {
    // sin conexión: queda guardada en este navegador y se reintentará la próxima vez.
  }
}
