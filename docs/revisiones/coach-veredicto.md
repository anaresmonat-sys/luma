# VEREDICTO revisor-visual — Coach
Fecha: 2026-09-12 00:00
Screenshot: docs/revisiones/coach-375.png
Usabilidad: 28/40
Craft: 13/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Centro de la pantalla, entre header y primera burbuja] Vacío muerto: más del 50% del viewport queda en blanco porque el hilo usa `justify-end` con solo 3 mensajes de semilla (HILO_COACH_EJEMPLO) → agregar 4-6 mensajes más de historia al seed para que el hilo llene el viewport de forma natural, o arrancar desde arriba (justify-start) cuando el hilo es corto.
2. [Burbujas de chat + input del composer] Texto a 13px en burbujas de usuario/LUMA y en el input — viola el mínimo de lectura del propio sistema (body ≥14px; 11-13px solo para labels/captions) → subir a 14px el texto de burbujas e input.
3. [Respuestas rápidas, botón de mic, botón de enviar] Cero `whileTap` / feedback táctil en los tres controles interactivos del composer y las sugerencias → falla la baseline de movimiento "tap <150ms responde" → agregar `motion.button` con `whileTap={{ scale: 0.97 }}`.
4. [Hilo de mensajes] Los mensajes nuevos (usuario y LUMA) aparecen sin animación de entrada, mientras el indicador "LUMA está escribiendo…" sí tiene fade → inconsistencia de movimiento dentro de la misma pantalla → envolver cada burbuja nueva en `motion.div` (opacity/y) igual que el indicador de escritura.
5. [Composer] No existe ningún camino de error visible (ni siquiera simulado) para un envío fallido — heurística 9 sin verificar en código: no hay mensaje "no se pudo enviar, intenta de nuevo" ni retry → dejar el estado de error listo aunque el envío sea simulado, para no llegar a Sesión 6 sin el patrón definido.

---

# VEREDICTO revisor-visual — Coach (2ª ronda)
Fecha: 2026-09-12 00:00
Screenshot: docs/revisiones/coach-375.png
Usabilidad: 28/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Verificación de los 5 defectos de la 1ª ronda:
1. Vacío muerto → CORREGIDO. El hilo (5 mensajes) llena el viewport de forma natural, sin hueco muerto visible en el screenshot.
2. Texto 13px → CORREGIDO. Burbujas e input confirmados a `text-[14px]` en el código (líneas 70, 81, 155).
3. Cero `whileTap` → CORREGIDO. Quick replies, mic y enviar son `motion.button` con `whileTap` (líneas 105-113, 141-149, 157-167).
4. Animación de entrada inconsistente → PARCIALMENTE CORREGIDO, con un bug nuevo: cada burbuja está envuelta en `motion.div` dentro de `AnimatePresence`, pero ese `AnimatePresence` tiene `initial={false}` (línea 62) — esta prop hace que Framer/Motion **omita** la animación de entrada para los elementos que ya existen al montar el componente. Efecto real: los 5 mensajes semilla aparecen SIN animar (igual que antes del fix), y solo los mensajes agregados después de una interacción (enviar / respuesta de LUMA) animan de verdad. El fix solo cubre la mitad del caso que reportó la 1ª ronda.
5. Sin camino de error → NO SE TOCÓ (confirmado, decisión documentada de dejarlo para Sesión 6). Heurística 9 sigue en el mínimo.

USABILIDAD: 28/40 (detalle: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:1 h10:3)
- h9 (errores claros con solución) sigue anclado en 1: cero implementación de un estado de fallo de envío, ni siquiera simulado — es el único hueco que impide que el resto de heurísticas (todas en 3, ninguna en 4) empujen el total sobre el gate de 36.
- Ningún heurístico llega a 4: la pantalla es sólida y correcta pero no ejemplar en ningún eje (gate cognitivo pasa limpio: 3 respuestas rápidas, 1 acción primaria, nada que memorizar entre pantallas).

CRAFT: 14/20 (detalle: jerarquía:3 profundidad:3 identidad:3 movimiento:2 encaje:3)
- Movimiento baja a 2 por el bug de `initial={false}` descrito arriba: la baseline no-negociable "stagger/entrada de pantalla" (DESIGN-CORE, animación baseline #1) no se cumple en la carga inicial de esta pantalla — el código lo confirma, no es apreciación visual. El resto de baselines aplicables (tap <150ms) sí están cubiertas.
- Jerarquía/profundidad/identidad se mantienen sólidas: fondo con blooms radiales (heredados del `body` global, no solo un fill plano), burbujas con borde dorado consistente con el resto de la app, avatar de LUMA, paleta Terciopelo & Oro sin cruzarse con las combinaciones vetadas del test anti-clon (Capítulo / Umbral).

FIDELIDAD: N/A (sin imagen de referencia externa para esta pantalla puntual; la ficha de arte es el contrato y se respeta: bordes dorados, radios 14-16px, Cormorant/Hanken, paleta vino-cacao-oro).

TOP DEFECTOS (2ª ronda):
1. [Hilo de mensajes, `AnimatePresence` en page.tsx línea 62] `initial={false}` anula la animación de entrada de los 5 mensajes semilla — el fix del defecto #4 de la 1ª ronda solo cubre mensajes agregados después de montar la pantalla, no la carga inicial → quitar `initial={false}` (o animar el bloque con un contenedor padre y `staggerChildren` en el montaje) para que las burbujas semilla entren igual que las nuevas.
2. [Composer, heurística 9] Sigue sin existir ningún camino de error simulado para un envío fallido (decisión documentada de diferir a Sesión 6, pero el hueco de rúbrica se mantiene) → agregar un estado de error simulado con copy "No se pudo enviar. Intenta de nuevo" + reintento antes de dar la pantalla por cerrada.
3. [Pills de respuestas rápidas] Texto a 11.5px — por debajo del mínimo de 14px para texto interactivo/CTA (el sistema solo exime labels/captions a 11-13px, y estos son CTAs de texto, no etiquetas) → subir a 12-13px como piso, o documentar explícitamente la excepción como "chip" en el sistema de componentes.
4. [Botón de enviar y botón de mic, composer] Área táctil de 44×44px (`size-11`) — por debajo de los 48px que pide el estándar de CTA vivo para el control más usado de la pantalla → subir ambos a `size-12` (48px).
5. [Header] El único indicio del alcance del coach es el subtítulo a 11px "tu tarotista y coach" — sin un primer mensaje de bienvenida algo más explícito sobre para qué sirve el chat, heurística 10 pasa raspando gracias solo a los quick replies (prioridad baja, solo si sobra tiempo).

Nota sobre el gate: NO es zona de rendimientos decrecientes todavía — hay 2 defectos concretos y accionables en código (el bug de `initial={false}` que invalida la mitad del fix de animación, y la heurística 9 completamente vacía) que por sí solos explican por qué el total no sube pese a que 3 de los 5 defectos originales sí quedaron resueltos de verdad. Corregir esos 2 puntualmente (sin tocar el resto) debería mover la aguja de forma medible; recién si tras esa ronda el total se estanca de nuevo alrededor de 30-32 correspondería declarar rendimientos decrecientes con criterio propio, como se hizo en landing/onboarding.

---

# VEREDICTO revisor-visual — Coach (3ª ronda)
Fecha: 2026-09-12 00:00
Screenshot: docs/revisiones/coach-375.png
Usabilidad: 31/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Detalle usabilidad: h1:3 h2:4 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:3 h10:3
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3

Verificación de los 5 defectos de la 2ª ronda:
1. `initial={false}` anulaba la entrada de los 5 mensajes semilla → CORREGIDO, verificado en código. La prop fue eliminada del `<AnimatePresence>` que envuelve el `.map(hilo)` (línea 89); cada burbuja conserva `transition={{ duration: 0.2, delay: i * 0.05 }}` (líneas 96 y 107), y con `initial` en su valor por defecto (`true`), AnimatePresence SÍ anima los elementos presentes al montar. El screenshot es un frame estático posterior a la animación (no se puede fotografiar el stagger en curso), pero el código confirma que ya no hay ninguna prop que lo desactive — el bug de raíz (la mitad del fix de la ronda anterior que quedaba sin cubrir) está resuelto.
2. Sin camino de error → CORREGIDO. Bloque `error` (líneas 116-130): burbuja con borde/fondo en el tono de riesgo (`--an-risk`), copy "No se pudo enviar." + botón "Reintentar" que llama a `reintentar()` (líneas 53-69), la cual reenvía el ÚLTIMO mensaje del usuario sin duplicar la burbuja original. El disparo es una probabilidad simulada del 15% tras enviar (líneas 34-40) — explícito en el comentario como solución temporal mientras no hay backend real. Heurística 9 pasa de "ausente" a "presente y funcional".
3. Pills a 11.5px → CORREGIDO. `text-[12.5px]` confirmado en el código (línea 153), dentro del rango 11-13px que el propio sistema permite para labels/chips (no para cuerpo de lectura). Se acepta como chip, no como texto de lectura larga.
4. Botones de mic/enviar a 44px → CORREGIDO. Ambos son `size-12` (48px) — mic en línea 189, enviar en línea 205 — confirmado en código y visualmente coherentes en el screenshot (círculos dorados/tenues de tamaño idéntico, alineados con el input).
5. Header con poco contexto → NO SE TOCÓ (documentado como prioridad baja desde la 2ª ronda). Sigue igual.

No se detectaron regresiones de los defectos de las rondas 1 y 2.

TOP DEFECTOS (3ª ronda):
1. [Fondo, franja inferior ~35-40% de la pantalla — quick replies, composer, nav] Los únicos blooms del fondo están definidos a nivel global (`app/globals.css` líneas 76-78) y ANCLADOS cerca del borde superior del viewport (`-6%` y `4%` desde arriba, radio ~420-460px, `background-attachment: fixed`) — en una pantalla con contenido que llena el viewport como Coach, esa franja inferior (donde viven las 3 pills, el composer y la nav) queda fuera del alcance de ambos radiales y se percibe como un fill casi plano, el mismo patrón de "profundidad incompleta" ya señalado y corregido en Inicio (ronda 2) y Descifra (rondas 1-4) → replicar aquí el mismo fix: un tercer bloom anclado cerca del borde inferior real del contenedor, con unidad relativa (`dvh`) en vez de `px` fijos.
2. [Header] Sigue sin dar contexto sobre el alcance del chat más allá del subtítulo "tu tarotista y coach" (11px) — 3 rondas sin tocarse, prioridad baja documentada desde la 2ª ronda → si se retoma, un primer mensaje o chip que aclare de qué puede hablarse con LUMA (relaciones, ansiedad, límites) subiría h10 de 3 a un margen más cómodo.
3. [Burbuja de error, copy] "No se pudo enviar." cumple el mínimo de la heurística 9 (qué pasó) pero no da ninguna pista de causa (¿sin conexión? ¿error del servidor?) antes del botón "Reintentar" — funcional pero no ejemplar → sumar una razón breve ("parece que se cortó la conexión") acercaría esta heurística a un 4.
4. [Composer, heurística 7] El único "atajo" es que Enter envía por comportamiento nativo del `<form>` — no hay pista visual de que existe, ni atajos adicionales (editar/reenviar el último mensaje con una tecla) — se mantiene en el piso funcional de "3", sin pulir hacia "4".
5. [General] No se detectaron bugs nuevos ni regresiones: los 2 defectos concretos de la 2ª ronda (bug de animación, ausencia de heurística 9) están genuinamente resueltos y verificados en código. Lo que queda repartido entre los puntos 1-4 de arriba ya no son roturas que un usuario note de inmediato, sino matices — se acerca a zona de rendimientos decrecientes pero el punto #1 (cobertura del fondo) sigue siendo un defecto concreto y accionable (una medida de CSS), no gusto puro.

Lectura de la brecha (¿bugs concretos o zona de pulido de rendimientos decrecientes?):
Los 2 defectos reales de la 2ª ronda (el bug de `initial={false}` y la heurística 9 vacía) están corregidos de forma verificable en código, sin regresiones — son la razón principal del salto de usabilidad (28→31) y craft (14→15). Lo que queda ya no es del mismo calibre: el punto #1 (cobertura del bloom en la franja inferior) es el único con relación esfuerzo/impacto clara y es EXACTAMENTE el mismo patrón que tomó 2-4 rondas resolver en Inicio y Descifra — vale la pena una 4ª ronda dirigida solo a ese punto antes de considerar el cierre por criterio propio, porque moverlo probablemente cruce el gate de craft (15→16) igual que ocurrió en las pantallas hermanas. Los puntos #2-#4 son de impacto menor/disperso (contexto de header, causa del error, descubribilidad de un atajo) y son candidatos razonables para cerrar como deuda de pulido conocida en ESTADO.md si una 4ª ronda dirigida al bloom no mueve la aguja de forma clara — todavía no es momento de invocar criterio propio: la pantalla está a solo 1 punto del gate de craft y a 5 del de usabilidad, con un fix conocido y de bajo costo pendiente.

---

# VEREDICTO revisor-visual — Coach (4ª ronda)
Fecha: 2026-09-13 00:00
Screenshot: docs/revisiones/coach-375.png
Usabilidad: 31/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Detalle usabilidad: h1:3 h2:4 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:3 h10:3
Detalle craft: jerarquía:3 profundidad:4 identidad:3 movimiento:3 encaje:3

Verificación del único defecto dirigido de la 3ª ronda:
1. Cobertura del fondo en la franja inferior → CORREGIDO, verificado en código y en screenshot. Se agregó un bloom LOCAL (page.tsx líneas 73-81, `-z-10`, `pointer-events-none`) con 2 radiales propios de esta pantalla — uno anclado arriba (`50% 22%`, `36dvh`) y uno anclado exactamente al borde inferior real del contenedor (`50% 96%`, `40dvh`, mezcla 46% de `--bloom-vino`) — mismo patrón (`color-mix` + unidades `dvh`, no px fijos) que ya usan Inicio/Tarot/Diario/Descifra, confirmado por grep cruzado contra esos 4 archivos. A diferencia de Tarot/Diario (que necesitaron un TERCER radial intermedio porque su contenido deja huecos de fondo visibles a media pantalla), en Coach el tramo medio está casi enteramente ocupado por burbujas de chat opacas — el único tramo de fondo realmente expuesto es exactamente la franja que el segundo radial (anclado a 96%) cubre: quick replies, composer y el aire justo antes del nav. En el screenshot esa franja se ve con calidez visible (tono vino, no un corte a fill plano), consistente con el resto de la pantalla. No queda un "valle" perceptible porque, a diferencia de las pantallas hermanas, aquí no hay una franja intermedia vacía de contenido que también necesite cobertura — resuelve la causa raíz sin necesitar un tercer radial. Profundidad sube de 3 a 4.

No se detectaron regresiones: el overlay es puramente decorativo (`pointer-events-none`, `-z-10`), no toca el layout, el scroll ni ningún handler; los 4 fixes ya verificados en la 2ª-3ª ronda (animación de entrada, estado de error, tamaños de pills/botones) siguen intactos en el código actual.

TOP DEFECTOS (4ª ronda) — remanentes, ninguno tocado esta ronda:
1. [Composer, accesibilidad de lectores de pantalla — verificado en código, sin `aria-live`/`aria-busy` en todo el archivo] Ni el indicador "LUMA está escribiendo…" (línea 149) ni la burbuja de error (línea 133) están dentro de una región `aria-live`, y el estado "escribiendo" no marca `aria-busy` en ningún contenedor — un usuario de lector de pantalla no recibe ningún anuncio de que LUMA está respondiendo o de que el envío falló, aunque visualmente el feedback esté completo (mismo tipo de hueco que se corrigió en Descifra en su 5ª ronda) → envolver el bloque de mensajes en `role="log" aria-live="polite"`, o al menos anunciar "escribiendo…" y el error con un `<span className="sr-only" aria-live="polite">`.
2. [Header] Sigue sin dar contexto sobre el alcance del chat más allá del subtítulo "tu tarotista y coach" — 4 rondas sin tocarse, documentado como prioridad baja desde la 2ª ronda → sin cambios, mismo fix sugerido (un primer mensaje o chip que aclare los temas: relaciones, ansiedad, límites).
3. [Burbuja de error, copy] "No se pudo enviar." sigue sin dar ninguna pista de causa antes de "Reintentar" — sin cambios desde la 3ª ronda → sumar una razón breve ("parece que se cortó la conexión").
4. [Composer, heurística 7] Sin atajo visible más allá de Enter nativo del formulario — sin cambios desde la 3ª ronda.
5. [General] No se detectaron bugs nuevos: el único punto dirigido de esta ronda (cobertura del bloom) quedó genuinamente resuelto sin introducir regresiones. Lo que queda repartido entre los puntos 1-4 son matices dispersos (uno de accesibilidad técnica real, verificable en código; tres de pulido documentados desde hace 2-3 rondas) — ninguno es "gusto puro", pero ninguno es tampoco una rotura que un usuario promedio note sin buscarla.

Lectura de la brecha (¿bugs concretos o zona de rendimientos decrecientes — cerrar con criterio propio?):
El defecto dirigido de la 3ª ronda (cobertura del bloom en la franja inferior) quedó corregido de forma verificable, sin regresiones, y cruzó el gate de craft (15→16/20). Usabilidad se mantiene en 31/40 porque, tal como se advirtió en la ronda anterior, esta ronda fue exclusivamente de CRAFT (fondo) y no tocó ninguna heurística Nielsen — el resultado es exactamente el proyectado. Con esto, Coach llega al mismo punto donde ya cerraron Inicio (31/40 · 16/20, ronda 3) y Descifra (31/40 · 18/20, ronda 4): craft sólido y por encima de su gate, usabilidad funcionalmente completa (feedback en toda acción >100ms, 1 acción primaria, error con solución y reintento real, controles ≥48px, sin jerga, nada que memorizar entre pantallas) pero 5 puntos por debajo de 36 porque 8 de las 10 heurísticas están empatadas en el peldaño "3" (sólido, solo un ojo entrenado afina) sin ningún "1" o "2" que arrastre el promedio. Los 4 puntos remanentes están dispersos en 3-4 heurísticas distintas (accesibilidad de lector de pantalla, contexto de header, causa del error, descubribilidad de atajo), cada uno de impacto individual de ~0.5-1 punto — para cruzar 36/40 haría falta resolver los 4 simultáneamente y que cada uno sume un punto completo, algo que el patrón de las 3 rondas anteriores de esta misma pantalla (y el de Inicio/Descifra) muestra que no ocurre: los saltos de usabilidad ya vienen en incrementos de +0 a +3 por ronda, nunca el salto de +5 que haría falta de una sola vez.
Recomendación: esta pantalla ya cumple el patrón de cierre por criterio propio aplicado a landing/onboarding/paywall/inicio/descifra. De los 4 puntos remanentes, el único con lectura binaria real (no de gusto) es el #1 (aria-live/aria-busy) — si se hace una 5ª ronda, que sea EXCLUSIVAMENTE ese fix, igual que se hizo en Descifra. Los puntos #2-#4 son candidatos legítimos para cerrar como deuda de pulido conocida en ESTADO.md en vez de perseguir el gate numérico indefinidamente.
