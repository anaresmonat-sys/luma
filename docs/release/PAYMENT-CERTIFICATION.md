# PAYMENT-CERTIFICATION — pagos con Hotmart (2026-10-20)

**Veredicto de pagos: PARCIAL (no certificado completo).**

Verificado con evidencia real:
- Firma del webhook (hottok en tiempo constante, falla cerrado sin variable) — `tests/hotmart-verify.test.ts`.
- Idempotencia (`processed_events`) y libro económico único (`payment_transactions`, clave provider+transaction_id+kind) — RPC `apply_hotmart_event` (atómica).
- Un evento viejo no resucita un reembolso/contracargo — `tests/membership-fsm.test.ts`.
- Regla de acceso (cancelado conserva hasta fin de período; pago fallido 3 días de gracia) — `tests/acceso-plan.test.ts` (22 pruebas en total pasan).
- Compra real de prueba: trial mensual → acceso → cancelación en trial (+ segunda compra). Correo de acceso recibido.
- Usuario normal no puede escribirse un plan ni ejecutar la RPC (probado en Supabase).

NO verificado (cuenta como 0 en el certificado):
- Trial anual, pago rechazado/past_due real, reembolso y contracargo reales, compra con correo distinto, job de reconciliación.
- Que HOTMART_PRODUCT_ID esté definido en Vercel (no hay acceso de lectura al proyecto).
- No hay allowlist de oferta/importe/moneda (solo de producto).
- No hay aviso previo al cobro ni correo de pagos fallidos propios (Hotmart reintenta por su cuenta).

## Actualización 2026-10-27
Verificado desde el examen anterior: cancelación automática por API con compra real (Hotmart la marca «Cancelada por el vendedor», acceso hasta fin de prueba); `PURCHASE_CANCELED` ya no regala acceso (fallo real corregido 23-oct, publicado); regla de acceso por fecha de prueba; `HOTMART_PRODUCT_ID` creado (8610914) en Vercel; `PRUEBA_SERVIDOR` no existe (controles activos); webhook cerrado sin clave (16 pruebas de recorrido en producción).
SIGUE SIN VERIFICAR: compra real del plan anual (el intento del 22-oct no se completó en el banco; hay que repetirlo para validar HOTMART_PRODUCT_ID con una compra real), pago rechazado/past_due real, reembolso real (por panel o por API), contracargo, compra con otro correo, trial anual, aviso previo al cobro (no existe), hora exacta del primer cobro (Hotmart no la da).

## Ciclo de cancelación en prueba: VERIFICADO de principio a fin (2026-10-27)
Compra real con prueba gratis → cancelación desde la app (API de Hotmart, 1 s) → «Cancelada por el vendedor» → acceso hasta el día 3 → bloqueo en el club de Hotmart al terminar la prueba. Confirmado por la dueña.
