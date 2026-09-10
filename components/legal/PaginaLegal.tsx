import Link from 'next/link';

export function PaginaLegal({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-[680px] px-5 py-16 [font-family:var(--font-body)]">
      <Link href="/" className="text-[13px] font-semibold text-[var(--accent)]">← LUMA</Link>
      <h1 className="mt-6 text-[28px] font-semibold leading-tight [font-family:var(--font-display)] text-[var(--text-primary)]">
        {titulo}
      </h1>
      <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-[var(--text-secondary)]">
        {children}
      </div>
      <p className="mt-10 text-[13px] text-[var(--text-tertiary)]">
        Borrador — el contenido legal definitivo se redacta antes del lanzamiento (privacidad, términos,
        cookies, reembolsos y aviso sobre la IA). Contacto: hola@luma.app
      </p>
    </main>
  );
}
