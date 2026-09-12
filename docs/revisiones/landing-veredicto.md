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
