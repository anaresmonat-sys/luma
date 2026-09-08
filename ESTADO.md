# ESTADO — Tarot Mirror (nombre tentativo)
Última actualización: 2026-09-08 | Sesión actual: 1

⏸️ CHECKPOINT — Última acción completada: idea validada recibida y guardada / Siguiente acción exacta: aprobar Plan Maestro y arrancar Sesión 1 (validación profunda + FICHA-AVATAR + monetización + arquitectura)

## Qué es esta app (3 líneas máximo)
Refugio diario para mujeres (22-42) que usa la simbología del tarot como detonante de journaling
guiado e inteligencia emocional. No es adivinación: es "psicología visual" para procesar emociones
y decidir sin actuar por impulso. Monetización: suscripción mensual/anual con prueba gratis.

## Promesa central (borrador — se afina en Sesión 1)
"Ayuda a mujeres en dilemas de pareja o ansiedad cotidiana a entender qué les pasa y qué hacer hoy,
sin horóscopos genéricos ni respuestas frías de IA, mediante cartas de tarot que disparan
journaling guiado y un ejercicio práctico de 1 minuto."

## Reporte de validación (idea PRE-VALIDADA por el usuario — materia prima, no se re-valida)
- Veredicto del usuario: oportunidad con competencia alta (+50 apps) pero hueco claro: introspección/journaling
- Apps de referencia / competidores:
  - Nebula — queja: respuestas robóticas, cobros agresivos · hueco: cero introspección/journaling
  - Labyrinthos — queja: contenido repetitivo, sin enfoque práctico · hueco: es herramienta de aprendizaje, no coach
  - Sanctuary — queja: caro (cobra por minuto) · hueco: depende de terceros, no autogestión
- Lo que los usuarios odian de la competencia (nuestra oportunidad):
  - Interpretaciones tipo "horóscopo de periódico", genéricas
  - IA superficial que se siente falsa y aleatoria, sin conexión con su situación real
  - Sin espacio privado para volcar pensamientos
- Precio de referencia declarado: $9.99/mes o $59.99/año · prueba gratis 3 días desde el onboarding
- Costo por cliente estimado: ~$0.15 USD/mes (IA por tirada + journaling) → margen ~98.5%
- Idioma/mercado: español (los ganchos y el avatar del resumen están en español)

## Avatar y venta (Sesión 1 — se completa FICHA-AVATAR.md)
- FICHA-AVATAR.md: NO creada aún
- Avatar: mujer 22-42, dilemas de pareja o ansiedad cotidiana, conoce el tarot, cansada de
  promesas místicas vacías y de IA fría. Nivel de consciencia: alto (conoce el problema y las
  soluciones, escéptica de ellas → sofisticación de mercado alta).
- Dolor #1: sobrecarga emocional y confusión sin espacio privado para procesarla de forma práctica
- Deseo #1: entender qué le pasa emocionalmente en < 3 minutos
- Objeciones: "otra app de horóscopo genérico" · "para eso están las tiradas gratis de TikTok/YouTube"
  · "no tengo tiempo de escribir párrafos largos a diario"
- Diferenciador: única app que usa las cartas como disparadores de inteligencia emocional +
  journaling guiado para tomar el control, no para predecir el futuro

## Estrategia de monetización (Sesión 1 — se decide con matriz A-F del 02C)
- Modelo: PENDIENTE (probable onboarding-first con trial, por ser B2C de personalización/bienestar)
- Trial: 3 días (declarado por el usuario) — se valida contra 02C/plazos de Hotmart
- Pricing propuesto de partida: $9.99/mes | $59.99/año — se valida con los 3 suelos del 02C + gate del 40

## Primera victoria (< 5 min)
Tirar una carta → recibir una interpretación psicológica de su emoción actual → responder UNA
pregunta de journaling reveladora + un ejercicio de 1 minuto para hoy.

## Decisiones técnicas (NO re-discutir sin pedirlo el usuario)
- Framework: PENDIENTE (se decide Sesión 1 — probable Next.js: landing + app + rutas de servidor para IA)
- Features del MVP (del campo 11 del resumen):
  1. Selección visual de 3 cartas
  2. Motor de prompt de coaching emocional basado en la carta
  3. Diario de reflexión (journaling)
  4. Rastreador de estado de ánimo
- NO construir aún: tarotistas humanos en vivo, horóscopo por signo, compatibilidad de pareja
  avanzada, foros comunitarios
- Modelo de IA: PENDIENTE (constante AI_MODEL, nunca hardcodeado)
- IA: texto→texto, sync (respuesta corta) — se confirma arquitectura en Sesión 1

## Riesgos (del resumen)
- Adquisición dependiente de TikTok orgánico sin pauta → plantillas de video replicables
- Cancelación a los 2 días → notificación diaria "tu reflexión de 1 minuto está lista" + loop
- Percepción de "IA genérica" → prompt en primera persona, coach empático, específico

## Secuencia maestra de construcción (NO saltar)
- Estado: nada construido. Ruta: `/` → `/onboarding` → `/paywall` → `/login` → `/app`
- Landing: pendiente · Onboarding: pendiente · Paywall: pendiente · Login: pendiente · App interna: pendiente
- Servicios externos: bloqueados hasta que las puertas anteriores estén aprobadas

## Sesión en progreso 🔧
- Sesión 1 — arrancando: falta aprobación del Plan Maestro por el usuario

## Próximas sesiones 📋
- Sesión 1: validación profunda, FICHA-AVATAR, FICHA-MODELO, FICHA-MERCADO, monetización, arquitectura
- Sesión 2: identidad visual y sistema de diseño (FICHA-ARTE)
- Sesión 3: página de ventas
- Sesión 4: onboarding, paywall, login
- Sesión 5: app interna
- Sesión 6: integraciones reales y seguridad
- Sesión 7: testing, pulido, rigor de entrega
- Sesión 8: adquisición, lanzamiento, backoffice

## Pendientes del usuario
- [ ] Nada por ahora — se avisará cuando toque crear cuentas (Hotmart, Supabase, Vercel, Resend) y comprar dominio

## Notas para la próxima sesión
- La idea llegó PRE-VALIDADA (bloque "RESUMEN FINAL — IDEA VALIDADA PARA CONSTRUIR"). No re-validar
  ni proponer alternativas. Prestar atención a campos 5, 11, 15, 16, 18, 20 del resumen.
