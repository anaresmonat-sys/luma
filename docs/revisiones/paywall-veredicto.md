# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-11 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 29/40
Craft: 12/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Pantalla "confirmado" tras el CTA] Debajo del mensaje "Vista previa de tu pago" queda un vacío enorme (más de la mitad del alto capturado no tiene contenido, sin nav ni cierre visual) → verificar si es real (quitar min-h-dvh+justify-center por un layout con tope de altura o agregar el siguiente paso visible) o artefacto de captura fullPage (mismo tipo de bug que la duplicación de header de la ronda 2) — re-capturar a viewport fijo antes de re-evaluar.
2. [Toda la pantalla, identidad] No aparece ningún dispositivo ownable de LUMA (carta de tarot flotante, círculos de emoción, retrato) — solo tipografía serif + acento dorado + un timeline de trial genérico (patrón Blinkist, citado en el propio código) → el brief de FICHA-ARTE pide "efecto wow, profundidad 3D, objeto flotante"; nada de eso vive en esta pantalla. Fix: sumar al menos 1 elemento visual firma (glyph de carta/luna junto al headline, o el retrato de LUMA) para que no sea intercambiable con cualquier paywall de suscripción.
3. [Fondo de toda la pantalla] Los blooms radiales que dan profundidad son casi imperceptibles a 375px — a simple vista el fondo se lee como un dark plano, no como el "ambiente de la noche íntima" descrito en FICHA-ARTE → subir opacidad/contraste de los blooms vino/ámbar detrás del hero y del timeline.
4. [Límite header/body, ~y=90px] Corte duro entre el color sólido del header sticky (bg/95 + blur) y el fondo del body — se ve como una línea recta en vez de una transición de profundidad → extender el gradiente del fondo detrás del header o igualar el tono exacto para que no se note el borde.
5. [Pie de pantalla] "Restaurar compra" enlaza a /entrar sin ninguna lógica de restauración real — en una pantalla que decide dinero, un enlace que promete restaurar una compra y no hace nada de eso rompe la confianza de quien ya pagó → dejar placeholder honesto ("Disponible pronto") o esperar a conectar Hotmart en Sesión 6 antes de mostrarlo como acción activa.

Nota sobre el defecto #4 de la ronda 2 (íconos Lock/ShieldCheck/Star/Check en SVG vs. sistema de emoji de FICHA-ARTE): revisado — es razonable. La landing (ya LISTA) usa el mismo patrón SVG para exactamente estos mismos usos (Star en el badge de trial de Oferta.tsx, Lock+ShieldCheck en Garantia.tsx, ambos con comentario explícito "siempre SVG"/"jamás emoji"). El override de FICHA-ARTE Ronda #4 ("SISTEMA DE ÍCONOS = EMOJI") enumera explícitamente ubicaciones de app interior (barra inferior, onboarding, Descifra, análisis, tarot, diario) — no incluye insignias de confianza/pago. Tratar landing+paywall como la misma categoría (pantallas de venta, iconografía de confianza en SVG) vs. app interior (iconografía funcional en emoji) es una lectura consistente de la ficha, no una inconsistencia real. No se penaliza.
