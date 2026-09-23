// Banner de avisos automáticos del dueño — docs/sistema/21-BACKOFFICE.md:
// "el dueño no técnico no va a leer tablas buscando problemas". Cada aviso es
// qué pasó → por qué importa → qué hacer, en lenguaje simple. Si no hay nada
// calculable todavía, se dice honestamente en vez de fingir que "todo bien".

export interface Aviso {
  emoji: string;
  texto: string;
  tono: 'alerta' | 'bien' | 'info';
}

export function BannerAvisos({ avisos }: { avisos: Aviso[] }) {
  if (avisos.length === 0) return null;
  return (
    <div className="mb-6 flex flex-col gap-2">
      {avisos.map((a, i) => (
        <div
          key={i}
          className="flex items-start gap-3 rounded-[var(--radius-card)] border p-3.5"
          style={{
            borderColor:
              a.tono === 'alerta'
                ? 'color-mix(in oklab, var(--an-risk) 45%, transparent)'
                : a.tono === 'bien'
                  ? 'color-mix(in oklab, var(--an-eye) 40%, transparent)'
                  : 'color-mix(in oklab, var(--accent) 30%, transparent)',
            background:
              a.tono === 'alerta'
                ? 'color-mix(in oklab, var(--an-risk) 10%, transparent)'
                : a.tono === 'bien'
                  ? 'color-mix(in oklab, var(--an-eye) 8%, transparent)'
                  : 'color-mix(in oklab, var(--accent) 6%, transparent)',
          }}
        >
          <span className="text-[16px] leading-none" aria-hidden="true">
            {a.emoji}
          </span>
          <p className="text-[13px] leading-relaxed text-[var(--text-primary)]">{a.texto}</p>
        </div>
      ))}
    </div>
  );
}
