# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-11 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 31/40
Craft: 14/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Lista de beneficios, bajo el headline] Los checkmarks (ícono Check de lucide) van sueltos, sin círculo de acento — viola el GATE BINARIO de conversión "checkmarks custom (círculo acento 12% + check SVG)" de CLAUDE.md/55 → envolver cada Check en un chip circular bg-accent/12% de ~20-24px.
2. [Toda la pantalla: timeline, plan cards, badges] Cero hairlines degradé (1-2px, gradiente) — todos los bordes son sólidos/tintados planos, incumple el GATE BINARIO "≥1 hairline degradé" de superficies de conversión (baja EJE 3 identidad) → aplicar un borde con gradiente sutil en la card del plan Anual o en el marco del timeline.
3. [docs/revisiones/paywall-sin-datos.png] Sin pasar por onboarding, desaparece TODA la lista de 3 beneficios (value stack) sin un fallback genérico — el pitch queda mucho más débil justo para el tráfico que más lo necesita (ads directos, link de restaurar) → agregar un array de beneficios genéricos por defecto cuando `respuestas` es null en vez de omitir la sección completa.
4. [Headline / subtítulo] El copy no repite el ancla emocional del dolor #1 de FICHA-AVATAR ("obsesionada mirando el teléfono") que la propia ficha exige repetir en landing+onboarding+paywall — se queda en "la calma que buscas", genérico → baja EJE 3 (emoción) de copy a 2/4; nombrar la escena exacta antes de resolver con la calma.
5. [Pantalla de confirmación tras el CTA] Usa la palabra inglesa "checkout" sin traducir ("Vista previa del checkout") — viola la regla de 0 inglés crudo en UI y el glosario propio del proyecto (checkout → "la página de pago") → renombrar a "Vista previa de tu pago".
