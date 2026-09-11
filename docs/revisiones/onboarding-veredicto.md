# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-11 00:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 32/40
Craft: 13/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Todas las pantallas de pregunta/reconocimiento — 01,02,04,05,06,08,09,10] `flex-1 justify-center` en PreguntaChips/PreguntaSlider/Reconocimiento centra el bloque en el alto disponible sin llenarlo de valor: el vacío arriba del título + debajo del último chip/CTA suma ~35-40% del área visible en varias pantallas → fix: anclar el contenido con padding-top fijo cerca del header y acercar el bloque de opciones al fondo (o sumar contenido de apoyo), en vez de justify-center puro.
2. [Íconos de las 7 preguntas — chips de opción en 01,02,04,05,08,09 + escape hatch] Toda la iconografía de opción es emoji nativo (💬💛💔🔍🌙⏳📱👀🫂🔮📔😟😬🤐⌛☀️🌤️🤷‍♀️📸🎵👯🔎✍️); aunque está documentado como override explícito en FICHA-ARTE.md (Ronda #4), sigue bajando la identidad ownable del kit terciopelo+oro y no pasa el check "chips SVG sin emoji" de las anclas de conversión → fix: set de íconos de línea propio con hairline dorado para las 7 preguntas core, reservando emoji para los contextos de chat/WhatsApp donde sí tiene justificación narrativa.
3. [Chip 4 en "temor" (05) y "atribución" (09)] El último ítem de la lista se ve visiblemente más apagado/gris que sus pares sin que el código defina un estado distinto (ChipOpcion no tiene lógica condicional de opacidad) — parece deshabilitado sin estarlo → fix: verificar que la captura se tome después de terminar el stagger de entrada (~0.6s con 4-5 ítems) para no congelar el frame en opacity:0.4 de un chip aún animando.
4. [Cada pantalla de pregunta] Heurística 7 (flexibilidad/eficiencia): fuera del soporte nativo de flechas en el slider, no hay ningún atajo o default adicional para el usuario avanzado (todo exige tap secuencial) → fix: no es bloqueante para un onboarding mobile, pero documentar la ausencia es intencional si se decide no agregar nada.
5. [Header de cada pantalla — franja "LUMA" + barra de progreso] No hay ningún hairline degradé decorativo (solo el fill sólido de la barra de progreso) en las pantallas de pregunta, mientras que la ancla de conversión pide ≥1 hairline degradé por vista → fix: agregar un hairline de 1-2px con degradé sutil (p.ej. bajo el header o enmarcando la carta en los reconocimientos) para reforzar el sistema de conversión.
