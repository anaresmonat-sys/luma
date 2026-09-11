# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-11 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 29/40
Craft: 16/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Fila "Ahora no · Restaurar compra" (paywall) + "Volver a los planes" (confirmado) + "Reenviar" (/entrar)] Tap targets de solo texto, sin padding ni min-height (code-verified en page.tsx/entrar/page.tsx), muy por debajo de 44px; "Ahora no" y "Restaurar compra" quedan a 20px de distancia pese a llevar a destinos opuestos (abandonar vs. recuperar compra) → envolver cada uno en un área táctil real (min-h-11 flex items-center px-3) sin cambiar el tamaño visual del texto.
2. [Pantalla "confirmado", docs/revisiones/paywall-confirmado.png] La tarjeta-resumen queda centrada con aire muy desigual (~450px arriba, ~850px abajo) dentro de un contenedor min-h-dvh capturado a ~1418px de alto, se lee como pantalla vacía/rota → verificar a la altura real de un dispositivo (375x812) antes de aprobar; si el hueco persiste ahí, anclar el contenido con justify-start/pt en vez de centrado puro.
3. [Header de "confirmado" vs. header del paywall principal] El paywall tiene barra sticky con blur + "LUMA" centrado; la confirmación solo deja la X flotante, sin barra ni marca — mismo flujo, mismo componente, apariencia distinta → reutilizar la barra de header (sin blur si se prefiere) con "LUMA" también en la confirmación.
4. [Botón CTA "Empezar mis 3 días gratis"] No refleja el plan seleccionado en su propio texto (persiste desde ronda 5, señalado entonces como bajo impacto) → opcional pero barato: "Empezar mi plan Anual/Mensual gratis" dinámico según selección.
5. [Enlace "Restaurar compra" → /entrar] La página destino no ofrece regreso explícito al paywall (solo "Volver al inicio" tras enviar, o el logo a "/" antes de enviar) → agregar un enlace "‹ Volver" que regrese a /paywall.
