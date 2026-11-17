// Parte VISUAL de la pestaña Ventas del panel: banner de estado, tarjetas, barra de reparto y reembolsos/cancelaciones
// en tarjetas de color. Recibe los datos ya calculados (los lee app/admin/ventas/page.tsx), así se puede ver con datos de ejemplo.

import type { ReactNode } from 'react';
import { SinDatos, Seccion, Tarjeta } from '@/components/admin/Tarjeta';
import { Glosa } from '@/components/admin/Glosa';
import { BotonReembolsar } from '@/components/admin/BotonReembolsar';

export interface PeticionVista {
  id: string;
  user_id: string;
  email: string;
  requested_at: string;
  estado: string;
  detalle: string | null;
}

export interface DatosVentas {
  reembolsos: PeticionVista[];
  peticiones: PeticionVista[];
  /** user_id de los reembolsos ya hechos */
  reembolsados: string[];
  activas: number;
  mensuales: number;
  anuales: number;
  cortesias: number;
  canceladas: number;
  reembolsadas: number;
  sinAcceso: number;
}

function fechaCorta(iso: string): string {
  return new Date(iso).toLocaleString('es-ES', { timeZone: 'Europe/Madrid', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

// Una petición (reembolso o cancelación) como tarjeta: inicial, correo, fecha y una etiqueta de color según su estado.
function FilaPeticion({
  correo,
  fecha,
  hecha,
  textoHecha,
  textoPendiente,
  accion,
}: {
  correo: string;
  fecha: string;
  hecha: boolean;
  textoHecha: string;
  textoPendiente: string;
  accion?: ReactNode;
}) {
  const color = hecha ? 'var(--an-eye)' : 'var(--accent)';
  return (
    <div
      className="flex flex-col gap-3 rounded-[var(--radius-card)] border bg-[var(--surface)] p-4"
      style={{ borderColor: `color-mix(in oklab, ${color} 40%, transparent)` }}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-base font-bold"
          style={{ background: `color-mix(in oklab, ${color} 18%, transparent)`, color }}
        >
          {correo.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1 basis-44">
          <p className="break-all text-sm font-semibold text-[var(--text-primary)]">{correo}</p>
          <p className="text-xs text-[var(--text-secondary)]">Pidió el {fecha} · hora de España</p>
        </div>
        <span
          className="ml-[3.25rem] shrink-0 rounded-full px-3 py-1 text-xs font-bold sm:ml-0"
          style={{ background: `color-mix(in oklab, ${color} 18%, transparent)`, color }}
        >
          {hecha ? `✓ ${textoHecha}` : textoPendiente}
        </span>
      </div>
      {accion}
    </div>
  );
}

export function VentasVista({ d }: { d: DatosVentas }) {
  const hechos = new Set(d.reembolsados);
  const reembolsosPendientes = d.reembolsos.filter((r) => !hechos.has(r.user_id));
  const porAtender = d.peticiones.filter((p) => p.estado !== 'cancelada');
  const totalSubs = d.activas + d.canceladas + d.reembolsadas + d.sinAcceso || 1;
  const segmentos = [
    { etiqueta: 'Activas', valor: d.activas, color: 'var(--an-eye)' },
    { etiqueta: 'Canceladas', valor: d.canceladas, color: 'var(--accent)' },
    { etiqueta: 'Reembolsadas', valor: d.reembolsadas, color: 'var(--an-question)' },
    { etiqueta: 'Sin acceso', valor: d.sinAcceso, color: 'var(--an-risk)' },
  ];
  const porHacer = reembolsosPendientes.length + porAtender.length;
  const colorBanner = porHacer > 0 ? 'var(--accent)' : 'var(--an-eye)';

  return (
    <div>
      <div
        className="flex items-center gap-3 rounded-[var(--radius-card)] border p-4"
        style={{
          borderColor: `color-mix(in oklab, ${colorBanner} 45%, transparent)`,
          background: `color-mix(in oklab, ${colorBanner} 10%, transparent)`,
        }}
        role="status"
      >
        <span aria-hidden="true" className="text-2xl">
          {porHacer > 0 ? '⏳' : '✅'}
        </span>
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            {porHacer > 0
              ? `Tienes ${porHacer} ${porHacer === 1 ? 'cosa' : 'cosas'} por hacer`
              : 'Todo al día: no hay reembolsos ni cancelaciones pendientes'}
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            {reembolsosPendientes.length > 0 ? `${reembolsosPendientes.length} por reembolsar` : 'Reembolsos al día'} ·{' '}
            {porAtender.length > 0 ? `${porAtender.length} por cancelar a mano` : 'Cancelaciones al día'}
          </p>
        </div>
      </div>

      <Seccion titulo="Tus suscripciones ahora mismo">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Tarjeta
            icono="✅"
            etiqueta="Activas"
            valor={d.activas}
            insight={`${d.mensuales} mensual · ${d.anuales} anual${d.cortesias > 0 ? ` · ${d.cortesias} cortesía` : ''}`}
            tono="bien"
          />
          <Tarjeta icono="🚪" etiqueta="Canceladas" valor={d.canceladas} insight="Ya no se les cobrará" />
          <Tarjeta icono="💸" etiqueta="Reembolsadas" valor={d.reembolsadas} />
          <Tarjeta icono="⛔" etiqueta="Sin acceso" valor={d.sinAcceso} insight="Compra sin completar o caducada" tono={d.sinAcceso > 0 ? 'alerta' : 'normal'} />
        </div>
        <div className="mt-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_22%,transparent)] bg-[var(--surface)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Cómo se reparten</p>
          <div
            className="mt-3 flex h-4 w-full overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--text-tertiary)_15%,transparent)]"
            role="img"
            aria-label={segmentos.map((s) => `${s.etiqueta}: ${s.valor}`).join(', ')}
          >
            {segmentos
              .filter((s) => s.valor > 0)
              .map((s) => (
                <div key={s.etiqueta} style={{ width: `${(s.valor / totalSubs) * 100}%`, background: s.color }} />
              ))}
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--text-secondary)]">
            {segmentos.map((s) => (
              <li key={s.etiqueta} className="flex items-center gap-1.5">
                <span aria-hidden="true" className="size-2 rounded-full" style={{ background: s.color }} />
                {s.etiqueta} <span className="font-semibold text-[var(--text-primary)]">{s.valor}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-[var(--text-tertiary)]">El dinero y las ventas exactas se ven en Hotmart → Ventas.</p>
        </div>
      </Seccion>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
        <Seccion titulo="Reembolsos">
          {d.reembolsos.length === 0 ? (
            <SinDatos>Nadie ha pedido reembolso todavía.</SinDatos>
          ) : (
            <div className="flex flex-col gap-3">
              {d.reembolsos.map((r) => {
                const hecho = hechos.has(r.user_id);
                return (
                  <FilaPeticion
                    key={r.id}
                    correo={r.email}
                    fecha={fechaCorta(r.requested_at)}
                    hecha={hecho}
                    textoHecha="Reembolsado"
                    textoPendiente="Por reembolsar"
                    accion={!hecho ? <BotonReembolsar peticionId={r.id} correo={r.email} /> : undefined}
                  />
                );
              })}
            </div>
          )}
        </Seccion>
        </div>

        <div>
        <Seccion titulo="Cancelaciones">
          {d.peticiones.length === 0 ? (
            <SinDatos>Nadie ha pedido cancelar todavía.</SinDatos>
          ) : (
            <div className="flex flex-col gap-3">
              {d.peticiones.map((p) => (
                <FilaPeticion
                  key={p.id}
                  correo={p.email}
                  fecha={fechaCorta(p.requested_at)}
                  hecha={p.estado === 'cancelada'}
                  textoHecha="Cancelada en Hotmart"
                  textoPendiente="Por cancelar a mano"
                  accion={p.estado !== 'cancelada' ? <p className="text-xs text-[var(--text-secondary)]">{p.detalle ?? 'sin detalle'}</p> : undefined}
                />
              ))}
            </div>
          )}
        </Seccion>
        </div>
      </div>

      <Seccion titulo="Cancelaciones: por decisión propia vs por tarjeta rechazada">
        <SinDatos>
          Sin datos — se calcula del estado de las suscripciones tras conectar Hotmart. Se separan porque se arreglan
          distinto: cuando alguien decide irse, se recupera mostrándole valor de nuevo; cuando le falla la tarjeta, se
          recupera con reintentos automáticos de cobro (lo que en inglés se llama dunning
          <Glosa termino="dunning">
            reintentos automáticos de cobro y un aviso para que actualice su tarjeta — antes de darla de baja del
            todo.
          </Glosa>
          ) y un aviso para que actualice su tarjeta.
        </SinDatos>
      </Seccion>

      <Seccion titulo="Cuánto vale cada clienta y cuánto cuesta conseguirla">
        <SinDatos>
          Sin datos — el LTV
          <Glosa termino="LTV">
            "Lifetime Value": cuánto dinero deja en total una clienta durante todo el tiempo que se queda pagando.
          </Glosa>{' '}
          y el CAC
          <Glosa termino="CAC">
            "Costo de Adquisición de Clientes": cuánto cuesta en publicidad conseguir a cada nueva clienta que paga.
          </Glosa>{' '}
          necesitan al menos un par de meses de ventas reales, y el CAC además requiere que ingreses el gasto en
          publicidad por canal. La ganancia real se calcula descontando Hotmart, afiliados, impuestos, el costo de IA
          (ya se está midiendo en "Costo de IA") e infraestructura de lo que factures. Todo esto se activa solo
          cuando haya datos de verdad — nunca se muestra un número inventado.
        </SinDatos>
      </Seccion>
    </div>
  );
}
