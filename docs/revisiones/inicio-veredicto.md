# VEREDICTO revisor-visual — Inicio (app interna, /app)

## Ronda 1
Fecha: 2026-09-12 00:00
Screenshot: docs/revisiones/inicio-375.png
Usabilidad: 30/40
Craft: 13/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Carta del día] `animar={false}` en `CartaSacerdotisa` (page.tsx L72) apaga la ÚNICA animación firma documentada en FICHA-ARTE para esta pantalla ("la carta del día se revela con resplandor ámbar + ascenso y rotación") → quitar la prop / pasar `animar` (default true) para que la carta se revele al entrar a Inicio.
2. [Accesos rápidos, abajo] "Descifrar un chat" / "Hablar con mi coach" desbordan a 2 líneas en la grilla de 2 columnas angosta, el ícono no se repite en la segunda línea y el pill excede la altura fija h-[48px] fijada en AppButton → acortar copy ("Descifrar chat"/"Hablar con LUMA") o achicar texto/gap para que quepa en 1 línea a 375px.
3. [Bajo la carta] Cita "Escucha antes de responder." duplicada: una vez dentro de la carta (hardcodeada en HeroDemoLuma.tsx L52-54, ignora props) y otra vez en el párrafo itálico de abajo (page.tsx L73-75) — redundancia que el mockup aprobado (frame 3) no tiene → borrar el párrafo duplicado y pasar numero/nombre/cita como props reales a CartaSacerdotisa.
4. [Fila de ánimo] Tocar una emoción solo hace `setAnimo` local (page.tsx L18/67), sin toast/confirmación ni efecto real hacia el diario, pese a que el comentario del código dice que "cambia el diario" → agregar confirmación visible ("Guardado en tu diario ✓") al seleccionar.
5. [Header] Hamburguesa (☰) y avatar llevan al mismo destino `/app/mas`; el glifo de hamburguesa promete un menú desplegable que no existe → dejar un solo punto de entrada a "Más".

## Ronda 2 (re-revisión)
Fecha: 2026-09-12 00:00
Screenshot: docs/revisiones/inicio-375.png
Usabilidad: 32/40  (detalle: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:2 h9:3 h10:3)
Craft: 14/20  (detalle: jerarquía:3 profundidad:2 identidad:3 movimiento:3 encaje:3)
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Verificación de los 5 fixes de la ronda 1:
1. Animación firma de la carta — CORREGIDO y verificado. `disparo="montaje"` dispara `initial→animate` al montar (no depende de scroll), `animar` por defecto `true`, y `useReducedMotion()` sigue respetado. En el screenshot la carta se ve COMPLETA y nítida (no atenuada): pergamino, ilustración, cita, resplandor ámbar y sombra de contacto todos visibles al 100% de opacidad.
2. Botones "Descifrar un chat" / "Hablar con mi coach" — CORREGIDO. La variante `compact` de `AppButton.tsx` (12px, `min-h` en vez de `h` fija) hace que ambos textos entren en una sola línea en el screenshot a 375px; ya no desbordan el pill.
3. Cita duplicada — CORREGIDO. `CartaSacerdotisa` ahora recibe `numero/nombre/cita` como props reales desde `CARTA_DEL_DIA` (seed-datos) y el párrafo repetido bajo la carta fue eliminado; en el screenshot la cita aparece una sola vez, dentro de la carta.
4. Confirmación de ánimo guardado — CORREGIDO pero DÉBIL. `elegirAnimo` ahora togglea `guardado` y muestra "Guardado en tu diario ✓" con fade-out a 2.2s (AnimatePresence). Funciona, pero es un texto de 11px sin ícono en un contenedor de 16px de alto — para el momento más importante del loop de retención (confirma que el check-in "cambia el diario"), la señal es fácil de perder si el usuario no está mirando exactamente ahí en ese instante.
5. Hamburguesa duplicada — CORREGIDO. El header solo tiene wordmark "LUMA" + avatar (único punto de entrada a `/app/mas`), confirmado en código y en el screenshot: no hay glifo ☰.

Top defectos:
1. [Carta del día, centro de pantalla] La carta tiene sombra 3D + glow + esquinas redondeadas — visualmente parece tocable, pero no tiene `onClick`/`Link` propio (solo el texto "Abrir mi lectura de hoy →" de abajo navega) → envolver `CartaSacerdotisa` en el mismo `Link` que el texto, o hacer el bloque completo tappable (anti-patrón 11: todo elemento con apariencia interactiva debe hacer algo).
2. [Zona media, entre la fila de ánimo y la carta] Los blooms radiales de `body` (globals.css L76-78) están anclados arriba (`-6%` / `4%`) y no alcanzan el tercio medio/inferior de esta pantalla; esa franja se lee como un fill plano de maroon-cacao, rompiendo la promesa de "3 niveles, nunca fondo plano" fuera del propio halo de la carta → añadir un tercer bloom sutil más abajo (o extender el radio) para que el fondo mantenga profundidad en toda la altura visible.
3. [Debajo de la fila de ánimo] "Guardado en tu diario ✓" es la única confirmación de un gesto que alimenta el Diario, pero es texto plano de 11px sin ícono que se desvanece en 2.2s → agregar un check/ícono pequeño (o un chip con fondo tenue) para que el ojo lo capte sin tener que buscarlo.
4. [Toda la pantalla, verificado en código] Solo `CartaSacerdotisa` consulta `useReducedMotion()`; la entrada de la sección (`motion.div` en page.tsx L48-53) y los `whileTap` de `AppButton`/`AppLinkButton`/`MoodPicker` no lo respetan → envolver el árbol en un `MotionConfig reducedMotion="user"` a nivel de layout en vez de repetir el check componente por componente.
5. [Header, esquina superior derecha] El avatar es un círculo con degradé liso, sin inicial ni ícono — ahora que es el ÚNICO acceso a "Más"/cuenta, no comunica de un vistazo que es tappable/cuenta → agregar la inicial de la usuaria ("A") o un ícono sutil dentro del círculo.

## Ronda 3 (re-revisión)
Fecha: 2026-09-12 00:00
Screenshot: docs/revisiones/inicio-375.png
Usabilidad: 31/40  (detalle: h1:3 h2:3 h3:3 h4:4 h5:3 h6:3 h7:3 h8:3 h9:3 h10:3)
Craft: 16/20  (detalle: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3)
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Verificación de los 5 fixes de la ronda 2:
1. Carta tappable — CORREGIDO y verificado en código: `page.tsx` L93-96 envuelve `<CartaSacerdotisa>` y el texto "Abrir mi lectura de hoy →" en un único `<Link href="/app/tarot">`. Toda la zona de la carta (imagen + halo + texto) es ahora un solo objetivo de tap, sin área muerta.
2. Bloom local en la franja media — CORREGIDO, con matiz. `page.tsx` L38-45 agrega un radial-gradient de 480×320px centrado en `top-1/3` con `color-mix(...40%...)`. En el screenshot la zona media-baja (donde ya empieza a notarse el halo de la carta) SÍ tiene calidez y gradiente; pero la franja inmediatamente debajo de la fila de ánimo (los ~150-180px justo bajo las etiquetas "Bien/Normal/Ansiosa/Triste/Ilusión") sigue leyéndose casi plana porque el centro del gradiente está posicionado más abajo, cerca de la carta, no de la fila de ánimo. Mejora real, pero no resuelve el 100% del defecto original.
3. Chip "Guardado en tu diario" — CORREGIDO. `page.tsx` L77-90: ahora es un chip `rounded-full` con fondo `color-mix(...accent 16%...)`, el check al inicio del texto, animación de entrada `y:-4→0` vía `AnimatePresence`. Más visible que el texto plano de la ronda 2, aunque sigue siendo pequeño (11px) para el peso del momento (confirma el loop de retención hacia el Diario).
4. `prefers-reduced-motion` global — CORREGIDO de forma ejemplar. `app/layout.tsx` L34 envuelve `{children}` en `<MotionConfig reducedMotion="user">` a nivel raíz, afectando TODA la app (no solo Inicio) desde un único punto — arquitectónicamente superior a repetir `useReducedMotion()` componente por componente. Verificado en código; no hay forma de que una pantalla nueva "se olvide" de respetarlo.
5. Avatar con inicial — CORREGIDO y verificado en screenshot: el círculo superior derecho muestra la "A" de "Ana" con buen contraste sobre el degradé, comunicando de un vistazo que es tappable/cuenta.

No se detectaron regresiones de los defectos de las rondas 1 y 2.

Top defectos (restantes, ronda 3):
1. [Franja entre la fila de ánimo y el halo de la carta] El bloom local nuevo está centrado demasiado abajo (cerca de la carta) — la banda justo bajo las etiquetas de emoción sigue percibiéndose casi plana → subir el centro del gradiente (usar `top-1/4` en vez de `top-1/3`) y/o subir el mix a ~55-60% para que la profundidad arranque más cerca de la fila de ánimo, no solo cerca de la carta. Es una corrección de code de una línea, pero el efecto visual actual es sutil — al borde entre "bug" y "matiz de pulido".
2. [Chip "Guardado en tu diario ✓"] Ya es un chip con ícono y animación, pero sigue en 11px dentro de una franja fija de 28px — para el momento más importante del loop de retención, el peso visual es todavía discreto → si se sigue iterando, un tamaño de texto de 12-13px o una entrada tipo "pop" (spring en vez de solo fade+slide) lo reforzaría. Esto ya es matiz de pulido, no un bug.
3. [General — sin ubicación única] No se encontraron bugs funcionales nuevos: los 5 fixes de la ronda 2 están genuinamente resueltos en código y confirmados en el screenshot, sin regresiones. La brecha restante hasta 36/40 está repartida en heurísticas que ya puntúan "sólido" (3/4) en casi todos los criterios, sin ningún "1" o "2" que arrastre el promedio — cerrar esos ~5 puntos requiere subir varias heurísticas de 3 a 4 (ejemplar) simultáneamente, lo cual es trabajo de pulido fino y alto esfuerzo/retorno incierto, no la corrección de defectos puntuales.
4. [Bottom nav / accesos rápidos] Componente de navegación inferior no incluido en los archivos de esta revisión — no se pudo verificar en código. En el screenshot el ícono "Inicio" (activo) se ve con color completo y los demás (Coach/Tarot/Diario/Más) más apagados, lo cual es un patrón activo/inactivo razonable — si se continúa iterando, confirmar que los íconos inactivos mantienen la identidad de emoji-color de FICHA-ARTE y no quedaron desaturados por accidente.

Nota para la decisión de seguir o cerrar: los defectos concretos y accionables (bugs) de las rondas 1 y 2 están resueltos. Lo que queda para llegar al gate de 36/40 ya no son fallas que un usuario cualquiera note sin buscarlas (ancla "2"), sino ajustes que solo un ojo entrenado detecta (ancla "3", que es donde está casi toda la rúbrica ahora) — exactamente la frontera donde el sistema define "3 vs 4". El craft SÍ alcanzó el gate (16/20). Seguir iterando esta pantalla específica tiene retorno decreciente: el ítem #1 de arriba es la única corrección con relación esfuerzo/impacto clara; los ítems #2 y #3 son afinación de gusto. Decisión razonable: aplicar el fix #1 (una línea) si se quiere apurar el cierre, o cerrar con criterio propio documentando que la pantalla está funcionalmente sólida y visualmente coherente con FICHA-ARTE, aun sin alcanzar el 36/40 formal.

## Ronda 2026-11-09 (revisor independiente)
Fecha: 2026-11-09
Screenshot: docs/revisiones/inicio-375.png
Usabilidad: 27/40  (detalle: h1:3 h2:2 h3:3 h4:3 h5:3 h6:3 h7:3 h8:2 h9:2 h10:3)
Craft: 15/20  (detalle: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3)
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Verificaciones en código: h3/h7 leídos en page.tsx y MoodPicker.tsx; eje 4 leído en CartaGirando.tsx (reduced-motion: carta ya descubierta, bloom y flotación estáticos; MotionConfig global heredado de la ronda 3, no re-verificado). FICHA-ARTE: paleta vino/oro, Cormorant + Hanken, radios coinciden; sin desvío. No es clon de "Capítulo" ni "Umbral".

Gate de carga cognitiva: 1 falla (tres botones dorados idénticos compiten como primarios; además la carta es una segunda ruta al mismo destino que el botón grande). No llega a sobrecarga crítica (<4).

Defectos con severidad:
1. [ALTA · h9/h1] page.tsx L82: `if (error) return;` descarta en silencio el fallo al guardar el ánimo, y el chip «Guardado en tu diario» se enciende ANTES (L76) e incluso sin sesión (`!userId`). La app puede decir «guardado» cuando no se guardó: falsa confirmación en el momento central del loop de retención → mostrar el chip solo tras el insert correcto y, si falla, un mensaje «No pudimos guardar tu ánimo. Toca de nuevo» con reintento.
2. [ALTA · h8/EJE 1] Tres CTAs con el mismo relleno dorado y la misma sombra (Abrir mi lectura, Descifrar un chat, Hablar con mi coach) → no hay UNA acción primaria; la jerarquía la pierde el usuario que entrecierra los ojos. Degradar los dos accesos de abajo a secundario (borde oro tenue, fondo hundido, texto dorado) y dejar el relleno pleno solo en «Abrir mi lectura».
3. [MEDIA · h2] La carta del día muestra «THE FOOL.» impreso en inglés (escaneo RWS) en una UI 100 % español y sin el nombre «El Loco» en ningún lado visible; el aria-label lo lleva pero el ojo no. Añadir un rótulo en español bajo la carta («El Loco · tu carta de hoy») o recortar/tapar la franja del título inglés con el mismo marco.
4. [MEDIA · h8/h10] «TU PROGRESO · Ánimo bajo hace 30 días: 1 de 1. Esta semana: 0 de 1 · vas mejorando» es críptico: «1 de 1» sobre un solo registro no es un progreso, y «vas mejorando» se afirma con n=1 (promesa sin base, riesgo para la confianza). Exigir un mínimo (p. ej. ≥3 registros por ventana) antes de mostrar la cajita y redactar en lenguaje llano («Hace un mes, 1 de tus 1 registros fue de ánimo bajo; esta semana, ninguno»).
5. [BAJA · EJE 1/encaje] Titular «¿Cómo estás hoy?» a 20 px y saludo a 11 px: el título queda tímido frente a la carta y los 3 botones; el hueco vertical entre la cajita y la carta (≈120 px) frente a la carta pequeña y centrada deja aire flotante. Subir el título a ~24 px y dar a la carta algo más de altura útil (usar ese hueco).

Observaciones sin penalizar fuerte: la carta flotante/giro con resplandor es un dispositivo ownable sólido; la imagen RWS amarilla satura frente al vino pero funciona como foco. Estados no observables (offline, skeleton de carga de progreso) no verificados; el mood no tiene deshacer explícito más allá de volver a tocar.

Qué falta para pasar el gate (≥36/40 y ≥16/20): arreglar 1 y 2 (suben h9 a 3 y h8 a 3, +2), 3 (h2 a 3, +1), 4 (h10/h8 pulido, +1) da ≈31/40; para llegar a 36 hace falta además subir varias heurísticas a 4 (feedback de guardado con estado de carga/error real, undo del ánimo, atajos). Craft necesita +1: jerarquía a 4 (títulos y cta primaria nítida) con los fixes 2 y 5.

Veredicto: NO LISTA

## Ronda 2026-11-09 b (revisor independiente)
Fecha: 2026-11-09
Screenshot: docs/revisiones/inicio-375.png (+ docs/revisiones/inicio-error-guardado-375.png)
Usabilidad: 30/40  (detalle: h1:3 h2:3 h3:3 h4:3 h5:2 h6:3 h7:3 h8:3 h9:3 h10:3)
Craft: 15/20  (detalle: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3)
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A

Verificación de los fixes de la ronda anterior (screenshot + código):
- Falsa confirmación de guardado: CORREGIDO en código (page.tsx L87-114: sin `userId` no se promete nada; el chip «Guardado» solo tras insert sin error; fallo o excepción muestra «No pudimos guardar tu ánimo. Toca de nuevo.» con role="alert"). Ver defecto 1 sobre cómo se ve.
- Una sola acción primaria: CORREGIDO. «Abrir mi lectura de tarot hoy» es el único relleno dorado; «Descifrar un chat» y «Hablar con mi coach» pasan a borde dorado con fondo tenue. Jerarquía nítida en el screenshot.
- Cajita «Tu progreso»: CORREGIDO. Exige ≥3 registros por ventana (MIN_REGISTROS) y el texto es llano («Hace un mes marcaste ánimo bajo 2 de 3 días; esta semana, 1 de 3 · vas mejorando»). Queda pequeña (ver defecto 3).
- Título 24px / saludo 12px: aplicado; el título ya sostiene la jerarquía frente a la carta.
- Nombre en inglés de la carta («THE MAGICIAN.»): decisión de la dueña de carta decorativa, sin nombre en español; no se penaliza como defecto, solo se anota como inglés impreso en la imagen (h2 queda en 3, no 4).
- FICHA-ARTE: vino/oro, Cormorant Garamond + Hanken Grotesk, radios, borde dorado en cajitas: coinciden. No es clon de «Capítulo» ni «Umbral».

Gate de carga cognitiva: 0 fallas relevantes (1 acción primaria, 2 secundarias, 5 emociones, cajita de 2 líneas). Solo observación: la carta y el botón grande llevan al mismo destino (redundancia aceptable).

Defectos con severidad:
1. [MEDIA · h9/h1] Estado de error (inicio-error-guardado-375.png): el mensaje bajo los emojis se ve casi invisible, rojo oscuro sobre vino, sin la píldora de fondo reconocible; el screenshot no demuestra un error legible (posible captura a mitad del fade-in, pero entonces el estado no está evidenciado). Además el ánimo «Ansiedad» queda resaltado como si estuviera guardado, y el aviso se apaga solo a los 3,6 s → repetir la captura con el mensaje a opacidad plena y contraste ≥4.5:1 (hoy `--an-risk` 12px sobre fondo del 16%), y al fallar quitar la selección o marcarla como «sin guardar».
2. [MEDIA · h5/h1] elegirAnimo (page.tsx L87-114) no tiene estado «guardando» ni bloqueo de doble toque: cada toque inserta una fila nueva en `checkins` (un doble tap o cambiar de idea duplica registros que alteran racha y «tu progreso») y no hay feedback durante la espera → deshabilitar el picker mientras dura el insert (o actualizar el registro del día en vez de insertar) y mostrar un estado «Guardando…».
3. [MEDIA · h8/h10] La cajita «Tu progreso» tiene texto de 11,5 px y el mismo borde dorado que los dos botones secundarios, por lo que parece tocable y no hace nada (regla UX 11); la frase mezcla dos ventanas y es densa para 2 líneas → texto ≥13 px o sin borde de botón (solo fondo hundido) y frase más corta («Esta semana 1 de 3 días con ánimo bajo; hace un mes eran 2 de 3»).
4. [BAJA · eje 4] Movimiento incompleto frente a las 7 baseline: una sola entrada fade+8px sin stagger entre bloques, sin whileTap visible (solo `transition-transform` sin `active:scale`), y sin celebración al marcar el ánimo → stagger de 60-80 ms en saludo/emojis/cajita/botones y `active:scale-[0.97]` en los tres botones.
5. [BAJA · eje 1] Demasiados tamaños de texto en pantalla (24, 16, 14, 12, 11.5, 11) frente al máximo de 3; saludo 12px y racha 11px quedan muy pequeños → unificar labels en 12-13px.

Observaciones sin penalizar: carta flotante con giro, resplandor y borde dorado es dispositivo ownable sólido y mantiene su tamaño; reduced-motion se respeta (carta ya descubierta); el hueco entre cajita y carta se ve equilibrado ahora. No verificados: offline y skeleton de carga de la cajita; undo del ánimo no existe (se puede volver a elegir).

Qué falta para pasar el gate (≥36/40 y ≥16/20): faltan 6 puntos de usabilidad y 1 de craft. Camino realista: (a) estado «guardando» + bloqueo de doble toque + error legible con reintento claro (h1 a 4, h5 a 3, h9 a 4 = +3); (b) cajita sin apariencia de botón y texto ≥13 px (h8 a 4 posible, h10 a 4 con ayuda contextual sobre qué cuenta como «ánimo bajo» = +2); (c) deshacer/cambiar el ánimo del día sin duplicar (h3 a 4 = +1); y para craft, stagger + tap scale + celebración mínima en el guardado (movimiento a 4 = +1). Sin esos cambios la pantalla es sólida pero no llega al umbral.

Veredicto: NO LISTA
