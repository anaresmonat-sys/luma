# VEREDICTO revisor-visual — Descifra la conversación
Fecha: 2026-09-12 00:00
Screenshot: docs/revisiones/descifrar-375.png (+ docs/revisiones/descifrar-resultado-375.png)
Usabilidad: 31/40
Craft: 13/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. Vacío muerto masivo bajo el contenido en ambos estados (tras "Probar con un ejemplo" en vacío;
   tras los 2 CTAs en resultado) → rellenar con contenido útil o centrar el bloque verticalmente;
   verificar que min-h-dvh/el fondo con blooms cubran el 100% real del viewport sin caer a un
   corte sólido casi negro en el borde inferior.
2. La zona vacía se percibe como fill marrón plano, sin blooms visibles (contradice FICHA-ARTE:
   "el fondo NUNCA es un fill plano") → subir opacidad/tamaño de los blooms radiales para que se
   perciban en toda la altura de pantalla, no solo cerca del header.
3. CTA "Analizar" deshabilitado con opacity-50 cuando el textarea está vacío → viola la ancla
   "CTA héroe nunca disabled por defecto"; mantenerlo tappable siempre y mostrar hint inline
   ("Pega tu conversación primero") al tocarlo vacío.
4. Cero estado de error en todo el flujo (heurística 9): no hay mensaje para texto muy corto/
   ambiguo ni manejo de fallo de análisis → agregar estado 'error' con qué-pasó + qué-hacer.
5. Sin stagger en el cambio Texto/Captura/Voz (instantáneo, sin AnimatePresence) ni en la lista
   de 3 hallazgos (aparecen todos juntos, no escalonados) → envolver el panel de modo en fade y
   dar stagger 60-80ms a cada hallazgo, tal como exige la doctrina de movimiento baseline.

---

# VEREDICTO revisor-visual — Descifra la conversación (2ª ronda)
Fecha: 2026-09-12 00:00
Screenshot: docs/revisiones/descifrar-375.png (+ docs/revisiones/descifrar-resultado-375.png)
Usabilidad: 29/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Detalle usabilidad: h1:3 h2:4 h3:3 h4:3 h5:3 h6:3 h7:2 h8:2 h9:3 h10:3
Detalle craft: jerarquía:3 profundidad:2 identidad:4 movimiento:3 encaje:3

Verificación de los 5 defectos de la 1ª ronda:
1. Vacío muerto (centrado vertical) → PARCIALMENTE CORREGIDO. El `flex flex-1 flex-col
   justify-center` sí reparte el contenido, pero el bloom (`absolute top-1/4 h-[30rem]`, altura
   fija) no llega a cubrir el último ~30-40% del viewport en el estado vacío: la franja bajo
   "Probar con un ejemplo" vuelve a caer en un degradado plano hasta el borde inferior, la misma
   familia de problema que el defecto original, en menor severidad.
2. Blooms visibles → CORREGIDO en la franja central (detrás de chips/textarea/CTA se percibe el
   resplandor cálido), pero no en los extremos superior e inferior de la pantalla vacía (ver #1).
3. CTA "Analizar" nunca disabled por defecto → CORREGIDO, verificado en código
   (`disabled={estado === 'cargando'}`, nunca por texto vacío) y en el screenshot (botón con
   relleno oro pleno, sin opacity-50).
4. Estado de error → CORREGIDO. `estado === 'error'` con mensaje qué-pasó + qué-hacer
   ("Necesito un poco más de contexto — pega al menos un par de mensajes."), transición de
   altura suave, se limpia solo al seguir escribiendo.
5. Stagger/transición → CORREGIDO. `AnimatePresence mode="wait"` en el panel de modo (fade
   200ms) + `staggerChildren: 0.07` real en los 3 hallazgos del resultado, cada uno como
   `motion.div` independiente con variants. `prefers-reduced-motion` respetado a nivel global
   vía `MotionConfig reducedMotion="user"` en `app/layout.tsx` (verificado en código).

Top defectos (2ª ronda):
1. [Estado vacío, franja inferior ~35-40% de la pantalla] El bloom radial no cubre la parte baja
   del viewport (altura fija `h-[30rem]` anclada a `top-1/4`): tras "Probar con un ejemplo" el
   fondo vuelve a ser un degradado plano sin textura hasta el borde inferior — repite, en menor
   grado, el defecto original #1/#2 → extender el bloom (segundo blur anclado a bottom, o
   `height` relativa al viewport) o comprimir el layout para que el contenido llegue más abajo
   en vez de solo centrarlo con aire muerto arriba y abajo.
2. [Caja de texto, ícono circular de micrófono] El hint dice "o mantén pulsado para hablar" pero
   el botón solo tiene `onClick` (tap simple) que navega al modo "Próximamente" — la copia
   promete un gesto de hold que no existe todavía → cambiar el texto a algo honesto ("toca para
   grabar — próximamente") hasta que Voz esté conectado, o implementar el gesto real.
3. [Selector Pega texto/Captura/Voz, los 3 chips] Sin `whileTap` ni ninguna respuesta de presión
   (solo cambian de color vía estado, sin animación), mientras el resto de la app usa
   `motion.button` con `scale 0.97` (AppButton) → añadir el mismo tap feedback para no romper la
   baseline de movimiento #4 (tap <150ms visible).
4. [Pantalla completa, primera carga del estado vacío] Falta stagger de entrada inicial: header,
   chips de modo, textarea y CTA aparecen todos de golpe — las variants `contenedor`/`item` solo
   se usan en el bloque de resultado, no en la carga inicial → envolver también el bloque inicial
   en la misma animación escalonada (baseline de movimiento #1).
5. [Íconos circulares de "Lo que hemos detectado"] `size-8` (32px) en vez de los 34px que fija la
   Ronda de retoques de FICHA-ARTE.md → cambiar a `size-[34px]` para cumplir la especificación
   registrada (desvío menor, no bloqueante).

Lectura de la brecha (¿bugs concretos o pulido de rendimientos decrecientes?):
NO es todavía pulido de rendimientos decrecientes — los 5 puntos de arriba son defectos
concretos y accionables (una medida de CSS, una discrepancia copy/comportamiento, animaciones
ausentes en componentes puntuales), no matices de gusto. Usabilidad está a 7 puntos del gate
(29 vs 36) y Craft a 1 punto (15 vs 16): la distancia no es sutil todavía. A diferencia de
landing/onboarding/paywall/inicio tras varias rondas, aquí solo va la 2ª ronda y el defecto
raíz #1 de la 1ª ronda (vacío/fill plano) sigue sin resolverse del todo — es el mismo bug,
mitigado pero no cerrado. Recomendación: vale una 3ª ronda dirigida SOLO a los 5 puntos de
arriba (el #1 es el de mayor impacto en craft/profundidad) antes de considerar cierre por
criterio propio.
