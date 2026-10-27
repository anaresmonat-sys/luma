# CERTIFICADO DE LANZAMIENTO — LUMA — 2026-10-27

**Veredicto: NO APTO para anuncios de pago · 68/100** (antes: 56/100 el 2026-10-20). Banda: <80 = NO APTO.
Apto para tráfico orgánico pequeño SOLO cuando se cierren los 5 puntos rápidos de abajo (decisión de la dueña).

| Pilar | Puntos | Evidencia |
|---|---|---|
| VENTA | 17/20 | Landing LISTA: 36/40 · 16/20 · copy 19/20 (ronda 15, capturas a 375 px). Falta la prueba social real (no hay clientas) |
| FUNNEL | 16/20 | Recorrido de inicio LISTA 36/40 · 16/20 (ronda 19) y planes LISTA 36/40 · 16/20 · 16/20 (ronda 18, con spinner y teclado). Falta el puente de correos del trial (día 2) y la compra real del anual |
| PRODUCTO | 14/20 | 49 pruebas unitarias + 17 de recorrido; IA en español neutro y sin género verificada con IA real; pantallas internas con veredictos anteriores (no repetidos hoy) |
| CONFIANZA | 8/15 | npm audit 0; CSP y cabeceras; RLS en todas las tablas e IDOR probado; cancelación automática probada con compra real. Pero: sin backups (Supabase Free), Vercel Hobby (no comercial), textos legales sin revisión profesional, reembolso real y compra anual sin probar |
| VELOCIDAD | 6/10 | Lighthouse móvil: landing 90, planes 93, inicio 89; CLS 0; LCP 3,0 / 2,7 / 3,1 s (meta 2,5 s) |
| RETENCIÓN | 7/15 | Hábito diario (tarot 1/3 al día), límites y panel real de suscripciones; faltan aviso previo al cobro, reintentos de pago fallido y recuperación de bajas |

## Bloqueantes abiertos (Gate 61)
1. Pagos sin certificar: plan anual (el intento del 22-oct no se completó), pago rechazado, reembolso real, contracargo, `HOTMART_PRODUCT_ID` sin comprobar con compra real.
2. Legal: textos sin revisión profesional; confirmación de edad solo en el navegador.
3. Infraestructura: Supabase Free (sin copias, se pausa) y Vercel Hobby (uso comercial prohibido, puede pausar el proyecto al pasar un límite).
4. Sin alertas de errores (Sentry), sin panel de estado.
5. Sin aviso previo al cobro ni reintentos propios de pago fallido (no se promete).
6. Límite de peticiones en memoria (no distribuido).

## Camino a ≥80 (+12 puntos)
Vercel Pro + Supabase Pro (+2 confianza) · compra anual y reembolso reales (+2) · revisión legal (+2) · correo de aviso del día 2 y reintentos (+3) · LCP bajo 2,5 s (+2) · veredictos nuevos de las pantallas internas (+1 a +2).

## Evidencia
docs/release/*.md · docs/release/lighthouse/*-2026-10-27.json · docs/revisiones/ (landing r15, inicio r19, planes r18) · tests/ (66 pruebas) · commit del examen en este repositorio.
Aviso de método: el revisor de la landing sobrescribió por error su archivo de veredictos y se reconstruyó (1 línea de redacción antigua cambió); los revisores no tienen Edit, las rondas las anexó el desarrollador. La nota del revisor de los planes fue condicional a la captura del estado «abriendo», que se hizo después y muestra el spinner.
