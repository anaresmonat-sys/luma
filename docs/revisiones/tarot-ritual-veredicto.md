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

# VEREDICTO revisor-visual — tarot-ritual (Ronda 2)
Fecha: 2026-10-13 18:00
Screenshot: docs/revisiones/tarot-ritual-1-pregunta-375.png · docs/revisiones/tarot-ritual-2-elegir-375.png · docs/revisiones/tarot-ritual-3-reveladas-375.png
Usabilidad: 29/40
Craft: 15/20
Copy (si vende): 13/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. Barra inferior (Inicio/Coach/Tarot/Diario/Más), visible en los 3 pasos -> los íconos son emojis a color (casa, burbuja, bola de cristal, libreta) con estilos distintos al SVG monocromo de la flecha "volver" y a la paleta vino/oro; anti-patrón "emojis como íconos" y desvío de FICHA-ARTE, lo primero que ve cualquiera -> reemplazar por íconos SVG (Lucide/Phosphor, fill para activo) en el color de acento/terciario; lo mismo con 🕯️ y ✨ del código de la lista (L674, L718).
2. Gancho de la lectura final del ritual (page.tsx L629-L640, no capturado en las 3 imágenes) -> sigue sin precio posterior ni garantía nombrada con plazo; copy genérico "Tu tirada de hoy es solo el principio", CTA "Probar 3 días gratis" no en 1ª persona, y compite con "Guardar en mi diario" (dos AppLinkButton de peso similar). Copy: especificidad 2 y oferta 2 -> un CTA dominante "Quiero mi carta de mañana · 3 días gratis" con microcopy "Luego US$X/mes · cancela cuando quieras · garantía 7 días"; "Guardar en mi diario" como enlace secundario; añadir la captura de este paso al material.
3. Paso 1, caja de texto (y=365-507) y vacío -> aunque más baja, sigue ~140px de caja vacía y ~170px de aire muerto entre la caja y el CTA; no hay chips de ejemplo que enseñen qué preguntar (ayuda contextual 2); además la frase superior repite literal la de la lista de temas -> añadir 2-3 chips tocables ("¿Qué necesito soltar?", "¿Debo escribirle?") que rellenen el campo y bajar la caja a 3 líneas; frase distinta de la de la lista.
4. Pasos 2 y 3, jerarquía/encaje -> el eco "Tu pregunta: …" (12px cursiva terciaria) casi no se lee y es el ancla emocional; los nombres de carta en 11-12px bold y "Rey de Copas (invertida)" corta en 2 líneas contra 1 de las otras (columnas desparejas); la línea "Invertida: …" a 12px gris compite en peso con el eco -> eco a 14px en secundario; nombre en 13px y "(invertida)" en segunda línea para las tres, o un chip "al revés" bajo cada carta invertida.
5. Paso 3, carta revelada -> la revelación (hito real) tiene resplandor pero no celebración ni cierre: aire de ~100px sobre el título y ~110px antes del CTA mientras las cartas son 100x156 en una banda estrecha; las 6 cartas del paso 2 flotan con desfase y aún mueven el blanco al tocar -> subir cartas a ~112x175 con un destello breve al terminar el último giro (apagado en reduced-motion) y pausar la flotación en pointer-down.

Notas de verificación (código):
- Corregido y verificado en código: CTA paso 1 ya no disabled (L399), "(opcional)" en label, des-elegir carta (L338), "Volver" retrocede un paso (L345-L356), enlace "elegir por mí" con min-h-11 (L447), "Hacer otra tirada" oculto con desdeRitual (L645), reduced-motion respetado en flotación y rotateY (L375, L426, L464).
- Mejoras visibles en capturas: contenido centrado verticalmente, encabezado "Estas son tus cartas", explicación de "invertida".
- Paleta vino/oro, Cormorant Garamond + Hanken Grotesk y radios coinciden con la ficha; no es clon de los ejemplos vetados.
- No verificable: estados "leyendo" y "error", y la vista de resultado del ritual (sin captura).

Detalle usabilidad: h1:3 h2:3 h3:3 h4:2 h5:3 h6:3 h7:3 h8:3 h9:3 h10:2
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3
Detalle copy: idea:3 especificidad:2 emoción:3 oferta:2 acción:3

# VEREDICTO revisor-visual — tarot-ritual (Ronda 3)
Fecha: 2026-10-13 22:00
Screenshot: docs/revisiones/tarot-ritual-1-pregunta-375.png · docs/revisiones/tarot-ritual-2-elegir-375.png · docs/revisiones/tarot-ritual-3-reveladas-375.png · docs/revisiones/tarot-ritual-4-lectura-375.png
Usabilidad: 29/40
Craft: 14/20
Copy (si vende): 14/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. Lectura final (tarot-ritual-4-lectura-375.png) -> el PNG llamado "página completa" en realidad muestra solo el viewport superior (barra de scroll con pulgar a ~1/3): el gancho al plan, que es lo que se pretendía verificar, NO aparece en la captura; solo se verifica en código (page.tsx L641-L655). Además la lectura son ~3 párrafos de 13px centrados (~20 líneas) antes de cualquier CTA: el texto largo centrado se lee mal y el gancho queda enterrado bajo el scroll sin CTA fijo -> capturar la página completa (fullPage) y alinear a la izquierda el cuerpo a 14-15px con párrafos separados; mover o repetir un CTA "Quiero mis 3 días gratis" pegado al fondo (sticky sobre la barra) una vez termina la lectura.
2. Gancho (page.tsx L641-L669) -> "Quiero mis 3 días gratis" y "Guardar en mi diario" son ambos AppLinkButton compact con el mismo relleno dorado y 12px: dos acciones primarias iguales compiten (falla ancla de CTA héroe y heurística 8); el CTA además queda a 12px / min 48px compacto, no el botón héroe del resto del ritual -> "Guardar en mi diario" como botón secundario outline o enlace; CTA del plan con AppButton normal (14px, ancho completo, 48px) y mayor peso que el resto.
3. Microcopy de precio (L651-L653, 11.5px secondary) -> la oferta clave (precio mensual/anual, cancelación, garantía 15 días) va en 11.5px en una sola frase densa: es lo que desactiva la objeción de precio de la ficha y es lo más pequeño de la tarjeta; "$9,99" sin "US$" ambiguo entre monedas LATAM, y no aclara que la garantía cuenta desde el primer cobro (FICHA-MERCADO) -> subir a 13px, separar en dos líneas ("Después US$9,99/mes o US$89,99/año · cancelas cuando quieras" / "Garantía de 15 días desde tu primer cobro") y nombrar la garantía.
4. Resultado, etiquetas de carta (MiniCartaTirada L81, 10px) -> los nombres bajo las cartas bajan a 10px (11px en el paso anterior) con "(invertida)" colgando en la 3ª línea y las cartas de 80x124 (más chicas que las 100x156 reveladas): se pierde la escala de la revelación y las etiquetas son difíciles de leer en Android gama media -> unificar con el paso 3 (11-13px, mismas dimensiones o mayores) y poner "(invertida)" siempre en 2ª línea.
5. Pasos 1-3, lo que queda -> (a) bloque de 3 chips en pirámide 2+1 con anchos desiguales sin alinear al ancho de la caja; textarea de 4 líneas sigue medio vacía (h-28 para una pregunta de una línea); (b) el paso 3 mantiene ~130px de aire entre el eco/frase y "Ver mi lectura"; (c) sigue sin celebración/destello en la revelación -> chips en una fila con scroll controlado o 3 de ancho completo apilados; textarea h-20; destello breve al terminar el último giro (apagado en reduced-motion).

Notas de verificación (código y fichas):
- Corregido y verificado: barra inferior con iconos de línea (captura 1-4, activo en dorado), chips de ejemplo tocables (L397-L408), eco a 13px, garantía 15 días coincide con FICHA-MERCADO (L33-L35) y precio US$9,99/mes con la ficha; reduced-motion respetado (L207, L375, L438, L476).
- Paleta vino/oro, Cormorant Garamond + Hanken Grotesk y radios coinciden con FICHA-ARTE; no es clon de los ejemplos vetados.
- Restos de emoji como íconos fuera del ritual: 🕯️ y ✨ en la lista de temas (L689, L702, L718, L733) siguen vigentes; no puntuados en estas capturas pero incumplen la regla de emojis.
- No verificable: estados "leyendo" y "error" (sin captura); la lectura completa ya no llega cortada según el reporte, pero la captura no la demuestra entera.

Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:2 h9:3 h10:3
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:2
Detalle copy: idea:3 especificidad:3 emoción:3 oferta:3 acción:2 (umbral ≥16/20: no se alcanza; acción ≤2 se corrige aunque el total pase; garantía nombrada con plazo: presente pero sin nombre ni "desde el primer cobro")

# VEREDICTO revisor-visual — tarot-ritual (Ronda 4)
Fecha: 2026-10-14 12:00
Screenshot: docs/revisiones/tarot-ritual-1-pregunta-375.png · docs/revisiones/tarot-ritual-2-elegir-375.png · docs/revisiones/tarot-ritual-3-reveladas-375.png · docs/revisiones/tarot-ritual-4-lectura-375.png · docs/revisiones/tarot-ritual-5-gancho-375.png
Usabilidad: 31/40
Craft: 14/20
Copy (si vende): 15/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. Lectura (capturas 4 y 5), cuerpo de 3 párrafos -> ~20 líneas de 13-14px CENTRADAS con líneas en blanco enormes entre párrafos: el texto largo centrado se lee mal, y es la parte que el usuario vino a consumir; el gancho queda tras un scroll largo y en la captura 4 el botón dorado asoma cortado bajo la barra. -> Alinear el cuerpo a la izquierda, 15px/1.6, párrafos con 16px de separación; dejar la caja del plan visible sin cortes al terminar.
2. Gancho (captura 5), microcopy de precio -> sigue "$9,99 al mes o $89,99 al año" sin "US$" (ambiguo entre monedas LATAM) y la garantía es solo "15 días de garantía": sin nombre ni "desde tu primer cobro", todo en una frase de 12,5px que cuesta leer; el sub-check de garantía nombrada no pasa limpio. -> Dos líneas: "Después US$9,99/mes o US$89,99/año · cancelas cuando quieras" y "Garantía LUMA de 15 días desde tu primer cobro".
3. Paso 1 (captura 1) -> textarea de ~145px para una pregunta de una línea sigue medio vacía, ~110px de aire muerto entre chips y CTA y chips en pirámide 2+1 de anchos desiguales; el encabezado dorado repite la idea de "respiración" sin ayudar a decidir. -> textarea de 3 líneas (h-20), chips apilados a ancho de la caja o en una fila alineada, bloque pregunta+chips pegado sobre el CTA.
4. Pasos 2 y 3 (capturas 2 y 3) -> composición flotante con ~130px vacíos arriba y abajo; las 6 cartas (76x118) y las 3 reveladas siguen siendo chicas para el momento emocional, con etiquetas de 11,5px y sin celebración visible al revelar (solo resplandor estático); el gancho del pago no aparece hasta la lectura. -> Cartas reveladas ≥112x175, nombres a 13px, destello breve al terminar el último giro (apagado en reduced-motion), bloque centrado con aire simétrico.
5. Gancho, jerarquía/copy (captura 5) -> el titular "Tu tirada de hoy es solo el principio. Mañana, LUMA te espera con tu carta del día" es genérico (no usa la pregunta del usuario ni lo que salió en SUS cartas) y las 3 piezas (caja, "Guardar en mi diario", aviso IA) tienen peso casi igual salvo el botón dorado. -> Titular específico y atado a la lectura ("Tu 4 de Oros aún tiene más que decirte: mañana, tu carta del día") y bajar "Guardar en mi diario" a enlace de texto.

Notas de verificación (código y fichas):
- Corregido y visible en capturas: "Quiero mis 3 días gratis" ya es el primario y es 1ª persona; "Guardar en mi diario" ahora es secundario con borde; precio y garantía visibles dentro de la caja; iconos de línea en la barra inferior; chips de ejemplo; flecha "volver" retrocede; reduced-motion respetado (useReducedMotion en page.tsx).
- Paleta vino/oro, Cormorant + sans humanista y radios coinciden con FICHA-ARTE; no es clon de los ejemplos vetados.
- No verificable: estados "leyendo" y "error" sin captura; heurística 1 puntuada sin ellos.

Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:3 h10:4 -> ajustada a 31 (h2:3 h5:3 h6:3 h9:2 h10:3 h8:3 h4:3 h1:2 h3:3 h7:3 al ponderar vacíos muertos y lectura centrada: ver defectos)
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:2 encaje:3
Detalle copy: idea:3 especificidad:3 emoción:3 oferta:3 acción:3 (total 15; falta 1 punto: garantía sin nombre ni inicio de plazo, titular del gancho genérico)
