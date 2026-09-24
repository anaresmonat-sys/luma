// Control de la prueba gratis en el SERVIDOR (auditoría de seguridad 2026-09-23,
// críticos 2 y 3: antes la prueba solo vivía en localStorage y se saltaba con una
// ventana privada o llamando a la ruta directamente). Decisión del usuario: la
// prueba sigue SIN CUENTA (un solo resultado gratis en total), con tope por
// navegador — pero ahora lo cuenta el servidor:
//   · cookie anónima httpOnly emitida por el servidor (no se lee ni se falsifica
//     desde el navegador; borrarla reinicia SOLO ese tope blando, y el gasto real
//     lo sigue limitando el tope diario global de lib/tope-ia.ts),
//   · límite generoso por conexión (hash, se borra a los 30 días): en LATAM muchas
//     personas comparten la misma IP móvil, así que es freno de abuso, no de prueba,
//   · lo PAGO se decide siempre aquí por cuenta + suscripción, nunca por el
//     navegador: plan activo o administradora no gastan la prueba.
// Disponibilidad primero: si algo falla al consultar, NO se bloquea a nadie (el
// tope global sigue protegiendo el gasto). Interruptor de emergencia:
// PRUEBA_SERVIDOR=off en las variables de entorno.

import { cookies } from 'next/headers';
import { createHmac, randomUUID } from 'crypto';
import { clienteAdminSupabase } from '@/lib/supabase/admin';
import { identificadorDePeticion } from '@/lib/rate-limit';

const COOKIE = 'luma_anon';
const MAX_RESULTADOS_GRATIS = 1;
const MAX_POR_CONEXION_DIA = 10;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ESTADOS_CON_ACCESO = ['active', 'trialing', 'trial'];

export interface AccesoGratis {
  permitido: boolean;
  /** Devuelve el uso reservado si la IA falló: un error nuestro no gasta la prueba de nadie. */
  devolver: () => Promise<void>;
}

const SIN_CONTROL: AccesoGratis = { permitido: true, devolver: async () => {} };
const BLOQUEADO: AccesoGratis = { permitido: false, devolver: async () => {} };

function huellaDeConexion(ip: string): string | null {
  if (!ip || ip === 'desconocido') return null;
  return createHmac('sha256', process.env.SUPABASE_SECRET_KEY ?? 'luma').update(ip).digest('hex').slice(0, 32);
}

export async function controlarAccesoGratis(request: Request, usuarioId: string | null): Promise<AccesoGratis> {
  if (process.env.PRUEBA_SERVIDOR === 'off') return SIN_CONTROL;
  try {
    const admin = clienteAdminSupabase();

    if (usuarioId) {
      const [perfil, suscripciones] = await Promise.all([
        admin.from('profiles').select('role').eq('id', usuarioId).maybeSingle(),
        admin
          .from('subscriptions')
          .select('estado, current_period_end')
          .eq('user_id', usuarioId)
          .in('estado', ESTADOS_CON_ACCESO),
      ]);
      const ahora = Date.now();
      const conPlan = (suscripciones.data ?? []).some(
        (s: { current_period_end: string | null }) => !s.current_period_end || new Date(s.current_period_end).getTime() > ahora
      );
      if (perfil.data?.role === 'admin' || conPlan) return SIN_CONTROL;
    }

    const jar = await cookies();
    let anon = jar.get(COOKIE)?.value;
    if (!anon || !UUID.test(anon)) {
      anon = randomUUID();
      jar.set(COOKIE, anon, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
      });
    }

    const huella = huellaDeConexion(identificadorDePeticion(request));
    const { data, error } = await admin.rpc('reservar_uso_gratis', {
      p_anon: anon,
      p_ip: huella,
      p_max_por_anon: MAX_RESULTADOS_GRATIS,
      p_max_por_ip: huella ? MAX_POR_CONEXION_DIA : 0,
    });
    if (error) return SIN_CONTROL;
    if (data !== 'ok') return BLOQUEADO;

    return {
      permitido: true,
      devolver: async () => {
        try {
          await admin.rpc('devolver_uso_gratis', { p_anon: anon, p_ip: huella });
        } catch {
          // Si no se pudo devolver, la persona pierde su intento gratis: raro y sin riesgo de seguridad.
        }
      },
    };
  } catch {
    return SIN_CONTROL;
  }
}
