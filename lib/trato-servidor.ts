// Lee, en el SERVIDOR, el trato que la persona eligió: primero el de su cuenta (user_metadata.trato) y, si no hay sesión o
// no eligió allí, la cookie `luma_trato` del navegador. Sin elección o ante cualquier fallo devuelve null: la IA usa entonces la regla neutra y la respuesta nunca se bloquea por esto.

import { cookies } from 'next/headers';
import { crearClienteServidor } from '@/lib/supabase/server';
import { COOKIE_TRATO, esTrato, type Trato } from '@/lib/trato';

export async function leerTrato(): Promise<Trato | null> {
  try {
    const supabase = await crearClienteServidor();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const valor = (user?.user_metadata as { trato?: unknown } | undefined)?.trato;
    if (esTrato(valor)) return valor;
    return await leerCookie();
  } catch {
    // la cuenta no respondió: se usa lo que el navegador ya dijo, si algo.
    return await leerCookie();
  }
}

async function leerCookie(): Promise<Trato | null> {
  try {
    const local = (await cookies()).get(COOKIE_TRATO)?.value;
    return esTrato(local) ? local : null;
  } catch {
    return null;
  }
}
