-- Aplicada en producción el 2026-10-20 (examen pre-lanzamiento). Índices para las claves foráneas user_id.
create index if not exists error_log_user_id_idx on public.error_log (user_id);
create index if not exists payment_transactions_user_id_idx on public.payment_transactions (user_id);
