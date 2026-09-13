# VEREDICTO revisor-visual — Tarot

## RONDA 1 — 2026-09-12 00:00
Screenshot: docs/revisiones/tarot-375.png (+ docs/revisiones/tarot-abierta-375.png, tirada "Amor" expandida)
Usabilidad: 25/40
Craft: 11/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Pantalla cerrada, mitad inferior] Zona completamente plana sin bloom ni contenido (≈40% del viewport, entre la última fila "Carta del día" y el nav) — Inicio.tsx ya resolvió este mismo defecto de profundidad con un bloom local (línea 35-45, comentario "defecto de profundidad, revisor ronda 2"); Tarot no lo tiene. Fix: agregar bloom radial local en la mitad inferior + distribuir el contenido con más aire/justify, igual que Inicio.
2. [Panel expandido → botón "Guardar en mi diario"] El botón (AppLinkButton → `<Link href="/app/diario">`) NO guarda nada: navega al tab Diario, que abre con el textarea vacío (placeholder genérico no relacionado) y sin ninguna confirmación. El usuario no tiene forma de saber si su lectura se guardó — la promesa del copy ("Guardar") es falsa. Fix: pasar la lectura por query param/estado y prellenar el textarea del Diario, o al menos mostrar una confirmación real antes/después de navegar.
3. [Cada fila de tirada, lista completa] El `<button>` que expande/colapsa (page.tsx líneas 31-54) no tiene `whileTap` ni ningún highlight de presión — a diferencia de MoodPicker (`whileTap scale 0.92`), AppButton y AppLinkButton (`whileTap scale 0.97`) que sí lo tienen en toda la app. Al tocar una fila no hay respuesta inmediata antes de que el panel abra en 300ms; se siente "muerta" un instante. Fix: envolver la fila en `motion.button`/`motion.div` con `whileTap={{ scale: 0.98 }}` o un fondo de presión.
4. [Lista completa, montaje de la pantalla] Las 5 filas aparecen de golpe sin stagger de entrada, rompiendo la firma de movimiento que sí tiene Inicio (motion.div con fade+y al montar). Fix: aplicar stagger 50-80ms a las filas al montar la pantalla.
5. [Tiradas inferiores, ej. "Carta del día"] Al expandir una fila cercana al final de la lista, el panel (carta + lectura + CTA) se abre fuera del viewport sin auto-scroll — el usuario no percibe que pasó algo hasta que baja manualmente. Fix: `scrollIntoView({behavior:'smooth', block:'nearest'})` sobre el panel recién abierto (respetando prefers-reduced-motion, ya cubierto por MotionConfig global).

Notas menores (no bloqueantes):
- Las miniaturas de carta en la lista son un rectángulo beige liso sin glifo — coincide exactamente con el mockup aprobado (`.tth` vacío en vista-previa-app.html línea 141), no se penaliza.
- Las 5 lecturas reutilizan el mismo glifo ilustrado de "La Sacerdotisa" (numero/nombre/cita sí cambian por tirada) — simplificación de V1 documentada, no se penaliza como defecto grave.

---

## RONDA 2 (RE-REVISIÓN) — 2026-09-12 00:00
Screenshot: docs/revisiones/tarot-375.png (+ docs/revisiones/tarot-abierta-375.png, tirada "Amor" expandida)
Usabilidad: 29/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:4 h7:2 h8:2 h9:3 h10:3
Detalle craft: jerarquía:3 profundidad:2 identidad:3 movimiento:3 encaje:3

Verificación de los 5 defectos de la ronda 1:
1. Bloom local de 2 radiales (líneas 38-46) — CORREGIDO parcialmente: el patrón de código es correcto e idéntico al de Inicio/Descifrar/Diario, pero la lista de 5 filas termina alrededor del 65% del alto y el radial inferior (34dvh anclado a 100%) no alcanza a cubrir el tramo medio — sigue viéndose una franja plana notable antes del nav (ver defecto #1 de esta ronda). Mejora real, no resuelve el síntoma visible al 100%.
2. Puente `lib/almacenamiento-diario.ts` — CORREGIDO: `guardarEntradaPendiente()` se llama sincrónicamente en el onClick del Link (antes de navegar, localStorage.setItem es síncrono), el Diario lee y limpia la clave en su `useEffect` de montaje y prellena el textarea. La lectura ya NO se pierde. Queda un matiz de comunicación, ver defecto #2 de esta ronda.
3. `whileTap={{scale:0.98}}` en las filas — CORREGIDO: confirmado en el código (línea 60), fila ahora es `motion.button`.
4. Stagger de entrada — CORREGIDO: `variants` con `staggerChildren: 0.06` envolviendo la lista (líneas 15-22, 52).
5. Auto-scroll al abrir panel — CORREGIDO: `scrollIntoView({behavior:'smooth', block:'center'})` con delay de 320ms sobre `panelRef` (líneas 26-33); visualmente confirmado en el screenshot "abierta" (el panel de Amor queda centrado en el viewport).

Diagnóstico: progreso real y verificable en los 5 puntos señalados, sin bugs nuevos introducidos por los cambios. Lo que mantiene la pantalla por debajo del gate no son los defectos originales (4 de 5 cerrados, 1 parcial) sino ejes que la ronda 1 no había llegado a explorar en profundidad (vacío remanente en la mitad inferior, matiz de comunicación del puente al Diario, y heurísticas de fondo — flexibilidad y estética — que ya venían bajas y no fueron tocadas en esta ronda de fixes). No es estancamiento ni rendimiento decreciente: es una segunda capa de pulido pendiente.

TOP DEFECTOS (ronda 2):
1. [Pantalla cerrada, franja ≈y:1010-1490px de 1567px totales, ~30% del alto] El bloom de 2 radiales está bien implementado en código pero la lista de 5 filas termina temprano y el radial inferior (480px·34dvh anclado a 100%) es demasiado corto para cubrir el tramo medio — queda una franja visiblemente más plana que el resto de la pantalla, justo antes del nav. Fix: aumentar el alcance/opacidad del radial inferior para que se funda con el del centro, o repartir las 5 filas con más padding vertical/justify para que ocupen el alto real del viewport.
2. ["Guardar en mi diario" → Diario, primer instante tras navegar] El textarea llega prellenado pero sin ningún aviso ("Trajimos tu lectura del Tarot" o similar) — el usuario no distingue si eso ya se guardó o si es solo un borrador, y debe volver a tocar el mismo verbo "Guardar" en la pantalla siguiente. Riesgo de que crea que ya guardó y abandone sin confirmar. Fix: mostrar un aviso breve (mismo patrón que el banner "aviso" ya usado en Diario) al detectar texto pendiente: "Trajimos tu lectura, tócala para editarla y guarda cuando quieras".
3. [Fila de tirada, miniatura de carta, todas las filas] Radio de 7px (línea 68, `rounded-[7px]`) no pertenece a la familia de radios de la ficha (14-16px cards, 14px botones) — se ve más angulosa que el resto de superficies redondeadas de la pantalla (panel expandido, CTA, carta flotante). Fix: subir a 10-12px para acercarla a la familia sin perder la lectura de "carta angosta".
4. [Heurística 7 — código] Sin verificación de ningún atajo/default más allá del tap — no hay recordatorio de última tirada consultada ni pre-selección inteligente. No bloquea por sí sola pero sigue siendo la heurística más floja de la pantalla; queda pendiente para una ronda de pulido, no urgente.
5. [Heurística 8 / Eje profundidad — pantalla cerrada en conjunto] Consecuencia directa del defecto #1: con ~30% del viewport bajo en contenido y en variación tonal, la pantalla cerrada se percibe menos "llena de valor" que Inicio/Diario. Fix: mismo que #1, o sumar una pieza de valor (ej. una franja "Tu última tirada" o un tip corto) en la zona baja en vez de dejarla decorativa.

Notas menores (no bloqueantes, heredadas de ronda 1, siguen sin penalizar):
- Miniaturas de carta lisas sin glifo — coincide con el mockup aprobado.
- Las 5 lecturas reutilizan el mismo glifo ilustrado de "La Sacerdotisa" — simplificación de V1 documentada.

---

## RONDA 3 (RE-REVISIÓN) — 2026-09-12
Screenshot: docs/revisiones/tarot-375.png (+ docs/revisiones/tarot-abierta-375.png, tirada "Amor" expandida)
Usabilidad: 30/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:4 h7:2 h8:3 h9:3 h10:3
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3

Verificación de los 3 defectos de la ronda 2:
1. Bloom inferior ampliado (52%/42dvh arriba, 50%/46dvh abajo anclado a 50% 96%) + `py-4` en cada fila (línea 64) — MEJORADO Y VERIFICADO en código y en screenshot: la franja baja ya no se ve como un corte plano, el calor del gradiente llega más cerca del nav y las filas ocupan más alto real. Sigue existiendo una banda (~y 1050-1300 de 1567) perceptiblemente más apagada que el tercio superior, pero ya no es un "corte" — es gradual. Diagnóstico: esto ya es zona de rendimientos decrecientes para un ajuste de GRADIENTE; seguir subiendo opacidad/alcance no va a cerrar el hueco de raíz porque el problema de fondo (solo 5 filas de contenido real) sigue igual. La siguiente mejora real es de CONTENIDO, no de degradado — ver defecto #1 de esta ronda.
2. Banner "Trajimos tu lectura de tarot — edítala y guarda cuando quieras" — CORREGIDO Y VERIFICADO EN CÓDIGO (`app/app/(tabs)/diario/page.tsx` líneas 31-40 y 105-112): `leerYLimpiarEntradaPendiente()` se lee en `useEffect` al montar, setea `trajoLectura=true`, y el banner (`rounded-full`, acento, texto exacto citado arriba) se renderiza condicionalmente antes del textarea ya prellenado. Cierra el hueco de comunicación señalado en ronda 2: el usuario ahora entiende que es un borrador para editar, no algo ya guardado. Sin efectos secundarios negativos detectados (el botón "Guardar" de Diario sigue validando texto vacío con `errorVacio`, independiente de este flujo).
3. `rounded-[7px]` → `rounded-[12px]` (línea 68) — CORREGIDO Y VERIFICADO en código. Se acerca a la familia de radios de la ficha (14-16px cards) sin quedar idéntico; a simple vista ya no rompe la lectura de la pantalla — solo un ojo entrenado nota el faltante de 2-4px contra el resto de superficies redondeadas (panel, CTA, carta flotante).

Diagnóstico general: los 3 defectos puntuales de la ronda 2 están cerrados o en el límite superior de lo que un ajuste de ese tipo puede dar (2 y 3 cerrados sin matices; 1 mejorado pero con techo alcanzado). No hay bugs nuevos introducidos por los cambios. Lo que sigue reteniendo la pantalla debajo del gate (36/40 y 16/20) no son ya estos 3 puntos sino heurísticas de fondo que ninguna de las 3 rondas tocó: h7 (flexibilidad/atajos) sigue en 2/4 sin ningún default ni recuerdo de la última tirada, y la sensación de "pantalla llena de valor" (h8/profundidad) sigue tope en 3 porque el hueco es de contenido, no de estilo. Para cerrar el gate hace falta una intervención estructural (agregar una pieza de valor real en la franja baja, o un atajo para el usuario recurrente), no una 4ª ronda de retoque fino sobre los mismos 3 puntos — seguir iterando ahí sería, en efecto, rendimiento decreciente.

TOP DEFECTOS (ronda 3):
1. [Pantalla cerrada, franja ≈y:1050-1300px de 1567 totales] El bloom ya no corta en seco pero la franja sigue más apagada que el resto — techo alcanzado para un fix de gradiente. Fix: reemplazar el intento de "llenar con más glow" por una pieza de contenido real (ej. "Tu última tirada: Amor — hace 2 días" o un tip corto de una línea) en esa zona; deja de tocar el radial.
2. [Heurística 7, código, pantalla completa] Ninguna de las 3 rondas agregó atajos/defaults: no hay recuerdo de última tirada consultada, no hay pre-selección para el usuario recurrente. Sigue siendo la heurística más floja (2/4) y el techo real para subir usabilidad del bloque 27-32 al 36+. Fix: guardar en localStorage la última tirada consultada y ofrecer un chip "Repetir: Amor" o similar arriba de la lista.
3. [Lista de 5 tiradas, decisión] 5 opciones en una sola decisión sigue un punto por encima de la guía "≤4 opciones antes de generar parálisis" del gate de carga cognitiva — no crítico aislado (no llega a las 4 fallas necesarias para gate crítico) pero suma fricción en una decisión emocional. No se tocó en ninguna ronda. Fix: agrupar "Amor"+"Ruptura" bajo una sub-etiqueta o dejarlo así si el dato de uso real muestra que las 5 se usan parejo.
4. [Miniatura de carta, radio 12px, todas las filas] Resuelto en código (línea 68) pero sigue siendo el único elemento de la pantalla con un radio distinto (12 vs 14-16 del resto) — diferencia menor, ajuste fino no bloqueante, se puede dejar así o subir a 14 en una futura pasada de consistencia global.
5. [Puente Tarot→Diario] Sin defectos nuevos — el banner + prellenado + botón "Guardar" con validación de vacío en Diario forman un flujo coherente de punta a punta. Se anota como resuelto, no como pendiente.

Notas menores (no bloqueantes, heredadas de rondas previas):
- Miniaturas de carta lisas sin glifo — coincide con el mockup aprobado.
- Las 5 lecturas reutilizan el mismo glifo ilustrado de "La Sacerdotisa" — simplificación de V1 documentada.

---

## RONDA 4 (RE-REVISIÓN) — 2026-09-13
Screenshot: docs/revisiones/tarot-375.png (lista cerrada, navegador limpio, sin tirada previa) + docs/revisiones/tarot-abierta-375.png (tirada "Amor" expandida)
Usabilidad: 31/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:4 h7:3 h8:3 h9:3 h10:3
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3

Verificación del fix de la ronda 3 (heurística 7 — atajo/recuerdo de última tirada):
- Confirmado en código (`app/app/(tabs)/tarot/page.tsx`): `CLAVE_ULTIMA_TIRADA = 'luma_ultima_tirada'`, `useEffect` de montaje lee la clave con `try/catch` (líneas 31-37, no bloquea si localStorage falla), y `alternar()` escribe el id al abrir cualquier tirada (línea 44). El chip condicional (líneas 68-81) solo se renderiza si `ultima && LECTURAS_TAROT[ultima]` existe — defensivo contra id corrupto/obsoleto. Al tocarlo, reutiliza el MISMO `alternar()` que las filas normales, así que hereda el auto-scroll (`scrollIntoView` sobre `panelRef`, línea 48) — cumple exactamente lo pedido: "localStorage con la última tirada + chip 'Repetir: Amor' que abre esa tirada directamente con el mismo auto-scroll".
- Screenshot de navegador limpio (sin `luma_ultima_tirada` en localStorage): el chip NO aparece — correcto, es el comportamiento esperado y evita el falso-vacío ("Repetir: null").
- BUG NUEVO (real, no cosmético): `alternar()` escribe en `localStorage` pero **nunca llama a `setUltima(id)`** — el estado `ultima` en memoria solo se fija una vez, al montar la página (línea 33). Si el usuario abre una tirada distinta de la que tenía el chip (p. ej. el chip decía "Ruptura" y el usuario ahora abre "Carta del día"), `localStorage` queda actualizado a "carta-dia" pero el chip visible en pantalla sigue mostrando "Ruptura" hasta que la pantalla se desmonta y se vuelve a montar (cambio de tab y vuelta, o recarga). Es una inconsistencia real entre el dato guardado y lo que el chip comunica — heurística 1 (visibilidad del estado) rota en ese escenario, pero solo se dispara si el usuario abre una segunda tirada distinta en la MISMA sesión y vuelve a mirar el chip — un ojo entrenado lo encuentra leyendo el código, un usuario promedio rara vez lo dispara/nota. Fix de una línea: agregar `setUltima(id)` dentro del `if (abrir) { ... }` de `alternar()`.
- Redundancia sin bug: si la última tirada guardada es "Amor" (primera de la lista, el caso más común en un uso real temprano), el chip queda literalmente encima de la fila "Amor" que se ve un scroll más abajo — no rompe nada, pero no aporta atajo real en ese caso puntual (el usuario ya la tiene a la vista). No se penaliza como defecto de heurística, sí se anota como pulido posible.

Impacto en las puntuaciones:
- h7 (flexibilidad y eficiencia) sube de 2→3: el atajo pedido existe, es funcional para su caso de uso principal (usuario que vuelve otro día y ve "Repetir tu última tirada: X →" apenas entra), y reutiliza el patrón de auto-scroll ya probado. No llega a 4 por el bug de reactividad dentro de sesión y por cubrir un solo atajo (no hay, por ejemplo, un acceso directo por tipo de tirada más frecuente).
- h8 y el eje de craft "profundidad" NO se mueven: el screenshot de cierre (navegador limpio, el escenario más común para cualquier usuario NUEVO o de primera sesión) sigue sin mostrar el chip por diseño correcto, así que la franja baja plana señalada en rondas 2-3 sigue exactamente igual — el fix ayuda al usuario RECURRENTE pero no toca el problema de contenido/profundidad para quien todavía no tiene una tirada guardada, que sigue siendo la mayoría de las capturas de este tipo. Se mantiene en 3/3.
- El resto de heurísticas y ejes de craft no tuvo cambios de código que los afecten; se mantienen en los valores de la ronda 3.

Diagnóstico: el fix estructural pedido está bien encaminado y correctamente acotado a su propósito (atajo para el usuario recurrente), con un bug de reactividad concreto y de arreglo trivial. Pero el gate (≥36/40 y ≥16/20) sigue sin alcanzarse porque el defecto de fondo señalado en rondas 2-3 — la franja baja de la pantalla CERRADA se percibe menos "llena de valor" que el resto de la app — es independiente del atajo agregado: se manifiesta en el escenario más común (usuario sin historial) y ningún cambio de esta ronda lo toca. Esto YA es zona de rendimientos decrecientes para seguir iterando heurística por heurística sobre la MISMA captura de cierre: la ronda 4 resolvió lo que se le pidió (h7), pero el techo real de la pantalla vuelve a ser el mismo defecto de contenido de la franja baja que las rondas 2 y 3 ya diagnosticaron y no llegaron a resolver de raíz. Recomendación de cierre de ciclo: o se acepta una revisión más para atacar EXCLUSIVAMENTE ese defecto de contenido (con datos semilla que simulen un `luma_ultima_tirada` ya existente en el screenshot de cierre, para que la franja baja muestre el chip real en la evidencia), o se declara este techo aceptable por criterio de producto y se pasa a otra pantalla — seguir puntuando micro-ajustes sobre exactamente los mismos 2-3 puntos ya diagnosticados en 3 rondas consecutivas es, en efecto, rendimiento decreciente.

TOP DEFECTOS (ronda 4):
1. [`app/app/(tabs)/tarot/page.tsx`, función `alternar()`, líneas 39-50] Bug de reactividad: escribe en `localStorage` pero nunca actualiza el estado `ultima` en memoria — el chip puede quedar mostrando una tirada vieja si el usuario abre una tirada distinta en la misma sesión. Fix: añadir `setUltima(id)` dentro del bloque `if (abrir)`.
2. [Pantalla cerrada, franja ≈y:1050-1300px de 1567 — screenshot `tarot-375.png`, el escenario de usuario sin historial] Sigue exactamente igual que en rondas 2-3: el nuevo chip no la toca porque solo aparece con `luma_ultima_tirada` ya en localStorage. Es el verdadero techo actual de la pantalla. Fix: agregar contenido real en esa zona para el caso SIN historial (ej. un tip corto o una franja de "sugerido para ti"), no seguir tocando el gradiente.
3. [Chip "Repetir tu última tirada", caso ultima = primera tirada de la lista] Si la última guardada es "Amor" (primera fila), el chip queda inmediatamente encima de esa misma fila visible un scroll más abajo — redundante sin ser un error, oportunidad de pulido menor.
4. [Lista de 5 tiradas, decisión — heredado de ronda 3] Sigue un punto por encima de la guía de ≤4 opciones; no se tocó esta ronda.
5. [Miniatura de carta, radio 12px — heredado de ronda 3] Sigue siendo el único radio fuera de familia (12 vs 14-16); ajuste fino no bloqueante.

Notas menores (no bloqueantes, heredadas de rondas previas):
- Miniaturas de carta lisas sin glifo — coincide con el mockup aprobado.
- Las 5 lecturas reutilizan el mismo glifo ilustrado de "La Sacerdotisa" — simplificación de V1 documentada.

---

## RONDA 5 (RE-REVISIÓN) — 2026-09-13
Screenshot: docs/revisiones/tarot-375.png (lista cerrada, sin historial en este navegador — estado por defecto correcto)
Usabilidad: 31/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:4 h7:3 h8:3 h9:3 h10:3
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3

Verificación del bug único reportado en la ronda 4 (`alternar()` no llamaba `setUltima(id)`):
- CORREGIDO Y VERIFICADO EN CÓDIGO. Línea 48 del archivo actual: `setUltima(id);` vive dentro del bloque `if (abrir) { ... }` de `alternar()` (líneas 42-50), inmediatamente después de `window.localStorage.setItem(CLAVE_ULTIMA_TIRADA, id)`. El estado en memoria y el valor persistido ahora se actualizan en el mismo tick cada vez que se abre cualquier tirada — no solo al montar la página. El escenario que reportó la ronda 4 (abrir "Ruptura" y luego "Decisión" en la misma sesión, sin recargar) queda resuelto: el chip debe re-renderizar con el nuevo `ultima` de inmediato porque `TIRADAS_TAROT.find((t) => t.id === ultima)?.nombre` (línea 76) lee directo del state que ahora sí cambia. Sin regresiones: el `try/catch` alrededor del `localStorage.setItem` sigue intacto (líneas 43-47), y `setUltima(id)` se ejecuta fuera del `try` pero después de que este ya corrió — si `localStorage` falla (modo privado/cuota), el chip en memoria de todos modos se actualiza para la sesión actual, lo cual es correcto (mejor esfuerzo, consistente con el resto del archivo).
- Screenshot de cierre (navegador limpio, sin `luma_ultima_tirada`): el chip NO aparece — coincide exactamente con el comportamiento esperado y con las capturas de rondas 2-4. No hay regresión visual.

Impacto en las puntuaciones:
- h1 (visibilidad del estado del sistema) se mantiene en 3. El bug corregido era real pero de bajo disparo (solo visible si el usuario abre una segunda tirada distinta en la misma sesión y vuelve a mirar el chip) y las rondas anteriores ya lo habían tratado como un matiz que no bajaba el número por sí solo — corregirlo cierra un riesgo de regresión futura y es higiene de código correcta, pero no había estado empujando la pantalla a un nivel "ejemplar" que ahora se alcance; sigue habiendo otros huecos de feedback más visibles (franja baja sin contenido) que mantienen el techo en 3.
- h7 (flexibilidad y eficiencia) se mantiene en 3, NO sube a 4. La ronda 4 ya había fijado el techo de h7 en 3 por DOS razones: el bug de reactividad Y que el atajo cubre un solo caso (no hay, p. ej., accesos directos por tipo de tirada más frecuente ni más de un default inteligente). Esta ronda resuelve la primera razón pero no la segunda, así que el heurístico no cruza a "ejemplar, decil superior" — sigue siendo "bien, solo un ojo entrenado nota qué falta".
- Craft y el resto de heurísticas: sin cambios de código que los afecten; se mantienen en los valores de la ronda 4.

Verificación del defecto estructural (franja baja sin historial, fuera de alcance esta ronda por decisión explícita):
El screenshot entregado (navegador limpio, sin `luma_ultima_tirada`) confirma que el chip correctamente NO aparece y que la franja baja de la pantalla cerrada sigue exactamente igual a las rondas 2-4: perceptiblemente más apagada y sin ninguna pieza de contenido propia para el usuario de primera sesión. Esto es fiel a lo declarado por el equipo — no se tocó esta ronda — y sigue siendo el defecto que sostiene tanto h8 como el eje de craft "profundidad" en 3/4 y 3/4 respectivamente.

TOP DEFECTOS (ronda 5):
1. [Pantalla cerrada, franja ≈y:1050-1300px de 1567 — escenario sin historial, el más común en cualquier usuario nuevo] Techo estructural confirmado en 4 rondas consecutivas (2, 3, 4 y 5): el chip de la ronda 3-4 nunca la toca por diseño (solo aparece con historial), y ningún cambio de contenido se ha aplicado a esa zona para el caso sin historial. Fix: agregar una pieza de contenido real ahí para el usuario sin tiradas previas (ej. un tip corto o una franja "sugerido para ti"), no un ajuste más de gradiente.
2. [Lista de 5 tiradas, decisión — heredado de rondas 3-4] Sigue un punto por encima de la guía de ≤4 opciones; no se tocó en ninguna ronda hasta ahora.
3. [Chip "Repetir tu última tirada", caso ultima = primera tirada de la lista — heredado de ronda 4] Redundancia menor sin ser error: el chip puede quedar encima de la misma fila visible un scroll más abajo.
4. [Miniatura de carta, radio 12px — heredado de rondas 3-4] Sigue siendo el único radio fuera de familia (12 vs 14-16 del resto de superficies); ajuste fino no bloqueante.
5. [Bug de reactividad de `alternar()` — heredado de ronda 4] Sin defectos nuevos: RESUELTO Y VERIFICADO en código esta ronda, sin regresiones. Se anota como cerrado, no como pendiente.

Notas menores (no bloqueantes, heredadas de rondas previas):
- Miniaturas de carta lisas sin glifo — coincide con el mockup aprobado.
- Las 5 lecturas reutilizan el mismo glifo ilustrado de "La Sacerdotisa" — simplificación de V1 documentada.

¿Corresponde cerrar esta pantalla con criterio propio en esta ronda?
No. El fix puntual que se pidió está genuinamente resuelto y verificado — pero a diferencia de Coach (que en su ronda 4 ya había cruzado el gate propio de craft, 16/20, con la usabilidad dispersa en matices de accesibilidad de bajo impacto) o de Diario (que llegó a 35/40 y 15/20, a exactamente 1 punto de cada gate), Tarot se queda en 31/40 y 15/20 — 5 puntos por debajo del gate de usabilidad y 1 por debajo del de craft, la MISMA distancia que tenía antes de esta ronda. La razón es simple: el defecto que domina el techo actual (franja baja sin contenido para el caso sin historial, que sostiene h8 y "profundidad" en 3/4) es el mismo que las rondas 2, 3 y 4 ya diagnosticaron sin resolver, y esta ronda —correctamente— no lo tocó porque no era su alcance. Cerrar por "rendimientos decrecientes" aplica cuando lo que queda son matices dispersos de bajo impacto (el patrón de Coach/Diario); aquí lo que queda es UN defecto concreto, accionable y de impacto claro (afecta directamente h8 y el eje de profundidad, y es visible para cualquier usuario de primera sesión, no solo "quien mira con lupa"). El veredicto formal se mantiene NO LISTA porque el gate numérico (≥36/40 y ≥16/20) no se cumple — pero, a diferencia de rondas anteriores, ya no queda ambigüedad sobre cuál es el único punto que falta: una ronda dirigida EXCLUSIVAMENTE a poblar esa franja baja con contenido real (no gradiente) para el caso sin historial es la vía más corta para cruzar ambos gates. Si tras esa ronda dirigida el total se estanca de nuevo por debajo de 36/20 pese a resolver ese punto, ahí sí correspondería evaluar el cierre por criterio propio, como se hizo en Coach.
