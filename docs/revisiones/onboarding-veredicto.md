# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-11 00:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 32/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Todas las pantallas de pregunta/reconocimiento/loading — 01,02,03,04,05,06,07,08,09,10,11] El bloque de contenido queda desplazado hacia la mitad superior de la pantalla con un vacío desproporcionado debajo (ej. 01-motivo: título+chips terminan ~64% de la altura de la captura, dejando ~36% vacío abajo contra solo ~13% de margen arriba — no es un centrado simétrico real pese a `flex-1 justify-center` en PreguntaChips.tsx/PreguntaSlider.tsx/Reconocimiento.tsx/LoadingPlan.tsx). El mismo patrón se repite de forma idéntica en 10 de 12 pantallas → recapturar el screenshot a un alto de dispositivo real (375×812/844, no ~375×2150) y, si el desbalance persiste ahí, reemplazar el `flex-1 justify-center` puro por un tope de alto/padding superior fijo para que el contenido no "flote" con exceso de aire abajo.
2. [components/onboarding/PlanListo.tsx línea 73] El CTA final sigue agrupado con `mt-auto` (el mismo patrón que causó el defecto #1 de la ronda anterior en Reconocimiento/Slider) → aplicar ahí el mismo fix ya usado en Reconocimiento/PreguntaSlider: agrupar el CTA con el resto del contenido y centrar verticalmente el bloque completo, no empujarlo con `mt-auto`.
3. [Chips de las 7 preguntas, ej. 04-ayuda, 05-temor, 08-hora] Iconografía emoji de sistema (documentada como override en FICHA-ARTE.md Ronda #4, válida como decisión de producto) contrasta con la promesa de la propia ficha ("efecto WOW... profundidad 3D... elegante") — el emoji queda plano dentro del chip con solo un tinte de fondo, sin el glow/relieve 3D del resto de la dirección A → aplicar al contenedor del emoji el mismo tratamiento de profundidad (glow sutil, sombra de contacto) que ya usa la carta de tarot en Plan Listo.
4. [components/onboarding/ui.tsx — EscapeHatchInput y ChipOpcion] La animación de aparición del campo de texto libre (EscapeHatchInput) no verifica `useReducedMotion`, a diferencia de PasoShell/Reconocimiento/LoadingPlan que sí lo hacen → envolver esa animación con el mismo check `reduce` para consistencia (heurística 4 / eje movimiento).
5. [components/onboarding/PreguntaSlider.tsx, pantalla 07-slider] El número del slider no implementa la baseline de "conteo animado de números héroe" (solo hace un crossfade del dígito ya resuelto al cambiar); `ContadorHero` está definido en ui.tsx para ese propósito pero no se usa en ningún punto del flujo → usarlo ahí o implementar un conteo real.
