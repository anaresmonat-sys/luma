// SUGERENCIAS — lo que escriben las clientas desde Más → «Enviar una sugerencia». Las nuevas arriba; se marcan como leídas.

import { revalidatePath } from 'next/cache';
import { crearClienteServidor } from '@/lib/supabase/server';
import { Tarjeta, Seccion, SinDatos } from '@/components/admin/Tarjeta';

export const dynamic = 'force-dynamic';

const ETIQUETA_TIPO: Record<string, string> = { mejora: 'Mejora', falta: 'Echa en falta', falla: 'Algo falla', otro: 'Otra cosa' };

async function marcarLeida(formData: FormData) {
  'use server';
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  const supabase = await crearClienteServidor();
  await supabase.from('sugerencias').update({ estado: 'leida' }).eq('id', id);
  revalidatePath('/admin/sugerencias');
}

export default async function AdminSugerenciasPage() {
  const supabase = await crearClienteServidor();
  const { data, error } = await supabase
    .from('sugerencias')
    .select('id, email, tipo, mensaje, estado, created_at')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    return (
      <Seccion titulo="Sugerencias">
        <SinDatos>No se pudieron leer las sugerencias: {error.message}</SinDatos>
      </Seccion>
    );
  }
  const lista = data ?? [];
  const nuevas = lista.filter((s) => s.estado === 'nueva').length;

  return (
    <div>
      <Seccion titulo="Sugerencias de las clientas">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Tarjeta icono="💬" etiqueta="Sin leer" valor={nuevas} tono={nuevas > 0 ? 'alerta' : 'normal'} />
          <Tarjeta icono="🗂️" etiqueta="Recibidas" valor={lista.length} />
        </div>
      </Seccion>
      <Seccion titulo="Mensajes">
        {lista.length === 0 ? (
          <SinDatos>Todavía no hay sugerencias. Aparecerán aquí cuando alguien las envíe desde la app.</SinDatos>
        ) : (
          <div className="flex flex-col gap-2">
            {lista.map((s) => (
              <div key={s.id} className="rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_22%,transparent)] bg-[var(--surface)] p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                  {ETIQUETA_TIPO[s.tipo] ?? s.tipo} · {new Date(s.created_at).toLocaleString('es', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  {s.estado === 'nueva' && <span className="ml-2 text-[var(--accent-lite)]">NUEVA</span>}
                </p>
                <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-[var(--text-primary)]">{s.mensaje}</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="text-xs text-[var(--text-secondary)]">{s.email ?? 'sin correo'}</span>
                  {s.estado === 'nueva' && (
                    <form action={marcarLeida}>
                      <input type="hidden" name="id" value={s.id} />
                      <button type="submit" className="min-h-11 text-sm font-semibold text-[var(--accent-lite)] underline underline-offset-2">
                        Marcar como leída
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Seccion>
    </div>
  );
}
