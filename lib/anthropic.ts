// Cliente de IA compartido — SOLO se importa desde código de servidor (rutas
// app/api/**), nunca desde un componente 'use client'. La clave vive en
// ANTHROPIC_API_KEY (env var de servidor, ver docs/sistema/09-SEGURIDAD.md y
// 30-INTEGRACION-IA.md — patrón BFF, jamás en el frontend).

import Anthropic from '@anthropic-ai/sdk';

export const AI_MODEL = process.env.AI_MODEL || 'claude-sonnet-5';

let cliente: Anthropic | null = null;

export function clienteAnthropic(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY no configurada');
  }
  if (!cliente) {
    cliente = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return cliente;
}

/** Regla de idioma que se añade al final de CADA prompt de sistema: la IA hablaba a veces en argentino (voseo: «vos», «tenés»). */
export const REGLA_DE_IDIOMA = `

IDIOMA Y TRATO (regla obligatoria, manda sobre cualquier otro estilo): escribe en español latino neutro y trata a la persona de TÚ («tú tienes», «puedes», «mira», «cuéntame»). JAMÁS uses voseo ni formas argentinas o rioplatenses: nada de «vos», «tenés», «podés», «querés», «sabés», «sos», «mirá», «decime», «contame», «pensá», «andá», «che». Evita también regionalismos de un solo país («plata» o «lana» por dinero, «parce», «órale», «guay», «chévere»). Si la persona escribe con voseo, no la imites: sigue con tuteo neutro.`;

/** Descifrar: igual que la regla general, salvo el texto sugerido para ENVIAR, que debe sonar natural en el dialecto de la conversación. */
export const REGLA_DE_IDIOMA_DESCIFRAR = `${REGLA_DE_IDIOMA}

Excepción única: en el texto sugerido para enviar («qué responder») usa el mismo registro y dialecto que la conversación pegada (si ella y la otra persona se tutean de una forma concreta, respétala), para que el mensaje suene natural viniendo de ella. Tu propia voz hacia la persona usuaria sigue siendo tuteo neutro.`;
