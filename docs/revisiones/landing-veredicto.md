# VEREDICTO revisor-visual — landing
Fecha: 2026-09-12 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 37/40
Craft: 17/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: 1) Oferta → los CTA de Anual y Mensual repiten el mismo texto ("Descifrar mi primera conversación") sin señal de cuál plan se está eligiendo → fix: variar el label por plan o confirmar el plan elegido en el siguiente paso. 2) Oferta → Mensual: el CTA es un <a> con estilo outline hecho a mano (no reutiliza <CtaButton>) mientras Anual sí lo usa → fix: extraer una variante 'outline' del mismo componente para no duplicar markup. 3) Header "Entrar" y todos los CTA apuntan a /entrar y /onboarding, que aún no existen (esperado por la secuencia del SO, no bloqueante hoy) → fix: nada por ahora, verificar antes de publicar. 4) Franja de prueba social bajo el hero es solo mecánica de oferta ("3 días gratis · sin cobros por mensaje · cancela cuando quieras"), sin ninguna cifra o testimonio real de uso → fix: sumar una métrica/testimonio real en cuanto exista. 5) SectionShell solo alterna base/elevada (2 niveles); no hay una superficie realmente "hundida" en la página → fix: opcional, dar un tratamiento inset a un elemento secundario (p. ej. el desglose de precio) para completar el sistema de 3 niveles.
