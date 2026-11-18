# Prueba de aislamiento entre cuentas (RLS) — 2026-11-18

**Resultado: APROBADA.** Una clienta no ve, escribe, cambia ni borra datos de otra, y un visitante sin cuenta no ve nada.

## Cómo se hizo
Dentro de una operación que se deshace sola (sin cambios ni cuentas nuevas en producción), con SQL sobre la base real (Supabase `zmqwdtqkoyxptqscbgpx`):
1. Se tomó una persona A con datos (la que más entradas de diario tiene) y otra persona B distinta.
2. Se actuó con el rol `authenticated` y la identidad de B.
3. Para las 21 tablas de `public` se contaron las filas visibles y cuántas pertenecen a otra persona.
4. Se intentó escribir, cambiar y borrar datos de A, y subir a B a administradora.
5. Se repitió como visitante (`anon`), sin sesión.

## Resultados
| Prueba | Resultado |
|---|---|
| B ve filas ajenas en alguna tabla | **Ninguna** (ai_calls, cancel_requests, checkins, journal_entries, profiles, subscriptions, etc.) |
| B escribe una entrada en el diario de A | **Bloqueado** |
| B cambia la suscripción de A | **0 filas afectadas** |
| B borra el diario de A | **0 filas afectadas** |
| B se hace administradora | **Bloqueado** |
| Tablas de servidor (`error_log`, `event_log`, `webhook_log`, `processed_events`) vistas por B | 0 filas |
| Visitante sin cuenta lee tablas con datos personales | **Denegado o 0 filas** (14 de 21 denegadas; el resto, 0 filas) |
| Visitante escribe en `sugerencias` o `event_log` | **Bloqueado** |

## Avisos del asesor de seguridad de Supabase (revisados)
- `uso_gratis` y `uso_gratis_ip` sin políticas: **a propósito** (solo las usa el servidor).
- `is_admin()` ejecutable por clientas: es el ayudante de las políticas de administradora y solo devuelve si **la propia** persona es administradora: sin riesgo.
- Protección de contraseñas filtradas desactivada: **no aplica** (LUMA no usa contraseñas, solo enlaces por correo).

## Qué NO cubre
Solo las políticas de la base de datos. No se probaron las rutas de la API con dos sesiones reales de navegador ni un contracargo o pago rechazado.
