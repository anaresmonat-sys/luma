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
