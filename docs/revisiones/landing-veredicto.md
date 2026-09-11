# VEREDICTO revisor-visual — landing
Fecha: 2026-09-11 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 35/40
Craft: 18/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Prueba social / testimonios — toda la página] Sigue sin ningún testimonio real ni cifra verificable de una usuaria (5ª ronda igual). CasosLuma se etiqueta honestamente "Ejemplos ilustrativos del mecanismo", lo cual evita engañar, pero no sustituye prueba real: la página entera no tiene un solo dato de un humano real, solo demo + garantía. La propia FICHA-AVATAR.md lo reconoce como pendiente ("Conseguir 5-10 testers del avatar antes de Sesión 3", cierre PENDIENTE). Fix: levantar 5-10 conversaciones reales (archivo 44) y agregar un bloque de cita/testimonio verificable antes de la Oferta.
2. [Accesibilidad de teclado — app/layout.tsx / components/landing/Hero.tsx SiteHeader] No existe un enlace "Saltar al contenido" antes del header; un usuario de teclado/lector de pantalla tiene que tabular por la marca y "Entrar" en cada carga antes de llegar al contenido. Fix: agregar `<a href="#hero" class="sr-only focus:not-sr-only ...">Saltar al contenido</a>` como primer foco del `<body>`.
3. [Header, link "Entrar" — components/landing/Hero.tsx líneas 56-63] Área táctil ≈40-41px (`py-3` + texto 14px), por debajo del mínimo de 44px de alto que exige el resto del sistema (todos los demás CTA/botones del kit son ≥44px). Fix: subir a `min-h-11` (44px) o `py-3.5`.
4. [Barra sticky mobile — components/landing/ui.tsx StickyCtaMobile] Una vez aparece (tras salir el hero) no tiene forma de cerrarse/descartarse manualmente; queda fija hasta que el usuario haga scroll a Oferta o al CTA final. Fix: agregar un control de cierre pequeño que la oculte el resto de la sesión (o guardar el dismiss en el estado local).
5. [Todos los CTA + login — app/page.tsx CTA_HREF, SiteHeader loginHref] Los enlaces "Descifrar mi primera conversación" y "Entrar" apuntan a `/onboarding` y `/entrar`; ninguna de las dos rutas existe todavía en `app/` (confirmado con glob: solo existen page.tsx, privacidad, terminos, cookies, reembolsos, aviso-ia) → hoy CUALQUIER clic en un CTA de la landing cae en 404. Es esperable en esta fase de la SECUENCIA MAESTRA (onboarding es el siguiente paso) y no bloquea "landing lista", pero debe quedar anotado como pendiente crítico antes de dar tráfico real.

Verificación de los 4 defectos de la ronda anterior (35/40 → NO LISTA):
- #1 focus-visible: RESUELTO. Confirmado en código: CtaButton (ui.tsx L170), ambos controles de StickyCtaMobile (L249, L256), BackToTop (L302), el CTA outline "Mensual" de Oferta.tsx (L192) y el `<button>` del acordeón de Faq.tsx (L74) llevan `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]` (o el ring-offset equivalente). Ya no es un defecto de consistencia (H4).
- #2 prueba social: SIGUE ABIERTO — ver defecto #1 de esta ronda.
- #3 landmark del header: RESUELTO. `SiteHeader` ahora se exporta por separado de `Hero` (components/landing/Hero.tsx L43-67) y en app/page.tsx (L29-30) es hermano directo de `<main>`, ya no anidado en `<section id="hero">`. El `<header>` recupera el rol de landmark "banner". El fondo con blooms vive a nivel `body` (app/globals.css L29-36, fijo/no-scroll), así que no hay salto visual entre el header y el hero pese al cambio estructural — verificado visualmente en el screenshot.
- #4 desfase de precio: RESUELTO. `sufijo: '/mes aprox.'` (app/page.tsx L108) convierte el "$6,00" en una equivalencia derivada en vez de una afirmación matemática exacta; ya no contradice el "$71,99/año" de al lado.

Craft — detalle: jerarquía:4 profundidad:4 identidad:4 movimiento:3 encaje:3. Sin desvíos frente a FICHA-ARTE.md (paleta #1a0d13/#33202c/#d8a441, radios 16/14, Cormorant Garamond + Hanken Grotesk verificados en tokens.css y layout.tsx). No coincide con ninguno de los ejemplos canónicos vetados (papel+tinta verde / pizarra+latón).
Copy — detalle: idea:4 especificidad:3 emoción:4 oferta:4 acción:4. Especificidad capada por la misma ausencia de prueba real (defecto #1). Garantía nombrada ("la Garantía de Calma de 7 Días") con plazo, cerca del CTA de compra — check binario OK.
Gate: Usabilidad 35/40 (< 36) → no cumple el gate doble aunque Craft (18/20) y Copy (19/20) sí lo cumplen individualmente.
