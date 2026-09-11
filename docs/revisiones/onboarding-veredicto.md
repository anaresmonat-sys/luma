# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-11 00:00
Screenshot: docs/revisiones/onboarding-375.png (+ onboarding-01..12 en docs/revisiones/)
Usabilidad: 29/40
Craft: 13/20
Copy (si vende): 15/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Pantallas 03/06/07/10 — reconocimiento y slider] Vacío muerto de ~40-45% entre el cuerpo/feedback y el CTA (el CTA se empuja al fondo con mt-auto sin nada que llene el medio) → centrar verticalmente el bloque completo (título+cuerpo+CTA) en vez de dejar el hueco crudo, o sumar un elemento visual que ocupe ese espacio.
2. [Pantallas 01/02/04/05/08/09 — chips] Pese al fix reportado de la ronda 1, sigue habiendo ~25-30% de espacio vacío asimétrico bajo la última opción (justify-center no está logrando el equilibrio visual) → verificar que el contenedor realmente use la altura completa del viewport del screenshot y ajustar el pb-16 fijo que rompe la simetría entre el margen superior e inferior.
3. [Código: Reconocimiento.tsx, PreguntaSlider.tsx] Las animaciones internas (opacity/scale/y) no consultan useReducedMotion — solo lo hacen PasoShell, LoadingPlan y CartaSacerdotisa — violando de forma inconsistente la regla UX #10 (prefers-reduced-motion siempre) en 2 de los 5 componentes compartidos.
4. [Código: PreguntaChips.tsx, usado en 7 de las 12 pantallas] Los chips de una misma pregunta aparecen todos juntos con el fade del frame, sin stagger de entrada (50-80ms) entre ítems — falta la baseline de movimiento #1 en el tipo de pantalla más repetido del flujo.
5. [Pantalla 01 — EscapeHatchInput "Otra cosa"] El botón Continuar queda deshabilitado (opacidad reducida) sin ningún texto que explique por qué — falta microcopy tipo "Escribe algo para continuar" cerca del input.

Notas adicionales (no top-5 pero relevantes): iconografía emoji está documentada como override explícito en FICHA-ARTE.md §Ronda 4 (no es defecto). COPY EJE 4 (claridad de oferta) puntúa bajo (2/4) porque el onboarding no ancla ningún indicio de stack/precio/garantía — es consistente con la decisión de diferir el paywall a la pantalla siguiente, pero por rúbrica un eje ≤2 exige corrección aunque el total no dependa de él. Los CTA "Continuar" (reconocimiento) son genéricos, no en 1ª persona de beneficio como "Fijar mi ritmo" o "Ver mi plan completo".
