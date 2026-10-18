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
