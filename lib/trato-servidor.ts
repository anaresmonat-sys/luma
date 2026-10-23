// Lee, en el SERVIDOR, el trato que la persona eligió (user_metadata.trato de su sesión). Sin sesión, sin elección o ante
// cualquier fallo devuelve null: la IA usa entonces la regla neutra y la respuesta nunca se bloquea por esto.

import { crearClienteServidor } from '@/lib/supabase/server';
import { esTrato, type Trato } from '@/lib/trato';

export async function leerTrato(): Promise<Trato | null> {
  try {
    const supabase = await crearClienteServidor();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const valor = (user?.user_metadata as { trato?: unknown } | undefined)?.trato;
    return esTrato(valor) ? valor : null;
  } catch {
    return null;
  }
}
