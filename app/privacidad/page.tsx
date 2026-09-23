import { PaginaLegal } from '@/components/legal/PaginaLegal';

export const metadata = { title: 'Privacidad — LUMA' };

export default function Page() {
  return (
    <PaginaLegal titulo="Privacidad" actualizado="23 de septiembre de 2026">
      <p>
        Esta política explica qué datos recopila LUMA, para qué los usa y qué derechos tienes sobre ellos. Está
        escrita para que se entienda sin ser abogada — si algo no queda claro, escríbenos.
      </p>

      <h2>Quién es responsable de tus datos</h2>
      <p>
        LUMA la opera <strong>Margarita Añares Chatlak</strong>, persona física, con residencia en España. Para
        cualquier tema de privacidad, escribe a{' '}
        <a href="mailto:anares.monat@gmail.com">anares.monat@gmail.com</a>.
      </p>

      <h2>Qué datos recopilamos</h2>
      <ul>
        <li>
          <strong>Tu correo electrónico</strong> — para crear tu cuenta y enviarte el enlace de acceso (no usamos
          contraseñas).
        </li>
        <li>
          <strong>Tu fecha de nacimiento</strong> — solo si usas "Conócete a ti misma" o "El Círculo": es
          indispensable para calcular tu numerología y tu arcano personal, el corazón de esa función.
        </li>
        <li>
          <strong>Lo que le cuentas a LUMA</strong> — los mensajes que analizas, tus conversaciones con el coach,
          tus tiradas de tarot y tus entradas del diario. Se guardan para que puedas volver a verlos y para que la IA
          entienda mejor tu situación con el tiempo.
        </li>
        <li>
          <strong>Datos de otras personas que tú decides guardar</strong> — si usas "El Círculo", puedes anotar el
          nombre y la fecha de nacimiento de alguien más (una amiga, un interés amoroso) para tu propia reflexión
          privada. Es tu responsabilidad usar esto solo como apunte personal, no para exponer a esa persona.
        </li>
        <li>
          <strong>Datos de uso</strong> — qué funciones usas y cuándo, para saber si la app funciona bien y arreglar
          errores.
        </li>
      </ul>
      <p>
        <strong>Lo que NUNCA te pedimos:</strong> tu número de tarjeta, contraseñas de otros servicios, o documentos
        de identidad. El pago lo procesa Hotmart directamente — nosotros nunca vemos ni guardamos los datos de tu
        tarjeta.
      </p>

      <h2>Para qué usamos tus datos</h2>
      <ul>
        <li>Darte acceso a tu cuenta y recordar tu historial dentro de la app.</li>
        <li>
          Generar las respuestas de la IA (el coach, las lecturas de tarot, el análisis de tus mensajes, la reflexión
          del diario) — para esto, el texto que escribes se envía al proveedor de IA que usamos (ver abajo).
        </li>
        <li>Procesar tu compra a través de Hotmart, si eliges un plan pago.</li>
        <li>Enviarte correos operativos (el enlace de acceso, avisos sobre tu compra).</li>
        <li>Detectar y corregir errores técnicos.</li>
      </ul>

      <h2>Con quién compartimos tus datos</h2>
      <p>No vendemos tus datos a nadie. Los compartimos únicamente con estos proveedores, cada uno con una función específica:</p>
      <ul>
        <li><strong>Supabase</strong> — guarda tu cuenta y todos tus datos en su base de datos (servidores en la Unión Europea).</li>
        <li><strong>Anthropic</strong> — procesa los textos que le pides a la IA (Coach, Tarot, análisis de mensajes, Diario) para generar la respuesta. Sus servidores están en Estados Unidos.</li>
        <li><strong>Vercel</strong> — aloja la aplicación web de LUMA.</li>
        <li><strong>Resend</strong> — envía los correos operativos (el enlace de acceso, avisos de tu compra).</li>
        <li><strong>Hotmart</strong> — procesa tu pago si compras un plan; ellos manejan los datos de tu tarjeta, nosotros no.</li>
      </ul>
      <p>Hoy no usamos ningún servicio de analítica ni publicidad de terceros. Si eso cambia, actualizaremos esta página y te avisaremos.</p>

      <h2>Tus textos y la IA (transferencia internacional)</h2>
      <p>
        Cuando usas el Coach, el Tarot, Descifrar la conversación o el Diario, el texto que escribes se envía a
        Anthropic, nuestro proveedor de IA, cuyos servidores están fuera de la Unión Europea (Estados Unidos). Esto
        es lo que en protección de datos se llama una <strong>transferencia internacional</strong>, y ocurre bajo los
        términos comerciales de Anthropic, que por defecto no usa los datos enviados por su API para entrenar sus
        modelos.
      </p>
      <p>
        ⚠️ No incluyas en tus mensajes contraseñas, números de tarjeta ni documentos de identidad — solo lo que
        necesites para tu análisis o reflexión.
      </p>

      <h2>Cuánto tiempo guardamos tus datos</h2>
      <p>
        Mientras tu cuenta esté activa, guardamos tu historial (diario, tiradas, conversaciones) para que puedas
        volver a verlo. Si eliminas tu cuenta, borramos todo de forma permanente — ver la siguiente sección.
      </p>

      <h2>Cómo eliminar tu cuenta y tus datos</h2>
      <p>
        Puedes borrar tu cuenta y todo lo que hayas guardado (diario, tiradas, conversaciones, círculo) desde{' '}
        <strong>Más → Zona de riesgo → "Eliminar mi cuenta y todos mis datos"</strong>, dentro de la app. Es
        inmediato, no se puede deshacer, y también limpia lo que LUMA haya guardado en tu dispositivo. Conservamos
        únicamente registros técnicos anónimos (sin tu nombre ni tu correo) de uso, errores y costo de la IA. Si prefieres pedirlo por correo, escribe a{' '}
        <a href="mailto:anares.monat@gmail.com">anares.monat@gmail.com</a>.
      </p>

      <h2>Tus derechos</h2>
      <p>
        Puedes pedirnos acceder a tus datos, corregirlos, eliminarlos, oponerte a su uso, limitarlo o pedir una copia
        portable, escribiendo a <a href="mailto:anares.monat@gmail.com">anares.monat@gmail.com</a>. Te
        respondemos en un plazo razonable.
      </p>

      <h2>Menores de edad</h2>
      <p>LUMA es solo para mayores de 18 años. No recopilamos a sabiendas datos de menores de edad.</p>

      <h2>Cookies</h2>
      <p>
        Usamos solo las cookies esenciales para mantener tu sesión iniciada (de Supabase Auth). No usamos cookies de
        publicidad ni de rastreo. Más detalles en nuestra{' '}
        <a href="/cookies">Política de Cookies</a>.
      </p>

      <h2>Cambios a esta política</h2>
      <p>
        Si hacemos un cambio importante, te avisaremos por correo antes de que entre en vigor. La fecha de arriba
        siempre muestra la última actualización.
      </p>
    </PaginaLegal>
  );
}
