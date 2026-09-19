# ESTADO — LUMA (nombre de trabajo)
Última actualización: 2026-09-19 | Sesión actual: 6 (servicios externos) — EN CURSO
Estado al cierre de hoy: app con IA real en las funciones principales + Mapa de Poder + El Círculo (Fase 1)
+ Sinergia zodiacal. Nada sin commitear a propósito: hay muchos cambios locales sin commit (el usuario no
lo ha pedido). Pendientes grandes: Vercel (GitHub App sin autorizar), tarjeta para compartir (Círculo Fase 2),
definir "LUMA VIP" y cobro suelto, protección de las rutas de IA en el servidor, Hotmart/dominio.

✅ CHECKPOINT — `ANTHROPIC_API_KEY` real puesta por el usuario (clave "Luma", $10 de crédito
prepago, recarga automática desactivada = tope de gasto natural, sin necesidad de "spend limit"
aparte). Verificado en el navegador de punta a punta: /app/descifrar analizó una conversación real
con la IA (respuesta de calidad, ej. detectó "control disfrazado de indiferencia") y al intentar un
segundo análisis sin plan, redirigió correctamente a /paywall — la prueba gratis de un solo uso
funciona en producción, no solo en el código. IA real confirmada funcionando para las 4 funciones.

✅ CHECKPOINT — Bug real reportado por el usuario, corregido: el botón "¿Qué podría responderle?"
en Descifrar llevaba al Coach con la conversación de EJEMPLO fija (la de "Estoy conociendo a un
chico..."), sin ninguna relación con el mensaje real recién analizado — rompía la ilusión justo
después de mostrar un resultado real. Nuevo `lib/almacenamiento-coach.ts` (mismo patrón que el
puente Tarot→Diario): el botón guarda "¿Qué podría responderle a esto? + el texto real" y el Coach,
si encuentra ese mensaje pendiente, arranca con el hilo VACÍO (no la charla de ejemplo) y precarga
el mensaje real en el campo de texto, listo para enviar. Se leyó en `useEffect` (no en el estado
inicial) para no romper la hidratación — mismo cuidado que ya se había tomado en `/paywall`.
Verificado en el navegador de punta a punta. tsc ✓.
PENDIENTE (no bloquea, ya anotado antes): cuando alguien entra al Coach SIN venir de un análisis
(ej. directo desde el onboarding eligiendo "coach", o desde el menú inferior), sigue viendo la
charla de ejemplo fija — no es lo mismo que "empezar de cero" de verdad. Arreglarlo bien requiere
guardar el historial real por usuario en Supabase (`coach_messages`, ya en el pendiente de esquema)
en vez de empezar cada vez con datos semilla; no se tocó hoy porque es un cambio más grande.

✅ CHECKPOINT — Auditoría completa de la app (pedida por el usuario: "revisa la app por completo...
que no tenga que estar analizando cada paso") + corrección de lo encontrado, en 2 capas:

**Capa 1 — arreglos rápidos:**
- "Cerrar sesión" en Más NO cerraba la sesión de verdad (solo navegaba a "/") → ahora llama a
  `supabase.auth.signOut()`. Solo se muestra el botón si hay sesión real (antes aparecía siempre).
- La pantalla Más mostraba "Plan Premium · $9,99/mes" fijo para CUALQUIER persona, incluso sin
  pagar nunca → ahora muestra el estado honesto ("Sin plan activo" / "Elige tu plan") según la
  prueba gratis (`lib/prueba-gratis.ts`) — no hay tabla `subscriptions` conectada todavía (pendiente
  de antes), así que es lo más honesto que se puede mostrar hoy.
- En /paywall, "Empezar mi plan… gratis" no desbloqueaba nada de verdad (Hotmart no está conectado,
  pendiente conocido) → ahora limpia la prueba gratis local como desbloqueo honesto y explícito
  (`desbloquearPorPlan()` en `lib/prueba-gratis.ts`), documentado en el código como simulación
  temporal hasta que el webhook real de Hotmart esté conectado.

**Capa 2 — Diario conectado a IA real:** antes SIEMPRE mostraba la misma frase fija
("has sentido inseguridad... 3 veces este mes") sin importar lo que la usuaria escribiera, y encima
gastaba la prueba gratis sin dar ningún resultado real a cambio. Nueva ruta `/api/diario` (mismo
patrón BFF) que lee el registro real y genera una reflexión corta y real. Ahora la prueba gratis se
consume solo si la IA responde con éxito (si falla, se guarda el registro igual pero no se gasta el
intento). El último patrón real queda guardado en localStorage y se muestra al volver. Verificado en
el navegador: reflexión distinta y coherente con el texto real escrito.

**Capa 3 — Mazo de tarot completo (78 cartas), pedido explícito del usuario "no usaremos APIs
externas":** nuevo `lib/tarotDeck.ts` con los 22 Arcanos Mayores + 56 Arcanos Menores (4 palos × 14
rangos), cada uno con palabras clave al derecho e invertida (tradición Rider-Waite-Smith, escritas a
mano). `drawCards(n)` roba cartas al azar sin repetir con 50% de probabilidad de invertida cada una;
`cartaDelDia()` es DETERMINÍSTICA por fecha (mismo hash para todas las usuarias el mismo día, cambia
solo a medianoche) — esto además corrige el hallazgo de la auditoría de que la carta del día estaba
congelada en "La Sacerdotisa" para siempre. Sin arte único por carta (avisado y aceptado por el
usuario): se sigue usando la misma plantilla visual `CartaSacerdotisa`, solo cambia número/nombre/
cita. `/api/tarot` ahora recibe la carta real (con su estado invertida) + palabras clave y genera la
lectura conectada a ese significado real, no a una carta fija. La pantalla Tarot guarda la tirada
COMPLETA (carta + lectura, no solo el ID) en localStorage — "Repetir tu última tirada" ahora sí
repite exactamente lo que salió, sin volver a llamar a la IA ni gastar otra prueba gratis (antes
solo recordaba el ID y volvía a pedir una lectura nueva, defecto real de la auditoría). Inicio
también usa `cartaDelDia()` para la carta que muestra en Inicio (dato dinámico nuevo sobre una
pantalla ya aceptada — ver `[veredicto:inicio]` abajo, no requiere nueva pasada del revisor).
Verificado en el
navegador de punta a punta: carta real distinta cada vez, lectura respeta el matiz invertido,
"repetir" reproduce exactamente lo mismo. tsc ✓ build ✓.

**Quedaron fuera, pausados a pedido explícito del usuario para más adelante:**
- Módulo de Progresión y Recompensas (racha visual con XP/niveles/álbum de cartas) — se avisó que
  "Analizar Chat = +25 XP" premia la conducta ansiosa que la app busca reducir (revisar antes de
  construir) y que el álbum necesita el mismo arte por carta que el mazo (pendiente de diseño).
- Modelo freemium con cupo gratis DIARIO (en vez de "una vez de por vida") — el usuario decidió
  dejar el modelo actual (una vez) tal como está.
- Microtransacción "Análisis de Compatibilidad Astral" ($2,99) con API externa de efemérides/
  sinastría — proyecto aparte (integración nueva + tipo de cobro nuevo que Hotmart no soporta hoy).
- Protección real en el servidor contra abuso de las rutas de IA (hoy el único freno es la bandera
  de localStorage, evadible) — sigue pendiente, anotado en el hallazgo de la auditoría.
✅ CHECKPOINT — "Escáner de Sinergia Zodiacal" CONSTRUIDO y verificado (ubicación decidida con el
usuario: dentro de Tarot, como pantalla propia `/app/compatibilidad` — SIN pestaña nueva en el menú
de abajo, porque ya hay 5 y esta función no se usa a diario. Segundo punto de entrada: sugerencia
dentro del chat del Coach, chip "✨ Ver compatibilidad de signos" junto a las respuestas rápidas).
- `lib/zodiaco.ts`: los 12 signos con símbolo Unicode dorado (con el selector de variación `︎`
  para forzar texto monocromo — sin él, Windows los pintaba de morado como emoji a color, defecto
  real visto al probar).
- `/api/compatibilidad`: sin API externa de efemérides (decisión explícita del usuario) — la IA
  genera el análisis completo (química, fricción, arcano combinado, consejo) a partir de los 2
  signos, en JSON estricto. `max_tokens` subido de 400 a 700 tras un bug real: con 400 la respuesta
  se cortaba a la mitad del JSON y fallaba el cálculo siempre.
- Freemium POR BLOQUE, distinto del resto de la app: % de sinergia y "Química y atracción" SIEMPRE
  gratis (no usa `lib/prueba-gratis.ts`, es un mecanismo de cobro aparte); "Fricción" y "Consejo" se
  ven con blur + botón "Ver planes" — hoy lleva a /paywall de forma honesta, SIN cobro real de $1,99
  suelto ni plan "VIP" (el usuario no confirmó ese cobro; ver pendiente abajo).
Verificado en el navegador de punta a punta: cálculo real, % + química visibles, resto bloqueado.
tsc ✓ build ✓.
PENDIENTE: definir si "LUMA VIP" es el mismo plan de $9,99 o uno nuevo, y cómo cobrar el reporte
suelto de $1,99 en Hotmart (hoy no existe cobro suelto, solo suscripción) — el botón "Ver planes"
deberá apuntar al cobro real cuando se decida.

✅ CHECKPOINT — "Mapa de Poder" ("Conócete a ti misma": numerología + arcano personal) CONSTRUIDO y
verificado. Ubicación decidida con el usuario: vive principalmente en **Más** (se calcula UNA sola
vez con la fecha de nacimiento — no cambia — y desde entonces queda guardado ahí de forma
permanente, con una tarjeta que antes no existía y que le da contenido a la pantalla más vacía de la
app), con un segundo enlace de descubrimiento desde **Tarot**. Sin API externa: el cálculo (sumar los
dígitos de la fecha hasta reducirlos a 1-9, manteniendo los números maestros 11/22) es matemática
pura en `lib/numerologyUtils.ts`, que además reutiliza el mismo mazo de 22 Arcanos Mayores de
`lib/tarotDeck.ts` para la correspondencia número→arcano (un solo mazo en todo el proyecto, no uno
duplicado). Solo la interpretación (arquetipo emocional, superpoder, punto ciego, consejo de
soberanía) la escribe la IA real vía `/api/numerologia`. Sin freemium/bloqueo — a diferencia de
Compatibilidad, aquí no se pidió cobro.
**Pedido explícito del usuario, ya cumplido:** "así la IA tiene más datos sobre la persona y en coach
la puede guiar mejor" — `/api/coach` ahora recibe el número+arcano guardado (si existe) y lo agrega
al system prompt como contexto sutil para personalizar sus respuestas, sin forzarlo en cada mensaje.
Verificado en el navegador de punta a punta con una fecha real (1994-07-23 → 8 · La Fuerza, cálculo
correcto) — lectura personalizada real, guardado visible en Más. tsc ✓ build ✓.

✅ CHECKPOINT — Numerología por nombre + ficha técnica completa inyectada al Coach (pedido explícito
del usuario, siguiendo la misma dinámica de "conócete a ti misma"). Nuevo `lib/numerologiaNombre.ts`:
tabla pitagórica (A-Z + Ñ=5, como pidió el usuario), matemática pura — `calcularNumeroExpresion`
(todas las letras) y `calcularNumeroAlma` (solo vocales, sus anhelos íntimos en pareja), ambas
reduciendo a 1-9 y respetando los números maestros 11/22. Nuevo `signoDeFecha()` en `lib/zodiaco.ts`:
el signo zodiacal se DERIVA de la fecha de nacimiento que ya se pedía (no hace falta preguntarlo
aparte). `/app/mapa-poder` ahora también pide el nombre completo; el perfil guardado
(`lib/almacenamiento-numerologia.ts`) creció a: nombre, fecha, número de vida, arcano, signo, número
de expresión, número del alma + la lectura de IA (arquetipo/superpoder/punto ciego/consejo).
`/api/coach` arma la ficha técnica exacta que pidió el usuario (ESTÁS HABLANDO CON / Signo / Arcano
Personal / Número del Alma / Patrón Emocional —este último usa el "punto ciego" ya calculado— +
la instrucción de personalización textual) y la agrega al system prompt SOLO si el perfil está
completo; sin perfil, el coach sigue funcionando igual que antes (sin romper nada). Verificado en el
navegador de punta a punta: cálculo correcto (nombre de prueba → Número del Alma 6, signo Leo por la
fecha), coach respondió con normalidad recibiendo el perfil. tsc ✓ build ✓.
**Simplificación consciente frente al pedido original — avisada, no oculta:** el usuario pidió
"UserProfileContext.ts" consolidando el perfil en "estado global/Supabase". Se mantuvo el mismo
patrón de persistencia que TODA la app usa hoy (localStorage, sin backend — regla del stack) en vez
de crear una tabla nueva en Supabase + un React Context global; NO era el punto final — ver el
siguiente checkpoint, donde sí se conectó a Supabase a pedido explícito del usuario.

✅ CHECKPOINT — Mapa de Poder CONECTADO a Supabase (pedido explícito del usuario: "conéctalo a
Supabase"). En vez de crear una tabla nueva, se extendió `profiles` (ya existía, 1 fila por usuaria,
RLS activo) con 12 columnas nuevas (`fecha_nacimiento`, `numero_vida`, `arcano_id`, `arcano_nombre`,
`signo_id`, `signo_nombre`, `numero_expresion`, `numero_alma`, `arquetipo`, `superpoder`,
`punto_ciego`, `consejo` — migración `agregar_mapa_poder_a_profiles`, aplicada vía MCP). Nuevo
`lib/supabase/perfilNumerologia.ts` (`leerPerfilSupabase`/`guardarPerfilSupabase`). Comportamiento:
CON sesión real, se lee primero de Supabase; si Supabase no tiene nada pero sí hay algo en
localStorage (se calculó antes de iniciar sesión), se sube solo una vez; al calcular de nuevo, se
guarda en los dos lados a la vez. SIN sesión (el login sigue sin ser obligatorio), todo sigue
funcionando exactamente igual que antes, solo en localStorage — no se rompió nada del camino
anónimo. `get_advisors` de seguridad: limpio (sin hallazgos nuevos tras la migración). tsc ✓ build ✓;
verificado en el navegador sin sesión (comportamiento intacto, la ruta anónima nunca llama a
Supabase). PENDIENTE: probar con una sesión real logueada (no se hizo login de prueba para no mandar
un correo real) — cuando el usuario inicie sesión de verdad, su Mapa de Poder ya calculado debería
subirse solo la primera vez que abra esa pantalla logueado.

✅ CHECKPOINT — "El Círculo" CONSTRUIDO (Fase 1 de la idea de viralidad del usuario: convertir
"conócete a ti misma" en algo social — "pon la fecha de tu amiga y mira qué dice LUMA de ella"). Fase
2 (tarjeta gráfica + botón de compartir por WhatsApp/Instagram) queda pendiente, aprobada solo para
después. Nueva tabla Supabase `circulo_perfiles` (varias filas por usuaria, a diferencia de `profiles`
que es 1:1 — RLS por `(select auth.uid()) = user_id`, índice en `user_id`, políticas separadas por
comando). Nueva pantalla `/app/circulo` (entrada desde Mapa de Poder, tarjeta "Descubre tu círculo"):
agregar nombre+fecha de cualquier persona, reutiliza EXACTAMENTE el mismo cálculo que Mapa de Poder
(cero costo de API adicional aparte de la interpretación de IA — mismo patrón). Lista de tarjetas
plegables por persona con su arquetipo/superpoder/punto ciego/consejo. Con sesión real sincroniza a
Supabase; sin sesión, sigue funcionando en localStorage (mismo patrón que Mapa de Poder). Sin gate de
plan todavía (la pregunta de qué es "LUMA VIP" sigue sin resolver — cuando se decida, aquí es donde
se aplicaría el límite del plan gratuito).
**Bug real encontrado y corregido durante la prueba en vivo:** un botón (✕ para quitar a alguien)
quedó anidado DENTRO de otro botón (el que abre/cierra la tarjeta) — HTML inválido que React marcaba
como error de hidratación en la consola. Se separaron en dos botones hermanos dentro de un div, no
uno dentro del otro. Verificado con `document.querySelectorAll('button button').length === 0` tras
el arreglo. tsc ✓ build ✓; probado en el navegador de punta a punta (agregar a "Elena Martinez" →
Aries · El Emperador, cálculo correcto).

✅ CHECKPOINT — Onboarding CORTADO en "ayuda" + prueba gratis de un solo uso (feedback directo del
usuario: "estamos vendiendo la app, no haciendo encuestas"). `app/onboarding/flujo.ts`/`page.tsx`:
el flujo ahora es motivo → momento → reconocimiento-1 → ayuda, y al responder "ayuda" salta DIRECTO
a la pantalla real (mensaje→`/app/descifrar`, coach→`/app/coach`, tarot→`/app/tarot`,
diario→`/app/diario`) — se borraron temor/reconocimiento-2/atribución/reconocimiento-final/plan
(inalcanzables). Nuevo `lib/prueba-gratis.ts`: una sola bandera en localStorage — el primer
resultado real en CUALQUIERA de las 4 funciones es gratis; el segundo intento (en cualquiera de
las 4) redirige a `/paywall`. Se conectaron a IA real las 2 funciones que faltaban: nuevas rutas
`/api/descifrar` (JSON estricto: lo que vemos/riesgo/pregunta) y `/api/tarot` (la carta —número/
nombre/cita— sigue fija, solo la lectura la genera la IA), mismo patrón BFF que `/api/coach`. Con
esto las 4 funciones (mensaje, coach, tarot, diario) dan un resultado real, no de ejemplo.
Verificado en el navegador: el salto motivo→…→ayuda→descifrar funciona: la pantalla real se
respeta la prueba gratis: un intento fallido (sin ANTHROPIC_API_KEY configurada todavía, error
esperado) NO consume la prueba gratis, el botón sigue disponible. tsc ✓ build ✓ (rutas /api/
descifrar y /api/tarot compilan). PENDIENTE: probar las 4 funciones de punta a punta con la clave
de Anthropic real puesta (ver punto 4 de abajo) para confirmar que el resultado se ve bien; el
gate del coach solo permite 1 mensaje real por persona antes del paywall (igual que las otras 3) —
si se siente muy corto para una conversación, es un ajuste a futuro, no un bug.

✅ CHECKPOINT — Sesión 6, estado por servicio (secuencia: GitHub → Vercel → Supabase → IA real →
Resend → dominio → Hotmart):

1. **GitHub — LISTO.** Repo privado `anaresmonat-sys/luma`, rama `main`, verificado con `git ls-remote`.
2. **Vercel — BLOQUEADO.** Cuenta conectada (team "LUMA", hobby), pero la GitHub App de Vercel
   (github.com/apps/vercel) todavía no tiene permiso sobre el repo `luma` → `create_git_project`
   sigue dando 400. Pedido al usuario varias veces, sin resolver. Ojo: "Vercel conectado a Claude"
   en Conectores es la cuenta, NO la GitHub App autorizada sobre el repo — ya generó una confusión.
3. **Supabase — LISTO el esquema + auth real.** Proyecto activo (`zmqwdtqkoyxptqscbgpx`,
   eu-central-1). Esquema aplicado vía MCP (migración `core_schema_v1`): 11 tablas, RLS por
   `(select auth.uid())`, políticas por comando, índice en cada FK. `get_advisors` limpio. Cliente
   instalado (`lib/supabase/{client,server}.ts`, `proxy.ts` — antes `middleware.ts`, Next.js 16
   renombró la convención). **Login real (magic link) funcionando de punta a punta**:
   `app/auth/callback/route.ts` + `signInWithOtp()` en `/entrar`, confirmado con éxito en los logs
   de Supabase. `.env.local` tiene las credenciales públicas; `SUPABASE_SECRET_KEY`/
   `ANTHROPIC_API_KEY` las agrega el usuario mismo.
   PENDIENTE: migrar cada pantalla de datos semilla/localStorage a lecturas/escrituras reales
   (solo `checkins` de Inicio ya escribe de verdad, ver racha/termómetro abajo); age-gate 18+
   (checkbox) sigue sin existir en ningún formulario, solo mencionado en las páginas legales.
4. **IA real (Coach) — LISTO parcial.** `/api/coach` conectado a Claude (BFF, `lib/anthropic.ts`),
   system prompt del usuario, historial recortado a 20 mensajes, max_tokens 500. FALTA: el usuario
   agregue su `ANTHROPIC_API_KEY` y active un spend cap en su consola de Anthropic (única
   protección de gasto hasta conectar el kill-switch por DB sobre `ai_calls`, que ya existe). Coach
   todavía NO guarda el historial en `coach_messages`.
5. **Resend — CONECTADO.** Cuenta + API key del usuario puestas en Supabase → Authentication →
   SMTP Settings (host smtp.resend.com, puerto 465, sender temporal `onboarding@resend.dev` hasta
   comprar dominio propio). Costó 2 intentos (la primera clave pegada era inválida, error 535 —
   se regeneró y quedó bien). Confirmado en logs: límite de envío subió de 2/hora a 30. Cuando se
   compre el dominio: verificarlo en Resend (SPF/DKIM, ver 46) y cambiar el sender.
6. **Dominio, Hotmart** — sin empezar.

✅ CHECKPOINT — Racha + termómetro CONSTRUIDO en Inicio (versión simple elegida por sobre el módulo
completo de niveles/XP/colección, que sigue sin resolver). `lib/racha.ts` (funciones puras,
calculadas en el navegador): racha de días consecutivos con check-in + termómetro que compara días
con ánimo ansiosa/triste hace ~30 días vs. esta semana. `app/app/(tabs)/page.tsx` escribe cada
check-in real en `checkins` (si hay sesión) y lee los últimos 40 días. Sin sesión se comporta igual
que antes (sin racha/termómetro, sin errores). Verificado con datos de prueba insertados y
BORRADOS de la cuenta real (racha=7, 4/7 vs 1/7 → "vas mejorando" disparó bien); tsc ✓ build ✓.

✅ CHECKPOINT — Onboarding: 3 rondas de feedback directo del usuario probando la app, las 3 sobre el
mismo problema de fondo (preguntas/pantallas genéricas que no respetaban lo que la persona ya había
contestado) — TODAS corregidas y verificadas en vivo:
1. La pregunta "momento" asumía "esa ansiedad" para todo el mundo → ahora tiene 3 variantes según
   `motivo` (ruptura/patrones/resto).
2. Las 2 pantallas de "reconocimiento" decían lo mismo sin importar la respuesta → ahora
   `reconocimiento-1` varía por `motivo` (4 variantes) y `reconocimiento-2` por `temor` (4 variantes).
3. Las preguntas de "pausa semanal" (slider) y "hora de recordatorio" no aplicaban a NINGUNO de los
   4 caminos de "ayuda" (analizar/coach/tarot/diario) — el usuario concluyó que esa configuración de
   hábito pertenece a DESPUÉS de la primera victoria, no al embudo de entrada → se ELIMINARON del
   flujo (`app/onboarding/flujo.ts`): ahora 5 preguntas reales + 2 reconocimientos (antes 7+2). Se
   borró `PasoSlider`/`feedbackCompromiso`/campos `compromiso`,`hora`,`horaLabel` (sin uso tras el
   recorte); `lineasLoading` reescrito sin ellos. `components/onboarding/PreguntaSlider.tsx` se dejó
   intacto (pieza reutilizable, fuera de cualquier ruta activa). Probado de punta a punta: plan final
   dice "Hecho con tus 5 respuestas", sin ningún paso de ritual. tsc ✓ build ✓ en las 3 rondas.
   PENDIENTE (no bloquea): la hora de recordatorio para push (D1-D7, 24-GAMIFICACION) habrá que
   pedirla en otro momento — después de la primera victoria real en la app, cuando se construya el
   sistema de notificaciones.

Nota técnica reusable: Playwright MCP en este entorno resetea a `about:blank` si `resize`/`navigate`
no van en el MISMO batch que las interacciones/screenshots — agrupar siempre todo en un solo mensaje.

Pendientes de producto/diseño sin resolver (el usuario decide cuándo):
- Módulo de logros: 3 de 4 puntos sin resolver (nombres de nivel menos "juicio", quitar XP de
  "analizar chat", arte de las cartas de la colección — el punto 4, Coach real, ya se hizo).
- ¿Lecturas de tarot con texto fijo o personalizadas por IA? Sin decidir — se resuelve al conectar
  Tarot a la IA real.
- Retrato final de LUMA: receta de prompt ya entregada al usuario para Gemini, pendiente que lo pase.
- Landing sección 5 (carrusel "La app por dentro") y logo real de LUMA (ícono+favicon+logotipo):
  CERRADOS con contenido/assets reales.

✅ CHECKPOINT (histórico) — Sesión 5 (app interna) COMPLETA. 6 pantallas con datos semilla reales,
cada una revisada salvo "Más" (secundaria): Inicio 31/40·16/20 · Descifra (función estrella)
31/40·18/20 · Coach 31/40·16/20 · Tarot 32/40·16/20 (6 rondas) — las 4 aceptadas con criterio
propio — y **Diario 36/40·16/20 · ✅ LISTA** (única en cruzar ambos gates). Detalle de cada ronda en
`docs/revisiones/<pantalla>-veredicto.md`. Patrón de toda la sesión: craft siempre cruza su gate,
usabilidad se estanca por debajo una vez agotados los bugs reales ("rendimientos decrecientes").

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
