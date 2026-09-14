'use client';

// LUMA — Página de ventas (Paso 1 de la SECUENCIA MAESTRA).
// Estructura canónica de 19-PAGINA-DE-VENTAS.md, compuesta desde el KIT
// (components/landing/). Copy: docs/copy/landing.md (marcado, trazado a FICHA-AVATAR.md).
// Estilo: FICHA-ARTE.md → Dirección A "Terciopelo & Oro" (tokens en components/landing/tokens.css).
// Modelo 02C: freemium onboarding-first → TODOS los CTA van a /onboarding.

import { HeroDemoLuma } from '@/components/app/HeroDemoLuma';
import { CasosLuma } from '@/components/app/CasosLuma';
import { Hero, SiteHeader } from '@/components/landing/Hero';
import { Problema } from '@/components/landing/Problema';
import { Agitacion } from '@/components/landing/Agitacion';
import { Solucion } from '@/components/landing/Solucion';
import { Oferta } from '@/components/landing/Oferta';
import { Garantia } from '@/components/landing/Garantia';
import { Faq } from '@/components/landing/Faq';
import { CtaFinal } from '@/components/landing/CtaFinal';
import { FooterLegal } from '@/components/landing/FooterLegal';
import { BackToTop, StickyCtaMobile } from '@/components/landing/ui';

const CTA_HREF = '/onboarding';
const CTA_LABEL = 'Descifrar mi primera conversación';

export default function LandingLuma() {
  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      <a
        href="#contenido"
        className="fixed left-4 top-4 z-50 -translate-y-16 rounded-[4px] bg-[var(--accent)] px-4 py-2 text-[14px] font-semibold text-[var(--bg)] transition-transform duration-150 focus:translate-y-0"
      >
        Saltar al contenido
      </a>
      <SiteHeader
        appName="LUMA"
        loginHref="/entrar"
        logo={<img src="/luma-icon.png" alt="" aria-hidden="true" className="h-6 w-auto" />}
      />
      <main id="contenido">
      {/* 1 · HERO */}
      <Hero
        h1Marked="Deja de releer sus mensajes. [acento]Entiende[/acento] qué está pasando."
        subtitleMarked="En un minuto: [b]hechos, riesgo y qué responder[/b], con tarot y coach."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        socialProof={<span>Empieza gratis 3 días · sin cobros por mensaje · cancela cuando quieras</span>}
        visual={<HeroDemoLuma />}
      />

      {/* 2 · PROBLEMA */}
      <Problema
        titulo="¿Te suena?"
        preguntas={[
          { emoji: '⏳', textoMarked: '¿Por qué me escribía todo el día y ahora [b]tarda horas[/b]?' },
          { emoji: '😕', textoMarked: '¿Estoy exagerando o de verdad cambió algo?' },
          { emoji: '😳', textoMarked: '¿Qué le respondo sin quedar como que me importa demasiado?' },
          { emoji: '😩', textoMarked: '¿Otra vez estoy repitiendo el [b]mismo patrón[/b] de siempre?' },
        ]}
      />

      {/* 3 · AGITACIÓN */}
      <Agitacion
        frases={[
          {
            emoji: '😖',
            textoMarked: 'Cada mensaje ambiguo te manda a la misma espiral: releer, suponer, preguntar a amigas igual de perdidas.',
          },
          {
            emoji: '🌙',
            textoMarked: 'Son las 23:00 y sigues en la cama releyendo la conversación por décima vez, con el estómago apretado.',
          },
          {
            emoji: '💔',
            textoMarked: 'No es que pienses de más. Es que [b]nadie te ayudó a ver la conversación con calma[/b].',
          },
        ]}
        contraste={{
          labelHoy: 'Hoy',
          hoy: 'Releer el chat, suponer lo peor y revisar el teléfono cada cinco minutos.',
          labelFuturo: 'Dentro de un mes, si nada cambia',
          futuro: 'La misma espiral — con un mes más de desgaste.',
        }}
      />

      {/* 4 · SOLUCIÓN */}
      <Solucion
        kicker="Cómo funciona"
        tituloMarked="Tu conversación, [acento]vista con calma[/acento]"
        mecanismo="descifrar la conversación"
        bigIdeaMarked="No piensas de más. LUMA separa los hechos de las historias, y desde ahí eliges: [b]una tirada, hablar con tu coach o anotarlo[/b]."
        pasos={[
          {
            titulo: 'Pega el chat',
            detalle: 'Copias la conversación de WhatsApp, subes una captura o lo cuentas por voz.',
          },
          {
            titulo: 'LUMA lo descifra',
            detalle: 'Te separa los hechos de las historias que tu mente construye.',
          },
          {
            titulo: 'Sabes qué hacer',
            detalle: 'Recibes el posible riesgo, una pregunta para ti y qué responder.',
          },
        ]}
        antesDespues={{
          labelAntes: 'Antes',
          antes: 'Releer el chat veinte veces y preguntarle a amigas igual de perdidas.',
          labelDespues: 'Después',
          despues: 'Qué pasa, qué arriesgas y qué responder — en un minuto.',
        }}
      />

      {/* 5 · CASOS — 3 mini-casos reales del mecanismo (sustituye el carrusel del kit
          mientras no exista la app interna; los screenshots reales van en Sesión 5 — ver ESTADO) */}
      <CasosLuma ctaLabel={CTA_LABEL} ctaHref={CTA_HREF} />

      {/* 6 · OFERTA — anual primero, trial 3 días (02C), total visible */}
      <Oferta
        kicker="Tu plan"
        tituloMarked="Menos que [acento]una consulta con una tarotista[/acento]"
        trialDias={3}
        anual={{
          nombre: 'Anual',
          badge: 'LA MÁS ELEGIDA',
          precioMes: '$6,00',
          sufijo: '/mes aprox.',
          totalAnual: 'Se cobra $71,99/año',
          ahorro: 'más de 4 meses gratis',
          descomposicionDia: 'menos de $0,20 al día',
          ctaLabel: CTA_LABEL,
          ctaHref: CTA_HREF,
          features: [
            'Descifra conversaciones sin límite: texto, captura o voz',
            'Chat con LUMA, tu tarotista y coach, cuando quieras',
            'Tiradas de tarot leídas para tu caso, no genéricas',
            'Diario emocional que te muestra tus patrones',
            'Sin cobros por mensaje ni por crédito. Nunca.',
          ],
        }}
        mensual={{
          nombre: 'Mensual',
          precioMes: '$9,99',
          sufijo: '/mes',
          ctaLabel: CTA_LABEL,
          ctaHref: CTA_HREF,
          features: [
            'Descifra conversaciones sin límite: texto, captura o voz',
            'Chat con LUMA cuando lo necesites',
            'Tiradas de tarot para tu caso, no genéricas',
            'Diario emocional con tus patrones',
            'Cancelas cuando quieras',
          ],
        }}
      />

      {/* 7 · GARANTÍA — FICHA-MERCADO §4: garantía 7 días > prueba 3 días */}
      <Garantia
        nombre="la Garantía de Calma de 7 Días"
        condicionMarked="Pruebas [b]3 días gratis[/b]: si LUMA no te da calma, no pagas nada. Y si pagas y no era para ti, tienes [b]7 días[/b] para el reembolso completo."
        pisoLegal="Respaldada por la garantía de Hotmart"
      />

      {/* 8 · FAQ — objeciones reales de FICHA-AVATAR, la #1 abierta */}
      <Faq
        items={[
          {
            pregunta: '¿Es un chatbot genérico que responde lo mismo a todo el mundo?',
            respuestaMarked:
              'No. LUMA lee [b]tu[/b] conversación concreta y te habla de tu caso. Nada de interpretaciones de horóscopo de periódico iguales cada día.',
          },
          {
            pregunta: 'El tarot en apps no me funciona, prefiero una persona real.',
            respuestaMarked:
              'Aquí el tarot es una herramienta de reflexión, no una promesa de futuro. Y tienes una coach que te acompaña, no solo cartas con texto.',
          },
          {
            pregunta: '¿No es caro por decirme significados que puedo buscar en Google?',
            respuestaMarked:
              'No pagas por significados. Pagas por entender [b]tu[/b] situación y salir de la espiral en un minuto. Y no hay cobros por mensaje ni por crédito.',
          },
          {
            pregunta: '¿La app me va a juzgar por escribirle a mi ex o por darle mil vueltas?',
            respuestaMarked:
              'Nunca. LUMA es tu espacio privado para entender lo que sientes, con el tono de una amiga preparada. Solo tú lo ves.',
          },
          {
            pregunta: '¿Y si no me convence?',
            respuestaMarked:
              '3 días gratis para probarla y 7 días de garantía tras el primer cobro. Cancelas cuando quieras, sin trámites.',
          },
        ]}
      />

      {/* 9 · CTA FINAL */}
      <CtaFinal
        h2Marked="Entiende qué pasa. [acento]Elige[/acento] mejor."
        futurePacingMarked="La próxima vez que su mensaje te descoloque, en vez de la espiral tienes claridad y un siguiente paso."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        recap="Descifra chats · Chat con LUMA · Tarot para tu caso · Diario de patrones · sin cobros por mensaje"
        psMarked="PS — Empiezas gratis. Los 3 días de prueba son de verdad: si LUMA no te da calma, no pagas nada. Y si pagas y no era para ti, tienes 7 días para el reembolso completo."
      />
      </main>

      {/* 10 · FOOTER LEGAL — las páginas enlazadas existen como borrador (contenido pendiente, archivo 47) */}
      <FooterLegal
        appName="LUMA"
        soporteEmail="hola@luma.app"
        enlaces={[
          { label: 'Privacidad', href: '/privacidad' },
          { label: 'Términos', href: '/terminos' },
          { label: 'Cookies', href: '/cookies' },
          { label: 'Reembolsos', href: '/reembolsos' },
          { label: 'Aviso sobre la IA', href: '/aviso-ia' },
        ]}
      />

      <StickyCtaMobile labelComercial={CTA_LABEL} href={CTA_HREF} />
      <BackToTop />
    </div>
  );
}
