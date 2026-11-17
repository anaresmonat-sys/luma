// Memoria de pantalla MIENTRAS DURE LA SESIÓN del navegador (sessionStorage: se borra al cerrar la pestaña, no sale del
// dispositivo). Sirve para que al cambiar de sección (Tarot ↔ Coach ↔ Descifrar…) y volver, la persona encuentre lo que
// estaba viendo: la conversación del Coach, la tirada abierta, etc.

export function guardarSesion(clave: string, valor: unknown): void {
  try {
    window.sessionStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    // sin almacenamiento de sesión: se sigue sin continuidad, no se bloquea nada.
  }
}

export function leerSesion<T>(clave: string): T | null {
  try {
    const crudo = window.sessionStorage.getItem(clave);
    return crudo ? (JSON.parse(crudo) as T) : null;
  } catch {
    return null;
  }
}

export function borrarSesion(clave: string): void {
  try {
    window.sessionStorage.removeItem(clave);
  } catch {
    // ídem.
  }
}
