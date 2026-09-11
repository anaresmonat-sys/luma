# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-11 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 31/40
Craft: 16/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Top defectos:
1. [Pie de confianza, bajo el CTA — "Restaurar compra"] Enlaza a `/entrar`, que NO EXISTE en el proyecto (verificado: no hay `app/entrar/page.tsx` en ninguna ruta del repo; ESTADO.md lo confirma como "404 hoy"). Cualquiera que lo toque cae en el 404 genérico de Next.js sin ningún mensaje de la app (heurísticas 3 y 9) → ocultar el enlace o quitarle apariencia de control activo hasta que exista `/entrar` (Sesión 6), o reemplazarlo por un texto no clicable ("Restaurar compra estará disponible pronto").
2. [Pie de confianza — "Pago seguro con Hotmart · Garantía de Calma de 7 días"] El `<p className="flex ...">` (app/paywall/page.tsx L263-269) no tiene `flex-wrap`; al no caber en ~335px, cada frase se reparte en su propia columna y se parte a media palabra: "Hotmart" y "días" quedan huérfanos en su propia línea, en vez de verse como una frase continua → agregar `flex-wrap justify-center gap-x-4 gap-y-1` y envolver cada ícono+texto en un `span` con `whitespace-nowrap`.
3. [Pantalla "confirmado" tras el CTA] En el viewport real (375×812, sin scroll — confirmado contra el PNG de 750×1624px) el bloque de mensaje ocupa solo ~28% del alto, con ~300px vacíos arriba y ~280px vacíos abajo. No es el defecto de asimetría severa de rondas previas (esa sí era una medición incorrecta, ya descartada) — el centrado es razonablemente simétrico — pero sigue siendo la pantalla de menor densidad de valor de todo el funnel, justo en el momento más importante (segundos antes del pago real) → sumar una mini-tarjeta de resumen (plan elegido + precio + fecha estimada del 1er cobro) para llenar el espacio con contenido útil en vez de aire.
4. ["Ahora no" vs "Restaurar compra"] Ambos enlaces comparten exactamente el mismo peso visual (mismo tamaño, color, subrayado al hover) pese a tener consecuencias muy distintas — uno abandona el flujo, el otro intenta recuperar una compra previa — una clienta que ya pagó antes puede no distinguir cuál tocar de un vistazo.
5. [CTA "Empezar mis {TRIAL_DIAS} días gratis"] El texto del botón no cambia según el plan tocado (Anual vs Mensual); la única confirmación textual de qué plan está a punto de activarse vive en el timeline de arriba, no junto al botón que se presiona — bajo impacto, pero un vistazo rápido al CTA no confirma qué se está por iniciar.
