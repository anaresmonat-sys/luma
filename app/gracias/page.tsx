// Página de bienvenida tras la compra (Hotmart → "página de agradecimiento"). Su único trabajo:
// que la persona que acaba de pagar sepa qué hacer ahora — entrar a LUMA con el mismo correo
// de la compra. Hotmart presenta el producto como un curso; aquí se aclara que LUMA vive en
// tuluma.app. Pública (sin sesión) y fuera del buscador.

import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, KeyRound, Mail, MailQuestion } from 'lucide-react';
import { AppLinkButton } from '@/components/app/AppButton';

export const metadata: Metadata = {
  title: 'Tu compra — LUMA',
  robots: { index: false, follow: false },
};

const PASOS = [
  {
    Icono: Mail,
    titulo: 'Abre tu correo',
    texto: 'Te enviamos un mensaje con tu botón de entrada. Si no lo ves, mira en spam o promociones.',
  },
  {
    Icono: KeyRound,
    titulo: 'Entra con el mismo correo de la compra',
    texto: 'Escribe el correo con el que pagaste y recibirás un enlace nuevo. Sin contraseñas.',
  },
  {
    Icono: MailQuestion,
    titulo: '¿Algo no cuadra?',
    texto: 'Escríbenos a soporte@tuluma.app y lo resolvemos contigo.',
  },
] as const;

// Pasos mientras el pago aún no está confirmado (Hotmart "en espera de pago" / "en análisis de crédito"): la dirección
// de esos dos estados es /gracias?estado=pendiente. No se promete acceso hasta que llegue el correo.
const PASOS_PENDIENTE = [
  {
    Icono: Clock,
    titulo: 'Espera la confirmación',
    texto: 'Puede tardar desde unos minutos hasta un día, según cómo hayas pagado. No tienes que hacer nada más.',
  },
  {
    Icono: Mail,
    titulo: 'Te llegará un correo con tu botón de entrada',
    texto: 'En cuanto se confirme el pago. Si no lo ves, mira en spam o promociones.',
  },
  PASOS[2],
] as const;

export default async function GraciasPage({ searchParams }: { searchParams: Promise<{ estado?: string | string[] }> }) {
  const { estado } = await searchParams;
  const pendiente = estado === 'pendiente';
  const pasos = pendiente ? PASOS_PENDIENTE : PASOS;
  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-[480px] flex-col px-6 pb-8 pt-12 [font-family:var(--font-body)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 70% 38dvh at 50% 18%, color-mix(in oklab, var(--bloom-vino) 32%, transparent), transparent 70%), ' +
            'radial-gradient(ellipse 60% 30dvh at 50% 100%, color-mix(in oklab, var(--bloom-vino) 22%, transparent), transparent 72%)',
        }}
      />

      <p className="text-center text-xs font-semibold tracking-widest text-[var(--accent-lite)]">LUMA</p>

      <h1 className="mt-6 text-center text-[32px] font-semibold leading-tight text-[var(--text-primary)] [font-family:var(--font-display)]">
        {pendiente ? (
          <>
            Estamos <span className="text-[var(--accent-lite)]">confirmando</span> tu pago
          </>
        ) : (
          <>
            Tu compra está <span className="text-[var(--accent-lite)]">confirmada</span>
          </>
        )}
      </h1>
      <p className="mx-auto mt-3 max-w-xs text-center text-base leading-relaxed text-[var(--text-secondary)]">
        {pendiente
          ? 'En cuanto se confirme, te enviamos un correo con tu acceso a LUMA. LUMA no vive en el área de cursos de Hotmart: vive en tu propio espacio en la web.'
          : 'LUMA no vive en el área de cursos de Hotmart: vive en tu propio espacio en la web. Entra desde aquí.'}
      </p>

      {!pendiente && (
        <div className="mt-7">
          <AppLinkButton href="/entrar">Entrar a LUMA</AppLinkButton>
        </div>
      )}

      <ol className="mt-8 flex flex-col gap-3">
        {pasos.map(({ Icono, titulo, texto }) => (
          <li
            key={titulo}
            className="flex items-start gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface-2)] p-3.5"
          >
            <span
              aria-hidden="true"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)] text-[var(--accent-lite)]"
            >
              <Icono size={20} strokeWidth={1.75} />
            </span>
            <div>
              <h2 className="text-base font-semibold text-[var(--text-primary)]">{titulo}</h2>
              <p className="mt-0.5 text-[13px] leading-snug text-[var(--text-secondary)]">{texto}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-auto pt-8 text-center text-[12.5px] leading-snug text-[var(--text-tertiary)]">
        Tienes 15 días de garantía desde tu primer cobro. Cancelas cuando quieras.{' '}
        <Link href="/reembolsos" className="underline underline-offset-2">
          Ver cómo
        </Link>
      </p>
    </main>
  );
}
