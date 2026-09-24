import { PaginaLegal } from '@/components/legal/PaginaLegal';

export const metadata = { title: 'Cookies — LUMA' };

export default function Page() {
  return (
    <PaginaLegal titulo="Cookies" actualizado="23 de septiembre de 2026">
      <p>
        Una cookie es un archivo pequeño que un sitio web guarda en tu navegador. Esto es lo que usamos en LUMA, sin
        rodeos.
      </p>

      <h2>Lo único que usamos hoy: cookies esenciales</h2>
      <p>LUMA usa únicamente dos tipos de cookies, ambas necesarias para que la app funcione y para protegerla:</p>
      <ul>
        <li>
          <strong>Sesión iniciada</strong> (de Supabase Auth, nuestro proveedor de inicio de sesión): sin ella
          tendrías que volver a entrar con tu correo cada vez que abrieras la app.
        </li>
        <li>
          <strong>Identificador anónimo de prueba</strong> (<code>luma_anon</code>, dura un año): un código al azar
          que sirve para llevar la cuenta de tu resultado gratis y evitar abusos. No contiene tu nombre ni tu
          correo, no se usa para publicidad y no puede leerse desde el navegador.
        </li>
      </ul>
      <p>Ninguna de las dos sirve para rastrearte ni para mostrarte publicidad.</p>

      <h2>Almacenamiento en tu dispositivo</h2>
      <p>
        Además de la sesión, LUMA guarda en el almacenamiento local de tu navegador algunas cosas para que la app
        funcione: si ya usaste tu prueba gratis, tu confirmación de mayoría de edad, tus respuestas de bienvenida y
        una copia de tu diario, tiradas y círculo. No se envía a ningún tercero ni sirve para rastrearte. Se borra al
        eliminar tu cuenta desde la app o al borrar los datos de tu navegador.
      </p>

      <h2>Lo que NO usamos</h2>
      <ul>
        <li>No usamos Google Analytics ni ninguna herramienta de medición de terceros.</li>
        <li>No usamos píxeles de publicidad (Meta, TikTok u otros).</li>
        <li>No vendemos ni compartimos datos de navegación con anunciantes.</li>
      </ul>
      <p>
        Como no usamos cookies no esenciales, hoy no necesitas elegir nada — por eso no ves un banner pidiéndote
        "aceptar" o "rechazar". Si en el futuro sumamos analítica o publicidad, actualizaremos esta página y te
        pediremos tu consentimiento antes de activarlas, con la opción de rechazarlas igual de fácil que aceptarlas.
      </p>

      <h2>Cómo borrar las cookies existentes</h2>
      <p>
        Puedes borrar las cookies de LUMA desde la configuración de tu navegador en cualquier momento — solo ten en
        cuenta que tendrás que iniciar sesión de nuevo la próxima vez que entres.
      </p>
    </PaginaLegal>
  );
}
