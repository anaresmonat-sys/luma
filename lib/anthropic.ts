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
