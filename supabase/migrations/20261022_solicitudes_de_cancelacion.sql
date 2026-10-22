-- Aplicada en producción el 2026-10-22. Guarda la hora exacta en que alguien pide cancelar (prueba ante disputas)
-- y el código de suscriptora de Hotmart para cancelar por API.
alter table public.subscriptions add column if not exists hotmart_subscriber_code text;

create table if not exists public.cancel_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text,
  requested_at timestamptz not null default now(),
  estado text not null default 'pendiente' check (estado in ('pendiente','cancelada','manual','error')),
  detalle text,
  resolved_at timestamptz
);
create index if not exists cancel_requests_user_id_idx on public.cancel_requests (user_id, requested_at desc);
alter table public.cancel_requests enable row level security;
create policy cancel_requests_select_propias on public.cancel_requests for select to authenticated using (user_id = (select auth.uid()));
