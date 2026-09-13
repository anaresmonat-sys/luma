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
2. [Heurística 7, código, pantalla completa] Ninguna de las 3 rondas agregó atajos/defaults: no hay recuerdo de última tirada, no hay pre-selección para el usuario recurrente. Sigue siendo la heurística más floja (2/4) y el techo real para subir usabilidad del bloque 27-32 al 36+. Fix: guardar en localStorage la última tirada consultada y ofrecer un chip "Repetir: Amor" o similar arriba de la lista.
3. [Lista de 5 tiradas, decisión] 5 opciones en una sola decisión sigue un punto por encima de la guía "≤4 opciones antes de generar parálisis" del gate de carga cognitiva — no crítico aislado (no llega a las 4 fallas necesarias para gate crítico) pero suma fricción en una decisión emocional. No se tocó en ninguna ronda. Fix: agrupar "Amor"+"Ruptura" bajo una sub-etiqueta o dejarlo así si el dato de uso real muestra que las 5 se usan parejo.
4. [Miniatura de carta, radio 12px, todas las filas] Resuelto en código (línea 68) pero sigue siendo el único elemento de la pantalla con un radio distinto (12 vs 14-16 del resto) — diferencia menor, ajuste fino no bloqueante, se puede dejar así o subir a 14 en una futura pasada de consistencia global.
5. [Puente Tarot→Diario] Sin defectos nuevos — el banner + prellenado + botón "Guardar" con validación de vacío en Diario forman un flujo coherente de punta a punta. Se anota como resuelto, no como pendiente.

Notas menores (no bloqueantes, heredadas de rondas previas):
- Miniaturas de carta lisas sin glifo — coincide con el mockup aprobado.
- Las 5 lecturas reutilizan el mismo glifo ilustrado de "La Sacerdotisa" — simplificación de V1 documentada.
