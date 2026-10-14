// Recibe el enlace de acceso del correo, lo cambia por una sesión real (cookies) y
// redirige adentro. Soporta DOS formas de enlace:
//   · ?token_hash=…&type=email  → verifyOtp: funciona en CUALQUIER navegador o app de
//     correo (no depende de nada guardado en el navegador que pidió el enlace). Es el
//     que usa la plantilla de correo actual de Supabase.
//   · ?code=…                   → intercambio PKCE (enlaces antiguos): solo funciona si
//     el enlace se abre en el MISMO navegador donde se pidió.
// Si algo falla, vuelve a Entrar con un aviso genérico — nunca expone el motivo exacto.

import { NextResponse } from 'next/server';
import type { EmailOtpType } from '@supabase/supabase-js';
import { crearClienteServidor } from '@/lib/supabase/server';

const TIPOS_VALIDOS: readonly EmailOtpType[] = ['email', 'magiclink', 'signup', 'recovery', 'invite', 'email_change'];

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const tipo = searchParams.get('type');
  // Solo rutas internas: `${origin}${next}` con next="@sitio-malo.com" produciría
  // "https://luma.app@sitio-malo.com" y mandaría a quien inicia sesión a otro
  // sitio (open redirect, hallazgo de la revisión de seguridad 2026-09-23).
  const nextCrudo = searchParams.get('next') ?? '/app';
  const next = /^\/(?![/\\])/.test(nextCrudo) ? nextCrudo : '/app';

  if (tokenHash && tipo && (TIPOS_VALIDOS as readonly string[]).includes(tipo)) {
    const supabase = await crearClienteServidor();
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: tipo as EmailOtpType });
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  } else if (code) {
    const supabase = await crearClienteServidor();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/entrar?error=enlace`);
}
