// Registro de eventos, errores y costo de IA — SOLO servidor. Alimenta el panel
// de administración (docs/sistema/21-BACKOFFICE.md). Nunca debe romper la
// función que lo llama: cualquier fallo al escribir el registro se traga en
// silencio (con un console.error para depurar), la respuesta al usuario sigue
// su curso igual.

import { clienteAdminSupabase } from '@/lib/supabase/admin';
import { calcularCostoUsd } from '@/lib/ai-pricing';

/** Vocabulario cerrado de eventos — evita que cualquiera mande texto libre a
 * event_log desde /api/log-event. Ampliar aquí, no aceptar tipos sueltos. */
export const TIPOS_DE_EVENTO = [
  'primera_accion', // activación: el primer resultado real que recibe (lib/prueba-gratis.ts)
  'onboarding_completado',
  'cuenta_eliminada', // auditoría legal 2026-09-23: derecho de eliminación (47-LEGAL-FISCAL-Y-PRIVACIDAD.md §3)
  // Camino de compra (60-OPERACION-DE-CONVERSION.md): conteos anónimos, sin cookies ni identificadores.
  'landing_vista',
  'onboarding_iniciado',
  'paywall_visto',
  'plan_elegido',
  'sinergia_calculada', // uso de la mini-calculadora de la página de ventas
] as const;
export type TipoDeEvento = (typeof TIPOS_DE_EVENTO)[number];

/** Eventos que el NAVEGADOR puede reportar. Los demás (p. ej. cuenta_eliminada) los
 * escribe solo el servidor: si /api/log-event los aceptara, cualquiera podría falsificarlos. */
export const TIPOS_DESDE_NAVEGADOR: readonly TipoDeEvento[] = [
  'primera_accion',
  'onboarding_completado',
  'landing_vista',
  'onboarding_iniciado',
  'paywall_visto',
  'plan_elegido',
  'sinergia_calculada',
];

const MAX_REGISTROS_POR_MINUTO = 200;

/** Freno global contra inundación de las rutas de registro abiertas (sin sesión): el límite por
 * conexión vive en memoria y no cubre ataques repartidos. Ante cualquier fallo, no bloquea. */
export async function hayDemasiadosRegistros(tabla: 'event_log' | 'error_log'): Promise<boolean> {
  try {
    const desde = new Date(Date.now() - 60_000).toISOString();
    const { count, error } = await clienteAdminSupabase()
      .from(tabla)
      .select('id', { count: 'exact', head: true })
      .gte('created_at', desde);
    if (error || count === null) return false;
    return count >= MAX_REGISTROS_POR_MINUTO;
  } catch {
    return false;
  }
}

export async function registrarEvento(
  type: TipoDeEvento,
  userId: string | null,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  try {
    const supabase = clienteAdminSupabase();
    await supabase.from('event_log').insert({ type, user_id: userId, metadata });
  } catch (error) {
    console.error('registrarEvento falló:', error instanceof Error ? error.message : error);
  }
}

export async function registrarError(message: string, context: string, userId: string | null = null): Promise<void> {
  try {
    const supabase = clienteAdminSupabase();
    await supabase.from('error_log').insert({
      message: message.slice(0, 500),
      context: context.slice(0, 200),
      user_id: userId,
    });
  } catch (error) {
    console.error('registrarError falló:', error instanceof Error ? error.message : error);
  }
}

export async function registrarLlamadaIA(
  feature: string,
  model: string,
  inputTokens: number,
  outputTokens: number,
  userId: string | null = null
): Promise<void> {
  try {
    const supabase = clienteAdminSupabase();
    await supabase.from('ai_calls').insert({
      feature,
      model,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      cost_usd: calcularCostoUsd(model, inputTokens, outputTokens),
      user_id: userId,
    });
  } catch (error) {
    console.error('registrarLlamadaIA falló:', error instanceof Error ? error.message : error);
  }
}
