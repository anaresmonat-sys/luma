# ECONOMICS-CERTIFICATION — costo de IA vs. precio (2026-10-20)

Datos reales de la tabla `ai_calls` (costo medio por llamada): tarot $0,0120 · coach $0,0081 · compatibilidad $0,0103 · descifrar $0,0058 · diario $0,0032 · numerología $0,0095. Gasto total de los últimos 30 días: $1,47.

Regla: costo de IA por usuario de pago < 20 % del precio. Con $9,99/mes el tope es ≈ $2,00 → unas 165 lecturas de tarot al mes por persona, o ≈ 340 de Descifrar. Un uso muy intenso (3 lecturas diarias de tarot + 3 chats de coach) cuesta ≈ $1,9/mes: dentro de la regla pero cerca del tope.

Protecciones reales: tope diario global de IA $5 (`lib/tope-ia.ts`), cuota de prueba gratis controlada en servidor, límites por usuario.


## Tarifas de Hotmart (fuente: asistente de Hotmart, 2026-10-22; confirmar en la documentación oficial)
Comisión por venta aprobada: 9,9 % + 1,00 USD (EUR/GBP igual; BRL 9,9 % + 2,49 BRL). Neto: mensual 9,99 → ≈ 8,00 USD · anual 89,99 → ≈ 80,08 USD.
Con el neto, la regla «IA < 20 %» da un tope de ≈ 1,60 USD por usuaria de pago al mes (mensual). Un uso muy intenso (≈ 1,9 USD) lo SUPERARÍA: vigilar el tope diario y las cuotas.
Reembolsos: las tarifas cobradas NO se devuelven al productor → cada reembolso del mensual cuesta ≈ 1,99 USD + el costo de IA usado. Solo se reembolsa el primer cobro, dentro de 15 días.

NO certificado (faltan): p95 de uso por usuaria real (aún no hay usuarias de pago), impuestos, y la tarifa oficial publicada por Hotmart. La economía sigue siendo una ESTIMACIÓN hasta tener 30 días de uso real.
