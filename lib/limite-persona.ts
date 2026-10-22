// Tope de uso POR PERSONA en el servidor (decisión de la dueña, 2026-10-13, tras el
// análisis de rentabilidad en ESTADO.md). Complementa al tope global de lib/tope-ia.ts
// (que corta a todos) y a la prueba gratis anónima de lib/prueba-servidor.ts:
//   · costo de IA por persona: $0,20 en 24 h y $2,00 en 30 días (regla del SO: la IA
//     no pasa del 20 % del precio; el plan mensual cuesta $9,99),
//   · durante la prueba de 3 días, $0,40 en total (lo regalado no puede salir caro),
//   · número de usos por función en 24 h (freno de abuso, no de uso normal).
// Se mide con ai_calls (costo ESTIMADO, ver lib/ai-pricing.ts). La administradora
// no tiene tope. Disponibilidad primero: si algo falla al consultar, no se bloquea.

import { clienteAdminSupabase } from '@/lib/supabase/admin';

const TOPE_DIA_USD = 0.2;
const TOPE_MES_USD = 2;
const TOPE_PRUEBA_USD = 0.4;
const DIAS_PRUEBA = 4;

const USOS_POR_DIA: Record<string, number> = {
  tarot: 3,
  coach: 30,
  descifrar: 8,
  diario: 10,
};

// Durante la prueba gratis el tarot es 1 tirada al día (decisión de la dueña, 2026-10-22): crea el hábito diario y
// el límite se cuenta como motivo para quedarse («al terminar la prueba, 3 al día»). Las demás funciones no cambian.
const USOS_POR_DIA_PRUEBA: Record<string, number> = { tarot: 1 };

const NOMBRE_FUNCION: Record<string, string> = {
  tarot: 'lecturas de tarot',
  coach: 'mensajes con el Coach',
  descifrar: 'mensajes descifrados',
  diario: 'reflexiones del diario',
};

// Hotmart aprueba la compra de la prueba como «active» (no como «trialing»), así que la prueba NO se reconoce por el
// estado sino por la fecha: una suscripción creada hace menos de DIAS_PRUEBA días está en su prueba gratis.
const ESTADOS_CON_PLAN = ['active', 'trialing', 'trial', 'cancelled'];
const HORA_MS = 60 * 60 * 1000;

/** Devuelve el mensaje amable para mostrar si la persona llegó a su tope; null si puede seguir. */
export async function topePersonaExcedido(usuarioId: string | null, feature: string): Promise<string | null> {
  if (!usuarioId || process.env.PRUEBA_SERVIDOR === 'off') return null;
  try {
    const admin = clienteAdminSupabase();
    const ahora = Date.now();
    const hace24h = ahora - 24 * HORA_MS;
    const hace30d = ahora - 30 * 24 * HORA_MS;

    const [perfil, suscripciones, llamadas] = await Promise.all([
      admin.from('profiles').select('role').eq('id', usuarioId).maybeSingle(),
      admin.from('subscriptions').select('estado, created_at').eq('user_id', usuarioId).in('estado', ESTADOS_CON_PLAN),
      admin
        .from('ai_calls')
        .select('feature, cost_usd, created_at')
        .eq('user_id', usuarioId)
        .gte('created_at', new Date(hace30d).toISOString()),
    ]);
    if (perfil.data?.role === 'admin') return null;
    if (llamadas.error || !llamadas.data) return null;

    let costoDia = 0;
    let costoMes = 0;
    let costoPrueba = 0;
    let usosFuncion = 0;
    const desdePrueba = ahora - DIAS_PRUEBA * 24 * HORA_MS;
    for (const f of llamadas.data) {
      const t = new Date(f.created_at as string).getTime();
      const costo = Number(f.cost_usd ?? 0);
      costoMes += costo;
      if (t >= hace24h) {
        costoDia += costo;
        if (f.feature === feature) usosFuncion += 1;
      }
      if (t >= desdePrueba) costoPrueba += costo;
    }

    const enPrueba = (suscripciones.data ?? []).some((f) => {
      const creada = f.created_at ? new Date(f.created_at as string).getTime() : 0;
      return ahora - creada < DIAS_PRUEBA * 24 * HORA_MS;
    });
    if (enPrueba && costoPrueba >= TOPE_PRUEBA_USD) {
      return 'Ya probaste mucho de LUMA en estos días de prueba. Mañana sigues, y con tu plan activo tendrás todo el mes.';
    }
    const maxDia = (enPrueba ? USOS_POR_DIA_PRUEBA[feature] : undefined) ?? USOS_POR_DIA[feature] ?? Infinity;
    if (feature === 'tarot' && usosFuncion >= maxDia) {
      return enPrueba
        ? 'Ya hiciste tu tirada de hoy 🌙 Vuelve mañana: al terminar tu prueba tendrás 3 tiradas al día. Mientras tanto, ¿te descifro esa conversación que tienes pendiente?'
        : 'Ya hiciste tus 3 tiradas de hoy 🌙 Las cartas necesitan descansar: vuelve mañana, o descifra ahora esa conversación que tienes pendiente.';
    }
    if (usosFuncion >= maxDia) {
      const nombre = NOMBRE_FUNCION[feature] ?? 'consultas';
      return `Hoy ya hiciste muchas ${nombre}. Descansa un poco y vuelve mañana: LUMA te espera con la mente fresca.`;
    }
    if (costoDia >= TOPE_DIA_USD) {
      return 'Hoy has usado LUMA mucho. Para cuidar la calidad de cada respuesta, vuelve mañana y seguimos.';
    }
    if (costoMes >= TOPE_MES_USD) {
      return 'Llegaste al uso máximo de este mes. Se renueva poco a poco cada día; si necesitas más, escríbenos a soporte@tuluma.app.';
    }
    return null;
  } catch {
    return null;
  }
}
