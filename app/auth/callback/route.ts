// Recibe el enlace del magic link, cambia el código de un solo uso por una
// sesión real (cookies), y redirige adentro. Si algo falla, vuelve a Entrar
// con un aviso genérico — nunca expone el motivo exacto.

import { NextResponse } from 'next/server';
import { crearClienteServidor } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/app';

  if (code) {
    const supabase = await crearClienteServidor();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/entrar?error=enlace`);
}
