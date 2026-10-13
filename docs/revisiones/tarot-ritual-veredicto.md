# VEREDICTO revisor-visual — tarot-ritual (Ronda 1)
Fecha: 2026-10-13 12:00
Screenshot: docs/revisiones/tarot-ritual-1-pregunta-375.png · docs/revisiones/tarot-ritual-2-elegir-375.png · docs/revisiones/tarot-ritual-3-reveladas-375.png
Usabilidad: 25/40
Craft: 13/20
Copy (si vende): 13/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. Paso 1, botón "Elegir mis cartas" (app/app/(tabs)/tarot/page.tsx L372, `disabled={!pregunta.trim()}`) -> el CTA héroe nace apagado (~50% opacidad) aunque la pregunta es "opcional", y el label "¿Cuál es tu pregunta?" no dice "(opcional)": el usuario cree que debe escribir y el botón muerto contradice el segundo botón "Prefiero que hablen solo las cartas". Falla 2 de las 4 anclas del CTA vivo. -> Quitar `disabled`; el botón siempre habilitado y, si está vacío, avanza igual (sin eco); label "¿Cuál es tu pregunta? (opcional)".
2. Paso 1, textarea (~400px de alto, y=200-610) -> es el objeto más grande de la pantalla para una pregunta de una línea: vacío muerto oscuro, el CTA queda hundido y el ojo va a la caja vacía, no al botón. -> Textarea de 3-4 líneas (~96-112px), debajo 2-3 chips de ejemplo tocables ("¿Qué necesito soltar?", "¿Debo escribirle?") que rellenan el campo, y subir el CTA a la zona del pulgar sin el hueco central.
3. Pasos 2 y 3, composición vertical -> ~140px vacíos entre subtítulo y cartas y ~120px antes del enlace (paso 2); ~130px arriba de las cartas y ~150px entre la frase y "Ver mi lectura" (paso 3). El momento más emocional (la revelación) flota sin escala. -> Agrandar cartas reveladas (≥110x172, 1 sola fila) y etiquetas a ≥13px, agrupar bloque cartas+eco+frase centrado con aire simétrico; en el paso 2 cartas más grandes o 3 filas de 2 para llenar.
4. Paso 2, interacción de elección (L323-L329, L399-L426) -> (a) no se puede des-elegir una carta (tocarCarta ignora las ya marcadas) y "volver" (flecha) sale de todo el ritual a la lista; (b) al tocar la 3ª, `paso` pasa a 'reveladas' al instante: nunca se ve el 3/3 ni la carta elegida, y las cartas reveladas aparecen en otro sitio (se pierde la continuidad "esta es la que toqué"); (c) "Prefiero que LUMA elija por mí" es texto de 13px sin altura mínima (<44px táctil) en color terciario. -> Permitir destocar; flecha vuelve al paso anterior; retener 400-600ms con las 3 marcadas y voltear cada carta en su lugar (rotateY) antes de pasar; enlace con `min-h-11` y color accent-lite.
5. Paso 3 y gancho de resultado -> las tres cartas salen "(invertida)" sin explicar qué significa (jerga para quien llega por una caja gratis; para la avatar "Valentina" suena a mal presagio); el gancho "Tu tirada de hoy es solo el principio… Probar 3 días gratis" compite con "Guardar en mi diario" y "Hacer otra tirada" (3 acciones apiladas), no es 1ª persona, y no nombra precio posterior ni la garantía de 7 días que la ficha define como respuesta a la objeción de precio. -> Etiqueta "invertida" con una frase corta de qué implica (o cambiar a "al revés: pide mirar hacia adentro"); en el resultado dejar UN CTA dominante ("Quiero mi carta de mañana · 3 días gratis") con microcopy "Luego US$X/mes · cancela cuando quieras · garantía 7 días", y bajar "Hacer otra tirada" a enlace discreto.

Notas de verificación (código):
- reduced-motion: correcto (useReducedMotion apaga flotación, y y rotateY). La flotación continua es de ±4px/3s: no impide el toque (objetivo 76x118px, ≥44px), pero tiene escalones desfasados (delay 0.4s) que hacen que el blanco se mueva al tocar; moderar a ±2px o pausarla en pointer-down. Se mantiene como ambientación, no estorba gravemente.
- Paleta (vino/cacao + oro #d8a441), Cormorant Garamond + Hanken Grotesk y radios: coinciden con FICHA-ARTE.md; sin desvío. No es clon de los ejemplos canónicos vetados.
- No verificable en capturas: estado "leyendo" (carga de la IA) y vista 'error'; la heurística 1 se puntuó sin ellos. Falta celebración/resplandor en la revelación (hito real) y entrada escalonada de las 6 cartas.
- Copy: la frase del paso 1 ("Haz una respiración profunda…") repite literalmente la de la lista de temas; el eco "Tu pregunta: …" en 12px terciario cursivo es de bajo peso para ser el ancla emocional.

Detalle usabilidad: h1:2 h2:3 h3:2 h4:3 h5:2 h6:3 h7:3 h8:2 h9:3 h10:2
Detalle craft: jerarquía:2 profundidad:3 identidad:3 movimiento:3 encaje:2
Detalle copy: idea:3 especificidad:2 emoción:3 oferta:2 acción:3 (ejes de especificidad y oferta ≤2: se corrigen aunque el total pase; garantía nombrada con plazo: NO presente en el gancho)
