# ESTADO — LUMA (nombre de trabajo)
Última actualización: 2026-09-12 | Sesión actual: 5 (app interna, en curso)

✅ CHECKPOINT — Arranque de Sesión 5 (app interna). El usuario confirmó "procede" tras ver el plan
de 5 pantallas. Construidas hasta ahora, con datos semilla reales (Ana, mismo caso de la landing):
**Inicio** (`/app` — check-in de ánimo con confirmación real + carta del día tocable, dispositivo
ownable, revelada al montar con `disparo="montaje"` en `CartaSacerdotisa`) — **construida, ACEPTADA
con criterio propio** (no LISTA por el gate automático — ver [veredicto:inicio] en Problemas
conocidos). 3 rondas de revisor-visual: 30/40·13/20 → 32/40·14/20 → 31/40·16/20 (Craft PASA el
gate ≥16/20 desde la 3ª ronda; Usabilidad se estancó en 31 sin defectos puntuales nuevos — mismo
patrón de rendimientos decrecientes que landing/onboarding/paywall, y el propio revisor lo dice
explícitamente: "cerrar con criterio propio en este punto es defendible"). 10 defectos reales
corregidos en el camino: animación de la carta apagada por error, botones de 2 col desbordando,
cita duplicada, hamburguesa redundante, confirmación de ánimo invisible/débil, carta sin Link
propio, franja plana sin profundidad, avatar sin inicial, `prefers-reduced-motion` no respetado
fuera de la carta (resuelto GLOBAL con `<MotionConfig reducedMotion="user">` en `app/layout.tsx`,
beneficia a toda la app). **Descifra la conversación**
(`/app/descifrar` — 3 modos de entrada, texto/captura/voz; captura y voz muestran "Próximamente"
honesto hasta que haya OCR/voz→texto real en Sesión 6; analizar simula el loop con datos semilla y
muestra los 3 items del análisis + 2 acciones cruzadas) — construida, auto-revisada contra el
checklist, sin ronda de revisor-visual todavía. **Coach** (`/app/coach` — chat con LUMA, hilo
semilla + respuestas rápidas + "escribiendo…" simulado + mic con aviso "Próximamente") —
construida. **Tarot** (`/app/tarot` — lista de 5 tiradas, cada una se expande in situ mostrando la
carta + una lectura corta, sin inventar una ruta de resultado nueva no aprobada) — construida.
**Diario** (`/app/diario` — check-in + entrada libre + patrón detectado semilla + calendario con
aviso "Próximamente") — construida. Componentes nuevos compartidos: `AppButton`/`AppLinkButton`
(variante `compact` para grillas de 2 columnas), `BottomNav`, `ScreenHeader`, `MoodPicker`,
`LumaAvatar` (retrato provisional). `CartaSacerdotisa` (antes solo de la landing) ahora acepta
props reales (numero/nombre/cita) y un modo de disparo por montaje — se comparte entre landing,
Inicio y Tarot. Pantalla "Más" (cuenta/ajustes) AÚN NO EXISTE — el avatar y el nav apuntan a
`/app/mas`, que hoy da 404 (esperable en esta etapa, mismo patrón que `/entrar` durante la landing).
Siguiente acción exacta: correr revisor-visual sobre Descifra la
conversación (función estrella, probablemente amerita revisión aunque no sea una de las 4
pantallas-dinero, por ser el mecanismo central del producto), construir la pantalla "Más", y
decidir con el usuario si Coach/Tarot/Diario necesitan su propia ronda de revisor o si el
presupuesto de tokens no lo justifica dado que comparten componentes ya revisados en Inicio.

✅ CHECKPOINT — Ciclo de fixes de la landing (`/`) a partir de feedback visual DIRECTO del usuario
CERRADO (6 rondas, 3-6). Los 4 puntos que el usuario reportó están CONFIRMADOS resueltos por el
revisor sin regresiones: (1-2) "LUMA/frases cortadas" eran un artefacto de ver la miniatura del
screenshot completo, el render real nunca tuvo recorte; (3) el chip "descifrar la conversación"
con "la mitad sin borde" era un bug real (Hairline degradé no funciona en un chip chico) — corregido
con borde sólido + fill de acento; (4) "los íconos deben ser emoji, más divertidos" — se unificó
Problema+Agitación a emoji y se ajustó la paleta de 3 de ellos que se veían mal en Windows/Segoe UI
Emoji. Un defecto heredado adicional (no reportado por el usuario, lo encontró el revisor) también
se corrigió: el CTA del plan Mensual de Oferta pasó de un `<a>` hecho a mano a la variante
`outline` del componente compartido `CtaButton`. Score final (ronda 6): **NO LISTA por el gate
automático — Usabilidad 34/40 (gate ≥36) · Craft 16/20 (PASA, gate ≥16) · Copy 19/20 (PASA, gate
≥16)**. El propio revisor describe la brecha de usabilidad como difusa (varios criterios en "3
sólido" sin un defecto puntual identificable) y la llama "decisión de producto, no bug pendiente"
— mismo patrón de rendimientos decrecientes que onboarding (5 rondas) y paywall (8 rondas).
Evidencia: docs/revisiones/landing-375.png + landing-problema/agitacion/solucion/oferta-375.png +
landing-veredicto.md (historial completo rondas 3-6). Onboarding y Paywall sin cambios esta sesión. /
Siguiente acción exacta: presentarle al usuario el cierre de este ciclo en simple (sus 4 puntos
resueltos + el score) y preguntar si prefiere seguir puliendo usabilidad o cerrar con criterio
propio y avanzar — y retomar la pregunta pendiente de qué sigue (app interna Sesión 5 / entrevistas
de avatar / retrato de LUMA).

## Qué es esta app (3 líneas máximo)
Coach de bolsillo de inteligencia emocional para el amor y las relaciones: combina IA, tarot y
análisis de chats/capturas para que mujeres jóvenes (18-38) descifren señales ambiguas, calmen la
ansiedad afectiva y sepan qué hacer hoy sin perder sus límites. Tarot = herramienta de reflexión,
no de predicción. Monetización: freemium onboarding-first (prueba 3 días → $9,99/mes o anual).

## Promesa central (borrador — se afina con el copy en Sesión 3)
"Entiende lo que está pasando y elige mejor." — Ayuda a mujeres con dudas o conflictos en su vida
amorosa a separar hechos de interpretaciones, ver sus patrones y decidir su próximo paso sin
adivinación, mediante análisis de su situación + coach IA + tarot como disparador de reflexión.

## Historial de enfoque (3 insumos fusionados — NO re-validar la idea)
- Insumo A — "Tarot Mirror" (resumen validado 2026-09-08): tarot como detonante de journaling. Vigente: avatar base, precio, postura anti-adivinación.
- Insumo B — PDF "LUMA_propuesta_MVP-3.pdf": foco a amor/relaciones; tono "amiga preparada, no vidente"; estética wellness premium; momento WOW.
- Insumo C — 2º resumen validado LUMA (2026-09-09): freemium; ANALIZADOR DE CHATS/CAPTURAS = función estrella; "Mis relaciones" al núcleo; 18 competidores 🟢; costo IA ~$1,20/usuaria/mes; avatar 18-38. **Manda C donde difieren.**

## App modelo (FICHA-MODELO.md — APROBADA por evidencia)
- **Nebula: Horoscope & Astrology** — 2 señales de revenue: #1 grossing horóscopo EE.UU. (Statista 2023) + ~US$300k/mes est. (Sensor Tower, ~mar-2026). Ads de largo recorrido.
- Qué conservamos: onboarding tipo quiz que construye inversión · preview de valor → paywall · freemium con prueba 3 días · hook de hábito diario (carta del día + check-in).
- Nuestro eje único (UNO): ángulo → coach de claridad en el amor, tarot como reflexión y analizador anclado a la situación real; + idioma-geo español LATAM. Elimina su queja #1: precio honesto, sin chat por créditos, lecturas no genéricas.

## Reporte de validación (materia prima — no se re-valida)
- Avatar: mujeres **18 a 60+** (rango ampliado a pedido del usuario). Primaria: 20-35, en dating / dudas en pareja / superando al ex, sobrepiensa señales — es el foco de la ADQUISICIÓN pagada (más volumen, CPM barato). Sub-avatares: 35-45 post-divorcio con hijos; 50-65 sola tras matrimonio largo/viudez, se replantea si volver a salir o hacer las paces con estar sola (usa más diario y carta del día que el analizador; canal orgánico Facebook). El producto y el copy NO excluyen por edad. Consciencia alta y ESCÉPTICA.
- Dolores textuales: "obsesionada mirando el teléfono a ver si respondió" · "the AI responses feel robotic and cold" · "same generic card interpretation every day" · "$10/week just for a daily card quote, total rip off".
- Deseos: entender qué pasa hoy en <3 min · saber qué responder sin perder dignidad · dejar de revisar el teléfono · espacio privado sin juicio · lectura anclada a su historia real.
- Competencia: 18 apps directas 🟢 (subnicho poco saturado). Entrantes cercanos: Arcana (AI Tarot Chat), "Bye – Red Flags" (tarot sobre tus conversaciones), Co-Star, The Pattern.
- Diferenciador: "la única app que conecta el Tarot con la lectura en tiempo real de tus chats y vínculos para darte claridad sobre qué hacer hoy sin perder tu dignidad".

## Momento WOW / primera victoria (<5 min)
Pega el último mensaje o sube una captura → tirada de 1-3 cartas contextualizada → desglose: qué
sabemos / qué observamos / posible riesgo / pregunta para ti / qué podrías responder. Sensación: "esta app me entiende."

## Avatar y venta (FICHA-AVATAR.md — BORRADOR)
- Estado BORRADOR: hay ~7 frases VoC con fuente; faltan ≥3 más antes de escribir copy de venta (Sesión 3). Recomendado: 5-10 conversaciones con mujeres del avatar (44).
- Dolor #1: obsesión/incertidumbre ante señales ambiguas. Deseo #1: entender qué pasa hoy en <3 min.
- Tono de marca (protegido en TODO el copy): amiga intuitiva y muy preparada; NUNCA vidente que dicta certezas; estética wellness/coaching premium, no esotérica.
- Canal: Meta/TikTok Ads + reels orgánicos con dilemas de chat reales. Ganchos: teléfono/espera · "subí la captura de mi ex" · "deja de pedir consejo a amigas confundidas" · "3 red flags en 1 minuto" · "interés un día, desaparece al otro".

## Monetización (DECIDE-INFORMA — el usuario puede ajustar el precio con /precios)
- Modelo: **freemium onboarding-first** (quiz → preview de valor → paywall → registro/login). Confirmado por matriz A-F (B2C bienestar/relaciones) + el modelo Nebula.
- Prueba: **3 días** · Garantía: **7 días** (regla dura 18: garantía > prueba ✓; Hotmart admite 7/15/21/30).
- Precio propuesto: **US$9,99/mes + US$71,99/año** ("más de 4 meses gratis"). El resumen validado decía $59,99/año (≈6 meses gratis, descuento ~50%); se propone $71,99 para proteger ingreso — el usuario decide.
- Suelo de MERCADO (FICHA-MERCADO §1): mediana ~$10-15/mes → $9,99 dentro de rango (−0 a −20%), sin desvío que justificar.
- Suelo de COSTO (gate 40): costo IA ~$1,20/usuaria/mes → margen bruto ~88% a $9,99. PASA con holgura.
  Cupos: Gratis = 1 tirada/mes + check-in diario + carta del día + diario básico (costo ≈ $0).
  Premium = coach/analizador/tarot ilimitados con tope blando por resultado (fórmula 02C ≈ 40 resultados/día) para casos extremos.
- Suelo de CANAL: se chequea antes de la 1ª campaña pagada (34, Sesión 8).

## Decisiones técnicas (NO re-discutir sin pedirlo el usuario — no van al chat)
- Framework: **Next.js App Router** (landing con SEO + app + rutas de servidor para IA). Idioma UI: español mono-idioma.
- Auth: **Supabase Auth** passwordless (magic link / OTP por email) + Google OAuth; age gate 18+ en el onboarding; rate limit y errores de login genéricos (26).
- Modelo de datos (RLS activa en TODAS por `user_id = (select auth.uid())`, columna indexada — 25):
  `profiles` · `onboarding_answers` · `checkins` (mood diario) · `daily_cards` · `tarot_readings` ·
  `situations` (analizador: input + salida estructurada) · `coach_messages` (chat) ·
  `relationships` (Mis relaciones: rol + notas de la usuaria) · `journal_entries` ·
  `subscriptions` (plan/estado desde webhook Hotmart, idempotente + firma) · `ai_calls` (coste/kill-switch, 30/31).
- IA (30): coach = texto→texto sync con contexto (perfil + relaciones + últimos mensajes);
  DESCIFRAR = texto→texto sync con salida estructurada (sabemos/observamos/riesgo/pregunta/qué responder);
  tiradas = texto→texto sync; OCR de capturas = modelo multimodal o OCR+texto; NOTAS DE VOZ = voz→texto
  en servidor y luego el flujo de texto (proveedores de OCR y de transcripción se deciden en Sesión 6).
  `AI_MODEL` en env, `max_tokens` ~800-1024, cache de idénticos, kill-switch por coste. Prompt con guardarraíles:
  solo auto-reflexión/límites/inteligencia emocional; PROHIBIDO predecir salud, embarazo, muerte o eventos trágicos (gate 61).
- Loop de retención (Hooked): Gatillo = notificación nocturna "tu reflexión de 1 minuto está lista" + evento personal →
  Acción = check-in + carta del día / pegar un mensaje → Recompensa = insight que reencuadra + carta contextual (variable) →
  Inversión = diario + perfiles de Mis relaciones + historial que personaliza la lectura de mañana.
  Test "si borro tu historial ¿la app de mañana es idéntica?": NO. Primera semana D1-D7 y ritual diario M0 se diseñan en Sesión 4/5.
- Pasarela: Hotmart + webhook a Supabase (default del SO). Reviews/competidores citados son apps nativas; se construye web app + Hotmart salvo que el usuario exija nativo.

## ALCANCE V1 (aprobado por el usuario — 6 pantallas núcleo + bienvenida + paywall = 8)
1. Bienvenida · 2. Recorrido de inicio (quiz) · 3. Inicio (check-in + carta del día) ·
4. **DESCIFRA LA CONVERSACIÓN** (función estrella — antes "Analizador de situaciones"; título de
   pantalla "Descifra la conversación". Entradas: pega texto · captura · NOTA DE VOZ) ·
5. Coach IA (= **LUMA**, la tarotista/coach) · 6. Tarot (tiradas contextuales 1-3 cartas) ·
7. Diario emocional (con "LUMA: veo un patrón…" + botón "Ver mi patrón") · + Pantalla de planes.
- ⚠️ **"Mis relaciones" MOVIDA A V2** (decisión del usuario 2026-09-10). Sale de la barra inferior
  (nav V1: Inicio · Coach · Tarot · Diario · Más). El contexto del coach en V1 es la sesión + el
  onboarding; la memoria de vínculos con perfiles llega en V2.

### "Trabajar mis límites" — ubicación (decidido 2026-09-10)
Es un EJERCICIO guiado, no una salida de análisis. Vive en el COACH (el coach lo propone y lo
acompaña; chip en el chat, junto a "trabajar la ansiedad"). También se puede ofrecer tras un
análisis, pero desde el coach, no como acción suelta de la pantalla Descifrar. Opcional V1: lista
"Ejercicios" bajo "Más". En V2 pasa a formar parte de los Programas ("Subir tus estándares" /
"Construir una relación segura").

### NOTAS DE VOZ (decisión de producto 2026-09-10 — a pedido del usuario)
- Toda caja de texto de la app (Descifrar, chat del coach, diario) lleva un botón de micrófono:
  la usuaria mantiene pulsado y habla en vez de escribir.
- El audio se transcribe EN EL SERVIDOR (modelo voz→texto; proveedor se decide en Sesión 6) y a
  partir de ahí sigue el MISMO flujo que el texto. Nunca se manda la clave de voz al navegador.
- Coste: transcripción ≈ US$0,006/min → despreciable frente a la respuesta. Entra en el
  circuit-breaker de coste (30/31). Límite blando: audios ≤ 2-3 min.
- Coherente con "la buena IA borra trabajo, no agrega pasos" (regla UX 19c).
- A V2: Programas de 7-30 días · detección de patrones sobre todo el historial · Mis relaciones con timeline profundo · memoria de largo plazo del coach.

## Riesgos
- "Mis relaciones" guarda notas sobre TERCEROS → en V1 es el espacio privado de reflexión de ELLA (cómo lo vive ella), sin perfilar al otro, borrable; salvaguardas con 47. Solo 18+.
- Alucinaciones IA / predicción de tarot → prompt con guardarraíles + gate 61.
- CPA alto en ads → ganchos de chats reales (plan de canal).
- Cancelación tras resolver la duda puntual → ritual diario (check-in + carta del día) + notificación nocturna + diario con patrones.
- Nombre "LUMA": varias apps lo usan → verificar marca/dominio/stores; alt: "LUMA Tarot & Relaciones", "Claria IA".

## Identidad visual — DIRECCIÓN A · TERCIOPELO & ORO (detalle en FICHA-ARTE.md)
- El usuario descartó la réplica de su mockup plano y eligió una dirección propia (2026-09-10):
  noche vino/cacao casi-negro con blooms suaves, ORO solo en la acción, carta de tarot de pergamino
  que FLOTA con sombra+resplandor 3D. Display Cormorant Garamond · body Hanken Grotesk.
- Rondas de retoque aplicadas: menos saturación/densidad · Descifra la conversación aligerada ·
  borde dorado en todas las cajitas · círculos de emoción con EMOJI (😌🙂😰😢🥰 / 😄😌😰😢😠), más grandes
  y visibles · caja de patrón del diario firmada "LUMA" con ícono de atención + botón "Ver mi patrón".
- Tour: `vista-previa-app.html` (8 pantallas). Aprobación del usuario: PENDIENTE. FICHA-ARTE.md cerrada con retoques acordados.

## LUMA — la persona (tarotista + coach)
- La IA de la app se personifica como **LUMA** (mismo nombre que la app): "tu tarotista y coach".
  Aparece así en el chat y en la caja de patrones del diario.
- PENDIENTE (sesión de assets, archivo 20): ilustración/retrato de LUMA — una figura femenina
  cálida y mística (no vidente estereotipada), en la paleta Terciopelo & Oro — para: avatar del
  coach en la app + foto de perfil / mascota en redes sociales (TikTok, Instagram). Se compone el
  prompt de imagen desde FICHA-ARTE.md. En el tour hay un emblema provisional (luna creciente + destello).

## Secuencia maestra de construcción (NO saltar)
- Estado: identidad cerrada; **código en marcha**. Ruta: `/` → `/onboarding` → `/paywall` → `/login` → `/app`
- Landing (`/`): **construida, ACEPTADO con criterio propio** (revisor-visual ronda 6: 34/40 · 16/20 · 19/20 — ver checkpoint y [veredicto:landing]) — protagonista: el mecanismo "descifra la conversación"; CTA primario "Descifrar mi primera conversación" → `/onboarding`. Placeholders honestos que quedan: visual del hero + carrusel "Así se ve por dentro" (screenshots reales cuando exista la app interna, Sesión 5).
- Onboarding (`/onboarding`): **construido, ACEPTADO con criterio propio** (ver checkpoint arriba y "Problemas conocidos"). 7 preguntas + 2 reconocimientos + loading + revelación del plan; CTA final → `/paywall`.
- Paywall (`/paywall`): **construido, ACEPTADO con criterio propio** (8 rondas, ver "Problemas conocidos" → [veredicto:paywall]). Headline+timeline del trial+2 plan cards tocables+CTA único.
- Entrar (`/entrar`): **construido** (magic link por email, simula el envío — Sesión 6 conecta el backend real). No estaba planeada como pantalla propia de esta sesión; se adelantó porque "Restaurar compra" del paywall necesitaba un destino real.
- Login completo (con sesión real)/App interna: pendientes (Sesión 5-6).
- Servicios externos: bloqueados hasta que las puertas anteriores estén aprobadas.
- Stack (51): Next.js 16 App Router + TS + Tailwind v4 (CSS-first, @theme) + shadcn/ui + Motion + Lucide.
  Kit de landing de `plantillas-codigo/landing/` → `components/landing/`. Tokens Terciopelo & Oro en globals.css.

## Sesiones
- ✅ Sesión 1 — validación, FICHA-MODELO (Nebula), FICHA-MERCADO, FICHA-AVATAR (borrador), monetización, arquitectura, unit economics. Aprobada por el usuario (precio + rango de edad 18-60+).
- ✅ Sesión 2 — identidad visual CERRADA: dirección **A · Terciopelo & Oro** + iconos emoji + LUMA con
  retrato + varias rondas de retoque. `vista-previa-app.html` (8 pantallas) aprobado por el usuario.
  FICHA-ARTE.md APROBADA (cosa juzgada).
- 🔧 Sesión 3 — CONSTRUCCIÓN: scaffold + página de ventas (en curso).
- 📋 Sesión 3: página de ventas (requiere FICHA-AVATAR APROBADA con ≥10 VoC).
- 📋 Sesión 4: onboarding + paywall + login · 5: app interna · 6: integraciones + seguridad · 7: testing + pulido + rigor · 8: adquisición + lanzamiento + backoffice.

## Problemas conocidos ⚠️
- [FICHA-AVATAR] APROBADA con 10 VoC (3 son paráfrasis de investigación, no citas verbatim). Antes del
  LANZAMIENTO: 5-10 conversaciones reales del avatar (archivo 44) para validar/afinar el copy de venta.
  Guía de entrevistas + mensajes de WhatsApp listos: docs/investigacion/guia-entrevistas-avatar.md.
- [landing] Placeholders honestos: (a) visual del hero, (b) carrusel "Así se ve por dentro" — se
  reemplazan con screenshots reales de la app interna (Sesión 5). CTAs → `/onboarding` (ya existe,
  construido en Sesión 4); `/entrar` (login) aún no existe (Sesión 4, paso 3).
- [legal] /privacidad /terminos /cookies /reembolsos /aviso-ia son BORRADOR — contenido legal
  definitivo antes del lanzamiento (archivo 47).
- [veredicto:landing] ACEPTADO CON CRITERIO PROPIO desde la 6ª ronda del 2º ciclo (ver detalle
  abajo) — no LISTA por el gate automático de Usabilidad, mismo patrón que onboarding/paywall.
  Historial 1er ciclo hasta la 1ª aprobación (8ª ronda, 2026-09-11): 29/10/14 → 31/15/15 →
  32/19/18 → 31/18/17 → 35/19/19 → 35/19/19 → 32/18/19 → 37/19/19 LISTA. El 2026-09-12 se elevó
  la escaneabilidad mobile (Agitación pasó de texto plano a íconos por frase) y se relanzó: 1ª
  repasada NO LISTA (falso positivo de un skip-link "superpuesto" — artefacto del script de
  captura, corregido en scripts-dev/shot.mjs; + Craft bajó a 16/20 por repetición de ícono) →
  corregido → 2ª repasada **LISTA: 37/40 · 17/20 · 19/20**. 2º CICLO (mismo día, feedback visual
  DIRECTO del usuario tras ver esa aprobación — 4 puntos: "LUMA cortada", "frases cortadas al
  final", chip de Solución "mitad sin borde", "íconos deben ser emoji"): ronda 3 (unificó íconos a
  emoji en Problema+Agitación, arregló Hairline roto del chip) → NO LISTA 33/17/19 (emoji fuera de
  paleta en Windows + ZWJ) → ronda 4 (ZWJ→😖, fill del chip 8%) → NO LISTA 33/17/19 (2 emoji de
  Problema seguían fuera de paleta) → ronda 5 (🤔💬🔁→😕😳😩, fill del chip 8%→13%) → NO LISTA
  33/15/19 (confirma los 4 puntos del usuario resueltos; único defecto restante es heredado: CTA
  Mensual de Oferta con `<a>` hecho a mano) → ronda 6 (CtaButton con variant outline) → **NO LISTA
  34/40 · 16/20 (PASA) · 19/20 (PASA)** — Craft y Copy pasan su gate; Usabilidad queda 2 puntos
  bajo el gate (≥36) sostenida por varios criterios en "3 sólido" sin defecto puntual identificable
  (el propio revisor lo describe como decisión de producto, no bug). El usuario decide si seguir
  puliendo o cerrar aquí. Evidencia: docs/revisiones/landing-375.png +
  landing-problema/agitacion/solucion/oferta-375.png + landing-veredicto.md (historial rondas 3-6).
  Pendientes menores sin bloquear: testimonios reales (ver FICHA-AVATAR arriba), `/entrar` ya
  existe, páginas legales en borrador (archivo 47), copy de CTA idéntico entre planes de Oferta,
  fill del chip de Solución podría subir más (13%→18-20%) en una pasada de pulido futura.
  NOTA sobre "veredicto caducado": el código .tsx de `app/onboarding/` y
  `components/onboarding/` es MÁS NUEVO que landing-veredicto.md porque se escribió después
  (Sesión 4) — no toca ningún archivo de la landing (`app/page.tsx`, `components/landing/*`,
  `components/app/HeroDemoLuma.tsx`, `components/app/CasosLuma.tsx` no cambiaron desde el
  veredicto LISTA). El veredicto de landing sigue vigente; no hace falta re-renderizar.
- [AppPorDentro] El carrusel de screenshots del kit sale de la V1 de la landing (lo reemplaza
  "Ejemplos reales"). Vuelve en Sesión 5 con capturas reales de la app interna (19 §5).
- [veredicto:onboarding] ACEPTADO CON CRITERIO PROPIO (no LISTA por gate automático) — 5 rondas
  de revisor-visual (25/12 → 29/13 → 32/14 → 25/11 → 32/13), sin converger al gate ≥36/40·≥16/20
  por un patrón de feedback inconsistente entre rondas sobre el balance vertical de las pantallas
  de pregunta (medido a mano dos veces por mí, el desbalance real es leve). El usuario decidió
  cerrar el ciclo de revisión tras la 5ª ronda. Bugs reales SÍ corregidos en el camino: selección
  de chip no se restauraba al volver "Atrás", fondo plano tapaba los blooms del brand kit. Emoji
  en las opciones NO es un defecto nuevo: es la decisión ya vigente de FICHA-ARTE (Ronda #4).
  Evidencia en docs/revisiones/onboarding-*.png + onboarding-veredicto.md.
- [assets LUMA] Falta el retrato/ilustración final de LUMA (persona) para avatar del coach + redes — sesión de assets (20). No bloquea la construcción; en el código va un placeholder.
- [veredicto:paywall] ACEPTADO CON CRITERIO PROPIO (no LISTA por gate automático) — 8 rondas de
  revisor-visual: 31/14/17 → 30/14/17 → 29/12/17 → 29/13/18 → 31/16/19 → 29/16/19 → 28/16/19 →
  29/16/19. Craft (16/20) y Copy (19/20) aprueban desde la ronda 5; Usabilidad se quedó en
  28-31/40 (gate ≥36) sin converger tras 8 rondas — mismo patrón de rendimientos decrecientes que
  onboarding y landing. El usuario decidió cerrar el ciclo tras la 8ª ronda, pase lo que pase.
  Bugs reales corregidos en el camino (no defectos de gusto): checkmarks sin círculo de acento,
  cero hairline degradé, sin fallback de beneficios sin datos del onboarding, ancla emocional de
  FICHA-AVATAR ausente, "checkout" sin traducir, header sticky duplicado en capturas fullPage
  (artefacto del script, no del producto), fill opaco tapando los blooms, sin dispositivo ownable
  (se agregó la carta de tarot), 2º resplandor casi imperceptible, pantalla "confirmado" sin
  salida, 404 real en /entrar (se construyó esa página, Sesión 4 paso 3), toques táctiles <44px en
  varios links, CTA que no reflejaba el plan elegido, header inconsistente entre pantallas del
  funnel, conteo de "N respuestas" mal calculado (contaba claves internas, no preguntas reales),
  email sin validación real, sin label visible, Enter no enviaba el formulario, wordmark con la
  fuente equivocada, plan seleccionado sin check visible (solo color/sombra). Un intento de leer
  localStorage de forma síncrona para evitar un salto visual ROMPIÓ la hidratación de React
  (confirmado en log de dev: "Hydration failed") — se revirtió, documentado en el código.
  ⚠️ NOTA RECURRENTE (ya resuelta, dejar como referencia): 3 rondas distintas midieron mal las
  proporciones de vacío de la pantalla "confirmado" (afirmaron alturas de 2768px/1418px cuando el
  PNG real es 750×1624 = viewport móvil estándar, verificado con `file` cada vez) — si un futuro
  revisor vuelve a señalar esto, verificar las dimensiones reales del archivo antes de "corregir".
  Evidencia en docs/revisiones/paywall-*.png + paywall-veredicto.md, docs/revisiones/entrar-*.png.
- `vista-previa-app.html` es mockup pre-código (no es la app); recorte por ajustar en 2 frames.
- FICHA-MERCADO: penetración de tarjeta por país y % compras >30 días quedaron NO ENCONTRADO — revisar 2027-03-09.
- [veredicto:inicio] ACEPTADO CON CRITERIO PROPIO (no LISTA por gate automático) — 3 rondas de
  revisor-visual: 30/13 → 32/14 → 31/16. Craft PASA (≥16/20) desde la 3ª ronda; Usabilidad se
  estancó en 31/40 (gate ≥36) sin defecto puntual nuevo en la última ronda — el propio revisor lo
  describe como "zona de retorno decreciente" y dice textualmente "cerrar con criterio propio en
  este punto es defendible". Mismo patrón que landing (6 rondas), onboarding (5) y paywall (8).
  10 bugs reales corregidos en el camino (no defectos de gusto): animación de la carta del día
  apagada por error (`animar={false}` residual de un fix anterior), botones de accesos rápidos
  desbordando a 2 líneas y rompiendo su altura fija, cita de la carta duplicada (hardcodeada +
  repetida en un párrafo aparte), ícono de hamburguesa prometiendo un menú que no existía, chip de
  confirmación "Guardado en tu diario" invisible/muy débil, la carta del día se veía tocable pero
  no tenía acción, franja de la pantalla sin profundidad (fill plano), avatar sin inicial/no se
  leía como tocable, `prefers-reduced-motion` solo respetado por un componente en vez de toda la
  app (resuelto con `<MotionConfig reducedMotion="user">` global en `app/layout.tsx`). Evidencia en
  docs/revisiones/inicio-375.png + inicio-veredicto.md (historial completo 3 rondas).

## Pendientes del usuario
- [x] Sesión 1 aprobada: precio $9,99/mes + $71,99/año · rango de edad ampliado a 18-60+.
- [ ] Aprobar el tour visual (dirección A) para cerrar la identidad y empezar a construir.
- [ ] Assets: se necesitará un retrato/ilustración de LUMA (persona) para la app y redes — se produce en la sesión de assets.
- [ ] Verificar disponibilidad del nombre "LUMA" (marca/dominio/stores) — te digo cómo cuando toque el dominio.
- [ ] Ideal antes de la página de ventas: hablar 10-15 min con 5-10 mujeres del perfil (te preparo las preguntas).
- [ ] Más adelante: crear cuentas (Hotmart, Supabase, Vercel, Resend) y comprar dominio — se avisará.

## Notas para la próxima sesión
- Enfoque ACTUAL: LUMA con Insumo C como fuente principal. No re-validar concepto.
- El ANALIZADOR DE CHATS/CAPTURAS es la función estrella y el eje del video/ads — priorizarlo en diseño y en la primera victoria.
- Referencia visual del usuario = CONTRATO: replicar, no reinterpretar (16 / 54 RUTA 2).
