# VEREDICTO revisor-visual — landing
Fecha: 2026-09-10 15:40
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 29/40
Craft: 10/20
Copy (si vende): 14/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) En el screenshot de página completa TODO lo posterior al carrusel (Oferta/precios, Garantía, FAQ, CTA final) no se ve: ~9.000px de vacío negro y solo el footer al fondo — las secciones quedan en opacity:0 porque el reveal `whileInView` no dispara sin scroll/JS. 2) El visual del hero es una caja discontinua vacía: cero demo del mecanismo para una audiencia escéptica que exige "muéstrame el análisis real". 3) Sin dispositivo ownable en la landing (falta la carta de tarot de pergamino de FICHA-ARTE): oscuro + un acento oro + Cormorant = intercambiable con cualquier landing "mística premium". 4) Doble reverso de riesgo sin jerarquía (3 días gratis + Garantía de 7 días) obliga a releer. 5) Profundidad plana: blooms al 0.4, sombras recortadas y el "rim highlight" de FICHA-ARTE no implementado.

---

## FORMATO DE SALIDA

VEREDICTO: NO LISTA
USABILIDAD: 29/40  (detalle: h1:2 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:3 h10:3)
CRAFT:      10/20  (detalle: jerarquía:3 profundidad:2 identidad:2 movimiento:2 encaje:1)
COPY:       14/20  (detalle: idea:3 especificidad:2 emoción:3 oferta:3 acción:3)
FIDELIDAD:  N/A (sin referencia vigente — propuesta propia; no se aplica test de fidelidad)

GATE: falla los tres umbrales — usabilidad 29 < 36, craft 10 < 16, copy 14 < 16 (y eje 2 de copy = 2, se corrige aunque pasara el total).

### Gate de carga cognitiva
Sin sobrecarga crítica: página bien troceada (4 preguntas, 3 pasos, 5 features/plan, 5 FAQ, 5 frames), 1 acción primaria repetida, nada que memorizar. Único punto: varios enlaces hoy caen en 404 (/onboarding, /entrar, footer legal) — el parent lo marca como normal en esta etapa, no se cuenta como falla de gate.

### CTA héroe vivo — CUMPLE los 4
- Contraste oro #d8a441 sobre #1a0d13 ≈ 7:1 (≥3:1). OK
- whileTap scale 0.97 + hover:bg + transition 150ms. OK
- `<a>` siempre habilitado, nunca disabled. OK
- h-[52px] + w-full en mobile. OK
(Único reparo: apunta a /onboarding inexistente — esperado en esta etapa.)

### Anclas de conversión
- Titular con énfasis: "Entiende" en oro sobre serif bold. OK
- ≥1 hairline degradé + chips SVG sin emojis: Hairline en chip del mecanismo, garantía y plan anual; IconChip = Lucide SVG, cero emojis en la landing. OK
- Secciones adyacentes distinguibles: alternancia base/elevada, pero el contraste #1a0d13 vs #241019 es muy sutil en el render. Borderline.
- Sub-check garantía nombrada: "la Garantía de los 7 Días" con nombre + plazo cerca del CTA y en el PS. OK
- Sub-check message-match: no verificable (sin dato de creativo de origen / archivo 34).

---

## TOP DEFECTOS

1. [Página completa — todo lo posterior al carrusel "Así se ve por dentro"] La Oferta/precios, la Garantía, el FAQ y el CTA final NO aparecen en el screenshot: hay ~9.000px de vacío negro y solo el footer flota al fondo. Las secciones usan `initial="hidden"` + `whileInView` (useReveal) y se quedan en `opacity:0` cuando el IntersectionObserver no dispara (captura full-page sin scroll / JS lento / sin JS). Las secciones que deciden el dinero desaparecen. → Fix: revelar por mejora progresiva — contenido visible por defecto, animación solo como enhancement (o fallback que fuerce estado "visible" si el observer no corrió en ~200ms).

2. [Hero — recuadro visual] El "producto" en el hero es una caja discontinua vacía (~250px) con una frase de sugerencia; no muestra el mecanismo a una audiencia escéptica (FICHA-AVATAR: consciencia 3-4, "ya probé apps así y las abandoné", ángulo recomendado = DEMO del análisis real). → Fix: demo real del análisis, aunque sea estática y rotulada "ejemplo": mensaje → hechos vs historias → posible riesgo → qué responder.

3. [Identidad visual — toda la página] Ningún dispositivo ownable de FICHA-ARTE está presente (la carta de tarot de pergamino que flota con sombra + resplandor, círculos de emoción, ítems del analizador con color propio). Queda oscuro + un acento oro + Cormorant Garamond = intercambiable con cualquier landing "mística premium". → Fix: montar la carta de pergamino como visual del hero (sombra de contacto + resplandor ámbar reales) y repetir un rasgo firma (grano/textura cálida o la carta) en 1-2 secciones más.

4. [Oferta / FAQ / PS] Doble reverso de riesgo sin jerarquía: "3 días gratis" (badge en ambos planes) + "la Garantía de los 7 Días" obligan a releer para saber si son 3 o 7 días. → Fix: una promesa dominante ("Empieza gratis 3 días") y la garantía como respaldo secundario en una línea ("y si pagas y no era para ti, 7 días para el reembolso completo").

5. [Profundidad / encaje — general] La ronda de densidad dejó los blooms al 0.4 y las sombras recortadas; sobre el vacío negro la página se lee plana y los 3 niveles de superficie apenas se distinguen. El "rim highlight" que pide FICHA-ARTE (`inset 0 1px 0 rgb(255 255 255/.5)`) no está en tokens.css ni en los componentes. → Fix: aplicar el rim highlight en `--surface`/cards y subir un punto el contraste de las superficies elevadas.

---

## NOTAS POR RÚBRICA

USABILIDAD (29/40)
- h1 Estado del sistema (2): dentro de lo que renderiza, el tap (0.97), el acordeón y el carrusel tienen feedback correcto en código; pero al hacer scroll hacia la oferta el usuario encuentra un vacío negro ("¿se rompió?").
- h2 Lenguaje (3): copy en el mundo del avatar (releer, espiral, patrón, "sin cobros por mensaje"); resta que los kickers "EL MECANISMO" y "LA OFERTA" son etiquetas de marketer visibles.
- h3 Control y libertad (3): "Entrar", FAQ que colapsa, sticky de 2 estados con scroll a #oferta; sin trampas de modal. Suficiente para una landing.
- h4 Consistencia (3): kit disciplinado (CtaButton, CheckCustom, IconChip, Kicker, radios por token). Alturas de botón 48/52/56 conviven; solo verificable en el tercio que renderiza.
- h5 Prevención de error (3): sin formulario; el riesgo real es que el CTA primario hoy va a 404.
- h6 Reconocer vs recordar (3): todo a la vista al hacer scroll; comparar "anual como mensual" vs "mensual" pide un beat.
- h7 Flexibilidad (3): sticky inteligente, anclas con smooth-scroll, FAQ con button real + aria-expanded/aria-controls, dots con aria-current, reduced-motion bien cableado. Sin count-up ni atajos.
- h8 Estético/minimalista (3): composición limpia y contenida en el hero; el vacío inferior es lo contrario a "cada elemento se gana su lugar" (se carga a craft).
- h9 Errores con solución (3): sin estados de error; el manejo de objeciones (FAQ + garantía + PS) cubre el "¿y si no me sirve?".
- h10 Ayuda contextual (3): FAQ = 5 objeciones reales, garantía nombrada, microcopy bajo el CTA; los placeholders describen pero no enseñan el mecanismo.

CRAFT (10/20)
- Jerarquía (3): en el hero se leen 4 niveles nítidos (display serif → subtítulo → CTA → microcopy); máx 3 tamaños por vista.
- Profundidad (2): 3 tokens de superficie + blooms + sombras tintadas, pero atenuados a propósito; el vacío inferior se lee como negro plano; rim highlight de la ficha sin implementar.
- Identidad (2): paleta con algo de carácter (vino/cacao, no #000; oro contenido; cremas cálidas), pero cero dispositivo ownable en la landing → test anti-clon: se cambiaría por otra app del rubro sin que se note. NO coincide con las paletas vetadas del 53 (no es auto-0).
- Movimiento (2): stagger de entrada, whileTap y reduced-motion bien resueltos en código; pero ese mismo sistema de reveal es lo que deja media página invisible en el render entregado. Falta count-up en números héroe.
- Encaje óptico (1): radios en familia y chips que abrazan su contenido en el hero; el vacío de ~9.000px es un desencaje a simple vista que domina la vista completa.

COPY (14/20) — vende; FICHA-AVATAR disponible
- Idea única (3): una Big Idea clara ("no piensas de más; nadie te ayudó a separar hechos de historias") con mecanismo bautizado ("descifrar la conversación"). Fractura menor: el hero es 100% "descifrador de chats" y la oferta/FAQ introducen un segundo marco (tarot/coach) que el hero no prepara.
- Especificidad y prueba (2): buenos números en la oferta (precio/día, total anual, plazos), pero CERO prueba — sin testimonios (honesto: no existen aún), sin demo del mecanismo, sin capturas reales. Para una audiencia escéptica que "ya probó apps así", la demo es justo lo que falta. Cero claims de ingresos/salud (cumple).
- Emoción / dolor real (3): preguntas casi verbatim de los dolores #1-#4, agitación antes de resolver, objeción "no me juzguen" atendida. Resta que la escena insignia de la ficha (23:00, en la cama, el estómago apretado) se cambió por una más genérica ("llegas ansiosa al trabajo").
- Claridad de oferta (3): qué recibo (5 features/plan), cuánto (ambos precios + $/día + total anual), qué me protege (garantía nombrada + trial). El solapamiento 3 días / 7 días exige un beat para entenderse.
- Dirección a una acción (3): un CTA primario repetido y en beneficio ("Descifrar mi primera conversación"); secundarios subordinados. La etiqueta varía ("Empezar mis 3 días gratis" / "Ver plan y precios" / "Elegir mensual").
- Sub-check garantía nombrada: OK. Sub-check message-match: no verificable.

FIDELIDAD: N/A — el parent indica que la referencia del usuario ya no está vigente (propuesta propia, dirección A). No se aplica test de fidelidad.

PLACEHOLDERS (evaluados, no penalizados como bug): el del hero está bien resuelto estructuralmente (dashed, ícono, sugerencia concreta, aspect fijo → CLS 0); los frames del carrusel también (chasis de teléfono + nombre de pantalla). El reparo no es el placeholder en sí, sino que el hero se queda sin visual persuasivo para esta audiencia (ver defecto 2).
