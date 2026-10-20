# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-11 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 29/40
Craft: 16/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [app/entrar/page.tsx — input de correo] No hay <form>/onKeyDown: escribir el correo y presionar Enter no hace nada (hay que tocar el botón sí o sí) → envolver input+botón en <form onSubmit> o agregar onKeyDown que dispare enviar() en Enter.
2. [app/paywall/page.tsx líneas 63-71] Los 3 beneficios y la línea "Hecho con tus N respuestas" se pintan primero en versión genérica y cambian de texto milisegundos después (useEffect que lee localStorage tras el primer paint) → parpadeo/salto de contenido visible en cada carga real. Leer localStorage de forma síncrona en el render inicial o mostrar skeleton hasta resolver.
3. [app/entrar/page.tsx — input de correo] Sin <label>/aria-label asociado, solo placeholder que desaparece al escribir → rompe la regla "labels visibles" del sistema. Agregar label visible arriba del input.
4. [components/paywall/PlanCards.tsx] La única señal de plan "seleccionado" es borde/sombra; no hay check o radio explícito → agregar ícono de check en la esquina de la card activa para reconocimiento inequívoco.
5. [header paywall/entrar — span "LUMA"] Usa la fuente body (Hanken Grotesk) en vez de la serif de marca que FICHA-ARTE define para el wordmark ("tracking ~0.3em" en Cormorant Garamond) → aplicar [font-family:var(--font-display)] al wordmark del header.

# VEREDICTO revisor-visual — paywall (Ronda 6)
Fecha: 2026-10-13 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 27/40
Craft: 15/20
Copy (si vende): 15/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Detalle usabilidad: h1:2 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:2 h9:2 h10:3
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3
Detalle copy: idea:3 especificidad:3 emoción:2 oferta:3 acción:4 (eje emoción <=2: se corrige aunque el total pasara)
Top defectos:
1. [Titular + subtítulo, parte alta] La reescritura quitó la escena del avatar: "3 días para probar LUMA, tu tarotista y coach" + "Descifra mensajes, saca tus cartas…" habla del producto, no del dolor (FICHA-AVATAR ancla: "obsesionada mirando el teléfono" → "en 1 minuto entiendes qué pasa y qué hacer hoy"). Ningún texto de la pantalla nombra la escena ni la ancla emocional, y "tarotista y coach" no es un mecanismo bautizado → titular/subtítulo que nombre la escena sin las palabras vetadas, p. ej. "Entiende qué te quiso decir, en 1 minuto" + "3 días gratis para probar LUMA"; trazar la frase a un campo de la ficha.
2. [Botón "Empezar mis 3 días gratis", app/paywall/page.tsx líneas 204-214] El tap hace window.location.href sin estado de carga ni bloqueo de doble tap: el usuario espera la navegación a Hotmart sin feedback (>100 ms) y puede disparar plan_elegido dos veces; tampoco hay manejo de error si checkoutHotmart falla → estado "Abriendo el pago seguro…" con botón bloqueado + try/catch con mensaje "No pudimos abrir el pago. Revisa tu conexión y vuelve a tocar el botón."
3. [Bloques de planes y timeline, centro de la pantalla] Repetición que no se gana su lugar: "3 DÍAS GRATIS" en las dos cards + "3 días" en titular, timeline y CTA, y "$89,99/año" aparece 4 veces (timeline, card, bajo CTA, "Se cobra"); además el CTA queda a ~1160px, fuera de la primera vista, sin sticky → quitar el badge de prueba de ambas cards (basta el titular y la timeline), dejar el precio anual 2 veces como máximo y hacer el CTA sticky al fondo.
4. [Garantía, línea inferior de 12px en --text-tertiary] La garantía no tiene nombre ni condición ("Garantía de 15 días", sin "desde el primer cobro") y es la línea más débil de la pantalla; además FICHA-MERCADO.md (§4: "Garantía elegida: 7") y el comentario de cabecera del código ("Garantía 7") contradicen el 15 mostrado, y ESTADO.md línea 318 marca pendiente verificarlo en Hotmart → nombrarla ("Garantía LUMA de 15 días: te devolvemos tu dinero") a 13px en --text-secondary junto al CTA, corregir FICHA-MERCADO y confirmar el plazo en el panel de Hotmart antes de vender.
5. [Aviso ?motivo=lectura-usada y beneficios, parte alta] Ambos se montan tras el useEffect (localStorage + URLSearchParams): el aviso empuja todo el contenido hacia abajo y los beneficios cambian de texto en cada carga real (CLS visible); además las cards de plan son botones sin role="radio"/aria-pressed, así que el plan elegido no se anuncia a lectores de pantalla → leer query/respuestas antes del primer paint (o reservar el espacio con skeleton) y envolver las cards en role="radiogroup" con role="radio" y aria-checked.

# VEREDICTO revisor-visual — paywall (Ronda 7)
Fecha: 2026-10-13 12:00
Screenshot: docs/revisiones/paywall-375.png (primera vista: docs/revisiones/paywall-primera-vista-375.png)
Usabilidad: 29/40
Craft: 15/20
Copy (si vende): 16/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:2 h10:3
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3
Detalle copy: idea:3 especificidad:3 emoción:3 oferta:3 acción:4 (sub-check "garantía nombrada" FALLA)
Verificado en código: CTA fijo >=48px (52px), whileTap 0.97, disabled solo tras pulsar, anti doble toque OK, FICHA-MERCADO ya dice 15 (consistente), ficha de arte respetada (vino/oro, Cormorant + Hanken, carta ownable). Eje 4 movimiento: stagger y tap OK; no hay conteo/dibujado de números ni celebración (no aplica del todo en paywall, pero no sube de 3).
Top defectos:
1. [Botón fijo "Abriendo el pago seguro…", app/paywall/page.tsx líneas 242-255] setAbriendoPago(true) nunca se revierte y no hay manejo de error: si checkoutHotmart lanza, la navegación se bloquea o el usuario vuelve atrás (bfcache) con el botón muerto al 70% diciendo "Abriendo…" → try/catch que haga setAbriendoPago(false) y muestre "No pudimos abrir el pago. Revisa tu conexión y toca de nuevo", y reset en el evento pageshow.
2. [Garantía, fila inferior "Garantía de 15 días", 12px text-tertiary, ~y 1225 de la captura completa] Sigue sin nombre ni condición ("desde el primer cobro") y está a >1000px del CTA fijo: ante la objeción "es caro / ya me cobraron sorpresa" (VoC 7, objeción 4) el CTA no la acompaña → mover una línea "Garantía de 15 días desde el primer cobro: te devolvemos tu dinero" a 13px text-secondary dentro de la barra fija, bajo la letra pequeña del cobro.
3. [Barra fija sobre el timeline, primera vista y selector de plan] En la primera vista la barra tapa el timeline a medio ítem ("Día 2 — te avisamos / Aviso antes de cualquier cobro" cortado) y las tarjetas Anual/Mensual quedan a ~1000px: el usuario pulsa un CTA cuyo plan (anual preseleccionado) no ha visto elegir → reducir padding inferior de la barra, o subir el selector de plan (2 chips compactos Anual/Mensual) encima del timeline para que se vea y se elija antes del botón.
4. [Cards de plan, components/paywall/PlanCards.tsx] Siguen sin role="radiogroup"/role="radio"/aria-checked (grep: solo aria-hidden), el plan elegido no se anuncia; y persiste la redundancia "3 DÍAS GRATIS" en ambas cards + "3 meses gratis" como ahorro, que se confunde con "3 días gratis" y "$89,99" 4 veces → añadir roles/aria-checked, quitar el badge de prueba de las cards y reformular el ahorro a "Ahorras 25% vs mensual" (verificable: 119,88 → 89,99).
5. [Beneficios y aviso ?motivo=lectura-usada, parte alta, useEffect líneas 75-79] El texto de beneficios se intercambia y el aviso se monta tras el primer paint (salto de contenido); además el copy no ata el dolor a "en 1 minuto" (ancla de la ficha) ni da una prueba (demo/testimonio) en la pantalla → leer respuestas/query antes del primer paint o reservar espacio con skeleton, y añadir una línea de prueba real ("Un análisis real en 1 minuto") trazada a FICHA-AVATAR.

# VEREDICTO revisor-visual — paywall (Ronda 8)
Fecha: 2026-10-13 18:00
Screenshot: docs/revisiones/paywall-375.png (primera vista: docs/revisiones/paywall-primera-vista-375.png)
Usabilidad: 28/40
Craft: 13/20
Copy (si vende): 16/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:2 h9:2 h10:3
Detalle craft: jerarquía:3 profundidad:2 identidad:3 movimiento:3 encaje:2
Detalle copy: idea:3 especificidad:3 emoción:3 oferta:3 acción:4 (plazo de garantía nombrado junto al CTA; sin eje <=2)
Verificado en código: radiogroup/radio/aria-checked OK; badge de prueba solo en la tarjeta elegida OK; reinicio del botón con pageshow + 8s OK; CTA 52px, whileTap 0.97, disabled solo tras pulsar OK; ficha de arte respetada (vino/oro, Cormorant + Hanken, carta ownable, wordmark serif). Aritmética del copy verificada: 89,99/12 = 7,50; 89,99/365 = 0,247; 119,88 - 89,99 = 29,89 (~3 meses). NO hay try/catch ni mensaje de error si checkoutHotmart lanza (defecto de Ronda 7 sin resolver).
Nota de evidencia: la captura "primera vista" mide 1126x731 y el ancho de la columna (~440px dentro de un lienzo mucho mayor) indica viewport de escritorio, NO 375x812; la captura completa tampoco es 375 de ancho. No se puede certificar el render real a 375px: recapturar con viewport 375x812.
Top defectos:
1. [Barra fija inferior sobre la tarjeta Anual y la tarjeta Mensual, primera vista] La barra del botón tapa el pie de la tarjeta Anual (la línea "Ahorras 3 meses frente al plan mensual" queda oculta y "Se cobra $89,99/año" pegada al botón) y la tarjeta Mensual no se ve en absoluto sin deslizar: la decisión de plan que se subió precisamente para verse sigue sin poder tomarse antes del botón, y el argumento de ahorro nuevo nunca se ve → compactar el bloque superior (carta a ~120px, 3 beneficios en 2 líneas cada uno o 2 beneficios) hasta que ambas tarjetas queden por encima de la barra a 375x812, o reducir la barra a botón + 1 línea; validar con captura real.
2. [Fondo con resplandor detrás de las tarjetas, borde a la altura del tercer beneficio] El div del halo (h-420px, inset-x-0, -top-10) se recorta en un rectángulo con borde duro visible que corta el tercer beneficio por la mitad y se lee como una caja distinta, no como luz → sustituir por un radial-gradient sobre el body/contenedor a ancho completo sin recorte (o mask-image con desvanecido vertical y -inset-x-10), y subir su inicio para que no atraviese texto.
3. [Botón "Abriendo el pago seguro…", app/paywall/page.tsx líneas 251-257] Sigue sin try/catch ni mensaje de error: si checkoutHotmart falla o el navegador bloquea la navegación, el usuario no recibe qué pasó ni qué hacer (solo se reactiva a los 8 s) → envolver en try/catch y mostrar bajo el botón "No pudimos abrir el pago. Revisa tu conexión y toca de nuevo", con role="alert".
4. [Pie de la tarjeta Anual, encaje con el botón] La tarjeta Anual termina a 0px del botón (padding inferior consumido por la barra), con el ahorro tapado y el precio "$7,50" en 24px casi del mismo peso que el CTA: el encaje parece accidental y la jerarquía precio/CTA compite → reservar padding-bottom del contenedor igual a la altura real de la barra (~120px) para que el scroll nunca deje una tarjeta pegada, y dejar el precio total anual a 13px en text-secondary legible.
5. [Aviso ?motivo=lectura-usada y beneficios, parte alta, useEffect líneas 81-85] Beneficios personalizados y aviso se montan tras el primer paint (salto de contenido y de altura que además desplaza las tarjetas bajo la barra); además la tarjeta "Mensual" repite el patrón sin dejar claro que también incluye los 3 días gratis hasta que se toca → leer query/respuestas antes del primer render (cookie/searchParams del servidor) o reservar altura, y mostrar en Mensual una línea "3 días gratis, luego $9,99/mes" fija.

# VEREDICTO revisor-visual — paywall (Ronda 9)
Fecha: 2026-10-14 12:00
Screenshot: docs/revisiones/paywall-1-primera-vista-375.png (también paywall-2-planes-375.png y paywall-3-final-375.png; 375x812 reales)
Usabilidad: 29/40
Craft: 14/20
Copy (si vende): 16/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:2 h10:3
Detalle craft: jerarquía:3 profundidad:2 identidad:3 movimiento:3 encaje:3
Detalle copy: idea:3 especificidad:3 emoción:3 oferta:3 acción:4 (sub-check "garantía nombrada": hay plazo y condición, pero sin nombre propio; sin eje <=2)
Verificado en código: radiogroup/radio/aria-checked OK; selector ya antes del calendario OK; insignia de prueba solo en la tarjeta elegida OK; CTA 52px, whileTap 0.97, disabled solo tras pulsar, reinicio por pageshow y 8 s OK; reduced-motion OK; ficha de arte respetada (vino/oro, Cormorant + Hanken, carta ownable). Gate de carga cognitiva: 0-1 fallos (3 beneficios, 2 planes, 1 acción primaria). Defectos de Ronda 8 que persisten: halo con borde duro (visto en la captura 1, banda que arranca justo bajo el 2º beneficio y corta el 3º), sin try/catch ni mensaje de error si checkoutHotmart lanza (líneas 251-257 sin cambios), y aviso/beneficios aún montados tras useEffect.
Top defectos:
1. [Halo detrás de las tarjetas, captura 1 a ~y 507, tercer beneficio "Un espacio privado…"] El div de resplandor (page.tsx líneas 167-174, h-420px, inset-x-0, -z-10) sigue dibujando un rectángulo con borde superior duro que atraviesa el tercer beneficio y se lee como una caja, no como luz → quitar ese div y poner el radial-gradient en el contenedor raíz a ancho completo con mask-image de desvanecido vertical, empezando bajo el último beneficio.
2. [Botón fijo, app/paywall/page.tsx líneas 251-257] No existe try/catch ni mensaje si checkoutHotmart lanza o la navegación se bloquea: el botón queda en "Abriendo el pago seguro…" 8 s sin decir qué pasó ni qué hacer (defecto abierto desde Ronda 7) → envolver en try/catch, setAbriendoPago(false) y mostrar bajo el botón con role="alert" "No pudimos abrir el pago. Revisa tu conexión y toca de nuevo."
3. [Primera vista, tarjeta Anual y barra fija] La tarjeta Mensual sigue fuera de la primera vista y la barra queda a ~20px del pie de la tarjeta Anual (el borde inferior se recorta bajo el degradado): el usuario que quiere comparar debe deslizar antes de decidir → compactar la carta (scale 0.55 o 90px de alto) y reducir mt-7 a mt-5 hasta que ambos planes entren sobre la barra, o recortar a 2 beneficios en la primera vista.
4. [Pie de página, captura 2/3: "Pago seguro con Hotmart · Garantía de 15 días" + letra pequeña de la barra] La garantía se repite dos veces en 12px text-tertiary, sin nombre propio, y "$89,99" aparece 3 veces (tarjeta, calendario, letra pequeña); contraste bajo del texto terciario sobre el vino → nombrar la garantía una sola vez ("Garantía LUMA: 15 días, te devolvemos tu dinero") a 13px en text-secondary dentro de la barra, y quitar el chip duplicado de la fila de confianza.
5. [Calendario de la prueba, ítem "Hoy — acceso completo / Todo LUMA, con uso justo cada día"] "uso justo" es lenguaje de política, no del usuario, y no dice qué límite hay → reemplazar por el límite real en palabras de la persona (p. ej. "Todo LUMA, 3 descifrados al día") o quitar la frase.

# VEREDICTO revisor-visual — paywall (Ronda 10)
Fecha: 2026-10-18 12:00
Screenshot: docs/revisiones/paywall-r10-1-primera-vista-375.png (también docs/revisiones/paywall-r10-2-final-375.png; ancho 375 real)
Usabilidad: 30/40
Craft: 14/20
Copy (si vende): 16/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:3 h10:3
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:2
Detalle copy: idea:3 especificidad:3 emoción:3 oferta:3 acción:4 (garantía nombrada con nombre y plazo junto al CTA: sub-check OK; sin eje <=2)
Defectos de Ronda 9 — estado: (1) halo con borde duro: RESUELTO (se ve luz difusa, sin caja). (2) try/catch + role="alert": RESUELTO en código (líneas 256-261 y 268-272), con la salvedad de que asignar window.location.href casi nunca lanza, así que si el navegador bloquea la navegación el usuario sigue sin mensaje hasta los 8 s. (3) Mensual fuera de la primera vista: PERSISTE (ver defecto 1). (4) garantía una sola vez con nombre, 13px text-secondary: RESUELTO; "$89,99" sigue 4 veces y la letra pequeña sigue en 12px text-tertiary: PARCIAL. (5) "uso justo": RESUELTO (timeline dice "Todo LUMA, desde hoy").
Verificado en código: CTA 52px ancho completo, whileTap 0.97, disabled solo tras pulsar, anti doble toque, pageshow + 8 s, reduced-motion en stagger, radiogroup/radio/aria-checked, header serif, paleta vino/oro y Cormorant + Hanken según FICHA-ARTE (sin desvío; no coincide con los clones vetados). Movimiento: stagger y tap, sin conteo/dibujado de números ni celebración (no sube de 3). Beneficios y aviso ?motivo siguen montándose tras useEffect (salto de contenido).
Top defectos:
1. [Primera vista, tarjeta Anual bajo el botón fijo, y=520-690] El botón fijo (y=658-708) pisa el pie de la tarjeta Anual (su borde inferior queda detrás del degradado de la barra) y la tarjeta Mensual no aparece sin deslizar: el usuario pulsa el CTA sin ver que hay otro plan, y el encaje tarjeta/barra parece accidental → bajar la carta a h-28 o quitar el subtítulo/un beneficio hasta que Anual y Mensual (o al menos un chip "Mensual $9,99") queden sobre la barra a 375x812, o dejar un hueco explícito de 16px entre el pie de Anual y la barra.
2. [Pie de la barra fija, letra pequeña 12px text-tertiary, y=762-790] "Después, $89,99 al año, más impuestos, en tu moneda local. Cancelas cuando quieras." es la promesa de transparencia más importante y es el texto más débil de la barra (contraste bajo sobre vino); además "$89,99" aparece 4 veces (tarjeta, "Se cobra", timeline, letra pequeña) → subirla a 13px text-secondary y quitar "Se cobra $89,99/año" de la tarjeta Anual (ya está en la letra pequeña y en el timeline).
3. [Beneficios y aviso lectura-usada, parte alta, page.tsx líneas 82-86] El texto personalizado y el aviso se montan tras el primer paint: salto de altura que desplaza las tarjetas bajo la barra en cada carga real → leer respuestas y query antes del primer render (initializer con comprobación typeof window + suppressHydrationWarning, o reservar altura mínima del bloque de beneficios).
4. [Fila "Ahora no · Restaurar compra", final de la página] "Restaurar compra" es jerga de tienda de apps y lleva a /entrar (iniciar sesión), no restaura nada; el usuario que ya pagó no entiende que debe entrar con su correo → renombrar a "Ya pagué, entrar" y mantener el destino /entrar?desde=paywall.
5. [Error de pago, page.tsx líneas 256-261] El try/catch casi nunca se dispara porque asignar location.href no lanza; si el navegador bloquea la redirección el botón vuelve a los 8 s sin explicar nada → tras el timeout de 8 s, además de reactivar el botón, hacer setErrorPago(true) para mostrar "No pudimos abrir el pago. Vuelve a intentarlo o escríbenos a soporte@tuluma.app." con role="alert".

# VEREDICTO revisor-visual — paywall (Ronda 11)
Fecha: 2026-10-18 18:00
Screenshot: docs/revisiones/paywall-r10-1-primera-vista-375.png (también docs/revisiones/paywall-r10-2-final-375.png; ancho 375 real)
Usabilidad: 31/40
Craft: 15/20
Copy (si vende): 16/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:4 h10:3
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3
Detalle copy: idea:3 especificidad:3 emoción:3 oferta:3 acción:4 (sin eje <=2; garantía nombrada con plazo junto al CTA)
Defectos de Ronda 10 — estado: (1) tarjeta Anual bajo la barra: RESUELTO (se ve completa, con ~16px de aire sobre el botón; la carta a scale .5 se lee pequeña pero legible). Mensual sigue sin verse en la primera vista: solo asoma un borde detrás del degradado, PARCIAL. (2) letra pequeña a 13px text-secondary: RESUELTO; "$89,99" quedó en 3 lugares (tarjeta, timeline, y ya no en la barra), aceptado. (3) salto de beneficios/aviso tras useEffect: PERSISTE, aceptado por el equipo (ver defecto 1). (4) "Ya pagué, entrar": RESUELTO, lenguaje del usuario. (5) mensaje de error a los 8 s: la línea 254-257 hace setErrorPago(true) tras el timeout y el <p role="alert"> existe: RESUELTO en código (no verificable en captura estática); h9 sube a 4 solo por esto con salvedad: el timeout dispara también si la redirección SÍ está en curso pero lenta (conexión lenta), mostrando "No pudimos abrir el pago" mientras Hotmart carga.
Verificado en código: CTA 52px ancho completo, whileTap 0.97, disabled solo tras pulsar, pageshow + 8 s, reduced-motion en stagger, radiogroup/radio/aria-checked, wordmark serif, ficha de arte respetada (vino/oro, Cormorant + Hanken, carta ownable; no coincide con los clones vetados). Movimiento: stagger y tap; sin conteo ni celebración (no sube de 3). Gate de carga cognitiva: 0 fallos relevantes (3 beneficios, 2 planes, 1 acción primaria). Umbral doble no alcanzado: usabilidad 31 < 36 y craft 15 < 16; copy 16 pasa sin eje <=2.
Top defectos:
1. [Beneficios y aviso lectura-usada, parte alta, page.tsx líneas 76-88] Cada carga real pinta 3 beneficios genéricos y luego los reemplaza por los personalizados (y el aviso empuja el contenido): es lo único que un usuario percibe sin buscarlo y sostiene h1 en 3 y h8 en 3; "costo conocido" no es un fix de diseño, hay solución limpia → leer localStorage con useSyncExternalStore (getServerSnapshot devuelve null, getSnapshot lee leerRespuestas()), que es seguro para hidratación, y reservar min-h del bloque de beneficios y del aviso.
2. [Barra fija inferior, y=660-790 de 812] La barra ocupa ~130px (16% de la pantalla) con 4 elementos apilados (botón, garantía, 2 líneas de letra pequeña) y aún así deja la tarjeta Mensual escondida; es mucho cromo para una pantalla con 1 acción → fusionar garantía y letra pequeña en 2 líneas totales (o mover la letra pequeña bajo las tarjetas, fuera de la barra) para liberar ~40px y que asome un chip "Mensual $9,99" completo sobre el botón.
3. [Timeline, ítem "Día 3 — 1er cobro: $89,99/año"] Con Mensual seleccionado muestra "$9,99/mes" pero el aviso de la barra y la tarjeta Anual conviven con el plan equivocado en la primera vista; además la tarjeta Mensual no dice que también lleva los 3 días gratis hasta tocarla, así que el usuario puede creer que solo Anual tiene prueba → mostrar en Mensual la línea fija "3 días gratis, luego $9,99/mes" (12px text-secondary), con el mismo patrón visual que Anual.
4. [Mensaje de error a los 8 s, page.tsx líneas 253-257] Dispara "No pudimos abrir el pago" aunque la redirección esté en curso en una conexión lenta, lo que asusta justo cuando el pago está cargando, y el timeout nunca se limpia (queda armado tras navegar de vuelta) → guardar el id del timeout, cancelarlo en pageshow y en cleanup, y en el texto decir "El pago tarda más de lo normal. Toca de nuevo el botón o escríbenos a soporte@tuluma.app."
5. [Movimiento, toda la pantalla] Solo stagger de entrada y tap; el precio héroe "$7,50" no cuenta ni hay respuesta al cambiar de plan (el borde salta, nada se desliza) → animar el borde de selección con layoutId compartido entre tarjetas (transición 200-300ms) para pasar craft de 15 a 16.

# VEREDICTO revisor-visual — paywall (Ronda 12)
Fecha: 2026-10-20 12:00
Screenshot: docs/revisiones/paywall-r12-1-primera-vista-375.png (también docs/revisiones/paywall-r12-2-transicion-375.png y docs/revisiones/paywall-r12-3-mensual-375.png; ancho 375 real)
Usabilidad: 32/40
Craft: 15/20
Copy (si vende): 16/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:4 h9:4 h10:3
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3
Detalle copy: idea:3 especificidad:3 emoción:3 oferta:3 acción:4 (sin eje <=2; garantía con plazo y condición junto al CTA, sin nombre propio)
Defectos de Ronda 11 — estado: (1) parpadeo de beneficios/aviso: RESUELTO en código (useLayoutEffect + lista `invisible` hasta leer; no se ve texto genérico que cambia). Salvedad: el HTML de servidor sale con esa zona invisible, así que sin JS o con hidratación lenta queda un hueco vacío de ~190px bajo el subtítulo (reservado, sin salto). (2) barra fija: RESUELTO (botón + garantía ~114px; letra pequeña bajo las tarjetas a 13px text-secondary, legible). La tarjeta Mensual sigue sin verse: en la primera vista solo asoma su rótulo "Mensual" cortado bajo el botón, sin precio — PARCIAL, tradeoff aceptado por el equipo, pero sigue costando h6. (3) Mensual sin línea de prueba: RESUELTO (tarjeta no elegida dice "Incluye 3 días de prueba"; elegida muestra la insignia). (4) timeout de error: RESUELTO (se cancela en pageshow y cleanup; texto "El pago tarda más de lo normal…" ya no asusta). (5) layoutId del marco dorado: RESUELTO (la captura 2 muestra el marco ya viajando hacia Mensual a 150 ms).
Verificado en código: CTA 52px ancho completo, whileTap 0.97, disabled solo tras pulsar, pageshow + 8 s, radiogroup/radio/aria-checked, ficha de arte respetada (vino/oro, Cormorant Garamond + Hanken Grotesk, carta ownable; no coincide con los clones vetados). Movimiento: stagger, tap, marco con spring; sin conteo de números ni celebración; el spring del marco (layoutId) NO está condicionado a prefers-reduced-motion (solo el stagger usa `reduce`), y no hay MotionConfig en la página. CTA vivo: contraste oro sobre vino alto, whileTap definido, habilitado por defecto, 52px de alto y ancho completo: cumple los 4. Gate de carga cognitiva: 0 fallos (3 beneficios, 2 planes, 1 acción primaria, bloques cortos).
Notas de evidencia: las 3 capturas muestran el indicador rojo de desarrollo de Next.js "1 Issue" encima de la línea de garantía (solo dev, pero hay un problema registrado en consola sin explicar y la captura no permite leer la garantía completa); la captura debe tomarse limpia (build de producción o indicador desactivado) y revisar qué es ese issue.
Top defectos:
1. [Tarjetas de plan al elegir, captura 1 vs 2 vs 3] Elegir plan cambia la altura de las dos tarjetas (la elegida pierde la línea "Incluye 3 días…" y gana la insignia; Anual sin elegir queda ~45px más alta que con la insignia): el contenido de abajo salta mientras el marco dorado se desliza y el efecto del layoutId se ensucia → igualar alturas (mostrar la línea de prueba solo en la tarjeta elegida pero reservar su espacio en ambas, o mover "Incluye 3 días" a la misma posición que la insignia) para que el marco viaje entre cajas del mismo tamaño.
2. [Primera vista, tarjeta Mensual bajo el botón, y=1350-1440 de la captura] Solo asoma el rótulo "Mensual" sin precio y cortado por el degradado: parece un error de maquetación, no una decisión, y quien quiere comparar no ve $9,99 → compactar la tarjeta NO elegida a una fila de ~64px (radio + "Mensual" + "$9,99/mes*" en la misma línea) o subir ~70px el bloque (quitar la línea "menos de $0,25 al día" o un beneficio) hasta que la fila completa quede sobre la barra.
3. [Captura 1-3, esquina inferior izquierda, indicador "1 Issue"] Hay un error/aviso activo de Next.js en la consola que tapa la garantía y que nadie explicó → abrirlo, corregir la causa y recapturar limpio; no declarar lista una pantalla con un issue sin diagnosticar.
4. [components/paywall/PlanCards.tsx línea 59, marco layoutId] La transición spring no respeta prefers-reduced-motion → envolver la página en <MotionConfig reducedMotion="user"> o pasar transition {duration: 0} cuando reduce sea true.
5. [Eje movimiento, "$7,50" héroe] Hay marco deslizante pero el precio héroe no cuenta ni hay celebración; el eje se queda en 3 (de las 7 baseline cubre stagger, tap, transición de selección) → animar el cambio de precio del timeline/tarjeta con una transición de dígitos (200 ms) y gatear todo con reduced-motion para llegar a craft 16.

# VEREDICTO revisor-visual — paywall (Ronda 13)
Fecha: 2026-10-20 18:00
Screenshot: docs/revisiones/paywall-r13-1-primera-vista-375.png (también docs/revisiones/paywall-r13-2-mensual-375.png y docs/revisiones/paywall-r13-3-final-375.png; ancho 375 real, sin indicador de desarrollo)
Usabilidad: 33/40
Craft: 15/20
Copy (si vende): 16/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:4 h7:3 h8:4 h9:4 h10:3
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3
Detalle copy: idea:3 especificidad:3 emoción:3 oferta:3 acción:4 (sin eje <=2; garantía con plazo y condición junto al CTA; no re-puntuada a fondo, sin cambios de copy relevantes)
Defectos de Ronda 12 — estado: (1) altura de tarjetas al elegir: RESUELTO (captura 1 vs 2: Anual y Mensual con la misma caja en ambos estados; el marco dorado viaja entre cajas iguales; sin salto de contenido). (2) Mensual cortada: RESUELTO (captura 1: Anual, Mensual con precio y la nota del asterisco completas sobre la barra). (3) "1 Issue": RESUELTO (las capturas salen limpias; la causa, un initial distinto servidor/cliente con reduced-motion, es verosímil; en código la página y Timeline ya usan initial constante y solo la duración depende de `reduce`). (4) reduced-motion del layoutId: RESUELTO (app/layout.tsx línea 34 envuelve en MotionConfig reducedMotion="user"). (5) conteo/celebración: PERSISTE (no se tocó).
Verificado en código: CTA 52px ancho completo, whileTap 0.97, disabled solo tras pulsar, habilitado por defecto, pageshow + timeout cancelable, radiogroup/radio/aria-checked, ficha de arte respetada (vino/oro, Cormorant Garamond + Hanken Grotesk, carta ownable; no coincide con los clones vetados). Movimiento: stagger, tap, marco con spring, línea del timeline que se dibuja (0 si reduce); NO hay conteo del precio ni celebración, así que el eje se queda en 3. Gate de carga cognitiva: 0 fallos. Umbral doble no alcanzado: usabilidad 33 < 36 y craft 15 < 16.
Top defectos:
1. [Timeline, captura 3, línea vertical bajo el nodo "Día 3"] La línea dorada (height 85% fijo en Timeline.tsx línea 26) se pasa del último círculo y asoma ~30px por debajo, como un cabo suelto; es lo primero que se ve desencajado en esa tarjeta → calcular la altura para que termine en el centro del último nodo (p. ej. bottom: 11px + top: 12px en vez de height 85%) y dibujarla con scaleY.
2. [Movimiento, precio "$7,50" y "$9,99" en tarjetas y "1er cobro" del timeline] Sigue sin conteo ni celebración: al cambiar de plan el precio del cobro del timeline cambia de golpe y ninguna cifra cuenta; es lo que mantiene el eje en 3 y el craft en 15 → animar el precio del timeline con transición de dígitos de 200 ms (AnimatePresence con y 6→0, o contador motion) gateada por `reduce`, y pulso suave al check de la tarjeta elegida; con eso movimiento llega a 4 y craft a 16.
3. [Parte baja, captura 3, entre timeline y "Ahora no · Ya pagué, entrar"] ~130px de aire muerto entre la tarjeta del timeline y la fila de salidas, y "Pago seguro con Hotmart" (12px text-tertiary, contraste bajo) queda lejos del botón de pago donde da confianza → reducir esos mt-7/mt-5 a mt-4 y mover "Pago seguro con Hotmart" a la barra fija junto a la garantía (13px text-secondary), o subirlo bajo la nota del asterisco.
4. [Insignias "3 DÍAS DE PRUEBA" en ambas tarjetas, captura 1] Con la insignia fija en las dos tarjetas ya no distingue nada (el plan no se diferencia por ella) y repite lo que dicen el titular, el CTA y el timeline (5 menciones de "3 días" en la pantalla) → quitar la insignia de las dos tarjetas y dejar "MÁS POPULAR" como único distintivo, o convertirla en un texto discreto 12px text-secondary; así Anual y Mensual se comparan por precio, que es la decisión real.
5. [Carta de marca, parte alta, 72px] A scale .34 la carta ownable se lee como un icono diminuto y pierde el efecto "objeto héroe" de FICHA-ARTE (3D + resplandor); la identidad queda en el color y la tipografía → subir la carta a ~96px recortando un beneficio (el tercero repite "privado y sin juicio" de la landing) o dejarla como marca de agua detrás del titular, para recuperar el dispositivo firma sin volver a empujar Mensual bajo la barra.

# VEREDICTO revisor-visual — paywall (Ronda 14)
Fecha: 2026-10-20 23:00
Screenshot: docs/revisiones/paywall-r14-1-primera-vista-375.png (también docs/revisiones/paywall-r14-2-final-375.png; ancho 375 real, sin indicador de desarrollo)
Usabilidad: 33/40
Craft: 15/20
Copy (si vende): 16/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:4 h7:3 h8:4 h9:4 h10:3
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3
Detalle copy: idea:3 especificidad:3 emoción:3 oferta:3 acción:4 (sin eje <=2; garantía con plazo y condición junto al CTA, sin nombre propio; sin cambios de copy desde la Ronda 13)
Defectos de Ronda 13 — estado: (1) línea del timeline con cabo suelto: RESUELTO (captura 2: dos tramos que arrancan bajo cada círculo y terminan en el borde del último nodo; en código Timeline.tsx usa top-[24px] -bottom-[22px] origin-top con scaleY escalonado 0.25 s y duración 0 si reduce). (2) conteo/celebración de números: PERSISTE (no se tocó; el precio del "1er cobro" sigue cambiando de golpe al elegir plan). (3) aire muerto y "Pago seguro con Hotmart": PARCIAL (el bloque final subió y el texto pasó a 13px text-secondary, legible; pero sigue ~85px de hueco entre el calendario y "Ahora no · Ya pagué", y la confianza de pago queda lejos del botón fijo, a ~110px de él). (4) insignias "3 DÍAS DE PRUEBA" en ambas tarjetas: decisión de la dueña, anotado y NO penalizado como defecto nuevo; sigue sin distinguir planes (5 menciones de "3 días"), pero cumple el criterio de que el copy de la prueba esté en las dos. (5) carta de marca 72px a scale .34: PERSISTE (se lee como icono; identidad apoyada en color y tipografía).
Verificado en código: CTA 52px ancho completo, whileTap 0.97, habilitado por defecto, disabled solo tras pulsar, pageshow + timeout cancelable, radiogroup/radio/aria-checked, MotionConfig reducedMotion="user" en layout, ficha de arte respetada (vino/oro #d8a441, Cormorant Garamond + Hanken Grotesk, carta ownable; no coincide con los clones vetados). CTA vivo: cumple los 4 anclas. Movimiento: stagger de entrada, tap, marco con spring, línea del timeline dibujada; falta conteo del número héroe y celebración (2 de las 7 baseline siguen ausentes: eje en 3). Gate de carga cognitiva: 0 fallos (3 beneficios, 2 planes, 1 acción primaria). Umbral doble no alcanzado: usabilidad 33 < 36 y craft 15 < 16.
Top defectos:
1. [Movimiento, precio "$7,50"/"$9,99" y "1er cobro: $89,99/año*" del timeline] Sigue sin conteo ni respuesta numérica al cambiar de plan: es lo único que separa craft 15 de 16 → animar el precio del "1er cobro" con transición de dígitos de 200 ms (AnimatePresence, y 6→0) o contador motion al montar el "$7,50", gateado por useReducedMotion; con eso el eje pasa a 4.
2. [Primera vista, nota "* Después de la prueba se cobra…" y botón fijo, y=1375-1445 de la captura] La nota del asterisco queda a ~8px del botón y bajo el degradado de la barra: se lee pegada y parece accidental, justo la promesa de transparencia del cobro → reducir ~12px arriba (por ejemplo mt-7 de las tarjetas a mt-5 o pb-40 a pb-44 del contenedor) para dejar 16px de aire sobre el botón.
3. [Parte baja, captura 2, entre "Ya pagué, entrar" y el botón fijo, y=1240-1440] "Pago seguro con Hotmart" sigue lejos del botón de pago y queda ~85px de hueco sobre él; la confianza debe acompañar al CTA → mover "Pago seguro con Hotmart" a la línea de garantía de la barra fija ("Garantía de 15 días desde que empiezas · Pago seguro con Hotmart") o subirla bajo la nota del asterisco, y quitar el bloque inferior.
4. [Carta de marca, parte alta, 72px scale .34] La carta ownable es un icono de ~34px de ancho: el dispositivo firma de FICHA-ARTE (carta 3D con resplandor) casi no se percibe y la pantalla se sostiene en color/tipografía → subirla a ~96px quitando el tercer beneficio ("Un espacio privado y sin juicio", ya dicho en landing) si Mensual sigue visible sobre la barra a 375x812.
5. [Insignias "3 DÍAS DE PRUEBA" en ambas tarjetas, decisión de la dueña] Se mantiene por decisión, pero para que no compita con el único distintivo real ("MÁS POPULAR") y con el precio héroe conviene bajarla de peso → pasar el chip a texto 12px text-secondary sin fondo (conserva el copy en ambas tarjetas sin hacer ruido); es sugerencia, no bloqueante.
