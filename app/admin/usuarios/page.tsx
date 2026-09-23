// USUARIOS — la lista real de cuentas viene de auth.users vía la API de
// administración (no de `profiles`, que solo se llena cuando alguien completa
// su Mapa de Poder: usar solo profiles subcontaría a quien entró pero nunca
// llegó ahí). Se cruza con profiles (nombre) y subscriptions (plan) para dar
// el estado completo de cada persona.

import { clienteAdminSupabase } from '@/lib/supabase/admin';
import { Tarjeta, Seccion, SinDatos } from '@/components/admin/Tarjeta';
import { FormularioAgregarUsuario } from '@/components/admin/FormularioAgregarUsuario';
import { Glosa } from '@/components/admin/Glosa';

export const dynamic = 'force-dynamic';

function formatearFecha(iso: string | null | undefined): string {
  if (!iso) return 'Sin datos';
  return new Date(iso).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default async function AdminUsuariosPage() {
  const admin = clienteAdminSupabase();

  const [{ data: listado, error }, { data: perfiles }, { data: suscripciones }] = await Promise.all([
    admin.auth.admin.listUsers({ perPage: 200 }),
    admin.from('profiles').select('id, nombre, role, created_at'),
    admin.from('subscriptions').select('user_id, estado, plan'),
  ]);

  const perfilPorId = new Map((perfiles ?? []).map((p: any) => [p.id, p]));
  const suscripcionPorId = new Map((suscripciones ?? []).map((s: any) => [s.user_id, s]));

  const usuarios = (listado?.users ?? [])
    .map((u) => ({
      id: u.id,
      email: u.email ?? 'Sin correo',
      nombre: (perfilPorId.get(u.id) as any)?.nombre ?? '—',
      role: (perfilPorId.get(u.id) as any)?.role ?? 'user',
      creado: u.created_at,
      ultimoAcceso: u.last_sign_in_at,
      estadoPlan: (suscripcionPorId.get(u.id) as any)?.estado ?? 'sin_suscripcion',
    }))
    .sort((a, b) => new Date(b.creado).getTime() - new Date(a.creado).getTime());

  return (
    <div>
      <Seccion titulo="Usuarios">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Tarjeta icono="👥" etiqueta="Total de cuentas" valor={usuarios.length} />
          <Tarjeta
            icono="💳"
            etiqueta="Con plan activo"
            valor={usuarios.filter((u) => u.estadoPlan === 'active').length}
          />
        </div>
      </Seccion>

      <Seccion titulo="Agregar usuario manualmente">
        <FormularioAgregarUsuario />
      </Seccion>

      <Seccion titulo="Lista de usuarios">
        {error && (
          <SinDatos>No se pudo cargar la lista de usuarios: {error.message}</SinDatos>
        )}
        {!error && usuarios.length === 0 && <SinDatos>Todavía no hay ningún usuario registrado.</SinDatos>}
        {!error && usuarios.length > 0 && (
          <div className="overflow-x-auto rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_22%,transparent)]">
            <table className="w-full min-w-[640px] text-left text-[12.5px]">
              <thead>
                <tr className="border-b border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] text-[11px] uppercase tracking-[0.04em] text-[var(--text-tertiary)]">
                  <th className="px-3 py-2.5">Nombre</th>
                  <th className="px-3 py-2.5">Correo</th>
                  <th className="px-3 py-2.5">Plan</th>
                  <th className="px-3 py-2.5">Alta</th>
                  <th className="px-3 py-2.5">Última vez</th>
                  <th className="px-3 py-2.5">
                    <span className="inline-flex items-center">
                      Rol
                      <Glosa termino="Rol">
                        Qué puede hacer esa cuenta: "Usuaria" solo ve su propia app; "Admin" (como tú) puede entrar
                        a este panel privado.
                      </Glosa>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id} className="border-b border-[color-mix(in_oklab,var(--text-tertiary)_10%,transparent)] last:border-0">
                    <td className="px-3 py-2.5 text-[var(--text-primary)]">{u.nombre}</td>
                    <td className="px-3 py-2.5 text-[var(--text-secondary)]">{u.email}</td>
                    <td className="px-3 py-2.5 text-[var(--text-secondary)]">
                      {u.estadoPlan === 'sin_suscripcion' ? 'Sin plan' : u.estadoPlan}
                    </td>
                    <td className="px-3 py-2.5 text-[var(--text-secondary)]">{formatearFecha(u.creado)}</td>
                    <td className="px-3 py-2.5 text-[var(--text-secondary)]">{formatearFecha(u.ultimoAcceso)}</td>
                    <td className="px-3 py-2.5 text-[var(--text-secondary)]">{u.role === 'admin' ? 'Admin' : 'Usuaria'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Seccion>
    </div>
  );
}
