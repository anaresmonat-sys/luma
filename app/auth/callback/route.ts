// Recibe el enlace del magic link, cambia el código de un solo uso por una
// sesión real (cookies), y redirige adentro. Si algo falla, vuelve a Entrar
// con un aviso genérico — nunca expone el motivo exacto.

import { NextResponse } from 'next/server';
import { crearClienteServidor } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // Solo rutas internas: `${origin}${next}` con next="@sitio-malo.com" produciría
  // "https://luma.app@sitio-malo.com" y mandaría a quien inicia sesión a otro
  // sitio (open redirect, hallazgo de la revisión de seguridad 2026-09-23).
  const nextCrudo = searchParams.get('next') ?? '/app';
  const next = /^\/(?![/\\])/.test(nextCrudo) ? nextCrudo : '/app';

  if (code) {
    const supabase = await crearClienteServidor();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/entrar?error=enlace`);
}
