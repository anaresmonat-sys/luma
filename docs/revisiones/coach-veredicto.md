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
