-- Sugerencias de las clientas desde la app (Más → «Enviar una sugerencia»).
-- Solo se escriben desde el servidor (/api/sugerencia, con la clave de servicio, tras comprobar la sesión);
-- ninguna política de INSERT para clientes. La administradora las lee (y las marca como leídas) desde /admin/sugerencias.
create table if not exists public.sugerencias (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text,
  tipo text not null default 'mejora' check (tipo in ('mejora','falta','falla','otro')),
  mensaje text not null check (char_length(mensaje) between 3 and 1000),
  estado text not null default 'nueva' check (estado in ('nueva','leida')),
  created_at timestamptz not null default now()
);
create index if not exists sugerencias_user_id_idx on public.sugerencias (user_id);
create index if not exists sugerencias_created_at_idx on public.sugerencias (created_at desc);
alter table public.sugerencias enable row level security;
create policy admin_lee_sugerencias on public.sugerencias for select using (is_admin());
create policy admin_actualiza_sugerencias on public.sugerencias for update using (is_admin()) with check (is_admin());
