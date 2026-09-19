// Mapa de Poder (numerología + arcano personal) en Supabase — extiende la
// tabla `profiles` ya existente (una fila por usuaria, RLS activo) en vez de
// crear una tabla nueva. Antes vivía solo en localStorage (no sobrevivía a
// cambiar de celular); pedido explícito del usuario, 2026-09-18: "conéctalo a
// Supabase". Se usa SOLO si hay sesión real — sin sesión, sigue funcionando
// igual que antes en localStorage (el login no es obligatorio todavía).

import { crearClienteNavegador } from './client';
import type { MapaPoder } from '@/lib/almacenamiento-numerologia';

export async function leerPerfilSupabase(userId: string): Promise<MapaPoder | null> {
  const supabase = crearClienteNavegador();
  const { data } = await supabase
    .from('profiles')
    .select(
      'nombre, fecha_nacimiento, numero_vida, arcano_id, arcano_nombre, signo_id, signo_nombre, numero_expresion, numero_alma, arquetipo, superpoder, punto_ciego, consejo'
    )
    .eq('id', userId)
    .maybeSingle();

  if (!data || !data.arcano_nombre || data.numero_vida === null) return null;

  return {
    nombre: data.nombre ?? '',
    fecha: data.fecha_nacimiento ?? '',
    numero: data.numero_vida,
    arcanoId: data.arcano_id ?? '',
    arcanoNombre: data.arcano_nombre,
    signoId: data.signo_id ?? '',
    signoNombre: data.signo_nombre ?? '',
    numeroExpresion: data.numero_expresion ?? 0,
    numeroAlma: data.numero_alma ?? 0,
    arquetipo: data.arquetipo ?? '',
    superpoder: data.superpoder ?? '',
    puntoCiego: data.punto_ciego ?? '',
    consejo: data.consejo ?? '',
  };
}

export async function guardarPerfilSupabase(userId: string, mapa: MapaPoder): Promise<void> {
  const supabase = crearClienteNavegador();
  await supabase
    .from('profiles')
    .update({
      nombre: mapa.nombre,
      fecha_nacimiento: mapa.fecha,
      numero_vida: mapa.numero,
      arcano_id: mapa.arcanoId,
      arcano_nombre: mapa.arcanoNombre,
      signo_id: mapa.signoId,
      signo_nombre: mapa.signoNombre,
      numero_expresion: mapa.numeroExpresion,
      numero_alma: mapa.numeroAlma,
      arquetipo: mapa.arquetipo,
      superpoder: mapa.superpoder,
      punto_ciego: mapa.puntoCiego,
      consejo: mapa.consejo,
    })
    .eq('id', userId);
}
