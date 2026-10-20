# Manual de LUMA — para ti, Margarita

## Dónde vive cada cosa
- **Tu app**: tuluma.app (se publica sola desde GitHub cuando yo hago "publicar" a tu orden).
- **Vercel**: la "casa" donde corre la app y se guardan sus claves.
- **Supabase**: donde están los usuarios y sus datos.
- **Hotmart**: cobra y avisa a la app de cada compra, cancelación o reembolso.
- **Anthropic**: el cerebro de IA; se paga con saldo prepagado.
- **Resend**: envía los correos de acceso.
- **Porkbun**: el dominio y los reenvíos de correo.

## Claves (nunca en el chat ni en el código)
Van solo en Vercel → Settings → Environment Variables: SUPABASE_URL, SUPABASE_SECRET_KEY, la clave de Anthropic, HOTMART_HOTTOK, HOTMART_PRODUCT_ID. Si una se filtra: créala nueva en su proveedor, cámbiala en Vercel y borra la vieja.

## Tareas comunes
- **Cancelar a alguien**: llega un correo a soporte@tuluma.app → cancelas en Hotmart (Ventas → compra → cancelar suscripción) → respondes. La persona conserva el acceso hasta el fin de lo pagado.
- **Reembolso**: Hotmart → Ventas → la compra → reembolsar (dentro de 15 días desde que empezó la prueba).
- **Dar acceso de cortesía**: pídemelo a mí.
- **Ver qué versión está publicada**: abre tuluma.app/api/version.
- **Recargar saldo de IA**: console.anthropic.com → Billing (activa la recarga automática).

## Si algo falla
1. La app no abre: mira vercel.com → Deployments; si el último falló, dímelo y vuelvo a la versión anterior (Promote en Vercel).
2. Dejó de responder la IA: casi siempre es saldo agotado o clave caducada en Anthropic.
3. Alguien pagó y no entra: Hotmart → Ventas confirma que está aprobada; luego dímelo con su correo.
4. Una persona pide borrar sus datos: puede hacerlo ella en la app (Más → Cuenta); si no, dímelo.
5. Supabase gratis se pausa tras 7 días sin uso y no tiene copias de seguridad: antes de tener clientes de pago, pasar a Pro.

## Límites de seguridad que ya tiene
Tope de gasto de IA de $5 al día, cuotas por persona y bloqueo de abusos.
