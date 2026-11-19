// «De qué red llega cada visita»: un código corto en el enlace (p. ej. tuluma.app/?f=tiktok) que el contador del camino de
// compra recuerda en el navegador y manda junto a cada paso (página de ventas, inicio, planes, elección de plan).
// Sin cookies ni datos personales: solo una etiqueta corta como «tiktok» o «instagram». Se ve en el panel (Resumen).

const CLAVE = 'luma_fuente';
const VALIDA_CODIGO = /^[a-z0-9_-]{1,20}$/;
const VALIDA_GUARDADA = /^[a-z0-9_.:-]{1,30}$/;

/** Limpia un código recibido por el enlace: minúsculas, solo letras, números, guion y guion bajo (máx. 20). */
export function normalizarCodigo(valor: string | null | undefined): string | null {
  const v = (valor ?? '').trim().toLowerCase();
  return VALIDA_CODIGO.test(v) ? v : null;
}

/** Devuelve la etiqueta de origen de esta visita: el código del enlace, el recordado, la web de la que viene o «directo». */
export function fuenteDeLaVisita(): string {
  try {
    const delEnlace = normalizarCodigo(new URLSearchParams(window.location.search).get('f'));
    if (delEnlace) {
      window.localStorage.setItem(CLAVE, delEnlace);
      return delEnlace;
    }
    const guardada = window.localStorage.getItem(CLAVE);
    if (guardada && VALIDA_GUARDADA.test(guardada)) return guardada;
    const anfitrion = window.location.hostname.replace(/^www\./, '');
    const referente = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, '') : '';
    if (referente && referente !== anfitrion) {
      const etiqueta = `web:${referente}`.slice(0, 30);
      if (VALIDA_GUARDADA.test(etiqueta)) {
        window.localStorage.setItem(CLAVE, etiqueta);
        return etiqueta;
      }
    }
  } catch {
    // sin almacenamiento o sin referente: se sigue como visita directa.
  }
  return 'directo';
}
