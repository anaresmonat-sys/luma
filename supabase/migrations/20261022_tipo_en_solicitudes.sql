-- Aplicada en producción el 2026-10-22. Distingue las peticiones de cancelación de las de reembolso.
alter table public.cancel_requests add column if not exists tipo text not null default 'cancelacion' check (tipo in ('cancelacion','reembolso'));
