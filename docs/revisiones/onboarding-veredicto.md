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

# VEREDICTO revisor-visual — onboarding (Ronda 6, recorrido sin preguntas)
Fecha: 2026-10-13 00:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 28/40
Craft: 10/20
Copy (si vende): 8/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Detalle usabilidad: h1:2 h2:3 h3:3 h4:3 h5:3 h6:4 h7:3 h8:2 h9:3 h10:2
Detalle craft: jerarquia:2 profundidad:2 identidad:2 movimiento:2 encaje:2
Detalle copy: idea:2 especificidad:1 emocion:1 oferta:2 accion:2 (es una puerta de edad, no vende; puntuado a pedido)
Gate de carga cognitiva: 0 fallas. El problema no es sobrecarga sino cromo heredado y CTA muerto.
Top defectos:
1. [Header, barra "6%" con flecha atrás] Barra de progreso al 6% en una pantalla que es el ÚNICO paso: promete un recorrido largo que ya no existe, el "6%" es dato falso y hace pensar que falta mucho antes de la primera lectura (frena justo lo que se quiere acelerar) → fix: en PasoEdad/page.tsx no renderizar la barra ni el porcentaje (variante de OnboardingHeader solo con atrás + LUMA), o pasar progreso oculto.
2. [Botón "Continuar", abajo] CTA disabled por defecto al 40% de opacidad (texto oscuro sobre dorado apagado, contraste visiblemente bajo, se lee como "roto") y sin hint de por qué; incumple el ancla "CTA héroe vivo" y no tiene whileTap/:active propio → fix: dejarlo habilitado a opacidad plena, al tocar sin casilla marcada mostrar hint "Marca la casilla para continuar" con el borde de la casilla resaltado, y añadir whileTap scale 0.97 + [touch-action:manipulation].
3. [Bloque central, ~230px de vacío sobre el título y ~200px bajo el botón] justify-center deja el contenido flotando en medio del viewport con aire muerto arriba/abajo; el titular de 22px es poco héroe y todo (título, párrafo, casilla, botón) pesa parecido → fix: anclar al tercio superior (pt-12) con título 28px Cormorant, o añadir un elemento ownable (carta/luna a línea con resplandor ámbar) sobre el título para que la pantalla tenga identidad, no solo un formulario.
4. [Casilla "Confirmo que soy mayor de 18 años"] Es un <button aria-pressed> con caja de 24px de borde tenue (text-tertiary 45%, casi invisible sobre #2b1a24) y 13.5px de texto: dos pasos (marcar + continuar) para una sola intención, y semántica incorrecta para lectores de pantalla (debería ser role="checkbox"/aria-checked o input checkbox con label); sin whileTap ni feedback de 100ms → fix: role="checkbox" aria-checked, borde de la caja a text-secondary/accent 60%, texto a 15px, y whileTap 0.98 en la fila.
5. [Párrafo explicativo y pie de pantalla] El texto dice "necesitamos confirmar tu edad" pero no enlaza a Términos/Privacidad ni dice qué pasa a continuación; el usuario no sabe que va directo a su lectura gratis, y a quien cierra la edad no se le da salida clara (solo la flecha atrás) → fix: línea al pie de 12px "Al continuar aceptas los Términos y la Privacidad" con enlaces, y subtítulo que nombre el destino ("y entras directo a tu primera lectura gratis"); además unificar header: franja sticky con bg/95 + blur crea una costura visible a ~100px sobre el degradé del fondo, quitar el backdrop o dejarlo transparente.
Verificación en código (no inferida): motion con reduced-motion cubierto (useReducedMotion); sin stagger (un solo bloque), sin whileTap en CTA ni casilla, sin aria-live para el estado del botón; "atrás" siempre presente y vuelve a "/" (h3 OK); edad persistida una vez por navegador y redirección directa si ya confirmó (h7 OK, pantalla neutra sin parpadeo). Paleta, tipografía (Cormorant + Hanken) y radios coinciden con FICHA-ARTE; sin desvío de ficha.
