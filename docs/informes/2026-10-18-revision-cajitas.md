# Informe de revisión de botones y enlaces — LUMA (2026-10-18)

Alcance: página de ventas, entrada, planes, puerta de edad e interior de la app. Probado a 375px con un navegador real (servidor local), más comprobaciones directas sobre tuluma.app.

## 🔴 Urgente
1. **La IA falla en la web real.** Descifrar, Tarot y Sinergia zodiacal responden error 502 en tuluma.app (probado hoy con una llamada de cada una). En mi entorno local la causa exacta es «invalid x-api-key» (la clave de la IA ya no es válida; tiene el formato correcto y nunca se subió a GitHub). Lo más probable es que la clave de producción sea la misma o esté igual de caducada. No pude leer los registros de Vercel (el conector no ve el proyecto), así que la causa en producción es una inferencia, no una certeza.
   - Qué hacer (sin pegar claves en el chat): en console.anthropic.com revisar que la clave exista y esté activa y que haya saldo; crear una nueva si hace falta; copiarla directo en Vercel → Settings → Environment Variables → `ANTHROPIC_API_KEY` (y en `.env.local`); volver a publicar.

## 🟠 Errores encontrados
2. **Enlace de Hotmart roto en «Cómo cancelar» y en «Reembolsos»:** `hotmart.com/es/sign-in` da 404. Una clienta que quiera cancelar llega a una página de error. El acceso correcto para compradoras es `consumer.hotmart.com`. Aparece en `app/app/cancelar/page.tsx` (2 sitios) y `app/reembolsos/page.tsx`.
3. **(Ya arreglado y publicado) «Ver mi análisis completo»** de la calculadora de signos llevaba a «Descifrar». Ahora lleva a Sinergia con los dos signos puestos.

## 🟡 Mejoras recomendadas
4. En **Más**, «Ayuda y soporte» solo muestra «próximamente», pero el correo de soporte ya existe. Debería abrir `mailto:soporte@tuluma.app`.
5. En la página de ventas, **«Empezar con el plan anual / mensual»** llevan al recorrido gratuito (Descifrar), no a los planes. Es coherente con «primera lectura gratis», pero la persona que pulsa «plan mensual» quizá espere llegar al pago.

## ✅ Lo que funciona
- 21 pantallas abren sin error y los 25 enlaces internos únicos responden 200. Sin anclas rotas.
- Enlaces de pago de Hotmart (mensual y anual): abren el checkout correctamente.
- Página de ventas: botón principal, 4 píldoras (Conversación, Tarot, Coach, Diario), carrusel (flechas y puntos), preguntas frecuentes (abren y cierran), planes, pie legal y correo de soporte.
- Planes: elegir Anual/Mensual cambia la selección; el botón abre el pago de Hotmart.
- Puerta de edad: casilla, aviso, botón y paso a la función elegida.
- Inicio: estados de ánimo se marcan y guardan; enlaces a Tarot, Descifrar, Coach y pestañas correctos.
- Coach: chips y envío presentes. Diario: ánimos, guardar y «Ver mi patrón». Descifrar: texto/captura, «Probar con un ejemplo» rellena, «Analizar» avisa si falta texto.
- Compatibilidad: elegir signos, el botón se habilita solo con los dos, y llega con los signos desde la página de ventas.

## No revisado a fondo
Mapa de poder, Círculo, Historial del diario, «Cancelar» y las pantallas de administración: abren (200) pero no pulsé todos sus botones. Tampoco probé el resultado real de las lecturas de IA por el fallo anterior.

## Segunda pasada (2026-10-18, tarde): Mapa de poder, Círculo, Historial y Cancelar
- **Mapa de poder:** el botón «Descubrir mi Arcano» solo se activa con nombre y fecha; si la IA falla muestra «No se pudo calcular — inténtalo de nuevo» (probado con la IA caída en local).
- **Círculo:** «+ Agregar a alguien» abre el formulario; el botón solo se activa con nombre y fecha; mismo mensaje de error. Solo se llega desde el resultado del Mapa de poder (por diseño).
- **Historial del diario (ARREGLADO, sin publicar):** sin sesión mostraba «No se pudo cargar tu historial» + «Reintentar», que nunca podía funcionar (la API responde 401). Ahora dice «Entra con tu correo para ver tu historial» con botón «Entrar con mi correo».
- **Cancelar:** instrucciones claras, botón «Ir al portal de Hotmart» (consumer.hotmart.com, pestaña nueva) y correo de soporte. No pude comprobar dentro del portal que exista la sección «Mis compras» (requiere cuenta de compradora).
