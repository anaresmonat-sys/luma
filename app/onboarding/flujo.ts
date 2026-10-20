// RECORRIDO DE INICIO — ya no hay preguntas (decisión de la dueña, 2026-10-13).
// Antes: "¿Qué te trae por aquí hoy?" → "¿Qué te ayudaría más?". La respuesta del motivo
// solo cambiaba el saludo del Coach y "Otra cosa (cuéntamelo)" no lo leía nadie; además
// la persona ya elige qué quiere probar al pulsar en la página de ventas
// (/onboarding?ayuda=analizar|tarot|coach|diario). Hoy el recorrido es: confirmar la
// edad → directo a la función real, donde está la primera lectura gratis.

export type OpcionAyuda = 'analizar' | 'coach' | 'tarot' | 'diario' | 'compatibilidad';

export interface Respuestas {
  ayuda?: string;
  ayudaLabel?: string;
}

export const OPCIONES_AYUDA: Record<OpcionAyuda, { label: string; ruta: string }> = {
  analizar: { label: 'Entender un mensaje o conversación confusa', ruta: '/app/descifrar' },
  coach: { label: 'Hablar con alguien que no me juzgue', ruta: '/app/coach' },
  // El tarot arranca con el ritual de "Elige tu carta" (app/app/(tabs)/tarot/page.tsx).
  tarot: { label: 'Una guía de tarot para reflexionar', ruta: '/app/tarot?ritual=1' },
  diario: { label: 'Llevar un registro de cómo me siento', ruta: '/app/diario' },
  // La calculadora de signos de la página de ventas («Ver mi análisis completo») llega aquí.
  compatibilidad: { label: 'Ver la sinergia entre dos signos', ruta: '/app/compatibilidad' },
};

export const AYUDA_POR_DEFECTO: OpcionAyuda = 'analizar';

export function esOpcionAyuda(valor: string | null): valor is OpcionAyuda {
  return valor !== null && Object.prototype.hasOwnProperty.call(OPCIONES_AYUDA, valor);
}

// Beneficios del paywall — el primero depende de lo que la persona quiso probar.
export function beneficiosPlan(r: Respuestas): { texto: string }[] {
  const porAyuda: Record<string, string> = {
    analizar: 'Descifra chats: hechos, riesgo y qué responder',
    coach: 'Habla con LUMA, tu coach, cuando lo necesites',
    tarot: 'Tiradas de tarot para tu caso, no genéricas',
    diario: 'Tu diario emocional para ver tus patrones con el tiempo',
    compatibilidad: 'Sinergia entre signos: química, fricciones y consejo para cuidar tus límites',
  };
  const principal = (r.ayuda && porAyuda[r.ayuda]) || porAyuda.analizar;
  const secundaria = r.ayuda === 'tarot' ? porAyuda.analizar : porAyuda.tarot;
  return [
    { texto: principal },
    { texto: secundaria },
    { texto: 'Un espacio privado y sin juicio' },
  ];
}
