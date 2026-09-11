# VEREDICTO revisor-visual — landing
Fecha: 2026-09-11 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 31/40
Craft: 18/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Sección "Casos" (Kicker "Ejemplos reales" sobre "Un mensaje confuso, tres respuestas claras")] El kicker llama "Ejemplos reales" a tres mensajes inventados por el equipo (mismo patrón que el rótulo "EJEMPLO" del hero) — no hay testimonios ni casos de usuarias reales: la propia FICHA-AVATAR.md reconoce "sin resultados de fundador aún" y "¿Hubo entrevistas del 44?: NO". Etiquetar contenido fabricado como "real" es un claim de prueba no verificable (Copy Eje 2) y roza dark pattern de prueba social falsa → renombrar el kicker (ej. "Así lo descifra LUMA" / "El mecanismo en acción") y quitar la palabra "reales" hasta tener casos verificados de usuarias.
2. [Sección Oferta, plan Mensual, botón CTA] Mide 48px (`h-12`, `<motion.a>` custom) mientras TODOS los demás CTA de la página (Hero, Casos, plan Anual, CtaFinal, StickyCtaMobile) usan `CtaButton` a 52-56px — repite la misma clase de inconsistencia que ya se corrigió en el sticky la ronda pasada, ahora en otro componente → reemplazar por una variante outline de `CtaButton` que conserve 52px.
3. [app/page.tsx, estructura global] Las 8 secciones entre el `<header>` del Hero y el `<footer>` cuelgan de un `<div>` plano — no existe `<main>` envolviendo el contenido primario, rompiendo el landmark principal para navegación por lectores de pantalla (regla UX #9 del sistema, HTML semántico) → envolver Problema…CtaFinal en `<main>`.
4. [Sección Oferta, card Anual] "$5,99/mes" no cuadra con "Se cobra $71,99/año" (5,99 × 12 = $71,88, no $71,99) — un usuario que hace la cuenta detecta el desajuste de 11 centavos, lo que resta credibilidad justo en la cifra más escrutada de la página → hacer que el precio mensual mostrado sea el cociente exacto del total anual real, o ajustar el total para que cuadre con el mensual mostrado.
5. [Toda la página, transversal — limitación reconocida, sigue abierta] Cero testimonios y cero datos de usuarias reales; los únicos "casos" son sintéticos (ver defecto #1). Para una avatar escéptica (consciencia 3-4 según FICHA-AVATAR.md) esto sigue siendo el punto más débil de especificidad/prueba (Copy Eje 2) y de H6/H9 → priorizar las 5-10 entrevistas del archivo 44 y reemplazar al menos 1-2 casos por citas/capturas reales antes de escalar tráfico pago.
