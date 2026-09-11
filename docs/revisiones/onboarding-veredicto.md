# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-11 00:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 25/40
Craft: 12/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Top defectos:
1. [Fondo de TODAS las pantallas — PasoShell en components/onboarding/ui.tsx, LoadingPlan.tsx, PlanListo.tsx] Cada contenedor de paso pinta `bg-[var(--bg)]` sólido y opaco, que tapa por completo los dos radial-gradient ("blooms") definidos en `body` (app/globals.css líneas 74-80). Resultado verificado en las 12 capturas: fondo liso en toda la app, exactamente lo que FICHA-ARTE prohíbe ("el fondo NUNCA es un fill plano") → fix: quitar el color de fondo opaco de los contenedores internos (dejarlos transparentes) para que se vea el gradiente del body, o replicar los blooms dentro de cada contenedor de paso.
2. [Pantallas de chips: onboarding-02, 04, 05, 08, 09] Entre ~25% y ~33% de la altura de pantalla queda vacía sin CTA, ilustración ni textura tras las 4 opciones — PreguntaChips.tsx no rellena ese espacio con nada (ni filler visual, ni CTA, ni el dispositivo ownable de la ficha) → fix: agregar cierre visual (ilustración de apoyo, textura de fondo visible, o centrar verticalmente el bloque de pregunta+chips en vez de anclarlo arriba).
3. [Chip no seleccionado — ChipOpcion en components/onboarding/ui.tsx línea 75] FICHA-ARTE Ronda #3 exige "BORDE DORADO en TODAS las cajitas (cards, filas de onboarding...)"; el borde por defecto del chip usa `color-mix(in oklab, var(--text-tertiary) 25%, transparent)` (tono neutro cálido), no `var(--accent)` dorado — visible en todas las capturas de preguntas (los bordes se ven grisáceos/apagados, no dorados) → fix: cambiar el borde por defecto a un dorado tenue (`color-mix` con `--accent`).
4. [CTAs principales — Reconocimiento.tsx "Continuar", PreguntaSlider.tsx "Fijar mi ritmo", PlanListo.tsx "Ver mi plan completo"] Son `<button>`/`<a>` planos sin `whileTap` ni `:active` definido — solo ChipOpcion tiene feedback de tap. Incumple el ancla "CTA héroe vivo" #2 (estado hover/tap definido) en 3 de las 4 pantallas de CTA único → fix: envolver en `motion.button`/`motion.a` con `whileTap={{ scale: 0.97 }}` igual que ChipOpcion.
5. [flujo.ts — beneficiosPlan(), rama ayuda === 'tarot'] Si el usuario elige "Una guía de tarot para reflexionar" en la pregunta de ayuda, el plan final muestra dos beneficios casi idénticos: "Tiradas de tarot pensadas para tu situación, no genéricas" (bullet 1, dinámico) y "Tiradas de tarot leídas para tu caso, no genéricas" (bullet 2, fijo) — redundancia de contenido no verificada en el screenshot provisto (que usa la rama "analizar") pero confirmada en código → fix: excluir el bullet fijo de tarot cuando `ayuda === 'tarot'`, o variar su texto.
