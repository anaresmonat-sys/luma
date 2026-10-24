# Experimento de 2 semanas: «Tarot del día» como puerta de entrada a LUMA

Fecha del plan: 2026-10-24 · Estado: PLAN (nada construido todavía)

## La pregunta que responde
¿El tarot trae gente nueva a LUMA y esa gente acaba probando Descifrar o el coach y pagando? Si la respuesta es sí, tiene sentido una app de tarot aparte; si es no, nos ahorramos meses.

## Qué se construiría (pequeño)
Una página pública y gratis: **tuluma.app/tarot-del-dia**
- Sin registro. La persona toca una carta, ve su significado y una frase del día.
- **Coste de IA cero:** usa la carta del día que ya existe en el código (sin llamar a la IA).
- Debajo de la carta, **un solo botón**: «Descifra una conversación gratis» → lleva a LUMA (primera lectura gratis).
- Texto que NO promete adivinar el futuro (la prueba automática de promesas lo vigila).
- Medición con los eventos que la web ya sabe contar (visita, toque en la carta, toque en el botón) + 3 eventos nuevos.

Trabajo estimado: medio día de programación + revisión visual.

## Cómo se consigue gente (sin pagar anuncios)
1. 3 vídeos cortos por semana (TikTok / Reels / Shorts): «tu carta de hoy», con el enlace en la biografía.
2. Una publicación diaria en historias con la carta del día.
3. La página se posiciona sola en buscadores para «tarot del día» (ya hay sitemap).
Meta de tiempo para ti: 20 minutos al día. Los guiones los preparo yo.

## Qué medimos (todo en Admin)
| Dato | Qué dice |
|---|---|
| Visitas a /tarot-del-dia | Si el tema atrae |
| % que toca la carta | Si la página engancha |
| % que toca «Descifra una conversación» | Si el tarot lleva a LUMA |
| Primeras lecturas hechas | Si pasan de curiosos a usuarios |
| Pruebas gratis empezadas y pagos | Lo que de verdad importa |

## Cuándo decidimos (día 14)
- **Sí a una app de tarot aparte** si hay más de 1.000 visitas, al menos un 15 % pasa a LUMA y hay pruebas gratis o pagos que vengan de ahí.
- **Seguir solo con LUMA y usar el tarot como imán** si hay visitas pero casi nadie pasa a LUMA.
- **Descartar** si no llegan ni 300 visitas con constancia en redes.

Estos umbrales son una propuesta para decidir con números y no con ganas; se pueden ajustar antes de empezar.

## Presupuesto
- IA: 0 $ (la página no llama a la IA).
- Servidor: ya incluido en el plan actual.
- Anuncios: 0 $ en estas dos semanas.
- Tu tiempo: ~20 min al día.

## Riesgos
- Tráfico que llega y no convierte: por eso medimos el paso a LUMA, no solo las visitas.
- Copiar palabras que prometan el futuro: se evita con el mismo texto prudente de LUMA.
- Que LUMA aún no esté lista para recibir más gente: por eso esto va **después** de publicar los cambios pendientes y de pasar a Vercel Pro (que cuesta 20 $ y evita que la web se pause si llega mucha gente).

## Orden recomendado
1. Cerrar lo pendiente de LUMA (Pedro, compra de prueba del anual, Vercel Pro).
2. Construir la página (medio día).
3. 14 días de publicaciones.
4. Decidir el día 14 con los números.
