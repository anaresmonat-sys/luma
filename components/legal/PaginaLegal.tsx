import Link from 'next/link';

export function PaginaLegal({
  titulo,
  actualizado,
  children,
}: {
  titulo: string;
  /** Fecha de última actualización, visible junto al título (47-LEGAL-FISCAL-Y-PRIVACIDAD.md §2.1). */
  actualizado?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-[680px] px-5 py-16 [font-family:var(--font-body)]">
      <Link href="/" className="text-[13px] font-semibold text-[var(--accent)]">← LUMA</Link>
      <h1 className="mt-6 text-[28px] font-semibold leading-tight [font-family:var(--font-display)] text-[var(--text-primary)]">
        {titulo}
      </h1>
      {actualizado && (
        <p className="mt-2 text-[12.5px] text-[var(--text-tertiary)]">Última actualización: {actualizado}</p>
      )}
      <div
        className="mt-6 space-y-4 text-[15px] leading-relaxed text-[var(--text-secondary)]
          [&_h2]:mt-8 [&_h2]:text-[17px] [&_h2]:font-semibold [&_h2]:text-[var(--text-primary)] [&_h2]:[font-family:var(--font-display)]
          [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5
          [&_strong]:font-semibold [&_strong]:text-[var(--text-primary)]
          [&_a]:text-[var(--accent-lite)] [&_a]:underline [&_a]:underline-offset-2"
      >
        {children}
      </div>
      <p className="mt-10 text-[13px] text-[var(--text-tertiary)]">
        Contacto: <a href="mailto:anares.monat@gmail.com" className="underline underline-offset-2">anares.monat@gmail.com</a>
      </p>
    </main>
  );
}
