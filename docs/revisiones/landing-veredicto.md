# VEREDICTO revisor-visual — landing
Fecha: 2026-09-12 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 37/40
Craft: 16/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) Skip-link "Saltar al contenido" aparece visible y superpuesto sobre el H1 del hero en el screenshot de esta ronda (app/page.tsx L29-34) — el código está bien (oculto vía -translate-y-16, visible solo con focus:translate-y-0) y una captura previa del mismo hero (landing-hero-375.png) no muestra el solape, así que es casi seguro un artefacto de captura (el link quedó enfocado antes de tomar el screenshot) y no una regresión real — pero bloquea el cierre hasta reconfirmar con una captura limpia. 2) El cambio de Agitación (íconos nuevos) blanquea la frontera visual entre "¿Te suena?" (con card+sombra) y "El costo de seguir igual" (mismo IconChip, sin card): ahora leen como una sola lista de 7 ítems en vez de pregunta→agitación — solo un ojo entrenado lo nota, no bloqueante. 3) Los CTA de los planes Anual y Mensual repiten el mismo texto sin señal de cuál se eligió (persiste de la ronda anterior). 4) Sigue sin testimonios/cifras reales de uso (persiste). 5) /onboarding y /entrar siguen sin existir (pendiente de etapa, no bloqueante).
