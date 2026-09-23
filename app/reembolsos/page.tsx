import { PaginaLegal } from '@/components/legal/PaginaLegal';

export const metadata = { title: 'Reembolsos — LUMA' };

export default function Page() {
  return (
    <PaginaLegal titulo="Reembolsos" actualizado="23 de septiembre de 2026">
      <h2>Prueba gratis de 3 días</h2>
      <p>
        Al empezar, tienes 3 días completos para probar LUMA sin que se te cobre nada. Si cancelas antes de que
        termine ese período, no pagas absolutamente nada.
      </p>

      <h2>Garantía de 7 días</h2>
      <p>
        Si después de tu primer cobro sientes que LUMA no es para ti, tienes <strong>7 días desde ese cobro</strong>{' '}
        para pedir el reembolso completo — sin preguntas incómodas.
      </p>

      <h2>Cómo pedir tu reembolso</h2>
      <p>
        Todos los pagos de LUMA se procesan a través de <strong>Hotmart</strong>, que gestiona los reembolsos
        directamente:
      </p>
      <ul>
        <li>Entra a hotmart.com/es/sign-in con el correo con el que compraste.</li>
        <li>Ve a "Mis compras" y busca tu suscripción a LUMA.</li>
        <li>Solicita el reembolso — Hotmart lo procesa según su ventana de garantía.</li>
      </ul>
      <p>
        Si tienes problemas para encontrar tu compra, escríbenos a{' '}
        <a href="mailto:anares.monat@gmail.com">anares.monat@gmail.com</a> y te ayudamos.
      </p>

      <h2>Si compras desde Brasil</h2>
      <p>
        La ley brasileña (Código de Defensa del Consumidor) te da derecho a desistir de tu compra dentro de los 7
        días siguientes, con devolución completa — este derecho ya está incluido en nuestra garantía de 7 días de
        arriba.
      </p>

      <h2>Después de un reembolso</h2>
      <p>
        Cuando se aprueba un reembolso o se reporta una devolución de cargo, tu acceso a las funciones pagas de LUMA
        se cierra. Tu cuenta y tu historial no se borran automáticamente — si además quieres eliminar tus datos,
        puedes hacerlo desde <strong>Más → Zona de riesgo → Eliminar mi cuenta</strong>.
      </p>
    </PaginaLegal>
  );
}
