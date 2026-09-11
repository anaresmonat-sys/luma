# VEREDICTO revisor-visual — landing
Fecha: 2026-09-11 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 32/40
Craft: 19/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Toda la página, ~21 pantallas de scroll a 375px] Sin tabla de contenidos ni "volver arriba": quien ya vio la oferta y quiere releer el FAQ o los casos solo tiene scroll manual largo → agregar mini-nav de anclas o botón flotante "volver arriba" tras cierto scroll (heurística 7).
2. [Sección Garantía, tras Oferta] "Empieza gratis, sin riesgo" no es un nombre PROPIO de garantía (el propio componente Garantia.tsx lo pide así) — sub-check "garantía nombrada" queda débil → renombrar a algo memorable tipo "Garantía de Calma de 7 Días" manteniendo la condición actual.
3. [StickyCtaMobile, barra fija inferior] Altura 48px (h-12) vs CtaButton estándar 52-56px en el resto de la página — un ojo entrenado nota el CTA fijo más liviano que los demás → unificar a 52px o documentar la excepción de espacio.
4. [Sección "Ejemplos reales" + hero] Los 4 casos mostrados (hero + 3 de Casos) siguen siendo demos rotuladas "EJEMPLO", sin ningún testimonio o dato real de usuarias todavía — para una avatar escéptica (consciencia 3-4 según FICHA-AVATAR) sigue siendo el punto más débil de especificidad/prueba, aunque ya resuelve el defecto anterior del carrusel vacío → acelerar las 5-10 entrevistas de docs/investigacion/guia-entrevistas-avatar.md para sumar 1-2 citas reales antes del lanzamiento.
5. [Header, "Entrar"] Enlace terciario sin estado hover/focus definido (a diferencia del resto de interactivos, que sí tienen whileTap/hover) → agregar transición de color en hover/focus-visible.
