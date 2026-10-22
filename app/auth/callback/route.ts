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
    // El enlace del correo NO se consume al abrirlo: los antivirus y los programas de correo abren los enlaces
    // por su cuenta (y el enlace sirve una sola vez), así que la persona llegaba a un enlace ya gastado.
    // Se muestra un botón y el acceso se completa con un POST (los escáneres no pulsan botones).
    return paginaDeConfirmacion(tokenHash, tipo, next);
  } else if (code) {
    const supabase = await crearClienteServidor();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // El enlace ya no sirve (se usó antes, o se pidió uno más nuevo). Si la persona YA tiene la sesión
  // abierta —caso típico: volvió a abrir el correo de la compra— se la lleva adentro en vez de
  // mostrarle un error por algo que ya está resuelto.
  try {
    const supabase = await crearClienteServidor();
    const { data } = await supabase.auth.getUser();
    if (data.user) return NextResponse.redirect(`${origin}${next}`);
  } catch {
    // sin sesión o sin conexión con el servicio: se cae al aviso normal de abajo.
  }

  return NextResponse.redirect(`${origin}/entrar?error=enlace`);
}

const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function paginaDeConfirmacion(tokenHash: string, tipo: string, next: string) {
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Entrar a LUMA</title>
<style>body{margin:0;min-height:100dvh;display:flex;align-items:center;justify-content:center;background:#1a0f14;color:#f3e7dc;font-family:system-ui,sans-serif;padding:24px;box-sizing:border-box}main{max-width:360px;width:100%;text-align:center}h1{font-size:26px;margin:0 0 12px}p{font-size:16px;line-height:1.5;color:#cdbcb0;margin:0 0 24px}button{width:100%;height:52px;border:0;border-radius:16px;background:#d9a441;color:#2a1608;font-size:16px;font-weight:700}</style></head>
<body><main><h1>Ya casi estás dentro</h1><p>Toca el botón para entrar a LUMA.</p>
<form method="post" action="/auth/callback"><input type="hidden" name="token_hash" value="${esc(tokenHash)}"><input type="hidden" name="type" value="${esc(tipo)}"><input type="hidden" name="next" value="${esc(next)}"><button type="submit">Entrar a LUMA</button></form></main></body></html>`;
  return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}

// Segundo paso: la persona toca el botón y aquí se gasta el enlace de verdad.
export async function POST(request: Request) {
  const { origin } = new URL(request.url);
  const form = await request.formData();
  const tokenHash = String(form.get('token_hash') ?? '');
  const tipo = String(form.get('type') ?? '');
  const nextCrudo = String(form.get('next') ?? '/app');
  const next = /^\/(?![/\\])/.test(nextCrudo) ? nextCrudo : '/app';

  if (tokenHash && (TIPOS_VALIDOS as readonly string[]).includes(tipo)) {
    const supabase = await crearClienteServidor();
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: tipo as EmailOtpType });
    if (!error) return NextResponse.redirect(`${origin}${next}`, 303);
  }
  return NextResponse.redirect(`${origin}/entrar?error=enlace`, 303);
}
