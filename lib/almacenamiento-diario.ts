// Puente de datos Tarot → Diario SIN backend (Sesión 6 conecta Supabase real).
// Regla del stack (CLAUDE.md): "Persistencia sin backend: app desplegada → localStorage."
// "Guardar en mi diario" desde una tirada deja el texto de la lectura listo para
// que el Diario lo prellene al abrir — si no, el botón navegaba sin guardar nada
// (revisor-visual, defecto real).

const CLAVE = 'luma_diario_pendiente';

export function guardarEntradaPendiente(texto: string): void {
  try {
    window.localStorage.setItem(CLAVE, texto);
  } catch {
    // localStorage puede fallar (modo privado, cuota) — no bloquea el flujo.
  }
}

export function leerYLimpiarEntradaPendiente(): string | null {
  try {
    const texto = window.localStorage.getItem(CLAVE);
    if (texto) window.localStorage.removeItem(CLAVE);
    return texto;
  } catch {
    return null;
  }
}
