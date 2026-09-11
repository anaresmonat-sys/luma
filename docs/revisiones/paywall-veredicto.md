# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-11 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 28/40
Craft: 16/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [/entrar, header al escribir el correo] Sin ningún control de salida visible (ni X ni "‹ volver a los planes") mientras se completa el email — el único escape es tocar el logo "LUMA", que manda a "/" y pierde el contexto de "Restaurar compra" (ese back-con-contexto solo aparece DESPUÉS de enviar, en el estado "enviado"). Un usuario que llega desde "Restaurar compra" esperando el mismo botón X que vio en todo el funnel no lo encuentra → Fix: agregar "‹ Volver a los planes" / X en el header de /entrar desde el primer render cuando `?desde=paywall`, no solo en el estado "enviado".
2. [/entrar, header] Header estructuralmente distinto al resto del funnel: h-16 vs h-14 del paywall/confirmado, logo-chip alineado a la izquierda vs X + "LUMA" centrado y sticky con blur. Es exactamente la pantalla a la que manda "Restaurar compra", así que el salto de estilo se nota sin buscarlo → Fix: reusar el mismo header (X 44px + "LUMA" centrado, h-14, sticky) que ya comparten paywall y confirmado.
3. [/entrar, input de correo] La validación solo exige que el texto contenga "@" (`email.includes('@')`) — "hola@" o "a@b" pasan y solo fallarían después, en un paso que hoy ni siquiera está conectado a un backend real → Fix: validar con un regex de email simple antes de aceptar el envío.
4. [paywall, "Continuar con Google"] El botón no indica que no está disponible hasta DESPUÉS de tocarlo (el aviso "se activa en una etapa posterior" solo aparece tras el tap) — en el primer instante parece un login funcional → Fix: mostrar el estado "(disponible pronto)" visible en el propio botón, sin depender del tap para revelarlo.
5. [paywall, headline vs precio de plan] El titular ("3 días para probar…") y el precio de las cards ("$6,00" / "$9,99") comparten el mismo tamaño (28px/bold/display), compitiendo por ser el elemento más grande de la pantalla en el squint-test → Fix: diferenciar un escalón (ej. precio a 24px) para que la jerarquía de 4 niveles quede inequívoca.
