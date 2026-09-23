// Cliente de Supabase con la CLAVE DE SERVICIO — se salta la RLS por completo.
// SOLO se importa desde código de servidor (rutas app/api/**, Server Components
// de app/admin/**), NUNCA desde un componente 'use client' (patrón BFF, igual
// que lib/anthropic.ts — ver docs/sistema/09-SEGURIDAD.md). Se usa solo para lo
// que la RLS no puede resolver: la API de administración de usuarios
// (invitar/crear cuentas) y escribir en event_log/error_log/ai_calls, que a
// propósito NO tienen política de INSERT para el cliente (la mayoría del uso de
// LUMA es anónimo, sin sesión, así que una política atada a auth.uid() no
// serviría — ver docs/sistema/21-BACKOFFICE.md, "alternativa más robusta").

import { createClient } from '@supabase/supabase-js';

// Sin generador de tipos de la base de datos en este proyecto (ver
// docs/sistema/25-BASE-DE-DATOS.md): se tipa como `any` a propósito, igual que
// el resto de los clientes de Supabase del proyecto — cada tabla ya está
// protegida por su propia RLS, el tipado de filas no es la capa de seguridad.
let cliente: ReturnType<typeof createClient<any, any, any>> | null = null;

export function clienteAdminSupabase() {
  if (typeof window !== 'undefined') {
    // Nunca debería llamarse desde el navegador — la clave de servicio no debe
    // salir del servidor. Si esto se dispara, es un error de importación.
    throw new Error('clienteAdminSupabase() no se puede usar en el navegador');
  }
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    throw new Error('SUPABASE_URL o SUPABASE_SECRET_KEY no configuradas');
  }
  if (!cliente) {
    cliente = createClient<any, any, any>(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return cliente;
}
