# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-11 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 29/40
Craft: 16/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [app/entrar/page.tsx — input de correo] No hay <form>/onKeyDown: escribir el correo y presionar Enter no hace nada (hay que tocar el botón sí o sí) → envolver input+botón en <form onSubmit> o agregar onKeyDown que dispare enviar() en Enter.
2. [app/paywall/page.tsx líneas 63-71] Los 3 beneficios y la línea "Hecho con tus N respuestas" se pintan primero en versión genérica y cambian de texto milisegundos después (useEffect que lee localStorage tras el primer paint) → parpadeo/salto de contenido visible en cada carga real. Leer localStorage de forma síncrona en el render inicial o mostrar skeleton hasta resolver.
3. [app/entrar/page.tsx — input de correo] Sin <label>/aria-label asociado, solo placeholder que desaparece al escribir → rompe la regla "labels visibles" del sistema. Agregar label visible arriba del input.
4. [components/paywall/PlanCards.tsx] La única señal de plan "seleccionado" es borde/sombra; no hay check o radio explícito → agregar ícono de check en la esquina de la card activa para reconocimiento inequívoco.
5. [header paywall/entrar — span "LUMA"] Usa la fuente body (Hanken Grotesk) en vez de la serif de marca que FICHA-ARTE define para el wordmark ("tracking ~0.3em" en Cormorant Garamond) → aplicar [font-family:var(--font-display)] al wordmark del header.
