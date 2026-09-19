// Cliente de Supabase para el NAVEGADOR ('use client'). Usa la clave pública
// (publishable/anon) — segura porque cada tabla tiene RLS activo (ver la
// migración `core_schema_v1` y docs/sistema/25-BASE-DE-DATOS.md).

import { createBrowserClient } from '@supabase/ssr';

export function crearClienteNavegador() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
