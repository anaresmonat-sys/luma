# CLAIMS-LEDGER — promesas públicas y su respaldo (2026-10-20)

| Promesa visible | Dónde | Respaldo | Estado |
|---|---|---|---|
| 3 días de prueba gratis | landing, planes, onboarding | Oferta de Hotmart con 3 días (compra real de prueba hecha) | ✅ verificada |
| Precios $9,99 / mes y $89,99 / año | landing, planes | Ofertas en Hotmart (compra real mensual) | ✅ mensual · ⚠️ anual sin compra real |
| Garantía de 15 días desde que empiezas la prueba | planes, reembolsos | Configurada en Hotmart (decisión de la dueña) | ✅; fuera de plazo no hay reembolso |
| Cancelas escribiendo a soporte (menos de 24 h) | /app/cancelar, términos | Proceso manual real | ✅ (vigilado: no se promete «un toque») |
| Tras cancelar conservas el acceso hasta fin de lo pagado | cancelar | `lib/acceso-plan.ts` + 6 pruebas | ✅ (corregido hoy; sin publicar) |
| Tu conversación es privada, no la guardamos (Descifrar) | onboarding, API | `app/api/descifrar` no persiste el texto; el log guarda mensaje fijo | ✅ |
| Aviso antes del cobro | — | NO existe | ❌ retirado; la prueba `claims.test.ts` impide que vuelva |
| «Ilimitado», «sabrás si te quiere» | — | Falso/prohibido | ❌ vigilado por prueba |
| Lecturas de IA (tarot, coach, descifrar…) | app | `ai_calls`, producción responde | ✅ |
| Datos seguros / solo tú ves lo tuyo | privacidad | RLS en 19 tablas + prueba de IDOR | ✅ |
| Textos legales | /privacidad, /terminos… | BORRADOR sin revisión profesional | ⚠️ |
