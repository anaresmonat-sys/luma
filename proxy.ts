// Refresca la sesión de Supabase en cada request (patrón SSR estándar de
// @supabase/ssr para Next.js App Router) — sin esto, la sesión guardada en
// las cookies puede expirar sin que el servidor se entere.

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options);
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Quien ya tiene la sesión abierta no debe volver a ver la pantalla de "escribe tu correo":
  // /entrar la manda directo a su espacio (o a los planes si venía de ahí). Cuando la sesión no
  // existe o caducó, /entrar se muestra con normalidad.
  if (user && request.nextUrl.pathname === '/entrar') {
    const destino = request.nextUrl.searchParams.get('desde') === 'paywall' ? '/paywall' : '/app';
    const redireccion = NextResponse.redirect(new URL(destino, request.url));
    for (const cookie of response.cookies.getAll()) redireccion.cookies.set(cookie);
    return redireccion;
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
