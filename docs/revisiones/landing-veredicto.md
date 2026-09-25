# VEREDICTO revisor-visual — landing
Fecha: 2026-09-12 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 33/40
Craft: 17/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) Agitación (justo debajo de "¿Te suena?", mismo bloque visual — Problema.tsx usa flush="bottom" y Agitacion.tsx flush="top" para leerse como UN solo movimiento) → los íconos pasan de chip SVG con borde (IconChip, cuyo propio comentario en ui.tsx y en Problema.tsx dice literalmente "jamás emoji") a emoji sueltos sin contenedor a mitad del mismo bloque continuo → fix: unificar el tratamiento (chip 44px para ambas secciones, o documentar y aplicar la excepción también a Problema) para que el sistema de íconos no cambie a mitad de un mismo movimiento visual. 2) Agitación, primera frase → el emoji "😵‍💫" es una secuencia ZWJ (cara mareada + espiral) con soporte tipográfico inconsistente entre plataformas/navegadores (riesgo real de verse partido en 2 glifos separados fuera de este entorno de captura) → fix: usar un emoji de un solo code point (ej. 😖) para eliminar el riesgo de fallback roto. 3) Chip "descifrar la conversación" (Solución) → el screenshot entregado es de página completa (16 042px de alto comprimidos a ~2000px efectivos): a esa resolución NO se puede confirmar con certeza a nivel de píxel si el borde quedó parejo ni el tamaño/alineación exactos del chip → fix: adjuntar una captura recortada de esa sección puntual (como se hizo antes con landing-hero-375.png/landing-casos-375.png) para cerrar la verificación con evidencia real, no solo con lectura de código. 4) Chip "descifrar la conversación" (Solución) → al quitar el Hairline degradé solo en este elemento, queda con un borde plano semitransparente mientras Oferta/Garantía conservan el detalle firma del hairline; el chip del mecanismo bautizado (uno de los 1-3 usos "que importan" según el propio sistema) pierde su único tratamiento distintivo y se ve más plano que el resto de cajas de la página → fix: sumar un relleno sutil de acento (6-8%) al borde sólido para que no se perciba "apagado" al lado de las cards con hairline. 5) Heredado de la ronda anterior (no tocado esta vez, sigue presente) → Oferta: los CTA de Anual y Mensual repiten el mismo texto sin señal de qué plan se eligió, y Mensual usa un <a> outline hecho a mano en vez de una variante del mismo componente → fix: agendar para la próxima ronda de pulido.

---

# VEREDICTO revisor-visual — landing (Ronda 4)
Fecha: 2026-09-12 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 31/40
Craft: 14/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) Problema §2, pregunta 4 ("¿Otra vez estoy repitiendo el mismo patrón...?") → el emoji 🔁 se renderiza (Segoe UI Emoji, Windows) como un cuadrado azul sólido y saturado dentro del IconChip tone="muted" — rompe la paleta "Terciopelo & Oro" y el propio comentario del código ("neutro apagado, nunca... colores que no sean de marca"); es el elemento que más salta a la vista al bajar por la lista de 4 preguntas → fix: cambiar por un emoji cuyo render nativo sea acorde a la paleta cálida (o volver a un glifo SVG tintado con var(--accent)/var(--text-secondary) solo para este ítem, ya que el emoji no permite controlar su color). 2) Problema §2, pregunta 3 ("¿Qué le respondo...?") → el emoji 💬 se renderiza como una burbuja blanca lisa y plana, de tratamiento visual distinto (vectorial/flat) al de los otros 3 íconos de la MISMA sección (⏳🤔, estilo "sticker" a color) y a los de Agitación (😖🌙💔) → el sistema de íconos quedó unificado en TIPO (emoji en ambas secciones) pero sigue sin ser homogéneo en ESTILO dentro de Problema mismo → fix: elegir 4 emoji cuyo render en Windows comparta el mismo lenguaje "sticker a color" (evitar los que Segoe renderiza como glifo plano tipo ícono de sistema). 3) Problema §2, pregunta 2 ("¿Estoy exagerando...?") → el emoji 🤔 en Segoe UI Emoji se ve con una expresión de sorpresa/mano tapando la boca, muy distinta del gesto "pensativo/dudoso" que sugiere el copy y de cómo se ve en Apple/otros sistemas → riesgo de lectura ambigua del ícono y de divergencia visual fuerte entre plataformas (el mismo tipo de riesgo cross-platform que motivó cambiar el 😵‍💫 de Agitación) → fix: probar el render en 2-3 plataformas o sustituir por un emoji con menor divergencia entre sistemas (ej. 😕/🫤). 4) Solución §4, chip "descifrar la conversación" → CONFIRMADO con la captura recortada: el borde ya no se ve "roto" (perímetro completo, sólido), corrigiendo el defecto de la ronda anterior — pero el fill de acento al 8% es casi imperceptible contra el fondo oscuro a este zoom, por lo que el chip del mecanismo bautizado sigue leyéndose bastante parecido en peso visual a los chips numerados "01/02/03" de abajo, en vez de distinguirse como EL elemento especial de la sección → fix: subir el fill a ~12-14% o sumar una sombra tintada sutil para que se perciba con más autoridad. 5) Heredado de la ronda anterior (fuera de alcance de esta ronda, sigue sin resolver) → Oferta: los CTA de Anual y Mensual repiten el mismo texto sin señal de qué plan se eligió, y Mensual usa un <a> outline hecho a mano en vez de una variante del mismo componente → fix: pendiente, agendar.

---

# VEREDICTO revisor-visual — landing (Ronda 5)
Fecha: 2026-09-12 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 33/40
Craft: 15/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Detalle usabilidad: h1:2 h2:4 h3:3 h4:3 h5:4 h6:4 h7:3 h8:3 h9:4 h10:3
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3
Verificación de los 4 fixes reportados:
- Defecto 1 (🔁 → 😩, pregunta 4): CONFIRMADO en landing-problema-375.png. Ya no hay cuadrado azul; el glifo es una cara amarilla "sticker" coherente con el resto.
- Defecto 2 (💬 → 😳, pregunta 3): CONFIRMADO. Ya no hay burbuja blanca plana; ahora es cara amarilla del mismo estilo que las otras 3.
- Defecto 3 (🤔 → 😕, pregunta 2): CONFIRMADO. Gesto coherente con el copy ("¿Estoy exagerando...?"), mismo estilo visual que 😳/😩.
  Los 3 fixes en conjunto SÍ resuelven la inconsistencia de estilo que rompía la sección: los 4 íconos de Problema (⏳ 😕 😳 😩) ahora se leen como un mismo lenguaje visual "sticker a color". Persiste un matiz menor no bloqueante: ⏳ es un emoji-objeto y los otros 3 son emoji-cara — mezcla de categoría, no de estilo de render (ver defecto #3 de esta ronda abajo).
- Defecto 4 (chip "descifrar la conversación": fill 8%→13% + sombra tintada): CONFIRMADO en código (Solucion.tsx línea 79) y visualmente en landing-solucion-375.png — el chip ya no pesa igual que los 01/02/03: se distingue por forma (pill vs cuadrado), posición (bajo el titular) y ahora también por un fill más cálido. La distinción sigue apoyándose más en forma/posición que en el salto de color (13% vs el 10% de --chip-bg de los numerados es un delta chico) — mejora real pero no contundente.
Top defectos:
1. [Oferta, sección de planes — no capturada en esta ronda pero confirmada como pendiente por el propio reporte] Los CTA de Anual y Mensual no muestran señal de selección (el usuario no sabe qué plan escogió) y Mensual usa un `<a>` con outline hecho a mano en vez del componente de botón del kit → fix: variante "seleccionado" (fill sólido + check) en ambos planes + reemplazar el `<a>` por el mismo componente de botón reutilizable. Es la causa principal de que h1 (visibilidad de estado) y el eje de Encaje Óptico no suban esta ronda.
2. [Solución, chip "descifrar la conversación"] El fill subió de 8% a 13%, pero sigue cerca del 10% de --chip-bg que usan los chips numerados 01/02/03: la distinción depende sobre todo de la forma (pill) y la posición, no de un salto de color contundente → fix: subir a ~18-20% o usar un fill menos diluido para que gane autoridad de color, no solo geométrica.
3. [Problema, lista de 4 preguntas] El set mezcla un emoji-objeto (⏳) con 3 emoji-cara (😕😳😩): ya no hay error de render ni choque de estilo, pero la categoría del glifo no es 100% homogénea dentro de la misma lista de 4 → fix opcional de pulido: sustituir ⏳ por una cara equivalente si se busca máxima uniformidad; no bloquea.
4. [Craft general] Ningún eje llega a 4/4 (ejemplar): jerarquía, profundidad, identidad, movimiento y encaje se sostienen en un 3 sólido pero ninguno tiene el detalle de showcase que lo lleve al top decile → fix: una vez resuelto el defecto 1, llevar el eje de Encaje a un acabado de referencia antes de la próxima revisión.

---

# VEREDICTO revisor-visual — landing (Ronda 6)
Fecha: 2026-09-12 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 34/40
Craft: 16/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Detalle usabilidad: h1:3 h2:4 h3:3 h4:3 h5:4 h6:4 h7:3 h8:3 h9:4 h10:3
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:4
Detalle copy: idea:4 especificidad:4 emoción:4 oferta:3 acción:4 (sin cambios de copy esta ronda — Oferta no tocó ningún texto, solo el componente del CTA)
Verificación del fix reportado (defecto 1 de la Ronda 5, único abierto de este ciclo):
- CONFIRMADO en código (Oferta.tsx línea 190: `<CtaButton href={mensual.ctaHref} variant="outline" fullMobile>`) y visualmente en landing-oferta-375.png — el CTA "Mensual" ya NO es un `<a>` hecho a mano: es el mismo `CtaButton` compartido con `variant="outline"` (mismo radius, mismo alto 52px, mismo whileTap 0.97, mismo focus-ring) que usa toda la app. Cero variante accidental.
- Señal de distinción Anual (recomendado) vs Mensual: CONFIRMADO visualmente — badge "LA MÁS ELEGIDA", Hairline emphasis (borde 2px degradado + sombra tintada), fondo con tinte de acento 5% y CTA sólido en Anual, contra card con borde plano, sin badge y CTA outline en Mensual. La jerarquía visual entre planes es clara e inequívoca (esto ya existía antes de esta ronda, sin cambios, y sigue funcionando sin regresión).
- Efecto en el puntaje: el defecto que I) rompía la consistencia de componentes (h4) y II) aplanaba el encaje óptico de Oferta queda resuelto → craft/encaje sube 3→4 (mecanismo ahora idéntico en construcción a cualquier otro CTA del kit). h1 sube 2→3 porque el botón Mensual ahora da feedback de tap consistente con el resto del sitio (antes era un `<a>` sin `whileTap`, una superficie "muda" al lado de botones que sí responden).
- Con esto, el defecto ÚNICO que venía arrastrando el ciclo desde la Ronda 3 (ver defecto 5/1/1 en las tres rondas previas) queda cerrado sin regresiones en las secciones ya aprobadas (Problema/Agitación/Solución reconfirmadas sin cambios en landing-problema-375.png / landing-agitacion-375.png / landing-solucion-375.png).
Top defectos:
1. [Usabilidad general, transversal] El total de 34/40 queda 2 puntos por debajo del gate (≥36) NO por un bug puntual sino porque varios criterios (h3 control y libertad, h7 flexibilidad, h8 estético/minimalista, h10 ayuda contextual) se sostienen en un 3 sólido ("bien, solo un ojo entrenado detecta qué afinar") sin ningún defecto visible específico que los tire abajo → fix: no hay un fix de una línea; requiere una pasada de pulido fino sección por sección (microcopy de ayuda contextual, algún atajo/default adicional) si se quiere cruzar el gate numérico — evaluar si vale la pena vs. lanzar con este nivel, que ya es sólido para producción real.
2. [Oferta, ambos CTA] "Descifrar mi primera conversación" es IDÉNTICO en la card Anual y en la Mensual — no hay ninguna palabra que referencie el plan elegido (ni siquiera "(plan anual)"/"(plan mensual)" en el mismo botón) → fix: diferenciar el copy del CTA por plan, o al menos agregar el nombre del plan en el botón, para que quien mira solo los dos botones (sin leer el card completo) sepa qué está por elegir.
3. [Solución, chip "descifrar la conversación" — heredado, sin tocar esta ronda] Sigue con fill de acento ~13%, muy cerca del 10% de --chip-bg de los chips numerados 01/02/03 → la distinción se apoya más en forma/posición que en un salto de color contundente → fix: subir a ~18-20% (pendiente desde Ronda 4, confirmado sin cambios en landing-solucion-375.png de esta ronda).
4. [Problema, lista de 4 preguntas — heredado, cosmético] ⏳ sigue siendo emoji-objeto contra 😕😳😩 emoji-cara: mezcla de categoría menor, no bloqueante → fix opcional, sin prisa.
5. [Craft general] jerarquía, profundidad, identidad y movimiento siguen en 3/4 (sólidos, no ejemplares); solo encaje llegó a 4 esta ronda gracias al fix de Oferta → fix: si se busca craft de showcase (18-20/20), sería la siguiente prioridad, pero ya cumple el gate de craft (≥16/20).

---

# VEREDICTO revisor-visual — landing (Ronda 7 · sección nueva 5B Sinergia + El Círculo)
Fecha: 2026-09-25 00:00
Screenshot: docs/revisiones/landing-375.png (página completa; sección puntuada sobre docs/revisiones/landing-sinergia-375-antes.png y docs/revisiones/landing-sinergia-375-despues.png)
Usabilidad: 33/40
Craft: 16/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Detalle usabilidad: h1:3 h2:4 h3:3 h4:3 h5:4 h6:4 h7:3 h8:2 h9:4 h10:3
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3
Detalle copy: idea:3 especificidad:4 emoción:3 oferta:4 acción:3 (trazabilidad a FICHA-AVATAR.md: NO VERIFICADA en esta ronda, no se leyó la ficha del avatar)
Efecto de 5B en la página: EMPEORA LIGERAMENTE el conjunto (h8 3→2, encaje 4→3, copy acción 4→3), aunque suma un gancho de curiosidad genuino y bien ejecutado en sí mismo. No rompe nada previo; el neto es negativo por dilución del camino de venta, no por bug.
Verificado en código (SinergiaCirculo.tsx): whileTap 0.97 en el botón; conteo animado del % con reduced-motion (aparece directo); barra que se llena; aria-live en el resultado; aviso "Elige los dos signos" al calcular incompleto (botón nunca disabled: CTA vivo); relleno borroso aria-hidden y de relleno (no expone análisis real); tope "10 personas al mes" honesto. NO hay transición de celebración ni undo/limpiar del cálculo (solo cambiar selects).
Top defectos:
1. [Sección 5B, resultado calculado, caja borrosa (aprox. y 1200-1380 del recorte "después")] Dos botones dorados de relleno sólido en la MISMA tarjeta y a ~250px de distancia ("Calcular sinergia" y "Descifrar mi primera conversación"), y el segundo es un CTA dorado a media página antes de la Oferta: compiten con el CTA héroe y rompen "una acción primaria por pantalla" → fix: "Calcular sinergia" pasa a variante outline/secundaria (borde oro, sin relleno); solo el CTA de la caja borrosa queda en oro sólido.
2. [Sección 5B completa, ubicación entre carrusel de la app y Oferta (page.tsx línea 151)] La página gira de vender "descifrar conversaciones" a un juego de horóscopo justo antes del precio; la sección pesa ~2 pantallas de scroll (≈1990px a 2x) y desvía a quien estaba a punto de decidir → fix: reducir a lo esencial (calculadora + una sola fila de 3 tarjetas de Círculo con menos alto) o mover la sección antes de Solución/carrusel, nunca inmediatamente antes de Oferta.
3. [El Círculo, carrusel de 3 tarjetas (aprox. y 1520-1790 recorte "antes")] Las tarjetas se recortan de golpe en el margen derecho del contenedor (no sangran hasta el borde de pantalla), no hay indicador de que hay más (puntos/flecha) y solo se ven 1,3 de 3; la tercera ("Mi cita") queda escondida y el elemento parece interactivo sin destino → fix: hacer sangrar el carrusel al borde (-mx del padding y pl inicial), mostrar ~1,5 tarjetas y añadir 3 puntos indicadores, o apilar en vertical las 3 tarjetas cortas.
4. [Calculadora, selects nativos (recorte "antes" y 630-940)] Tras el título y el párrafo, el usuario debe abrir dos <select> nativos para ver algo; la tarjeta arranca vacía sin resultado ni ejemplo precargado (empty state que no enseña) → fix: precargar una pareja de ejemplo con su % ya visible (ej. Libra + Piscis, la que ya usa el carrusel) o un valor por defecto en cada select, con el borroso ya activo.
5. [Resultado, caja borrosa (recorte "después" y 1020-1380)] El texto encima del difuminado más el botón lleva ~330px de alto con relleno visible detrás que se ve turbio y ocupa más que el propio resultado (95%); además los emoji 💞🌸✨ de las tarjetas se mezclan con glifos ♎︎♓︎ de texto: dos sistemas en la misma tarjeta (el sistema emoji sí está permitido por la ficha, pero el glifo del signo sale en dorado plano y el emoji a color) → fix: reducir el alto de la caja a ~2 líneas de relleno y unificar el encabezado de tarjeta (emoji solo o glifo solo).

---

# VEREDICTO revisor-visual — landing (Ronda 8 · sección 5B reubicada y compactada)
Fecha: 2026-09-25 00:00
Screenshot: docs/revisiones/landing-375.png (página completa; sección puntuada sobre docs/revisiones/landing-sinergia-375-despues.png y SinergiaCirculo.tsx)
Usabilidad: 34/40
Craft: 16/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Detalle usabilidad: h1:3 h2:4 h3:3 h4:3 h5:4 h6:4 h7:3 h8:3 h9:4 h10:3
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3
Detalle copy: idea:3 especificidad:4 emoción:3 oferta:4 acción:4 (trazabilidad a FICHA-AVATAR.md: NO VERIFICADA, no se leyó la ficha del avatar en esta ronda)
Verificación de los cambios pedidos:
- CONFIRMADO: 5B ya no queda pegada a la Oferta; va tras "Cómo funciona" y antes del recorrido por la app (defecto 2 de R7 mitigado, h8 2→3, acción 3→4).
- CONFIRMADO en captura y código (línea 157-164): "Calcular sinergia" es botón de contorno; el único oro sólido de la sección es el CTA de la caja borrosa (defecto 1 de R7 cerrado).
- CONFIRMADO: el carrusel sangra al borde derecho (-mx-5 + px-5) y hay pista "Desliza para ver más →" (defecto 3 cerrado a medias: la pista es solo texto de 12px en terciario, sin puntos; el propio texto se oculta en desktop).
- PARCIAL: calculadora con selects precargados (Leo–Sagitario en el código), pero el resultado NO se ve hasta tocar "Calcular"; y la captura "después" muestra Aries–Leo/95% mientras el código precarga Leo–Sagitario, o sea el recorte no corresponde al estado por defecto actual y no prueba lo que se dice haber cambiado.
- Quitado el párrafo de fricciones: CONFIRMADO en captura (la caja borrosa ya no muestra relleno turbio visible, solo el texto y el botón).
Verificado en código: whileTap 0.97, conteo animado con reduced-motion, barra que se llena, aria-live, aviso de selección incompleta, botón nunca disabled. Sin undo/limpiar ni celebración.
Top defectos:
1. [Usabilidad, transversal] 34/40 queda a 2 puntos del gate (≥36): h3, h7, h10 siguen en 3 sin defecto puntual; la página acumula 3 chips/secciones de "juego" y demostración antes de la Oferta → fix: pasada de pulido de ayuda contextual/atajos, no hay fix de una línea.
2. [5B, resultado, caja borrosa (aprox. y 1080-1350 del recorte)] El bloque con borde, texto de 3 líneas y botón dorado de 2 líneas ("Descifrar mi primera / conversación") ocupa casi tanto como el resultado; el CTA en 2 líneas dentro de caja estrecha se ve apretado y rompe el encaje → fix: CTA a ancho completo con texto corto en 1 línea ("Descifrar mi conversación") o quitar el borde del contenedor.
3. [5B, calculadora, estado inicial] La tarjeta abre solo con selects y un botón contorno tenue; el número héroe (95%) no existe hasta el tap, y el botón de contorno sobre fondo oscuro cálido se lee casi como deshabilitado (borde 45% acento, fill oscuro) → fix: calcular al montar con el ejemplo precargado (resultado ya visible) o subir el borde del contorno a ≥70% acento.
4. [Círculo, tarjetas (aprox. y 1680-1870)] Mezcla emoji a color (💞) con glifo del signo (♎︎) en dorado plano en la misma cabecera; el carrusel solo insinúa la 2ª tarjeta y la 3ª no se ve → fix: añadir 3 puntos indicadores o reducir el ancho de tarjeta a ~220px para mostrar 1,5.
5. [Evidencia] Recorte "después" no coincide con el estado por defecto del código (Aries–Leo vs Leo–Sagitario), y landing-375.png a 83px de ancho efectivo (9090px de alto) no permite verificar detalles → fix: regenerar los recortes desde el build actual antes de la Ronda 9.
