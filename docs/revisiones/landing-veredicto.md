# VEREDICTO revisor-visual — landing
Fecha: 2026-09-11 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 35/40
Craft: 19/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Toda la página — CtaButton, StickyCtaMobile (ambos botones), BackToTop, CTA outline "Mensual", disparadores del acordeón FAQ] Ningún CTA/botón interactivo define `focus-visible` propio (verificado en código: grep de `focus-visible`/`outline` en components/landing solo devuelve 1 resultado, el link "Entrar" de Hero.tsx). El resto depende del outline por defecto del navegador → inconsistente con el resto del sistema y accesibilidad de teclado floja. Fix: agregar `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2` (o equivalente sobre --bg) a CtaButton, ambos botones de StickyCtaMobile, BackToTop y el `<button>` del FAQ.
2. [Prueba social / testimonios] Sigue sin ningún testimonio real ni cifra verificable de una usuaria — el kicker de Casos ya no engaña ("Cómo se ve en la práctica" + nota "Ejemplos ilustrativos"), pero la página completa no tiene NINGÚN dato de un humano real, solo demo + garantía como prueba. Fix: levantar 5-10 conversaciones reales (archivo 44) y agregar un bloque de cita/testimonio verificable antes de la Oferta; hasta entonces sigue siendo limitación conocida, no oculta.
3. [Estructura semántica — app/page.tsx + components/landing/Hero.tsx] El `<header>` (marca "LUMA" + link "Entrar") vive ANIDADO dentro de `<section id="hero">`, que a su vez está dentro de `<main>` → el header pierde el rol de landmark "banner" para lectores de pantalla (no hay región de encabezado de página, solo de sección). Fix: sacar el `<header>` de Hero.tsx y ponerlo como hermano de `<main>` en page.tsx (antes de la apertura de `<main>`).
4. [Oferta, plan Anual — app/page.tsx líneas 108-110] `precioMes: "$6,00"` × 12 = $72,00, pero `totalAnual` dice "Se cobra $71,99/año" → desfase de $0,01. Mejora frente a la ronda anterior ($5,99 × 12 = $71,88, once centavos de diferencia) pero el número sigue sin cuadrar exacto, el mismo tipo de defecto que ya se señaló antes. Fix: usar "$6,00/mes" con total "$72,00/año", o mostrar el precio mensual real sin redondear.

Nota de verificación (no cuenta como defecto): se revisó el fix del botón "volver arriba" en mobile (StickyCtaMobile con chevron-up integrado a la barra fija, BackToTop solo desktop `md:inline-flex`). En el screenshot full-page actual el texto "la Garantía de Calma de 7 Días" se ve completo, sin ningún botón u overlay superpuesto — el fix parece correcto. Recomendado confirmar con una captura de VIEWPORT real (375×812, no full-page) sobre la sección Garantía antes de dar el tema por cerrado, porque el full-page screenshot no siempre refleja con fidelidad el comportamiento de `position:fixed` en cada punto de scroll.
