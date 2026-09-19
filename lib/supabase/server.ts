// Cliente de Supabase para el SERVIDOR (Route Handlers, Server Components).
// Lee/escribe la sesión desde las cookies — así el servidor sabe quién es
// auth.uid() para que la RLS funcione. Nunca usar la clave publicable aquí
// para escrituras que dependan de identidad: este cliente ya trae la sesión
// real del usuario vía cookies.

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function crearClienteServidor() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // setAll llamado desde un Server Component sin permiso de escritura
            // de cookies — se ignora porque el middleware refresca la sesión.
          }
        },
      },
    }
  );
}
