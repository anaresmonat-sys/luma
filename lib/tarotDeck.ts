// Mazo completo de tarot (78 Arcanos Mayores y Menores) — reemplaza las 5
// "tiradas" con UNA carta fija cada una para siempre (defecto real de la
// auditoría 2026-09-18: la misma carta se repetía para todo el mundo, todos
// los días). Las palabras clave (derecho/invertido) alimentan el prompt de
// /api/tarot para que la IA genere una lectura real conectada a la carta que
// tocó de verdad, no un texto fijo. Sin arte único por carta todavía (eso es
// un proyecto de diseño aparte, ver ESTADO.md) — se sigue mostrando con la
// misma plantilla visual de siempre (CartaSacerdotisa), solo cambia el
// número/nombre/cita.

export interface CartaTarot {
  id: string;
  numero: string;
  nombre: string;
  arcano: 'mayor' | 'menor';
  palo?: 'bastos' | 'copas' | 'espadas' | 'oros';
  derecho: string[];
  invertido: string[];
  /** Ruta en /public/tarot — escaneo original de 1909 (Rider-Waite-Smith, Pamela
   * Colman Smith), dominio público, tomado de Wikimedia Commons. */
  image: string;
}

const MAYORES_BASE: Omit<CartaTarot, 'image'>[] = [
  { id: 'el-loco', numero: '0', nombre: 'El Loco', arcano: 'mayor', derecho: ['nuevos comienzos', 'espontaneidad', 'fe en el futuro'], invertido: ['imprudencia', 'riesgos sin pensar', 'dudas'] },
  { id: 'el-mago', numero: 'I', nombre: 'El Mago', arcano: 'mayor', derecho: ['manifestación', 'recursos propios', 'poder personal'], invertido: ['manipulación', 'talento desperdiciado', 'planes a medias'] },
  { id: 'la-sacerdotisa', numero: 'II', nombre: 'La Sacerdotisa', arcano: 'mayor', derecho: ['intuición', 'misterio', 'sabiduría interior'], invertido: ['secretos ocultos', 'desconexión de la intuición'] },
  { id: 'la-emperatriz', numero: 'III', nombre: 'La Emperatriz', arcano: 'mayor', derecho: ['abundancia', 'cuidado propio', 'sensualidad'], invertido: ['dependencia', 'bloqueo creativo', 'descuido propio'] },
  { id: 'el-emperador', numero: 'IV', nombre: 'El Emperador', arcano: 'mayor', derecho: ['estructura', 'autoridad', 'estabilidad'], invertido: ['rigidez', 'control excesivo', 'falta de disciplina'] },
  { id: 'el-hierofante', numero: 'V', nombre: 'El Hierofante', arcano: 'mayor', derecho: ['tradición', 'guía', 'valores compartidos'], invertido: ['rebeldía', 'cuestionar normas', 'dogmatismo'] },
  { id: 'los-enamorados', numero: 'VI', nombre: 'Los Enamorados', arcano: 'mayor', derecho: ['conexión real', 'elección del corazón', 'valores alineados'], invertido: ['desequilibrio', 'decisiones en conflicto', 'desconexión'] },
  { id: 'el-carro', numero: 'VII', nombre: 'El Carro', arcano: 'mayor', derecho: ['determinación', 'avance', 'voluntad propia'], invertido: ['falta de dirección', 'agresividad', 'pérdida de control'] },
  { id: 'la-fuerza', numero: 'VIII', nombre: 'La Fuerza', arcano: 'mayor', derecho: ['coraje sereno', 'compasión', 'dominio interior'], invertido: ['duda de una misma', 'debilidad', 'impaciencia'] },
  { id: 'el-ermitano', numero: 'IX', nombre: 'El Ermitaño', arcano: 'mayor', derecho: ['introspección', 'guía interior', 'soledad elegida'], invertido: ['aislamiento excesivo', 'evitar preguntas difíciles'] },
  { id: 'la-rueda', numero: 'X', nombre: 'La Rueda de la Fortuna', arcano: 'mayor', derecho: ['ciclos', 'cambio de suerte', 'destino en movimiento'], invertido: ['resistencia al cambio', 'mala racha prolongada'] },
  { id: 'la-justicia', numero: 'XI', nombre: 'La Justicia', arcano: 'mayor', derecho: ['verdad', 'equilibrio', 'consecuencias justas'], invertido: ['deshonestidad', 'injusticia', 'evasión de responsabilidad'] },
  { id: 'el-colgado', numero: 'XII', nombre: 'El Colgado', arcano: 'mayor', derecho: ['pausa consciente', 'nueva perspectiva', 'rendición'], invertido: ['estancamiento', 'resistencia', 'sacrificio inútil'] },
  { id: 'la-muerte', numero: 'XIII', nombre: 'La Transformación', arcano: 'mayor', derecho: ['cierre de ciclo', 'transformación', 'dejar ir'], invertido: ['miedo al cambio', 'estancamiento', 'ciclo que no termina'] },
  { id: 'la-templanza', numero: 'XIV', nombre: 'La Templanza', arcano: 'mayor', derecho: ['equilibrio', 'paciencia', 'integración'], invertido: ['excesos', 'desajuste', 'falta de visión a largo plazo'] },
  { id: 'el-diablo', numero: 'XV', nombre: 'El Diablo', arcano: 'mayor', derecho: ['ataduras', 'deseo', 'patrones repetidos'], invertido: ['liberación', 'romper cadenas', 'reconocer una dependencia'] },
  { id: 'la-torre', numero: 'XVI', nombre: 'La Torre', arcano: 'mayor', derecho: ['revelación súbita', 'quiebre necesario', 'verdad que sale a la luz'], invertido: ['evitar lo inevitable', 'caos contenido'] },
  { id: 'la-estrella', numero: 'XVII', nombre: 'La Estrella', arcano: 'mayor', derecho: ['esperanza', 'sanación', 'confianza en el futuro'], invertido: ['desánimo', 'desconexión de la fe', 'agotamiento'] },
  { id: 'la-luna', numero: 'XVIII', nombre: 'La Luna', arcano: 'mayor', derecho: ['intuición', 'lo no dicho', 'confusión que oculta una verdad'], invertido: ['claridad que emerge', 'miedos que se disipan'] },
  { id: 'el-sol', numero: 'XIX', nombre: 'El Sol', arcano: 'mayor', derecho: ['alegría', 'claridad', 'vitalidad'], invertido: ['optimismo forzado', 'expectativas poco realistas'] },
  { id: 'el-juicio', numero: 'XX', nombre: 'El Juicio', arcano: 'mayor', derecho: ['revisión', 'despertar', 'llamado a decidir'], invertido: ['autocrítica dura', 'negarse a perdonar(se)'] },
  { id: 'el-mundo', numero: 'XXI', nombre: 'El Mundo', arcano: 'mayor', derecho: ['cierre pleno', 'logro', 'sentirse completa'], invertido: ['cierre pendiente', 'sensación de que falta algo'] },
];

// Los Arcanos Mayores se guardan como `<posición>-<id>.webp` (0-el-loco, 2-la-sacerdotisa…).
const MAYORES: CartaTarot[] = MAYORES_BASE.map((c, i) => ({ ...c, image: `/tarot/${i}-${c.id}.webp` }));

type RangoMenor = { numero: string; sufijo: string; derecho: Record<string, string[]>; invertido: Record<string, string[]> };

// Significado por número/rango, con matices propios por palo (no genérico
// puro) — construido a mano siguiendo la tradición Rider-Waite-Smith.
const RANGOS_MENORES: RangoMenor[] = [
  { numero: 'As', sufijo: 'de', derecho: { bastos: ['nueva pasión', 'inspiración', 'impulso creativo'], copas: ['nuevo amor', 'apertura emocional', 'conexión'], espadas: ['claridad mental', 'verdad', 'nueva idea'], oros: ['nueva oportunidad material', 'estabilidad que empieza'] }, invertido: { bastos: ['falta de dirección', 'entusiasmo apagado'], copas: ['emoción reprimida', 'oportunidad emocional perdida'], espadas: ['confusión', 'verdad usada para herir'], oros: ['oportunidad perdida', 'inseguridad financiera'] } },
  { numero: '2', sufijo: 'de', derecho: { bastos: ['planificación', 'visión a futuro', 'decisiones'], copas: ['unión', 'atracción mutua', 'conexión genuina'], espadas: ['indecisión', 'tregua tensa', 'bloqueo'], oros: ['equilibrio', 'adaptación', 'malabares'] }, invertido: { bastos: ['miedo a lo desconocido', 'planes sin acción'], copas: ['desequilibrio en la relación', 'ruptura de confianza'], espadas: ['parálisis por análisis', 'decisión forzada'], oros: ['desorganización', 'sobrecarga'] } },
  { numero: '3', sufijo: 'de', derecho: { bastos: ['expansión', 'previsión', 'resultados en camino'], copas: ['celebración compartida', 'amistad', 'comunidad'], espadas: ['dolor', 'ruptura', 'verdad dolorosa'], oros: ['colaboración', 'reconocimiento del esfuerzo'] }, invertido: { bastos: ['retrasos', 'obstáculos inesperados'], copas: ['exceso', 'chismes', 'alguien que sobra'], espadas: ['sanación', 'perdón', 'dolor que empieza a soltarse'], oros: ['trabajo en equipo débil', 'falta de reconocimiento'] } },
  { numero: '4', sufijo: 'de', derecho: { bastos: ['celebración', 'estabilidad', 'hogar'], copas: ['apatía', 'contemplación', 'oportunidad no vista'], espadas: ['descanso', 'pausa mental', 'recuperación'], oros: ['seguridad', 'control', 'apego a lo material'] }, invertido: { bastos: ['transición inestable', 'celebración pospuesta'], copas: ['despertar a una nueva oportunidad'], espadas: ['agotamiento por no descansar', 'estancamiento'], oros: ['aferrarse por miedo', 'avaricia'] } },
  { numero: '5', sufijo: 'de', derecho: { bastos: ['competencia', 'tensión', 'desafío sano'], copas: ['pérdida', 'duelo', 'enfoque en lo negativo'], espadas: ['conflicto', 'ganar a cualquier precio', 'tensión'], oros: ['dificultad', 'sentirse excluida', 'escasez'] }, invertido: { bastos: ['conflicto evitado', 'discordia interna'], copas: ['aceptación', 'seguir adelante'], espadas: ['reconciliación', 'dejar atrás una pelea'], oros: ['recuperación', 'pedir ayuda', 'fin de la carencia'] } },
  { numero: '6', sufijo: 'de', derecho: { bastos: ['victoria', 'reconocimiento', 'confianza'], copas: ['nostalgia', 'recuerdos', 'reconexión con el pasado'], espadas: ['transición', 'dejar atrás la tormenta', 'avanzar'], oros: ['generosidad', 'dar y recibir con equilibrio'] }, invertido: { bastos: ['caída del ego', 'éxito no reconocido'], copas: ['vivir en el pasado', 'idealización'], espadas: ['resistirse a soltar', 'quedarse en la turbulencia'], oros: ['deuda emocional', 'dar con condiciones'] } },
  { numero: '7', sufijo: 'de', derecho: { bastos: ['defender una postura', 'perseverancia'], copas: ['opciones', 'fantasía', 'ilusiones'], espadas: ['estrategia', 'evasión', 'actuar en secreto'], oros: ['paciencia', 'evaluar el progreso'] }, invertido: { bastos: ['sentirse abrumada', 'ceder terreno'], copas: ['claridad', 'elegir con los pies en la tierra'], espadas: ['salir a la luz', 'confesar', 'ser descubierta'], oros: ['impaciencia', 'resultados que no llegan'] } },
  { numero: '8', sufijo: 'de', derecho: { bastos: ['movimiento rápido', 'noticias', 'avance repentino'], copas: ['alejarse', 'buscar algo más profundo'], espadas: ['sentirse atrapada', 'autolimitación', 'victimismo'], oros: ['dedicación', 'maestría en proceso'] }, invertido: { bastos: ['retrasos', 'frustración por la lentitud'], copas: ['miedo a dejar ir', 'quedarse por costumbre'], espadas: ['liberarse de creencias limitantes'], oros: ['perfeccionismo', 'trabajo sin propósito'] } },
  { numero: '9', sufijo: 'de', derecho: { bastos: ['resiliencia', 'último esfuerzo', 'cautela ganada'], copas: ['satisfacción', 'deseo cumplido', 'gratitud'], espadas: ['ansiedad', 'pensamientos nocturnos', 'miedo'], oros: ['independencia', 'disfrute del propio esfuerzo'] }, invertido: { bastos: ['agotamiento', 'actitud defensiva excesiva'], copas: ['complacencia vacía', 'satisfacción superficial'], espadas: ['esperanza tras la angustia', 'pedir ayuda'], oros: ['aislamiento autoimpuesto', 'dependencia oculta'] } },
  { numero: '10', sufijo: 'de', derecho: { bastos: ['carga pesada', 'responsabilidad', 'casi meta'], copas: ['armonía emocional', 'felicidad compartida'], espadas: ['final doloroso', 'tocar fondo', 'cierre definitivo'], oros: ['legado', 'estabilidad a largo plazo', 'familia'] }, invertido: { bastos: ['sobrecarga', 'delegar es necesario'], copas: ['relación idealizada', 'desconexión familiar'], espadas: ['recuperación lenta', 'lo peor ya pasó'], oros: ['inestabilidad familiar', 'conflicto de valores'] } },
  { numero: 'Sota', sufijo: 'de', derecho: { bastos: ['curiosidad', 'mensajera', 'ganas de explorar'], copas: ['sensibilidad', 'mensaje del corazón', 'creatividad emocional'], espadas: ['curiosidad mental', 'mensajera directa', 'vigilancia'], oros: ['nueva oportunidad concreta', 'aprendizaje práctico'] }, invertido: { bastos: ['impulsividad', 'falta de foco'], copas: ['inmadurez emocional', 'inseguridad'], espadas: ['chismes', 'palabras hirientes sin pensar'], oros: ['falta de compromiso', 'planes sin ejecutar'] } },
  { numero: 'Caballero', sufijo: 'de', derecho: { bastos: ['acción impulsiva', 'pasión', 'aventura'], copas: ['romance', 'encanto', 'seguir al corazón'], espadas: ['acción decidida', 'ambición', 'comunicación directa'], oros: ['constancia', 'responsabilidad', 'paso a paso'] }, invertido: { bastos: ['imprudencia', 'prisa sin plan'], copas: ['promesas vacías', 'idealización'], espadas: ['impulsividad', 'dureza innecesaria'], oros: ['estancamiento', 'rigidez'] } },
  { numero: 'Reina', sufijo: 'de', derecho: { bastos: ['seguridad en una misma', 'calidez', 'determinación'], copas: ['empatía', 'intuición emocional', 'cuidado'], espadas: ['claridad', 'independencia', 'límites firmes'], oros: ['cuidado práctico', 'generosidad con los pies en la tierra'] }, invertido: { bastos: ['celos', 'energía dispersa'], copas: ['sobre-sensibilidad', 'dependencia emocional'], espadas: ['frialdad', 'dureza excesiva', 'aislamiento'], oros: ['descuidarse a una misma por cuidar a otros'] } },
  { numero: 'Rey', sufijo: 'de', derecho: { bastos: ['liderazgo', 'visión', 'carisma'], copas: ['equilibrio emocional', 'madurez', 'compasión con límites'], espadas: ['autoridad intelectual', 'verdad', 'decisiones justas'], oros: ['abundancia', 'seguridad', 'generosidad estable'] }, invertido: { bastos: ['autoritarismo', 'impaciencia'], copas: ['manipulación emocional', 'frialdad oculta'], espadas: ['manipulación por la lógica', 'crueldad fría'], oros: ['materialismo', 'control a través del dinero'] } },
];

const PALOS: { id: 'bastos' | 'copas' | 'espadas' | 'oros'; label: string }[] = [
  { id: 'bastos', label: 'Bastos' },
  { id: 'copas', label: 'Copas' },
  { id: 'espadas', label: 'Espadas' },
  { id: 'oros', label: 'Oros' },
];

const MENORES: CartaTarot[] = PALOS.flatMap((palo) =>
  RANGOS_MENORES.map((r) => {
    const id = `${r.numero.toLowerCase()}-${r.sufijo}-${palo.id}`;
    return {
      id,
      numero: r.numero,
      nombre: `${r.numero} ${r.sufijo} ${palo.label}`,
      arcano: 'menor' as const,
      palo: palo.id,
      derecho: r.derecho[palo.id],
      invertido: r.invertido[palo.id],
      image: `/tarot/${id}.webp`,
    };
  })
);

/** Las 78 cartas del mazo — 22 Arcanos Mayores + 56 Arcanos Menores. */
export const MAZO_TAROT: CartaTarot[] = [...MAYORES, ...MENORES];

/** Imagen de una carta a partir de su id (ej. el arcano guardado en el perfil). */
export function imagenDeCarta(id: string): string | undefined {
  return MAZO_TAROT.find((c) => c.id === id)?.image;
}

export interface CartaExtraida {
  carta: CartaTarot;
  invertida: boolean;
}

/** Roba `count` cartas al azar, sin repetir, cada una con su propia
 * probabilidad de salir invertida (mitad y mitad, como en una tirada real). */
export function drawCards(count: number): CartaExtraida[] {
  const n = Math.max(1, Math.min(count, MAZO_TAROT.length));
  const barajado = [...MAZO_TAROT].sort(() => Math.random() - 0.5);
  return barajado.slice(0, n).map((carta) => ({ carta, invertida: Math.random() < 0.5 }));
}

/** Carta del día: DETERMINÍSTICA por fecha — la misma carta para todas las
 * usuarias durante el mismo día, cambia sola a la medianoche. Antes estaba
 * congelada en una sola carta para siempre (defecto real de la auditoría
 * 2026-09-18) — este es el arreglo. */
export function cartaDelDia(fecha: Date = new Date()): CartaExtraida {
  const clave = `${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}`;
  let hash = 0;
  for (let i = 0; i < clave.length; i++) hash = (hash * 31 + clave.charCodeAt(i)) >>> 0;
  const indice = hash % MAZO_TAROT.length;
  const invertida = Math.floor(hash / MAZO_TAROT.length) % 2 === 1;
  return { carta: MAZO_TAROT[indice], invertida };
}

/** Posiciones de la tirada de 3 cartas por categoría — se leen como UNA historia
 * conectada, no carta por carta (técnica de tarotista profesional: la posición +
 * la relación entre cartas importa más que cada carta aislada). "Carta del día"
 * se queda en 1 sola carta, como en todas las apps de tarot con más ventas
 * (estándar del sector para el draw diario). Pedido del usuario, 2026-09-22:
 * "que la app sea más pro", tras investigar apps top (Raka, Nummi, Jenova). */
export const POSICIONES_TIRADA: Record<string, [string, string, string]> = {
  amor: ['Lo que sientes tú', 'Lo que siente la otra persona', 'Hacia dónde va esto'],
  ruptura: ['Qué se cerró', 'Qué te cuesta soltar', 'Qué viene después'],
  decision: ['Un camino', 'El otro camino', 'Lo que de verdad necesitas ver'],
  autoconocimiento: ['Lo que muestras', 'Lo que ocultas', 'Lo que estás llamada a integrar'],
};

/** Frase corta para mostrar bajo el nombre de la carta (reemplaza la "cita"
 * fija de antes) — se arma con las primeras palabras clave del lado que salió. */
export function citaDeCarta({ carta, invertida }: CartaExtraida): string {
  const palabras = invertida ? carta.invertido : carta.derecho;
  const frase = palabras.slice(0, 2).join(', ');
  return frase.charAt(0).toUpperCase() + frase.slice(1) + '.';
}
