# VEREDICTO revisor-visual — Tarot
Fecha: 2026-09-12 00:00
Screenshot: docs/revisiones/tarot-375.png (+ docs/revisiones/tarot-abierta-375.png, tirada "Amor" expandida)
Usabilidad: 25/40
Craft: 11/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Pantalla cerrada, mitad inferior] Zona completamente plana sin bloom ni contenido (≈40% del viewport, entre la última fila "Carta del día" y el nav) — Inicio.tsx ya resolvió este mismo defecto de profundidad con un bloom local (línea 35-45, comentario "defecto de profundidad, revisor ronda 2"); Tarot no lo tiene. Fix: agregar bloom radial local en la mitad inferior + distribuir el contenido con más aire/justify, igual que Inicio.
2. [Panel expandido → botón "Guardar en mi diario"] El botón (AppLinkButton → `<Link href="/app/diario">`) NO guarda nada: navega al tab Diario, que abre con el textarea vacío (placeholder genérico no relacionado) y sin ninguna confirmación. El usuario no tiene forma de saber si su lectura se guardó — la promesa del copy ("Guardar") es falsa. Fix: pasar la lectura por query param/estado y prellenar el textarea del Diario, o al menos mostrar una confirmación real antes/después de navegar.
3. [Cada fila de tirada, lista completa] El `<button>` que expande/colapsa (page.tsx líneas 31-54) no tiene `whileTap` ni ningún highlight de presión — a diferencia de MoodPicker (`whileTap scale 0.92`), AppButton y AppLinkButton (`whileTap scale 0.97`) que sí lo tienen en toda la app. Al tocar una fila no hay respuesta inmediata antes de que el panel abra en 300ms; se siente "muerta" un instante. Fix: envolver la fila en `motion.button`/`motion.div` con `whileTap={{ scale: 0.98 }}` o un fondo de presión.
4. [Lista completa, montaje de la pantalla] Las 5 filas aparecen de golpe sin stagger de entrada, rompiendo la firma de movimiento que sí tiene Inicio (motion.div con fade+y al montar). Fix: aplicar stagger 50-80ms a las filas al montar la pantalla.
5. [Tiradas inferiores, ej. "Carta del día"] Al expandir una fila cercana al final de la lista, el panel (carta + lectura + CTA) se abre fuera del viewport sin auto-scroll — el usuario no percibe que pasó algo hasta que baja manualmente. Fix: `scrollIntoView({behavior:'smooth', block:'nearest'})` sobre el panel recién abierto (respetando prefers-reduced-motion, ya cubierto por MotionConfig global).

Notas menores (no bloqueantes):
- Las miniaturas de carta en la lista son un rectángulo beige liso sin glifo — coincide exactamente con el mockup aprobado (`.tth` vacío en vista-previa-app.html línea 141), no se penaliza.
- Las 5 lecturas reutilizan el mismo glifo ilustrado de "La Sacerdotisa" (numero/nombre/cita sí cambian por tirada) — simplificación de V1 documentada, no se penaliza como defecto grave.
