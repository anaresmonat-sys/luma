# VEREDICTO revisor-visual — landing
Fecha: 2026-09-10 18:20
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 31/40
Craft: 15/20
Copy (si vende): 15/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) Prueba insuficiente para audiencia escéptica: el carrusel "Así se ve por dentro" son 5 chasis vacíos y el único activo persuasivo es un demo con UN caso elegido a mano; sin testimonios (esperable) ni segundos casos. 2) Fractura de mensaje: hero + demo venden 100% "descifrador de chats"; oferta y FAQ introducen tarotista/coach/tiradas/diario que el hero nunca prepara. 3) La carta de pergamino (única pieza ownable) aparece una sola vez y SIN su reveal firma de FICHA-ARTE (resplandor + ascenso/rotación); HeroDemoLuma no tiene ninguna animación; el rasgo no se repite. 4) Rim highlight a rgb(255 255 255/.07) cuando FICHA-ARTE pide /.5: la "luz de vela" del borde elevado es casi invisible y la alternancia base/elevada sigue muy sutil a 375px. 5) Etiqueta del CTA primario en 4 variantes + 4 tamaños de chip conviviendo.

---

## FORMATO DE SALIDA

VEREDICTO: NO LISTA
USABILIDAD: 31/40  (detalle: h1:3 h2:4 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:3 h10:3)
CRAFT:      15/20  (detalle: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3)
COPY:       15/20  (detalle: idea:3 especificidad:3 emoción:3 oferta:3 acción:3)
FIDELIDAD:  N/A (propuesta propia dirección A "Terciopelo & Oro" — sin referencia vigente; no se aplica test de fidelidad)

GATE: falla los tres umbrales por poco — usabilidad 31 < 36, craft 15 < 16, copy 15 < 16. Ningún eje de copy ≤2.
DELTA vs revisión anterior: usabilidad 29→31 · craft 10→15 · copy 14→15. Los 5 arreglos aterrizaron; el craft sube fuerte (se resolvió el vacío de ~9.000px y entró un dispositivo ownable). Sigue NO LISTA: la pantalla del dinero aún no tiene prueba real ni un mensaje único coherente, y la usabilidad queda 5 puntos corta.

### Verificación de los 5 cambios declarados
1. Reveal por mejora progresiva — VERIFICADO en código (useReveal: estado `armado` con setTimeout 60ms; `oculto` = {opacity:1} hasta armar; VIEWPORT_ONCE amount 0) y en el screenshot full-page: Oferta, Garantía, FAQ y CTA final ahora RENDERIZAN. Defecto #1 anterior: RESUELTO. Reparo menor: hay un posible flash (contenido visible → a 60ms las secciones bajo el fold saltan a opacity:0 → reaniman al entrar) — no visible en screenshot, severidad baja.
2. Visual del hero real — VERIFICADO (components/app/HeroDemoLuma.tsx): carta de pergamino que flota (box-shadow en capas + sombra de contacto elíptica + resplandor ámbar radial + rotateX/Y) y demo estática rotulada "EJEMPLO": mensaje → "Lo que vemos" / "Posible riesgo" / "Qué responder" con íconos Lucide (Eye/AlertTriangle/MessageSquare), cero emojis. Defecto #2 anterior: RESUELTO.
3. Profundidad — VERIFICADO: --rim en tokens.css, aplicado vía SectionShell (`shadow-[var(--rim)]`) y --shadow-card; --surface separado (#241019 → #2c1a25); blooms cálidos en app/globals.css (radial #6d2f3e / #4a2233 al 55%, background-attachment fixed). PARCIAL: el rim se implementó a .07 de alfa, muy por debajo del .5 que especifica FICHA-ARTE §brand kit — ver defecto 4.
4. Reverso de riesgo con jerarquía — VERIFICADO (page.tsx §7 + docs/copy/landing.md): la Garantía lidera con "Pruebas 3 días gratis: si LUMA no te da calma, no pagas nada" y el reembolso de 7 días queda como respaldo secundario en la misma frase. MEJORADO. Residuo: el badge "3 días gratis" sigue en AMBAS cards de plan y el FAQ repite las dos ventanas — el lector aún procesa dos plazos.
5. Kickers + escena insignia — VERIFICADO: kickers "Cómo funciona" / "Tu plan" / "Por dentro" (antes "EL MECANISMO" / "LA OFERTA"); Agitación restaura "Son las 23:00 y sigues en la cama releyendo la conversación por décima vez, con el estómago apretado" (casi verbatim de FICHA-AVATAR "MOMENTO DEL DÍA"). RESUELTO.

### Gate de carga cognitiva — PASA
Sin sobrecarga: 4 preguntas, 3 pasos, 5 features/plan, 2 planes, 5 FAQ, 5 frames. 1 acción primaria repetida. Nada que memorizar. Texto por bloque ≤3-4 líneas (warnCopy ejecutable en el kit). "Qué sigue" siempre obvio. Único punto: el CTA primario apunta a /onboarding (404 hoy) — el parent lo declara esperable en esta etapa; no se cuenta como falla de gate, pero mantiene h1/h5 lejos de 4.

### CTA héroe vivo — CUMPLE los 4
- Contraste oro #d8a441 sobre #1a0d13 ≈ 8:1 (≥3:1). Texto --bg sobre oro ≈ 8:1. OK
- whileTap scale 0.97 + hover:bg color-mix + transition-colors 150ms. OK
- `<motion.a>` siempre habilitado, nunca disabled. OK
- h-[52px] (hero) / h-14 (CTA final) + w-full en mobile + touch-action:manipulation. OK
Único reparo: destino /onboarding inexistente (esperado esta etapa).

### Anclas de conversión
- Titular con énfasis: "Entiende" en oro dentro de serif bold (Cormorant). OK
- ≥1 hairline degradé + chips SVG sin emojis: `<Hairline>` (padding-box/border-box) en chip del mecanismo, garantía y plan anual; `<IconChip>`/`<CheckCustom>` = Lucide SVG; CERO emojis en la landing (la decisión emoji-como-íconos de FICHA-ARTE es solo para la app interna). OK
- Secciones adyacentes distinguibles: alternancia base #1a0d13 / elevada #2c1a25 + rim + shadow-card; más separadas que antes pero aún sutiles a 375px sobre paleta oscura. Borderline (no baja el eje 2, pero ver defecto 4).
- Sub-check garantía nombrada (binario): PASA — "Empieza gratis, sin riesgo" con plazos (3 días / 7 días) junto a la oferta y repetida en el PS. El "nombre" es genérico (no una garantía bautizada distintiva), pero cumple el binario.
- Sub-check message-match (binario): NO VERIFICABLE — sin dato de creativo/anuncio de origen (archivo 34).

---

## TOP DEFECTOS

1. [Sección "Así se ve por dentro" + prueba global] La única evidencia para una audiencia que "ya probó apps así y las abandonó" (FICHA-AVATAR, consciencia 3-4) es UN caso de demo elegido a mano y no interactivo; el carrusel son 5 chasis de teléfono vacíos con nombre de pantalla y no hay testimonios (honesto: no existen aún). El eje que la ficha marca como decisivo —DEMO del mecanismo— está apenas cubierto. → Fix: donde hoy está el carrusel de placeholders, poner 2-3 mini-casos "mensaje real → Lo que vemos / Posible riesgo / Qué responder" (estáticos y rotulados), o mover ahí el demo del hero y ampliarlo a varias situaciones.

2. [Hero + demo vs Oferta/FAQ] El hero y el "EJEMPLO" venden 100% "descifrador de chats de WhatsApp"; la oferta ("Chat con LUMA, tu tarotista y coach", "Tiradas de tarot leídas para tu caso", "Diario emocional") y el FAQ (preguntas de tarot) introducen un segundo producto que el hero nunca prepara. Se lee como dos apps. → Fix: puente en el subtítulo o un kicker del hero que nombre el marco completo (tarot + coach) y una línea en Solución que conecte descifrar → carta / coach / diario.

3. [Identidad + movimiento — carta de pergamino] El dispositivo ownable de FICHA-ARTE aparece UNA sola vez (hero) y SIN su reveal firma ("la carta se revela con resplandor ámbar + leve ascenso y rotación −3°→0°"): entra con el fade plano de 0.3s del bloque hero, y HeroDemoLuma no tiene ninguna animación. El rasgo no se repite en ninguna otra sección. Queda oscuro + un oro + Cormorant Garamond (el serif más usado de la época) → sigue siendo sustituible por otra landing "mística premium". → Fix: animar la carta con su reveal firma al entrar en viewport (con prefers-reduced-motion) y repetir el motivo (la carta o una textura cálida) en Solución u Oferta.

4. [Profundidad — superficies elevadas] El rim highlight está a `inset 0 1px 0 rgb(255 255 255 / 0.07)` cuando FICHA-ARTE §brand kit especifica `/.5`: la "luz de vela" en el borde superior de lo elevado es prácticamente invisible y los 3 niveles de superficie (#1a0d13 / #2c1a25 / #140a0f) apenas se distinguen a 375px sobre la paleta oscura. → Fix: subir el rim hacia el valor de la ficha (probar .18–.5 y elegir por render) y separar un punto más --surface del --bg.

5. [Consistencia h4 / encaje — CTA y chips] El CTA primario cambia de etiqueta en 4 lugares ("Descifrar mi primera conversación" / "Empezar mis 3 días gratis" / "Elegir mensual" / "Ver plan y precios") y conviven 4 tamaños de chip (IconChip 44px · garantía 60px · CheckCustom 22px · chips del demo 28px). → Fix: una sola etiqueta para el CTA primario en hero, carrusel y CTA final; reducir a 2 tamaños de chip como máximo.

---

## NOTAS POR RÚBRICA

USABILIDAD (31/40)
- h1 Estado del sistema (3): el vacío negro tras el carrusel está resuelto (todas las secciones renderizan). Tap 0.97, acordeón con altura animada, carrusel con dots/aria-current, sticky de 2 estados: feedback correcto en todo lo interactivo. No llega a 4: sin count-up en los números de precio y el CTA primario navega a un 404.
- h2 Lenguaje del usuario (4): copy en el mundo exacto de la avatar y trazado a VoC ("releer", "espiral", "el estómago apretado", "sin cobros por mensaje ni por crédito", "¿otra vez el mismo patrón?"); cero inglés, cero jerga corporativa; kickers ya en lenguaje llano. Las preguntas del FAQ son las objeciones literales de la ficha. Decil superior en este eje.
- h3 Control y libertad (3): "Entrar" visible, FAQ que colapsa del todo (`setAbierto(null)`), sticky que hace scroll a #oferta antes de saltar al CTA, smooth-scroll con fallback reduced-motion, sin trampas de modal. Suficiente para una landing; no hay nav de secciones para saltar al precio salvo el sticky.
- h4 Consistencia (3): kit disciplinado (CtaButton, CheckCustom, IconChip, Kicker, Hairline, SectionShell; radios por token 16/14). Restan: 4 etiquetas para el CTA primario, alturas de botón 48/52/56 y 4 tamaños de chip (defecto 5).
- h5 Prevención de error (3): sin formularios; touch-action:manipulation contra el doble-tap; enlaces del footer a páginas borrador reales. El riesgo vivo: el CTA primario hoy va a 404 (esperado esta etapa).
- h6 Reconocer vs recordar (3): todo a la vista al hacer scroll; cada card de plan repite sus propias features (no hay que recordar qué trae la anual al leer la mensual). Comparar $5,99 vs $9,99 + total anual pide un beat.
- h7 Flexibilidad (3): sticky inteligente de 2 estados, anclas con smooth-scroll, FAQ con button real + aria-expanded/aria-controls, dots con aria-label/aria-current, prefers-reduced-motion cableado en todo el kit. Sin aceleradores para experto más allá del sticky; sin count-up.
- h8 Estético/minimalista (3): estructura canónica de 10 secciones sin duplicar, 1 acción primaria por vista, ritmo 64/96px, acento contenido. Resta: el visual del hero es muy alto en el stack vertical de mobile (carta 208px + resplandor + panel demo ≈ 550px), y los kickers van en versalitas.
- h9 Errores con solución (3): sin estados de error en una landing estática; el manejo de objeciones (FAQ + garantía + PS) cubre "¿y si no me sirve?" con siguiente paso concreto ("cancelas cuando quieras, sin trámites"), sin códigos técnicos.
- h10 Ayuda contextual (3): el demo del hero ahora ENSEÑA el mecanismo (mensaje → lectura → riesgo → qué responder), rotulado "EJEMPLO"; FAQ = 5 objeciones reales con la #1 abierta; microcopy bajo cada CTA; garantía nombrada. No llega a 4: la sección "Por dentro" son placeholders con nombre y no enseña.

CRAFT (15/20)
- Jerarquía (3): al entrecerrar se leen 4 niveles (display serif 40/60px → subtítulo 17px → CTA → microcopy 13px); títulos de sección 30/40px. Tensión: la carta de pergamino en crema es el elemento de mayor contraste del hero y compite con el H1 por la primera fijación de la mirada.
- Profundidad (3): 3 niveles de superficie + blooms cálidos fixed + sombras tintadas + la carta que flota de verdad (sombra de contacto + resplandor + insets). El rim a .07 (vs .5 de la ficha) y la alternancia base/elevada aún sutil a 375px le quitan el 4 (defecto 4).
- Identidad (3): entra un dispositivo ownable real (carta de pergamino 3D con su glyph y su cita en serif) + colores propios del analizador; paleta con carácter (vino/cacao, no #000; oro contenido). No es clon de los ejemplos vetados del 53. No llega a 4: el device aparece una sola vez y sin repetición, y Cormorant Garamond + oro sobre oscuro es un kit reconocible del rubro.
- Movimiento (3): stagger de entrada (0.07), whileTap 0.97, acordeón con altura animada, AnimatePresence en el sticky, prefers-reduced-motion ejemplar. Faltan: count-up en números héroe (hay candidato claro: los precios / "4 meses gratis") y el reveal firma de la carta que pide FICHA-ARTE.
- Encaje óptico (3): radios estrictamente por token, chips que abrazan su contenido, tabular-nums en todos los números, padding lateral simétrico (px-5), lift deliberado de la card anual. El vacío de ~9.000px que dominaba la vista anterior está resuelto. Restan lupa: 4 tamaños de chip y el stack interno del visual del hero (carta rotada sobre panel ancho) algo forzado en vertical.

COPY (15/20) — vende; FICHA-AVATAR disponible
- Idea única (3): Big Idea clara ("no piensas de más; nadie te ayudó a separar los hechos de las historias") + mecanismo bautizado ("descifrar la conversación"), desarrollada en Solución. Fractura: el hero prepara solo "descifrador de chats" y la oferta/FAQ suman tarot + coach + diario (defecto 2).
- Especificidad y prueba (3): sube desde 2 — ya existe el demo del mecanismo (mensaje real → lectura específica → riesgo → qué responder), que es justo lo que pedía la ficha para una audiencia escéptica. Buenos números en la oferta (precio/día, total anual, plazos). Cero claims de ingresos/salud (cumple). Techo: un solo caso, no interactivo; sin testimonios (honesto); carrusel = placeholders.
- Emoción / dolor real (3): escena insignia restaurada (23:00, en la cama, el estómago apretado), preguntas casi verbatim de los dolores #1-#4, agita antes de resolver, objeción "no me juzguen" atendida. Resta profundidad en el costo futuro: "un mes más de desgaste" es más suave que el material de la ficha ("mandas el mensaje del que te arrepientes", "meses de paz mental", "la relación misma").
- Claridad de oferta (3): qué recibo (5 features/plan en lenguaje de resultado), cuánto (ambos precios + $/día + total anual), qué me protege (garantía + trial + piso Hotmart + PS). El solapamiento 3 días / 7 días está mejor jerarquizado en la sección Garantía, pero el badge "3 días" sigue en ambas cards y el FAQ repite las dos ventanas: aún pide un beat.
- Dirección a una acción (3): un CTA primario repetido y en beneficio/1ª persona; secundarios subordinados ("Elegir mensual" outline, "Entrar" terciario). Baja de 4 por las 4 etiquetas distintas del mismo click (defecto 5).
- Sub-check garantía nombrada: PASA (borderline — nombre genérico). Sub-check message-match: NO VERIFICABLE.

FIDELIDAD: N/A — el parent confirma que la referencia del usuario ya no está vigente (propuesta propia, dirección A "Terciopelo & Oro"). No se aplica test de fidelidad. Sí se anota, como desvío menor respecto a FICHA-ARTE: el rim highlight a .07 vs .5, y la escala tipográfica de la landing (display 40/60px, body 15-17px) corre por encima de la escala de la ficha (display ~26-30px, body ~13-14px) — defendible para una landing y más accesible, pero es una divergencia con la ficha.

PLACEHOLDERS (evaluados, no penalizados como bug): el del hero quedó sustituido por el visual real; los frames del carrusel (chasis + nombre de pantalla, dashed) están bien resueltos estructuralmente. El reparo no es el placeholder en sí, sino que la sección "Por dentro" no aporta prueba para esta audiencia (defecto 1).
