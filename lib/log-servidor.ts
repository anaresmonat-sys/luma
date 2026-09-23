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
] as const;
export type TipoDeEvento = (typeof TIPOS_DE_EVENTO)[number];

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
