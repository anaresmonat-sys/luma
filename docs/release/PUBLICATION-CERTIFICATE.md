# PUBLICATION-CERTIFICATE (2026-10-20)

Estado: **NO CERTIFICADA la cadena GitHub → Vercel → dominio**: el conector de Vercel no ve el proyecto, así que no se pudo comprobar despliegue, variables de entorno ni plan.

Comprobado desde fuera: tuluma.app y www.tuluma.app responden 200 con HTTPS y cabeceras de seguridad; los cambios de la dueña se ven en producción tras cada "publica" (último verificado: f7f2d4a).
Pendiente: confirmar en Vercel (a) rama de producción = main, (b) variables SUPABASE_URL / SUPABASE_SECRET_KEY / ANTHROPIC / HOTMART_HOTTOK / HOTMART_PRODUCT_ID definidas, (c) PRUEBA_SERVIDOR NO está en "off", (d) plan que permita uso comercial, (e) que `/api/version` devuelva el commit esperado tras publicar.
Commits locales sin publicar: 1252fd5 y los cambios del examen.
