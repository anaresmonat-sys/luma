// Cliente mínimo de la API de Hotmart para cancelar suscripciones — SOLO servidor.
// Documentación oficial: developers.hotmart.com (Authentication · Get subscriptions · Cancel subscription).
// Las credenciales (HOTMART_CLIENT_ID y HOTMART_CLIENT_SECRET; HOTMART_BASIC es opcional) se crean en Hotmart →
// Herramientas → Credenciales de desarrollador y se pegan SOLO en las variables de entorno de Vercel.

const URL_TOKEN = 'https://api-sec-vlc.hotmart.com/security/oauth/token';
const URL_API = 'https://developers.hotmart.com/payments/api/v1/subscriptions';
const ESPERA_MAX_MS = 8_000;

export type ResultadoCancelacion =
  | { ok: true; subscriberCode: string }
  | { ok: false; motivo: 'sin_credenciales' | 'no_encontrada' | 'error_hotmart' };

let tokenEnMemoria: { valor: string; caduca: number } | null = null;

export function hayCredencialesHotmart(): boolean {
  return Boolean(process.env.HOTMART_CLIENT_ID && process.env.HOTMART_CLIENT_SECRET);
}

// El token "Basic" de Hotmart es base64(client_id:client_secret): se calcula solo si no se dio HOTMART_BASIC
// (y si se dio con el prefijo "Basic " incluido, se quita para no duplicarlo).
function tokenBasic(): string {
  const dado = process.env.HOTMART_BASIC?.trim().replace(/^Basic\s+/i, '');
  return dado || Buffer.from(`${process.env.HOTMART_CLIENT_ID}:${process.env.HOTMART_CLIENT_SECRET}`).toString('base64');
}

async function pedir(url: string, init: RequestInit): Promise<Response> {
  return fetch(url, { ...init, signal: AbortSignal.timeout(ESPERA_MAX_MS), cache: 'no-store' });
}

async function obtenerToken(): Promise<string> {
  if (tokenEnMemoria && tokenEnMemoria.caduca > Date.now() + 60_000) return tokenEnMemoria.valor;
  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: process.env.HOTMART_CLIENT_ID!,
    client_secret: process.env.HOTMART_CLIENT_SECRET!,
  });
  const r = await pedir(`${URL_TOKEN}?${params}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Basic ${tokenBasic()}` },
  });
  if (!r.ok) throw new Error(`token_${r.status}`);
  const j = (await r.json()) as { access_token?: string; expires_in?: number };
  if (!j.access_token) throw new Error('token_vacio');
  tokenEnMemoria = { valor: j.access_token, caduca: Date.now() + (j.expires_in ?? 3600) * 1000 };
  return j.access_token;
}

const ESTADOS_YA_CERRADOS = /^(INACTIVE|CANCELLED|EXPIRED)/i;

/** Busca el código de suscriptora vigente de ese correo. */
export async function buscarSubscriberCode(email: string, token: string): Promise<string | null> {
  const r = await pedir(`${URL_API}?${new URLSearchParams({ subscriber_email: email })}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!r.ok) throw new Error(`buscar_${r.status}`);
  const j = (await r.json()) as {
    items?: Array<{ subscriber_code?: string; status?: string; subscriber?: { email?: string } }>;
  };
  const vigente = (j.items ?? []).find(
    (s) =>
      s.subscriber_code &&
      !ESTADOS_YA_CERRADOS.test(s.status ?? '') &&
      (!s.subscriber?.email || s.subscriber.email.toLowerCase() === email.toLowerCase()),
  );
  return vigente?.subscriber_code ?? null;
}

/** Cancela en Hotmart (corta el cobro). Si ya conocemos el código, no hace falta buscarlo. */
export async function cancelarEnHotmart(email: string, codigoConocido?: string | null): Promise<ResultadoCancelacion> {
  if (!hayCredencialesHotmart()) return { ok: false, motivo: 'sin_credenciales' };
  try {
    const token = await obtenerToken();
    const codigo = codigoConocido || (await buscarSubscriberCode(email, token));
    if (!codigo) return { ok: false, motivo: 'no_encontrada' };
    const r = await pedir(`${URL_API}/${encodeURIComponent(codigo)}/cancel`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ send_mail: true }),
    });
    if (r.status === 401) tokenEnMemoria = null;
    if (!r.ok) return { ok: false, motivo: 'error_hotmart' };
    return { ok: true, subscriberCode: codigo };
  } catch {
    return { ok: false, motivo: 'error_hotmart' };
  }
}

export type ResultadoReembolso =
  | { ok: true }
  | { ok: false; motivo: 'sin_credenciales' | 'rechazado' | 'error_hotmart'; estadoHttp?: number; detalle?: string };

/**
 * Reembolsa una venta por su código de transacción (PUT /payments/api/v1/sales/{código}/refund).
 * Hotmart solo permite reembolsar la PRIMERA transacción de una suscripción y dentro de la garantía; si no se cumple,
 * responde con un error y aquí se devuelve como `rechazado` con su mensaje para mostrárselo a la dueña.
 */
export async function reembolsarEnHotmart(codigoTransaccion: string): Promise<ResultadoReembolso> {
  if (!hayCredencialesHotmart()) return { ok: false, motivo: 'sin_credenciales' };
  try {
    const token = await obtenerToken();
    const r = await pedir(`https://developers.hotmart.com/payments/api/v1/sales/${encodeURIComponent(codigoTransaccion)}/refund`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    if (r.status === 401) tokenEnMemoria = null;
    if (r.ok) return { ok: true };
    const texto = (await r.text().catch(() => '')).slice(0, 300);
    return { ok: false, motivo: r.status >= 500 ? 'error_hotmart' : 'rechazado', estadoHttp: r.status, detalle: texto };
  } catch {
    return { ok: false, motivo: 'error_hotmart' };
  }
}
