# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-11 00:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 32/40
Craft: 13/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Todas las pantallas de pregunta/reconocimiento — 01,02,04,05,06,08,09,10] `flex-1 justify-center` en PreguntaChips/PreguntaSlider/Reconocimiento centra el bloque en el alto disponible sin llenarlo de valor: el vacío arriba del título + debajo del último chip/CTA suma ~35-40% del área visible en varias pantallas → fix: anclar el contenido con padding-top fijo cerca del header y acercar el bloque de opciones al fondo (o sumar contenido de apoyo), en vez de justify-center puro.
2. [Íconos de las 7 preguntas — chips de opción en 01,02,04,05,08,09 + escape hatch] Toda la iconografía de opción es emoji nativo (💬💛💔🔍🌙⏳📱👀🫂🔮📔😟😬🤐⌛☀️🌤️🤷‍♀️📸🎵👯🔎✍️); aunque está documentado como override explícito en FICHA-ARTE.md (Ronda #4), sigue bajando la identidad ownable del kit terciopelo+oro y no pasa el check "chips SVG sin emoji" de las anclas de conversión → fix: set de íconos de línea propio con hairline dorado para las 7 preguntas core, reservando emoji para los contextos de chat/WhatsApp donde sí tiene justificación narrativa.
3. [Chip 4 en "temor" (05) y "atribución" (09)] El último ítem de la lista se ve visiblemente más apagado/gris que sus pares sin que el código defina un estado distinto (ChipOpcion no tiene lógica condicional de opacidad) — parece deshabilitado sin estarlo → fix: verificar que la captura se tome después de terminar el stagger de entrada (~0.6s con 4-5 ítems) para no congelar el frame en opacity:0.4 de un chip aún animando.
4. [Cada pantalla de pregunta] Heurística 7 (flexibilidad/eficiencia): fuera del soporte nativo de flechas en el slider, no hay ningún atajo o default adicional para el usuario avanzado (todo exige tap secuencial) → fix: no es bloqueante para un onboarding mobile, pero documentar la ausencia es intencional si se decide no agregar nada.
5. [Header de cada pantalla — franja "LUMA" + barra de progreso] No hay ningún hairline degradé decorativo (solo el fill sólido de la barra de progreso) en las pantallas de pregunta, mientras que la ancla de conversión pide ≥1 hairline degradé por vista → fix: agregar un hairline de 1-2px con degradé sutil (p.ej. bajo el header o enmarcando la carta en los reconocimientos) para reforzar el sistema de conversión.

# VEREDICTO revisor-visual — onboarding (Ronda 6, recorrido sin preguntas)
Fecha: 2026-10-13 00:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 28/40
Craft: 10/20
Copy (si vende): 8/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Detalle usabilidad: h1:2 h2:3 h3:3 h4:3 h5:3 h6:4 h7:3 h8:2 h9:3 h10:2
Detalle craft: jerarquia:2 profundidad:2 identidad:2 movimiento:2 encaje:2
Detalle copy: idea:2 especificidad:1 emocion:1 oferta:2 accion:2 (es una puerta de edad, no vende; puntuado a pedido)
Gate de carga cognitiva: 0 fallas. El problema no es sobrecarga sino cromo heredado y CTA muerto.
Top defectos:
1. [Header, barra "6%" con flecha atrás] Barra de progreso al 6% en una pantalla que es el ÚNICO paso: promete un recorrido largo que ya no existe, el "6%" es dato falso y hace pensar que falta mucho antes de la primera lectura (frena justo lo que se quiere acelerar) → fix: en PasoEdad/page.tsx no renderizar la barra ni el porcentaje (variante de OnboardingHeader solo con atrás + LUMA), o pasar progreso oculto.
2. [Botón "Continuar", abajo] CTA disabled por defecto al 40% de opacidad (texto oscuro sobre dorado apagado, contraste visiblemente bajo, se lee como "roto") y sin hint de por qué; incumple el ancla "CTA héroe vivo" y no tiene whileTap/:active propio → fix: dejarlo habilitado a opacidad plena, al tocar sin casilla marcada mostrar hint "Marca la casilla para continuar" con el borde de la casilla resaltado, y añadir whileTap scale 0.97 + [touch-action:manipulation].
3. [Bloque central, ~230px de vacío sobre el título y ~200px bajo el botón] justify-center deja el contenido flotando en medio del viewport con aire muerto arriba/abajo; el titular de 22px es poco héroe y todo (título, párrafo, casilla, botón) pesa parecido → fix: anclar al tercio superior (pt-12) con título 28px Cormorant, o añadir un elemento ownable (carta/luna a línea con resplandor ámbar) sobre el título para que la pantalla tenga identidad, no solo un formulario.
4. [Casilla "Confirmo que soy mayor de 18 años"] Es un <button aria-pressed> con caja de 24px de borde tenue (text-tertiary 45%, casi invisible sobre #2b1a24) y 13.5px de texto: dos pasos (marcar + continuar) para una sola intención, y semántica incorrecta para lectores de pantalla (debería ser role="checkbox"/aria-checked o input checkbox con label); sin whileTap ni feedback de 100ms → fix: role="checkbox" aria-checked, borde de la caja a text-secondary/accent 60%, texto a 15px, y whileTap 0.98 en la fila.
5. [Párrafo explicativo y pie de pantalla] El texto dice "necesitamos confirmar tu edad" pero no enlaza a Términos/Privacidad ni dice qué pasa a continuación; el usuario no sabe que va directo a su lectura gratis, y a quien cierra la edad no se le da salida clara (solo la flecha atrás) → fix: línea al pie de 12px "Al continuar aceptas los Términos y la Privacidad" con enlaces, y subtítulo que nombre el destino ("y entras directo a tu primera lectura gratis"); además unificar header: franja sticky con bg/95 + blur crea una costura visible a ~100px sobre el degradé del fondo, quitar el backdrop o dejarlo transparente.
Verificación en código (no inferida): motion con reduced-motion cubierto (useReducedMotion); sin stagger (un solo bloque), sin whileTap en CTA ni casilla, sin aria-live para el estado del botón; "atrás" siempre presente y vuelve a "/" (h3 OK); edad persistida una vez por navegador y redirección directa si ya confirmó (h7 OK, pantalla neutra sin parpadeo). Paleta, tipografía (Cormorant + Hanken) y radios coinciden con FICHA-ARTE; sin desvío de ficha.

# VEREDICTO revisor-visual — onboarding (Ronda 7)
Fecha: 2026-10-13 00:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 32/40
Craft: 13/20
Copy (si vende): 12/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Detalle usabilidad: h1:3 h2:4 h3:3 h4:3 h5:3 h6:4 h7:3 h8:3 h9:3 h10:3
Detalle craft: jerarquia:3 profundidad:2 identidad:3 movimiento:2 encaje:3
Detalle copy: idea:2 especificidad:2 emocion:2 oferta:3 accion:3 (puerta de edad, no vende; puntuado a pedido, no es gate de esta pantalla)
Gate de carga cognitiva: 0 fallas. Un solo CTA, una sola casilla, texto en 3 líneas.
Mejoras confirmadas respecto a la Ronda 6 (verificadas en código): sin barra falsa; CTA tocable con pista role="status"; role="checkbox"+aria-checked; whileTap 0.97 en CTA; enlaces /terminos y /privacidad existen; titular 28px con acento; medallón con icono de LUMA; contenido anclado arriba; reduced-motion cubierto; tokens (--on-accent #2a140f, --accent-lite #e9b06a, radios) coinciden con FICHA-ARTE.
Top defectos:
1. [Botón "Empezar mi lectura gratis" a y≈528] Sin casilla queda a opacity-70: dorado apagado/verdoso que se lee como deshabilitado aunque sea tocable, y el cambio de 70%→100% es el único feedback de estado; incumple en parte el ancla "CTA héroe vivo" (contraste/vitalidad) → fix: quitar `opacity-70` y mostrar el CTA a opacidad plena siempre; que el estado "sin marcar" lo comunique la pista y un borde acento del recuadro de la casilla (shake/resaltado 150ms al tocar el CTA sin marcar).
2. [Franja superior y≈0-100 vs cuerpo] La costura del header (bg-[var(--bg)]/95 + backdrop-blur) sigue visible como banda horizontal a ~100px sobre el degradé del fondo (ya señalada en Ronda 6, NO corregida); además "LUMA" en texto + el icono de LUMA en el medallón duplican la marca → fix: en OnboardingHeader (components/onboarding/ui.tsx) usar fondo transparente sin blur para esta pantalla y quitar el wordmark de la franja (o el medallón), dejando solo la flecha atrás.
3. [Mitad inferior, y≈590-812] ~220px de vacío muerto bajo el pie legal: el contenido está anclado arriba pero no hay nada que lo equilibre ni profundidad en esa zona (fondo casi plano) → fix: subir el bloque a un centrado óptico (pt ~ 20% del alto) o anclar CTA + legal al fondo (mt-auto) con el pulgar, y dejar el medallón/titular en el tercio superior; sumar un bloom ámbar tenue detrás del CTA para profundidad.
4. [Párrafo y copy] Describe a LUMA ("relaciones, tarot e inteligencia emocional para adultos") en vez de al dolor de la avatar: no hay promesa de no-juicio (objeción 6 de FICHA-AVATAR, destino = onboarding) ni ancla emocional ("en 1 minuto entiendes qué pasa"); es copy de ficha técnica → fix: "Aquí cuentas lo que te pasa sin que nadie te juzgue. Confirma tu edad y en 1 minuto tienes tu primera lectura, gratis y sin tarjeta." (trazable a objeción 6 + ancla emocional).
5. [Enlaces "Términos" y "Privacidad", y≈576] Texto de 12px en tono terciario con área táctil de ~16px de alto, muy por debajo de los 44px; y el movimiento de la pantalla es un solo fade de entrada (sin stagger medallón → titular → párrafo → casilla) → fix: dar `inline-block py-3` / `-my-3` a los enlaces para ≥44px de zona táctil, y aplicar stagger 60-80ms a los 4 bloques con spring de la ficha.

# VEREDICTO revisor-visual — onboarding (Ronda 8)
Fecha: 2026-10-13 00:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 33/40
Craft: 13/20
Copy (si vende): 14/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Detalle usabilidad: h1:3 h2:4 h3:3 h4:3 h5:4 h6:4 h7:3 h8:3 h9:3 h10:3
Detalle craft: jerarquia:3 profundidad:2 identidad:3 movimiento:2 encaje:3
Detalle copy: idea:2 especificidad:2 emocion:3 oferta:3 accion:4 (puerta de edad, no vende; puntuado a pedido)
Gate de carga cognitiva: 0 fallas.
Mejoras confirmadas (screenshot + código): CTA a color pleno, siempre habilitado, h-14, whileTap 0.97, anclado abajo con mt-auto; pista role="status" con espacio reservado (h-5, sin salto de layout); línea "Aquí nadie te juzga" presente; enlaces con py-2 inline-block (área ~36px, aún <44px).
Desvío de evidencia: el archivo docs/revisiones/onboarding-375.png mide 1128x732 (columna de ~440px centrada con márgenes laterales), NO 375x812. No demuestra el render a 375px que exige el gate; la zona del pulgar y el vacío vertical se juzgaron sobre otra proporción. Tokens, tipografía (Cormorant + Hanken) y radios coinciden con FICHA-ARTE.
Top defectos:
1. [Captura completa] La evidencia no es 375px (1128x732, layout de escritorio) → fix: re-capturar con viewport 375x812 vía Playwright y sobrescribir docs/revisiones/onboarding-375.png antes de volver a pedir veredicto; sin eso el gate de cierre no se puede dar por cumplido.
2. [Franja superior y≈0-100] La costura del header (bg-[var(--bg)]/95 + backdrop-blur-sm) sigue visible como banda más oscura sobre el degradé, defecto arrastrado desde la Ronda 6 y sin corregir; además "LUMA" en texto y el icono dorado del medallón duplican la marca → fix: en OnboardingHeader (components/onboarding/ui.tsx) quitar bg/95 y backdrop-blur (transparente) y eliminar el wordmark o el medallón.
3. [Fondo, zona entre casilla y CTA y bajo el legal] Fondo prácticamente plano vino-casi-negro en la mitad inferior; sin bloom ni hairline degradé: profundidad de 2 niveles y cero hairline degradé en la vista → fix: bloom radial ámbar al ~8% detrás del CTA y un hairline degradé de 1px oro→transparente sobre el borde superior de la tarjeta de la casilla.
4. [Movimiento — PasoEdad.tsx] Un único fade/slide para toda la pantalla: sin stagger medallón → titular → párrafo → casilla, y marcar la casilla no tiene microanimación (el check aparece sin spring) → fix: variants con delayChildren 0.07 en los 4 bloques y scale spring 0.12 bounce en la caja al marcarse.
5. [Casilla "Confirmo que soy mayor de 18 años" y enlaces legales] Al tocar el CTA sin marcar, solo aparece un texto de 13px bajo la casilla: el recuadro no se resalta (sin borde acento ni sacudida) y la pista no está asociada con aria-describedby; los enlaces Términos/Privacidad miden ~36px de alto (<44) en 12px terciario → fix: al activar `pista`, cambiar el borde del recuadro a var(--accent) 100% con shake de 150ms y añadir aria-describedby; subir los enlaces a py-3 (≥44px) y 13px.

# VEREDICTO revisor-visual — onboarding (Ronda 9)
Fecha: 2026-10-14 00:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 33/40
Craft: 13/20
Copy (si vende): 15/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Detalle usabilidad: h1:3 h2:4 h3:3 h4:3 h5:4 h6:4 h7:3 h8:3 h9:3 h10:3
Detalle craft: jerarquia:3 profundidad:2 identidad:3 movimiento:2 encaje:3
Detalle copy: idea:3 especificidad:2 emocion:3 oferta:3 accion:4 (puerta de edad, no vende; puntuado a pedido)
Gate de carga cognitiva: 0 fallas.
Verificado en screenshot 375x812 real (primera ronda con evidencia válida) y código: cabecera limpia (solo flecha atrás, sin costura ni wordmark duplicado); titular 28px Cormorant con acento dorado; CTA pleno h-14 anclado abajo, whileTap 0.97; casilla role="checkbox"; pista role="status" con altura reservada; enlaces legales con 44px de área; paleta, tipografía y radios coinciden con FICHA-ARTE; sin clon de ejemplos vetados.
Top defectos:
1. [Fondo, banda y≈440-640 entre la casilla y el CTA, y bajo el legal] ~200px de vacío con fondo casi plano vino: solo 2 niveles de profundidad y cero hairline degradé en toda la vista → fix: bloom radial ámbar ~8% detrás del CTA (en el contenedor mt-auto) y hairline degradé 1px oro→transparente en el borde superior de la tarjeta de la casilla.
2. [PasoEdad.tsx, motion.div raíz] Un único fade+slide de 8px para toda la pantalla: sin stagger medallón → titular → párrafo → casilla, y la casilla no tiene microanimación al marcarse (el check aparece de golpe) → fix: variants con staggerChildren 0.07 en los 4 bloques y spring (bounce 0.12) en la caja y el Check al marcar.
3. [Casilla + pista "Marca la casilla para continuar."] Al tocar el CTA sin marcar, el recuadro de la casilla no cambia (sin borde acento ni sacudida 150ms), y la pista de 13px queda lejos del CTA (y≈455 vs CTA y≈670) → fix: con `pista` activo, borde de la tarjeta a var(--accent) 100% + shake corto, y aria-describedby de la casilla hacia el role="status".
4. [Acción del CTA, onContinuar → window.location.href] Tras el tap válido hay navegación completa sin ningún estado intermedio (sin spinner inline ni bloqueo de doble tap) → si la siguiente ruta tarda, la pantalla parece colgada → fix: estado `enviando` que deshabilita el botón y cambia su etiqueta a "Entrando…" con indicador inline antes de redirigir.
5. [Copy del párrafo, y≈250-310] Sigue empezando por la ficha técnica de LUMA ("habla de relaciones, tarot e inteligencia emocional para adultos") y el no-juicio queda relegado a una línea de 14px tenue; sin escena del dolor de la avatar → fix: invertir el orden: primero "Aquí nadie te juzga: cuenta lo que te pasa en un espacio privado." y después "Confirma tu edad y tu primera lectura es gratis, sin tarjeta."; llevar el no-juicio a peso/color del párrafo principal.

# VEREDICTO revisor-visual — onboarding (Ronda 10)
Fecha: 2026-10-18 00:00
Screenshot: docs/revisiones/onboarding-r10-edad-375.png
Usabilidad: 34/40
Craft: 15/20
Copy (si vende): 15/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Detalle usabilidad: h1:4 h2:4 h3:3 h4:3 h5:4 h6:4 h7:3 h8:3 h9:3 h10:3
Detalle craft: jerarquia:3 profundidad:3 identidad:3 movimiento:3 encaje:3
Detalle copy: idea:3 especificidad:2 emocion:3 oferta:3 accion:4 (puerta de edad, no vende; puntuado a pedido)
Gate de carga cognitiva: 0 fallas. Evidencia: 375x812 reales (estado inicial y estado de aviso); el estado "Entrando…" NO tiene captura (solo verificado en código).
Defectos de la Ronda 9 verificados:
- R9-1 (profundidad/hairline): PARCIAL. Bloom ámbar detrás del CTA presente y visible; hairline degradé en el código (top de la casilla) pero a 1px apenas se distingue en la captura; la banda y≈470-640 sigue vacía.
- R9-2 (stagger + spring): CORREGIDO en código (entrada(0..3) con delay 0.07; spring en la caja al marcar, reduced-motion respetado). Nota: los dos párrafos comparten delay (índice 2), es un solo paso.
- R9-3 (borde acento + sacudida + aria-describedby): CORREGIDO. Borde acento visible en la captura de aviso, aria-describedby="pista-edad" hacia role="status". Queda: la pista sigue a ~215px del CTA y la sacudida no se repite en un segundo toque.
- R9-4 (estado enviando): CORREGIDO en código (disabled, spinner, "Entrando…/Preparando tu lectura…", whileTap off). Queda sin salida de recuperación ni anuncio accesible.
- R9-5 (copy): CORREGIDO. El no-juicio abre en 16px/600 y "Cuenta lo que te pasa sin miedo" encabeza el párrafo; confirma objeción 6 de la ficha.
Verificado contra FICHA-ARTE: Cormorant en titular, Hanken en cuerpo, oro #d8a441 solo en acción/titular/acento, fondo vino con blooms, radios de tarjeta/botón de tokens. Sin desvío; sin clon de los ejemplos vetados.
Top defectos:
1. [Banda y≈470-640, entre la pista y el CTA] ~170px de vacío con fondo casi plano; el bloom solo cubre la zona del botón → fix: anclar casilla + pista al bloque inferior sobre el CTA (zona del pulgar) o centrar ópticamente el bloque superior con más pt y sumar un 3er nivel (campo hundido #1f1219 o bloom vino arriba-derecha) para llenar la banda.
2. [Pista "Marca la casilla para continuar." y≈446 vs CTA y≈670] El aviso aparece lejos del botón que lo provocó, sin animación de entrada (el texto salta), y la sacudida solo se dispara cuando `faltaCasilla` pasa de false a true: un segundo toque en el CTA no repite el feedback → fix: contador `intentos` como key/trigger de la sacudida, fade de 150ms con AnimatePresence en la pista, y acercar la pista al CTA (debajo de él o encima del botón).
3. [Botón con estado "Entrando…"] `enviando` nunca vuelve a false: si onContinuar falla o la ruta no carga, el botón queda bloqueado al 80% sin mensaje ni reintento; el cambio de etiqueta no se anuncia (sin aria-live) y no hay captura de ese estado → fix: try/catch o timeout de 8s con setEnviando(false) + mensaje "No pudimos entrar. Inténtalo de nuevo", aria-live="polite" en el botón, y capturar el estado para el siguiente veredicto.
4. [Hairline de la casilla y escala tipográfica] El hairline degradé (1px, accent-lite→transparente sobre borde de 35%) no se percibe a 375px, así que el sistema de conversión sigue sin su detalle firma visible; además la pantalla usa 28/16/15/14/13/12px (6 tamaños, tope 3 recomendado) → fix: hairline de 2px a opacidad plena sobre el borde, y consolidar 16/15/14 en dos tamaños (p. ej. 16 semibold + 14) y 13/12 en uno.
5. [Casilla, gesto de marcado] Al marcar solo cambia la caja de 28px; la tarjeta completa no responde (sin whileTap ni cambio de fondo/borde a estado "confirmado"), y el estado marcado no tiene captura de evidencia → fix: whileTap 0.98 en la fila, borde de la tarjeta a acento pleno + fondo #33202b al marcar, y adjuntar captura del estado marcado.
