# VEREDICTO revisor-visual — Coach
Fecha: 2026-09-12 00:00
Screenshot: docs/revisiones/coach-375.png
Usabilidad: 28/40
Craft: 13/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Centro de la pantalla, entre header y primera burbuja] Vacío muerto: más del 50% del viewport queda en blanco porque el hilo usa `justify-end` con solo 3 mensajes de semilla (HILO_COACH_EJEMPLO) → agregar 4-6 mensajes más de historia al seed para que el hilo llene el viewport de forma natural, o arrancar desde arriba (justify-start) cuando el hilo es corto.
2. [Burbujas de chat + input del composer] Texto a 13px en burbujas de usuario/LUMA y en el input — viola el mínimo de lectura del propio sistema (body ≥14px; 11-13px solo para labels/captions) → subir a 14px el texto de burbujas e input.
3. [Respuestas rápidas, botón de mic, botón de enviar] Cero `whileTap` / feedback táctil en los tres controles interactivos del composer y las sugerencias → falla la baseline de movimiento "tap <150ms responde" → agregar `motion.button` con `whileTap={{ scale: 0.97 }}`.
4. [Hilo de mensajes] Los mensajes nuevos (usuario y LUMA) aparecen sin animación de entrada, mientras el indicador "LUMA está escribiendo…" sí tiene fade → inconsistencia de movimiento dentro de la misma pantalla → envolver cada burbuja nueva en `motion.div` (opacity/y) igual que el indicador de escritura.
5. [Composer] No existe ningún camino de error visible (ni siquiera simulado) para un envío fallido — heurística 9 sin verificar en código: no hay mensaje "no se pudo enviar, intenta de nuevo" ni retry → dejar el estado de error listo aunque el envío sea simulado, para no llegar a Sesión 6 sin el patrón definido.
