import Link from 'next/link';

// Micro-disclaimer junto a CADA salida de IA — no solo enterrado en los
// Términos (docs/sistema/47-LEGAL-FISCAL-Y-PRIVACIDAD.md §2.4, auditoría legal
// 2026-09-23: no existía en ningún lugar de la app hasta hoy). Un renglón,
// discreto, con enlace a la explicación completa.
export function AvisoIA({ className = '' }: { className?: string }) {
  return (
    <p className={`text-[11px] leading-snug text-[var(--text-tertiary)] ${className}`}>
      Esto es orientación generada por IA, no un consejo profesional — tú decides.{' '}
      <Link href="/aviso-ia" className="underline underline-offset-2">
        Saber más
      </Link>
    </p>
  );
}
