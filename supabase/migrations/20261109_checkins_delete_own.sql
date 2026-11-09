-- Aplicada en producción el 2026-11-09 (con el OK de la dueña).
-- Cada persona puede borrar SOLO sus propios registros de ánimo: lo usa el botón «Deshacer» de Inicio (5 s tras guardar).
create policy delete_own on public.checkins
  for delete
  to public
  using ((select auth.uid()) = user_id);
