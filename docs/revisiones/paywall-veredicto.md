# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-11 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 30/40
Craft: 14/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Top defectos:
1. [docs/revisiones/paywall-mensual-seleccionado.png, franja media] El header sticky (X + LUMA) aparece duplicado y superpuesto sobre "Todo LUMA, sin límites" del timeline — la evidencia no es confiable tal como está (patrón típico de captura full-page con `position: sticky` que se repite en cada "pliegue" del stitching). Fix: recapturar con el header neutralizado durante el full-page shot o con captura de un solo viewport, y confirmar en dispositivo/emulador real que no ocurre en producción.
2. [Toda la pantalla] Ninguno de los 3 dispositivos ownable que FICHA-ARTE ya estableció para LUMA (carta de tarot flotante con resplandor, círculos de emoción, ítems del analizador con color propio) aparece en el paywall — la identidad se apoya solo en dorado + serif, y la pantalla podría pasar por la de cualquier app de suscripción cálida. Fix: sumar al menos 1 detalle firma (ej. una mini-carta de pergamino junto al headline o el resplandor ámbar del objeto héroe) para anclar visualmente "esto es LUMA".
3. [Franja de confianza bajo el CTA] "Pago seguro con Hotmart · [ícono] la Garantía de Calma de 7 Días" — el "la" inicial suelto después del separador "·" lee como oración cortada/typo. Fix: cambiar a "Garantía de Calma de 7 días" (sin el "la", minúscula en "días" para consistencia con el resto del copy).
4. [Value stack + footer de confianza] El resto de la app usa EMOJI como sistema de íconos (decisión explícita de FICHA-ARTE, ronda #4), pero el paywall usa solo íconos Lucide (Lock, ShieldCheck, Star, Check) que no están en la lista de "glifos de cromo" exentos — inconsistencia de lenguaje visual entre pantallas de la misma app. Fix: decidir y documentar en FICHA-ARTE si el paywall es una excepción (como los glifos de cromo) o migrar Star/Lock/ShieldCheck a la iconografía emoji del resto de la app.
5. [Heurística 9 + enlace "Restaurar compra"] No existe ningún estado de error diseñado ni en código (pago rechazado, fallo de webhook Hotmart) — aceptable por fase, pero hoy la pantalla no comunica nada si algo falla; además "Restaurar compra" enlaza a `/entrar` (login) sin ninguna lógica de restauración real, lo que puede generar una expectativa que la pantalla no cumple. Fix: diseñar el copy del estado de error antes de conectar Hotmart real (Sesión 6) y aclarar/renombrar el destino de "Restaurar compra" mientras no exista lógica real detrás.
