// Red de seguridad del aviso de crisis de Descifrar: si la IA marca `crisis` pero se olvida de las líneas de ayuda
// (pasó con un único mensaje de maltrato, 2026-11-17), el servidor las añade. Números verificados el 2026-11-02:
// México Línea de la Vida 800 911 2000 · Colombia 106 (salud mental) y 155 (violencia contra la mujer) ·
// Chile *4141 (suicidio) y 1455 (violencia contra la mujer) · España 024 (suicidio) y 016 (violencia de género).

export const LINEAS_DE_AYUDA =
  'Si estás sufriendo violencia o maltrato: México 800 911 2000, Colombia 155, Chile 1455, España 016. ' +
  'Si piensas en hacerte daño: Colombia 106, Chile *4141, España 024. Si hay peligro inmediato, llama a emergencias.';

/** Devuelve el mensaje de crisis con las líneas de ayuda: no repite las que la IA ya puso. */
export function completarAyuda(mensaje: string, crisis: boolean): string {
  if (!crisis) return mensaje;
  const yaLasTrae = /800 911 2000/.test(mensaje) && /\b(024|016|4141|1455)\b/.test(mensaje);
  return yaLasTrae ? mensaje : `${mensaje}\n\n${LINEAS_DE_AYUDA}`;
}
