# CERTIFICADO DE LANZAMIENTO — LUMA — 2026-11-10

**Veredicto: NO APTO para anuncios de pago · 71/100** (antes: 68/100 el 2026-10-27; 56/100 el 2026-10-20). Banda: <80 = NO APTO.
Apto para un lanzamiento pequeño y controlado (gente cercana, sin anuncios) con los 3 cuidados de «Antes de las primeras clientas».

| Pilar | Puntos | Evidencia |
|---|---|---|
| VENTA | 17/20 | Landing LISTA (36/40 · 16/20 · copy 19/20, ronda 15; hoy solo cambió un icono). Lighthouse móvil hoy: 94-98, LCP 1,8-2,3 s, CLS 0. Falta prueba social real (no hay clientas). |
| FUNNEL | 14/20 | Compra anual real iniciada y validada por la app (producto reconocido, cuenta activa, cancelación confirmada por Hotmart). Pero los veredictos independientes de hoy dejan onboarding en NO LISTA 34/40·15/20 y planes en NO LISTA 32/40·15/20·16/20 (el 27-oct habían salido LISTA: el revisor oscila). Falta el aviso del día 2 antes del cobro. |
| PRODUCTO | 15/20 | 60 pruebas unitarias + 17 de recorrido en verde; IA real probada hoy en 8 casos (maltrato, crisis, salud, «¿me quiere?»…); regla de crisis y líneas de ayuda por país en Tarot y Descifrar; trato de género con o sin cuenta; Inicio con Deshacer y sin duplicados (NO LISTA 33/40·15/20, decisión de cerrar rondas). |
| CONFIANZA | 9/15 | npm audit 0; sin secretos en el repositorio; CSP/HSTS/X-Frame/nosniff en producción; webhook sin firma → 401; /admin sin sesión → redirige; RLS en las 20 tablas (2 sin políticas a propósito, solo servidor); cancelación automática probada hoy con compra real; recarga automática de la IA activada (5→25 US$). Pero: Supabase Free (sin copias) y Vercel Hobby (uso comercial prohibido), textos legales sin revisión profesional, reembolso y primer cobro reales sin probar, aviso de Supabase: caducidad de enlaces de acceso > 1 h, sin alertas de errores (Sentry), límite de peticiones en memoria. |
| VELOCIDAD | 8/10 | Planes 1,7 s ✓ y landing 1,8-2,1 s ✓ (meta 2,5 s); CLS 0 en las tres; recorrido de inicio 3,7 s ✗. |
| RETENCIÓN | 8/15 | Hábito diario (ánimo con racha que cuenta y deshacer, carta, tarot 1/3 al día), límites por persona y panel de suscripciones; faltan aviso previo al cobro, reintentos de pago fallido y recuperación de bajas. |

## Antes de las primeras clientas (lanzamiento pequeño)
1. Un cobro y un reembolso reales de punta a punta (prueba mensual con +prueba6, ~US$2 de tarifa no reembolsable).
2. Decidir el aviso previo al cobro: alertas de renovación de Hotmart (sin comprobar si cubren el primer cobro tras la prueba) o correo propio. Hasta entonces la web no lo promete (comprobado).
3. Vercel Pro desde la primera venta real (Hobby prohíbe uso comercial y puede pausar el proyecto).

## Bloqueantes abiertos antes de anunciar con dinero (Gate 61)
1. Pagos sin certificar: primer cobro y reembolso reales, pago rechazado, contracargo.
2. Legal: textos sin revisión profesional; confirmación de edad solo en el navegador.
3. Infraestructura: Supabase Free (sin copias) y Vercel Hobby.
4. Sin alertas de errores (Sentry) ni panel de estado.
5. Sin aviso previo al cobro ni reintentos propios de pago fallido.
6. Límite de peticiones en memoria, no distribuido.
7. Tres pantallas del dinero (onboarding, planes, Inicio) con el último veredicto del revisor en NO LISTA; recorrido de inicio con LCP 3,7 s.
8. Aviso de Supabase Auth: caducidad de los enlaces de acceso > 1 hora (ajuste en el panel de Supabase, a cargo de la dueña).

## Camino a ≥80 (+9 puntos)
Vercel Pro + Supabase Pro (+2 confianza) · primer cobro y reembolso reales (+2) · revisión legal profesional (+2) · aviso del día 2 / alertas de Hotmart (+2) · onboarding y planes LISTA y LCP del inicio < 2,5 s (+1 a +2).

## Qué se midió hoy y qué NO
Medido hoy: npm audit, búsqueda de secretos, cabeceras de producción, webhook sin firma, /admin sin sesión, RLS y avisos del asesor de Supabase, 60 pruebas unitarias, 17 de recorrido (sobre el build local con la misma base), Lighthouse móvil (informes docs/release/lighthouse/*-2026-11-06*.json; simulado, 1-2 corridas por página), 8 casos de IA con clave real (el 2026-11-02), veredictos del revisor de planes, onboarding e Inicio (docs/revisiones/).
NO medido hoy: prueba de acceso cruzado entre usuarios con dos cuentas reales (solo revisión de políticas RLS; la de borrado se probó con rol authenticated y rollback), contracargo, pago rechazado, reembolso, copia de seguridad/restauración, coste real de IA por persona (216 llamadas registradas desde el 23-sep: ~1.600 tokens de entrada y ~320 de salida por llamada; el tope por persona de 1,60 US$/mes acota el gasto; el precio por token no se verificó hoy), landing re-puntuada (se conserva el veredicto del 27-oct porque el diseño no cambió).

## Evidencia
docs/release/*.md · docs/release/lighthouse/*-2026-11-06*.json · docs/revisiones/ (inicio rondas a-d, planes, onboarding) · tests/ (60 unitarias + 17 de recorrido) · supabase/migrations/20261109_checkins_delete_own.sql · commits de este repositorio.
