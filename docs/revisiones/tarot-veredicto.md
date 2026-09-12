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
