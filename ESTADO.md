# ESTADO — LUMA (nombre de trabajo)
Última actualización: 2026-09-14 | Sesión actual: 6 (servicios externos) — EN CURSO

✅ CHECKPOINT — Sesión 6 arrancó (secuencia: GitHub → Vercel → Supabase → IA real → Resend →
dominio → Hotmart). SIGUE BLOQUEADA en el primer paso: se le pidió al usuario crear cuenta/repo en
GitHub (P0-P1 de `docs/sistema/62`), sin respuesta aún — nada más avanza hasta tener owner+repo.
2026-09-14: el usuario preguntó si Tarot (o alguna otra sección) necesita una API distinta —
se le explicó que NO: una sola IA de texto sirve para Descifra/Coach/Tarot, aparte solo hace falta
el modo imagen (Captura) y voz→texto (notas de voz), todo dentro de la misma conexión de la Sesión 6.
Reveló de paso una decisión de producto sin cerrar: ¿las lecturas de tarot quedan con texto fijo
(gratis) o se vuelven personalizadas por IA a la situación real de cada usuaria (más "wow", cuesta
por tirada)? Sin decidir — se resuelve al conectar la IA real, salvo que el usuario adelante la
respuesta antes.
Mientras tanto se hicieron 2 cosas fuera de esa cola, a pedido del usuario:
1. Se le dio la receta de prompt (compuesta desde FICHA-ARTE) para generar el retrato final de LUMA
   con Gemini — sigue pendiente que el usuario lo genere y lo pase.
2. El usuario generó el logo final con Gemini (imagen real, corazón+espada dorado con glow) y pidió
   "exactamente esto" — se reemplazó el primer intento en SVG por el ASSET REAL: recortado y con
   fondo transparente (`public/luma-icon.png`, 389×532; + `public/luma-lockup.png` con el wordmark
   para splash/OG futuro), conectado en la cabecera de la landing (`app/page.tsx`). Receta para
   regenerar: extraer el símbolo de la imagen fuente, chroma-key del fondo casi-negro (~#1a0f15,
   igual al `--bg` de la app) a transparente, trim al bounding box. `components/app/LumaLogo.tsx`
   (la versión SVG a mano) se BORRÓ por quedar superseded — no usar de referencia futura.
   El usuario confirmó: ya está también en la cabecera de Inicio (`app/app/(tabs)/page.tsx`) y como
   favicon real (`app/icon.png` 512×512 + `app/favicon.ico` reconstruido con el símbolo, ambos con
   el ícono centrado sobre `--bg` sólido). Ícono chico — CERRADO.
   El usuario pidió además el LOGOTIPO completo (símbolo + "LUMA" resplandeciente debajo, tal cual
   su imagen) — ya existía como `public/luma-lockup.png` (recortado a su bounding box, fondo
   transparente) del mismo procesamiento del ícono; se le mostró al usuario (archivo enviado) y NO
   se usó todavía en ninguna pantalla — no cabe en las cabeceras angostas actuales (es vertical).
   El usuario pidió "ponlo donde creas mejor" (DECIDE-INFORMA-AVANZA) → se puso como hero centrado
   en `app/entrar/page.tsx` (arriba de "Entra a tu plan"), sin tocar las demás pantallas: es la
   pantalla de menor riesgo (sin blueprint estricto de doctrina, momento de confianza/identidad al
   iniciar sesión) y no compite con ningún bloque funcional existente. Logotipo completo — CERRADO.
Propuesta sin decidir del usuario: agregar RACHA de constancia (check-in diario) + un "termómetro"
que compare el ánimo de hace 30 días vs ahora (visto en apps del nicho: Mend, Attached, NoContact —
investigado y documentado en la conversación, no en archivo aparte). Requiere backend real
(Sesión 6) para ser honesto — no se construye con localStorage. Esperando luz verde del usuario.

✅ CHECKPOINT (histórico) — Sesión 5 (app interna) COMPLETA. 6 pantallas construidas con datos semilla reales
(Ana, mismo caso de la landing), cada una pasada por revisor-visual salvo "Más" (secundaria):

- **Inicio** (`/app`) — ACEPTADA con criterio propio. 3 rondas, final 31/40·16/20 (craft PASA).
- **Descifra la conversación** (`/app/descifrar`, función estrella) — ACEPTADA con criterio propio.
  4 rondas, final 31/40·18/20 (craft PASA con margen).
- **Coach** (`/app/coach`) — ACEPTADA con criterio propio. 4 rondas, final 31/40·16/20 (craft PASA).
- **Tarot** (`/app/tarot`) — ACEPTADA con criterio propio. 6 rondas, final 32/40·16/20 (craft PASA
  recién en la 6ª, tras agregar un teaser real de "carta del día" para usuarias sin historial).
- **Diario emocional** (`/app/diario`) — **✅ LISTA** (veredicto real, gate automático completo):
  **36/40 · 16/20**, ronda 6. Única pantalla de la app interna en cruzar ambos gates.
- **Más** (`/app/mas`) — construida (pantalla secundaria, sin revisor-visual por doctrina).

Detalle completo de cada ciclo de rondas en "Problemas conocidos" (`[veredicto:*]`) y en
`docs/revisiones/<pantalla>-veredicto.md`. Patrón confirmado en TODA la sesión (landing,
onboarding, paywall, inicio, descifra, coach, tarot): craft siempre cruza su gate (≥16/20);
usabilidad se estanca bajo el gate (≥36/40) una vez agotados los bugs reales — el revisor lo llama
"rendimientos decrecientes". Diario cruzó ambos porque sus pendientes eran 100% concretos y baratos
(persistencia real, conteo animado, `prefers-reduced-motion`), no heurísticas dispersas de alcance.

Componentes nuevos compartidos: `AppButton`/`AppLinkButton` (variante `compact`, `busy`/`aria-live`,
`onClick` en el Link), `BottomNav`, `ScreenHeader`, `MoodPicker`, `LumaAvatar` (retrato provisional).
`CartaSacerdotisa` (antes solo de la landing) ahora acepta props reales (numero/nombre/cita) y un
modo de disparo por montaje (`disparo="montaje"` vs `"scroll"`) — compartida entre landing, Inicio
y Tarot. `MotionConfig reducedMotion="user"` en `app/layout.tsx` (global). Puentes de persistencia
sin backend (localStorage, Sesión 6 conecta Supabase real): `lib/almacenamiento-diario.ts`
(Tarot→Diario) y contadores/últimas-tiradas inline en cada pantalla. /
Siguiente acción exacta: presentarle al usuario el cierre de Sesión 5 en simple y preguntar cómo
seguir — Sesión 6 (conectar servicios reales) es lo siguiente en la secuencia maestra, pero las
entrevistas de avatar y el retrato de LUMA siguen pendientes de sesiones anteriores.

## Qué es esta app (3 líneas máximo)
Coach de bolsillo de inteligencia emocional para el amor y las relaciones: combina IA, tarot y
análisis de chats/capturas para que mujeres jóvenes (18-38) descifren señales ambiguas, calmen la
ansiedad afectiva y sepan qué hacer hoy sin perder sus límites. Tarot = herramienta de reflexión,
no de predicción. Monetización: freemium onboarding-first (prueba 3 días → $9,99/mes o anual).

## Promesa central
"Entiende lo que está pasando y elige mejor." — Ayuda a mujeres con dudas o conflictos en su vida
amorosa a separar hechos de interpretaciones, ver sus patrones y decidir su próximo paso sin
adivinación, mediante análisis de su situación + coach IA + tarot como disparador de reflexión.

## Historial de enfoque (3 insumos fusionados — NO re-validar la idea)
- Insumo A — "Tarot Mirror": tarot como detonante de journaling. Vigente: avatar base, precio, postura anti-adivinación.
- Insumo B — PDF "LUMA_propuesta_MVP-3.pdf": foco amor/relaciones; tono "amiga preparada, no vidente"; estética wellness premium.
- Insumo C — 2º resumen validado LUMA: freemium; ANALIZADOR DE CHATS/CAPTURAS = función estrella; 18 competidores 🟢; costo IA ~$1,20/usuaria/mes; avatar 18-38. **Manda C donde difieren.**

## App modelo (FICHA-MODELO.md — APROBADA por evidencia)
- **Nebula: Horoscope & Astrology** — #1 grossing horóscopo EE.UU. (Statista 2023) + ~US$300k/mes est. (Sensor Tower).
- Qué conservamos: onboarding tipo quiz · preview de valor → paywall · freemium con prueba 3 días · hook diario (carta del día + check-in).
- Nuestro eje único: coach de claridad en el amor, tarot como reflexión y analizador anclado a la situación real + español LATAM.

## Reporte de validación (materia prima — no se re-valida)
- Avatar: mujeres **18 a 60+**. Primaria: 20-35, en dating/dudas en pareja/superando al ex. Sub-avatares: 35-45 post-divorcio con hijos; 50-65 sola tras matrimonio largo/viudez. Consciencia alta y ESCÉPTICA.
- Dolores: "obsesionada mirando el teléfono a ver si respondió" · "the AI responses feel robotic" · "same generic card interpretation every day".
- Deseos: entender qué pasa hoy en <3 min · saber qué responder sin perder dignidad · espacio privado sin juicio.
- Competencia: 18 apps directas 🟢. Entrantes: Arcana, "Bye – Red Flags", Co-Star, The Pattern.
- Diferenciador: "la única app que conecta el Tarot con la lectura en tiempo real de tus chats y vínculos".

## Momento WOW / primera victoria (<5 min)
Pega el último mensaje o sube una captura → tirada de 1-3 cartas contextualizada → desglose: qué
sabemos / qué observamos / posible riesgo / pregunta para ti / qué podrías responder.

## Avatar y venta (FICHA-AVATAR.md — BORRADOR)
- Estado BORRADOR: ~7 frases VoC con fuente; faltan ≥3 más antes del lanzamiento (entrevistas reales, archivo 44).
- Dolor #1: obsesión/incertidumbre ante señales ambiguas. Deseo #1: entender qué pasa hoy en <3 min.
- Tono de marca: amiga intuitiva y muy preparada; NUNCA vidente que dicta certezas.
- Canal: Meta/TikTok Ads + reels orgánicos con dilemas de chat reales.

## Monetización (DECIDE-INFORMA — el usuario puede ajustar el precio con /precios)
- Modelo: **freemium onboarding-first** (quiz → preview de valor → paywall → registro/login).
- Prueba: **3 días** · Garantía: **7 días**.
- Precio: **US$9,99/mes + US$71,99/año** ("más de 4 meses gratis").
- Suelo de MERCADO: mediana ~$10-15/mes → $9,99 dentro de rango. Suelo de COSTO: costo IA ~$1,20/usuaria/mes → margen ~88%. PASA con holgura.
  Cupos: Gratis = 1 tirada/mes + check-in + carta del día + diario básico. Premium = ilimitado con tope blando (~40 resultados/día).
- Suelo de CANAL: se chequea antes de la 1ª campaña pagada (Sesión 8).

## Decisiones técnicas (NO re-discutir sin pedirlo el usuario)
- Framework: **Next.js App Router**. Idioma UI: español mono-idioma.
- Auth: **Supabase Auth** passwordless (magic link/OTP) + Google OAuth; age gate 18+; rate limit y errores genéricos.
- Modelo de datos (RLS por `user_id = (select auth.uid())`): `profiles` · `onboarding_answers` · `checkins` · `daily_cards` ·
  `tarot_readings` · `situations` · `coach_messages` · `relationships` · `journal_entries` · `subscriptions` · `ai_calls`.
- IA: coach/descifrar/tiradas = texto→texto sync; OCR de capturas = multimodal; notas de voz = voz→texto en servidor.
  `AI_MODEL` en env, `max_tokens` ~800-1024, cache de idénticos, kill-switch por coste. Prompt: solo auto-reflexión/límites/inteligencia emocional; PROHIBIDO predecir salud/embarazo/muerte (gate 61).
- Loop de retención (Hooked): Gatillo=notificación nocturna → Acción=check-in/pegar mensaje → Recompensa=insight+carta → Inversión=diario+historial.
- Pasarela: Hotmart + webhook a Supabase.

## ALCANCE V1 (aprobado por el usuario — 8 pantallas)
1. Bienvenida · 2. Recorrido de inicio (quiz) · 3. Inicio (check-in + carta del día) ·
4. **DESCIFRA LA CONVERSACIÓN** (función estrella; pega texto/captura/nota de voz) ·
5. Coach IA (= **LUMA**) · 6. Tarot (1-3 cartas) · 7. Diario emocional · + Pantalla de planes.
- ⚠️ "Mis relaciones" MOVIDA A V2. Nav V1: Inicio · Coach · Tarot · Diario · Más.
- "Trabajar mis límites": vive en el Coach (chip en el chat), no en Descifrar. V2 = parte de Programas.
- NOTAS DE VOZ: botón de mic en toda caja de texto; se transcribe EN EL SERVIDOR (proveedor: Sesión 6); ≈US$0,006/min, límite ≤2-3 min.

## Riesgos
- "Mis relaciones" (V2) guarda notas sobre TERCEROS → espacio privado de reflexión de ELLA, sin perfilar al otro, borrable. Solo 18+.
- Alucinaciones IA / predicción de tarot → prompt con guardarraíles + gate 61.
- Cancelación tras resolver la duda puntual → ritual diario + notificación + diario con patrones.
- Nombre "LUMA": varias apps lo usan → verificar marca/dominio/stores antes de comprar dominio.

## Identidad visual — DIRECCIÓN A · TERCIOPELO & ORO (detalle en FICHA-ARTE.md — APROBADA, cosa juzgada)
- Noche vino/cacao casi-negro con blooms suaves, ORO solo en la acción, carta de tarot de pergamino
  que FLOTA con sombra+resplandor 3D. Display Cormorant Garamond · body Hanken Grotesk.
- Sistema de íconos = EMOJI en toda la app (Ronda #4, decisión explícita del usuario — anula la
  regla general anti-emoji SOLO para este proyecto).
- Tour: `vista-previa-app.html` (8 pantallas), aprobado. Ver FICHA-ARTE.md para el detalle completo de rondas de retoque.

## LUMA — la persona (tarotista + coach)
- La IA se personifica como **LUMA**: "tu tarotista y coach". `components/app/LumaAvatar.tsx` tiene
  un retrato ilustrado PROVISIONAL — el final se produce en la sesión de assets (archivo 20), no bloquea.

## Secuencia maestra de construcción
- Landing (`/`) → Onboarding (`/onboarding`) → Paywall (`/paywall`) → Entrar (`/entrar`) → App (`/app/*`).
- Landing, Onboarding, Paywall: construidos, ACEPTADOS con criterio propio (ver [veredicto:*] abajo).
- Entrar: construido (magic link simulado — Sesión 6 conecta el backend real).
- App interna: **completa** (ver checkpoint arriba) — las 6 pantallas construidas y revisadas.
- Servicios externos (Sesión 6): pendientes — GitHub, Supabase, IA real, Vercel, Resend, dominio, Hotmart.
- Stack: Next.js 16 App Router + TS + Tailwind v4 (CSS-first) + shadcn/ui + Motion + Lucide.

## Sesiones
- ✅ Sesión 1 — validación, fichas, monetización, arquitectura. Aprobada (precio + edad 18-60+).
- ✅ Sesión 2 — identidad visual CERRADA (Dirección A). FICHA-ARTE.md APROBADA (cosa juzgada).
- ✅ Sesión 3-4 — landing, onboarding, paywall, entrar construidos y aceptados.
- ✅ Sesión 5 — app interna completa (6 pantallas, ver checkpoint arriba).
- 📋 Sesión 6: servicios externos + seguridad · 7: testing + pulido + rigor · 8: adquisición + lanzamiento + backoffice.

## Problemas conocidos ⚠️
- [FICHA-AVATAR] APROBADA con 10 VoC (3 son paráfrasis). Antes del LANZAMIENTO: 5-10 conversaciones
  reales del avatar (archivo 44). Guía lista: docs/investigacion/guia-entrevistas-avatar.md.
- [legal] /privacidad /terminos /cookies /reembolsos /aviso-ia son BORRADOR — contenido definitivo antes del lanzamiento (archivo 47).
- [assets LUMA] Falta el retrato/ilustración final de LUMA — sesión de assets (20). No bloquea; hay placeholder en el código.
- `vista-previa-app.html` es mockup pre-código (no es la app).
- FICHA-MERCADO: penetración de tarjeta por país y % compras >30 días quedaron NO ENCONTRADO — revisar 2027-03-09.
- [veredicto:landing] ACEPTADO CON CRITERIO PROPIO — 1er ciclo: 8 rondas → LISTA 37/40·17/20·19/20
  (2026-09-11). 2º ciclo (feedback directo del usuario sobre 4 puntos, todos confirmados resueltos:
  recorte falso-positivo de miniatura, chip de Solución con borde roto —bug real—, íconos a emoji):
  6 rondas → NO LISTA final 34/40·16/20(PASA)·19/20(PASA), usabilidad 2pts bajo gate sin defecto
  puntual identificable ("decisión de producto, no bug" según el revisor). Evidencia:
  docs/revisiones/landing-*.png + landing-veredicto.md (historial completo, ambos ciclos).
- [veredicto:onboarding] ACEPTADO CON CRITERIO PROPIO — 5 rondas, sin converger (25/12→32/13) por
  feedback inconsistente entre rondas sobre balance vertical (desbalance real leve, verificado a
  mano). Bugs reales corregidos: selección de chip no se restauraba al volver, fondo tapaba blooms.
  Evidencia: docs/revisiones/onboarding-*.png + onboarding-veredicto.md.
- [veredicto:paywall] ACEPTADO CON CRITERIO PROPIO — 8 rondas, craft(16/20)/copy(19/20) aprueban
  desde ronda 5, usabilidad 28-31/40 sin converger. Bugs reales corregidos: checkmarks sin acento,
  sin hairline, "checkout" sin traducir, CTA no reflejaba el plan elegido, 404 real en /entrar
  (construido), toques <44px, plan seleccionado sin check visible, hidratación rota por lectura
  síncrona de localStorage (revertido). Evidencia: docs/revisiones/paywall-*.png + paywall-veredicto.md.
- [veredicto:inicio] ACEPTADO CON CRITERIO PROPIO — 3 rondas → 31/40·16/20(PASA). Bugs reales:
  animación de la carta apagada por error, botones desbordando, cita duplicada, hamburguesa
  redundante, confirmación invisible, carta sin Link, franja sin profundidad, avatar sin inicial,
  `prefers-reduced-motion` no global (resuelto con `MotionConfig` en `app/layout.tsx`, beneficia
  toda la app). Evidencia: docs/revisiones/inicio-375.png + inicio-veredicto.md.
- [veredicto:descifrar] ACEPTADO CON CRITERIO PROPIO — 4 rondas → 31/40·18/20(PASA con margen).
  Bugs reales: vacío muerto + fondo plano (blooms con `dvh` + 3er bloom), CTA se deshabilitaba por
  vacío (corregido: nunca disabled, explica por qué), sin estado de error, mic prometía gesto que no
  tenía, sin whileTap en chips, sin stagger inicial, íconos a 32px en vez de 34px, sin atajo de
  teclado, sin spinner de carga, sin aria-busy/aria-live (agregado a `AppButton`). Evidencia:
  docs/revisiones/descifrar-375.png + descifrar-veredicto.md.
- [veredicto:coach] ACEPTADO CON CRITERIO PROPIO — 4 rondas → 31/40·16/20(PASA). Bugs reales: hilo
  semilla muy corto (vacío muerto, ampliado a 5 mensajes), texto a 13px (subido a 14px), sin
  whileTap, bug real `AnimatePresence initial={false}` anulaba animación de entrada de mensajes
  semilla, sin camino de error (agregado: 15% fallo simulado + Reintentar), botones a 44px en vez de
  48px, sin bloom inferior, sin `aria-live`/`role="log"`. Evidencia: docs/revisiones/coach-375.png + coach-veredicto.md.
- [veredicto:tarot] ACEPTADO CON CRITERIO PROPIO — 6 rondas → 32/40·16/20(PASA, recién en ronda 6).
  El revisor fue explícito: el techo hasta la ronda 5 NO era rendimientos decrecientes sino un
  defecto concreto — franja baja plana para usuarias SIN historial (el caso más común); se resolvió
  con un teaser real de "carta del día" (mismos datos que esa tirada) + CTA directo. Otros bugs
  reales: filas sin whileTap, sin stagger, sin auto-scroll, "Guardar en mi diario" no persistía nada
  (resuelto con `lib/almacenamiento-diario.ts`), bug de reactividad real (`alternar()` no llamaba
  `setUltima(id)`, chip desactualizado en la misma sesión), radio de miniatura fuera de familia.
  Evidencia: docs/revisiones/tarot-*.png + tarot-veredicto.md.
- [veredicto:diario] **✅ LISTA** — gate automático completo: **36/40 · 16/20**, ronda 6 (historial:
  30/12→25/11→30/14→34/15→35/15→36/16). Bugs reales corregidos: vacío muerto sin bloom, mic/"Ver mi
  patrón" sin `onClick` (agregado "Próximamente"), "Guardar" confirmaba con texto vacío, sin
  stagger, sin bloom intermedio, header fuera del stagger, sin atajo de teclado, "Guardado ✓" NO
  persistía nada (bug real, resuelto con localStorage), franja final vacía (resuelto con contador
  real animado de registros guardados), conteo animado no respetaba `prefers-reduced-motion`
  (corregido). Evidencia: docs/revisiones/diario-375.png + diario-veredicto.md.

## Pendientes del usuario
- [ ] Assets: retrato/ilustración de LUMA (persona) para la app y redes — sesión de assets.
- [ ] Verificar disponibilidad del nombre "LUMA" (marca/dominio/stores) antes de comprar dominio.
- [ ] Ideal antes del lanzamiento: hablar 10-15 min con 5-10 mujeres del perfil (entrevistas de avatar).
- [ ] Sesión 6: crear cuentas (Hotmart, Supabase, Vercel, Resend) y comprar dominio — se avisará.

## Notas para la próxima sesión
- Enfoque ACTUAL: LUMA con Insumo C como fuente principal. No re-validar concepto.
- El ANALIZADOR DE CHATS/CAPTURAS (Descifra la conversación) es la función estrella — ya construida.
- Sesión 6 conecta los servicios reales: define ahí el proveedor de OCR y de voz→texto.
