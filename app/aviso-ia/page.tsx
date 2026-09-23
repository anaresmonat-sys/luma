import { PaginaLegal } from '@/components/legal/PaginaLegal';

export const metadata = { title: 'Aviso sobre la IA — LUMA' };

export default function Page() {
  return (
    <PaginaLegal titulo="Aviso sobre la IA" actualizado="23 de septiembre de 2026">
      <p>
        LUMA usa inteligencia artificial (el modelo de Anthropic) para generar las respuestas del Coach, las lecturas
        de Tarot, el análisis de tus mensajes en "Descifra la conversación" y las reflexiones del Diario. Antes de
        usar cualquiera de estas funciones, queremos que tengas claro lo siguiente.
      </p>

      <h2>Es orientación, no consejo profesional</h2>
      <p>
        Lo que LUMA te dice es <strong>orientación generada por IA</strong>, pensada para ayudarte a reflexionar — no
        es consejo médico, psicológico, legal ni financiero. No sustituye a un profesional. Si estás pasando por una
        crisis emocional seria, busca ayuda de un profesional de salud mental o de una línea de apoyo en tu país.
      </p>

      <h2>La IA puede equivocarse</h2>
      <p>
        Los modelos de IA a veces generan respuestas incompletas, imprecisas o directamente incorrectas. Nada de lo
        que LUMA te diga debe tomarse como un hecho comprobado sin que tú lo contrastes con tu propio criterio.
      </p>

      <h2>El tarot es una herramienta de reflexión</h2>
      <p>
        Las cartas y sus lecturas en LUMA no predicen el futuro ni tienen poderes sobrenaturales — son un punto de
        partida para pensar en tu situación desde otro ángulo.
      </p>

      <h2>Tú decides</h2>
      <p>
        La decisión final sobre tu vida, tus relaciones y lo que haces con la información que LUMA te da es siempre
        tuya. Te acompañamos a pensar con más claridad — no decidimos por ti.
      </p>

      <h2>Cómo se procesan tus textos</h2>
      <p>
        Lo que escribes se envía al proveedor de IA (Anthropic) para generar la respuesta. Más detalles sobre cómo
        se maneja esa información en nuestra <a href="/privacidad">Política de Privacidad</a>.
      </p>
    </PaginaLegal>
  );
}
