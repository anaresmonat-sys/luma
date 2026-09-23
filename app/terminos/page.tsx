import { PaginaLegal } from '@/components/legal/PaginaLegal';

export const metadata = { title: 'Términos — LUMA' };

export default function Page() {
  return (
    <PaginaLegal titulo="Términos" actualizado="23 de septiembre de 2026">
      <p>
        Al usar LUMA aceptas estos términos. Los escribimos en lenguaje simple para que sepas exactamente qué esperar
        — si algo no te queda claro, escríbenos a{' '}
        <a href="mailto:anares.monat@gmail.com">anares.monat@gmail.com</a>.
      </p>

      <h2>Qué es LUMA</h2>
      <p>
        LUMA es una app de bienestar emocional para relaciones: analiza conversaciones, ofrece lecturas de tarot como
        herramienta de reflexión y un coach con inteligencia artificial para ayudarte a entender lo que te pasa y
        decidir tu próximo paso.
      </p>

      <h2>Qué NO es LUMA</h2>
      <ul>
        <li>No es terapia ni sustituye a un psicólogo, psiquiatra o consejero profesional.</li>
        <li>No predice el futuro. El tarot en LUMA es un disparador de reflexión, no una herramienta adivinatoria.</li>
        <li>
          No da consejo legal, médico ni financiero. Las respuestas de la IA son orientación general — ver el{' '}
          <a href="/aviso-ia">Aviso sobre la IA</a>.
        </li>
      </ul>

      <h2>Quién puede usar LUMA</h2>
      <p>LUMA es solo para mayores de 18 años. Necesitas una cuenta con tu correo electrónico real.</p>

      <h2>Tu suscripción</h2>
      <ul>
        <li>LUMA ofrece 3 días de prueba gratis. Al terminar la prueba, si no cancelaste, se cobra el plan que elegiste.</li>
        <li>La suscripción se renueva automáticamente cada mes o cada año, según el plan que elijas, hasta que la canceles.</li>
        <li>Puedes cancelar cuando quieras desde <a href="/app/cancelar">Más → Cómo cancelar</a>; sigues teniendo acceso hasta el final del período ya pagado.</li>
        <li>
          Los pagos se procesan a través de Hotmart. Nuestra{' '}
          <a href="/reembolsos">Política de Reembolsos</a> explica cuándo puedes pedir tu dinero de vuelta.
        </li>
      </ul>

      <h2>Lo que escribes y lo que la IA te responde</h2>
      <p>
        Tus mensajes, entradas de diario y conversaciones son tuyos — puedes usarlos, copiarlos y guardarlos como
        quieras. No los publicamos ni los compartimos con nadie más que los proveedores necesarios para hacer
        funcionar la app (ver nuestra <a href="/privacidad">Política de Privacidad</a>).
      </p>

      <h2>Uso aceptable</h2>
      <p>No está permitido usar LUMA para:</p>
      <ul>
        <li>Acosar, amenazar o dañar a otra persona.</li>
        <li>Intentar hackear, sobrecargar o dañar la app.</li>
        <li>Crear cuentas falsas o hacerte pasar por otra persona.</li>
      </ul>
      <p>
        Si detectamos un uso indebido, podemos suspender o cerrar tu cuenta. Si crees que fue un error, escríbenos y
        lo revisamos.
      </p>

      <h2>Límite de responsabilidad</h2>
      <p>
        LUMA se ofrece "tal cual". La IA puede generar respuestas incompletas o incorrectas — la decisión final sobre
        tu vida y tus relaciones siempre es tuya. No somos responsables de las decisiones que tomes basándote en lo
        que la app te dice.
      </p>

      <h2>Ley aplicable</h2>
      <p>
        Estos términos se rigen por la ley española. Si compras desde otro país, esto no te quita los derechos de
        protección al consumidor que la ley de tu país te reconozca.
      </p>

      <h2>Cambios a estos términos</h2>
      <p>Si hacemos un cambio importante, te avisaremos por correo antes de que entre en vigor.</p>
    </PaginaLegal>
  );
}
