# PRIVACY-DATA-MAP — qué datos se guardan y dónde (2026-10-20)

| Dato | Dónde | Quién lo ve | Notas |
|---|---|---|---|
| Correo, sesión | Supabase Auth | solo la persona (RLS) y la admin | enlace de acceso por correo (Resend) |
| Perfil, signo, fecha de nacimiento | tablas de perfil | solo la persona | RLS con `(select auth.uid())` |
| Diario, lecturas guardadas | tablas propias | solo la persona | borrables |
| Conversación pegada en Descifrar | NO se guarda | — | se envía a Anthropic para el análisis; el log no guarda el texto |
| Textos que se envían a la IA (tarot, coach, diario) | Anthropic (procesador) | — | avisado en /aviso-ia |
| Pagos | Hotmart (procesador); aquí solo estado del plan y libro de transacciones | admin | sin datos de tarjeta |
| Eventos de uso | `log-event` (vocabulario cerrado) | admin | sin texto libre |
| Confirmación de edad | localStorage del navegador | — | ⚠️ no es prueba legal de consentimiento (Gate 4) |

Borrado de cuenta: existe (`/api/cuenta/eliminar`, en cascada). Exportación de datos: NO existe todavía.
Encargados: Supabase (EE. UU./UE a confirmar), Anthropic, Vercel, Hotmart, Resend.
