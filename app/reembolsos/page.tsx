import { PaginaLegal } from '@/components/legal/PaginaLegal';

export const metadata = { title: 'Reembolsos — LUMA' };

export default function Page() {
  return (
    <PaginaLegal titulo="Reembolsos" actualizado="19 de octubre de 2026">
      <h2>Prueba gratis de 3 días</h2>
      <p>
        Al empezar, tienes 3 días completos para probar LUMA sin que se te cobre nada. Si cancelas antes de que
        termine ese período, no pagas absolutamente nada. Para cancelar, escríbenos a{' '}
        <a href="mailto:soporte@tuluma.app">soporte@tuluma.app</a> o usa <a href="/app/cancelar">Más → Cómo cancelar</a>.
      </p>
      <p>
      </p>

      <h2>Garantía de 15 días</h2>
      <p>
        Si sientes que LUMA no es para ti, tienes <strong>15 días desde que empiezas tu prueba</strong> para pedir el
        reembolso completo — sin preguntas incómodas. Como la prueba dura 3 días, después de tu primer cobro te quedan
        12 días. Si te pasas por poco, escríbenos igualmente: miramos cada caso.
      </p>

      <h2>Cómo pedir tu reembolso</h2>
      <p>
        Todos los pagos de LUMA se procesan a través de <strong>Hotmart</strong>. Para pedir tu reembolso:
      </p>
      <ul>
        <li>Escríbenos a <a href="mailto:soporte@tuluma.app">soporte@tuluma.app</a> desde el correo con el que compraste.</li>
        <li>Dinos que quieres el reembolso — no hace falta explicar el motivo.</li>
        <li>Lo gestionamos nosotras con Hotmart y te confirmamos por correo. Hotmart devuelve el dinero al mismo medio de pago.</li>
      </ul>
      <p>
        También puedes ver tus compras y recibos en consumer.hotmart.com con el mismo correo de la compra.
      </p>

      <h2>Si compras desde Brasil</h2>
      <p>
        La ley brasileña (Código de Defensa del Consumidor) te da derecho a desistir de tu compra dentro de los 7
        días siguientes, con devolución completa — este derecho ya está incluido en nuestra garantía de 15 días de
        arriba, que dura más tiempo.
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
