# VEREDICTO revisor-visual — Diario emocional
Fecha: 2026-09-12 00:00
Screenshot: docs/revisiones/diario-375.png
Usabilidad: 25/40  (detalle: h1:2 h2:4 h3:3 h4:2 h5:2 h6:4 h7:2 h8:2 h9:2 h10:2)
Craft: 11/20  (detalle: jerarquía:3 profundidad:2 identidad:3 movimiento:1 encaje:2)
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Top defectos:
1. [Franja inferior, desde "Ver mi patrón →" hasta la bottom nav, ~30% de la altura de pantalla]
   Vacío muerto: sin contenido y sin textura — los blooms de `body` (globals.css) están anclados
   arriba (`-6%`/`4%`) y no alcanzan esta zona, se lee como fill plano oscuro. Mismo patrón ya
   detectado y corregido en Inicio y Descifra (bloom local ausente aquí) → agregar un bloom radial
   local anclado hacia el tercio inferior del contenedor, o centrar/expandir el contenido para que
   la pantalla no termine en aire muerto.
2. [Caja de texto, ícono de micrófono 🎤] El botón NO tiene `onClick` ni ningún handler
   (`app/app/(tabs)/diario/page.tsx` L74-80) — al tocarlo no pasa absolutamente nada, ni siquiera el
   aviso honesto que sí recibe el calendario en la misma pantalla (L27-30, "Próximamente: historial
   de tu diario") → aplicar el mismo patrón de aviso ("Próximamente: nota de voz") o el toast usado
   en Descifra ("toca para grabar — próximamente").
3. [Bajo la caja de patrón, botón "Ver mi patrón →"] Tampoco tiene `onClick` (L101-106) — mismo
   borde dorado y misma altura (h-11) que el resto de botones funcionales de la app, por lo que
   parece 100% tappable, pero no hace nada ni avisa nada (viola el anti-patrón 11: todo elemento
   con apariencia interactiva debe responder) → si no existe aún la pantalla de destino, darle el
   mismo aviso honesto "Próximamente" que ya tiene el calendario en este mismo archivo.
4. [Botón "Guardar"] `guardar()` (L22-25) no valida el contenido de `texto` — con el textarea vacío
   (solo mostrando el placeholder de ejemplo `ENTRADA_DIARIO_EJEMPLO`), el botón igual cambia a
   "Guardado ✓" como si hubiera una entrada real guardada, dando una confirmación falsa (heurística
   5, prevención de errores) → deshabilitar o mostrar un hint ("Escribe algo antes de guardar")
   cuando `texto.trim() === ''`.
5. [Toda la pantalla, verificado en código] No hay animación de entrada escalonada: mood picker,
   caja de texto y caja de patrón aparecen todos de golpe al montar — solo existen micro-
   interacciones de tap (MoodPicker, AppButton), sin `variants`/`staggerChildren` en el contenedor
   de la página, a diferencia de la baseline de movimiento #1 ya aplicada en Descifra → envolver el
   contenido en un `motion.div` con stagger 60-80ms entre bloques.
