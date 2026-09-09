# FICHA DE DIRECCIÓN DE ARTE — LUMA

- Estado: BORRADOR (pendiente OK del usuario sobre el tour `vista-previa-app.html` — 54)

## Referencia del usuario (CONTRATO — ver 16, protocolo obligatorio)
- ¿Hay imagen(es) de referencia del usuario?: SÍ → mockup de 10 pantallas de LUMA enviado en el
  chat el 2026-09-09 (pantalla completa: layout, componentes, jerarquía) → RUTA 2 del 54: RÉPLICA FIEL.
  Archivar la imagen en docs/revisiones/referencia-usuario-luma.png cuando esté disponible.
- Extracción (mirada sobre la imagen, no de memoria):
  - Modo: claro/cálido · Fondo: #f4eee4 · Superficie: #fbf7f1 · Hundido: #efe7dc · Texto 1º/2º: #3d342e / #9a8c7f
  - Acento: #c88b84 (rosa empolvado) — aparece en: botón principal (CTA), pestaña activa de la barra
    inferior, enlaces ("Explorar mi insight"), títulos de las tiradas, corazones pequeños. Rosa más
    profundo #b97b74 para degradé/estado presionado.
  - 2ª nota: panel espresso #2a2320 (solo la tarjeta Premium del paywall, con texto crema).
  - Semánticos visibles: aviso/"posible riesgo" #c15c4c (terracota) · calma/éxito #8ba888 (salvia, en las caritas de emoción).
  - Display: serif editorial de contraste medio, suave → elegida **Fraunces** (candidatas: Fraunces, Playfair Display, Cormorant Garamond). Wordmark "LUMA" con tracking amplio (~0.3em).
  - Body: sans humanista cálida → elegida **Hanken Grotesk** (candidatas: Hanken Grotesk, Figtree, Manrope). PROHIBIDO Inter/Roboto de marca.
  - Radio: cards ~18px · botones ~14px · filas ~14px · chips ~12px · círculos de emoción completos.
  - Espaciado: aireado (padding de pantalla ~18-20px; escala 4·8·12·16·24·32).
  - Sombras: sutiles, difusas, tintadas en cálido (rgb(61 52 46 / ~0.10-0.22)). Nunca duras/negras.
  - Bordes: hairline cálido #e8dfd0 de 1px en cards y filas.
  - Textura/gradiente: fotografía de atardecer (cálida, dorada) en bienvenida y miniaturas de tarot;
    trazos orgánicos tenues tipo topografía en la tarjeta Premium.
  - Layout: hero+lista / cards apiladas; onboarding = filas de opción con ícono a la izquierda;
    Home = saludo + fila de emociones + card de insight + grilla 2×2 de accesos + barra inferior;
    Tarot = filas con miniatura + título serif + pregunta; chat = burbujas; paywall = 2 columnas
    (Gratis claro vs Premium oscuro).
  - Íconos: línea, grosor ~1.6px, redondeados (corazón, chispa/estrella, luna, sol, calendario).
  - Detalle firma a replicar: titular en serif editorial fino + rosa empolvado sobre crema cálido +
    miniaturas de foto de atardecer + caritas de emoción dibujadas a línea dentro de círculos.
- Prohibiciones anti-IA que la referencia LEVANTA: NINGUNA — la referencia ya es clara/cálida/editorial,
  totalmente compatible con la capa anti-IA (sin neón, sin negro puro, sin glow, sin glass).

## Identidad derivada
- N/A — hay referencia del usuario (RÉPLICA FIEL). No se fusionan líderes para el PRODUCTO. La TABLA
  DE LÍDERES vive en FICHA-MODELO.md (Nebula #1) y solo alimenta ángulos/patrones, no la paleta.

## Personalidad compilada (obligatoria — la referencia no dicta motion ni voz)
- 3 adjetivos: **Sereno (dominante) · Cálido · Minimal**
- Compilación (tabla del 11):
  → spring: bounce 0.08 / stiffness ~205 · duración base: 320ms · exclamaciones: máx 0/pantalla
  → celebración N1: check suave con el nombre de la usuaria · N2: banner calmado con luz (sin confetti)
    · N3: el insight/anillo que se completa + tarjeta para guardar (sin confetti)
  → radius tendencial: 16-18px · color emocional: bajo — neutros cálidos dominan, rosa solo en la acción/dato clave
  → arquetipo de voz: mentor sereno (amiga intuitiva y preparada; nunca vidente que dicta certezas)

## Brand kit final (los valores que viven en globals.css / @theme)
- Fondo: #f4eee4 · Superficie: #fbf7f1 · Hundido: #efe7dc · Texto 1º/2º: #3d342e / #9a8c7f
- Acento: #c88b84 (SOLO en: CTA, pestaña activa, enlaces, dato/acción clave) · rosa profundo #b97b74 (degradé/pressed)
- 2ª nota: espresso #2a2320 (porqué: la tarjeta Premium del paywall, contraste de valor — viene de la referencia)
- Semánticos: éxito/calma #8ba888 · aviso/riesgo #c15c4c · (error crítico: reservar un rojo más neutro si hace falta)
- Display: Fraunces (400-600) · Body: Hanken Grotesk (400-700) · Escala: display ~24-28px / title ~20-21px / body ~14-15px / label ~11-13px
- Radio: 16-18px cards · 14px botones · Profundidad: 3 niveles por color + sombras sutiles tintadas (no bordes fuertes) · Espaciado: escala 4·8·12·16·24·32·48·64
- Dispositivo ownable: las caritas de emoción dibujadas a línea dentro de círculos + las miniaturas de foto de atardecer con marco blanco fino (propio de LUMA, tomado de la referencia)
- Motion signature: easing suave (sin linear) · stagger 60-80ms en la primera pantalla · firma: la carta del día que aparece con un fundido cálido y un leve ascenso

## Trazabilidad y vetos
- Ruta de diseño (PREGUNTA DE REFERENCIA del 54): réplica de referencia (el usuario dio pantalla completa → no se hace A/B/C)
- Réplica fiel: `replica-fiel.html` (pantalla Inicio: referencia reconstruida vs V1) · screenshot docs/revisiones/replica-fiel-375.png · test de fidelidad: **PASA (0 desvíos)** — ver docs/revisiones/identidad-visual-fidelidad.md
- Tour de la app: `vista-previa-app.html` (9 frames) · screenshot docs/revisiones/vista-previa-app-375.png · vistas: bienvenida, onboarding, Inicio/M0, Analizar mi situación, Coach, Tarot, Mis relaciones, Diario, paywall · aprobado por el usuario: PENDIENTE
- Paleta derivada de: referencia del usuario (contrato) · Dispositivo ownable: caritas de línea + miniaturas de atardecer con marco
- Registro anti-repetición: paleta (crema #f4eee4 + rosa empolvado #c88b84) y par tipográfico (Fraunces + Hanken Grotesk) quedan VETADOS para el próximo proyecto del SO
- Modo (claro/cálido) DERIVADO por: la referencia del usuario lo fija (no asumido)

## Idioma UI: español (mono-idioma) · Fecha de cierre de la ficha: PENDIENTE · Aprobada por el usuario: NO (pendiente del tour)
