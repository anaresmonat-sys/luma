// Freno de gasto de IA en el SERVIDOR (auditoría de seguridad 2026-09-23,
// hallazgo crítico 2: las rutas de IA no tenían ningún tope real — el límite
// por minuto vive en memoria y se reinicia solo). El gasto del día se suma de
// la tabla ai_calls. Si algo falla al consultar (p. ej. falta la clave de
// servicio en el entorno), NO se bloquea a nadie: es mejor perder el freno un
// rato que tumbar la app entera.

import { clienteAdminSupabase } from '@/lib/supabase/admin';
import { crearClienteServidor } from '@/lib/supabase/server';

const TOPE_POR_DEFECTO_USD = 5;

export async function topeDiarioIAExcedido(): Promise<boolean> {
  try {
    const configurado = Number(process.env.AI_DAILY_BUDGET_USD);
    const tope = configurado > 0 ? configurado : TOPE_POR_DEFECTO_USD;
    const inicioDelDia = new Date();
    inicioDelDia.setUTCHours(0, 0, 0, 0);
    const { data, error } = await clienteAdminSupabase()
      .from('ai_calls')
      .select('cost_usd')
      .gte('created_at', inicioDelDia.toISOString());
    if (error || !data) return false;
    const gastado = data.reduce((suma, fila) => suma + Number(fila.cost_usd ?? 0), 0);
    return gastado >= tope;
  } catch {
    return false;
  }
}

/** Id de la persona si hay sesión; null si usa la app sin cuenta (sigue permitido). */
export async function idUsuarioOpcional(): Promise<string | null> {
  try {
    const supabase = await crearClienteServidor();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id ?? null;
  } catch {
    return null;
  }
}
