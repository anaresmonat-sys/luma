import { AppLinkButton } from '@/components/app/AppButton';

// Invitación a elegir plan, SIEMPRE debajo del resultado (nunca encima): la persona
// primero recibe lo que vino a buscar y recién después se le propone seguir. Solo se
// pinta cuando la lectura gratis ya se gastó y no hay plan (lo decide cada pantalla).
export function InvitacionPlan({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_40%,transparent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] p-3 text-center ${className}`}
    >
      <p className="text-[13.5px] font-semibold leading-snug text-[var(--text-primary)]">
        Esta era tu lectura gratis. Para seguir, elige tu plan.
      </p>
      <div className="mt-2.5">
        <AppLinkButton href="/paywall?motivo=lectura-usada" compact>
          Elegir mi plan
        </AppLinkButton>
      </div>
    </div>
  );
}
