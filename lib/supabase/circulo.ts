// "El Círculo" en Supabase (tabla `circulo_perfiles`, varias filas por
// usuaria — a diferencia del Mapa de Poder propio, que vive en `profiles`).
// Se usa SOLO con sesión real; sin sesión, El Círculo sigue funcionando en
// localStorage igual que el resto de la app antes de conectar Hotmart/login.

import { crearClienteNavegador } from './client';
import type { PersonaCirculo } from '@/lib/almacenamiento-circulo';

interface FilaCirculo {
  id: string;
  nombre: string;
  fecha_nacimiento: string;
  numero_vida: number;
  arcano_id: string;
  arcano_nombre: string;
  signo_id: string;
  signo_nombre: string;
  numero_expresion: number;
  numero_alma: number;
  arquetipo: string;
  superpoder: string;
  punto_ciego: string;
  consejo: string;
}

function filaAPersona(f: FilaCirculo): PersonaCirculo {
  return {
    id: f.id,
    nombre: f.nombre,
    fecha: f.fecha_nacimiento,
    numero: f.numero_vida,
    arcanoId: f.arcano_id,
    arcanoNombre: f.arcano_nombre,
    signoId: f.signo_id,
    signoNombre: f.signo_nombre,
    numeroExpresion: f.numero_expresion,
    numeroAlma: f.numero_alma,
    arquetipo: f.arquetipo,
    superpoder: f.superpoder,
    puntoCiego: f.punto_ciego,
    consejo: f.consejo,
  };
}

export async function leerCirculoSupabase(userId: string): Promise<PersonaCirculo[]> {
  const supabase = crearClienteNavegador();
  const { data } = await supabase
    .from('circulo_perfiles')
    .select(
      'id, nombre, fecha_nacimiento, numero_vida, arcano_id, arcano_nombre, signo_id, signo_nombre, numero_expresion, numero_alma, arquetipo, superpoder, punto_ciego, consejo'
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return (data ?? []).map(filaAPersona);
}

/** Devuelve el registro insertado (con el id real de Supabase, distinto del id local temporal). */
export async function agregarAlCirculoSupabase(
  userId: string,
  persona: Omit<PersonaCirculo, 'id'>
): Promise<PersonaCirculo | null> {
  const supabase = crearClienteNavegador();
  const { data } = await supabase
    .from('circulo_perfiles')
    .insert({
      user_id: userId,
      nombre: persona.nombre,
      fecha_nacimiento: persona.fecha,
      numero_vida: persona.numero,
      arcano_id: persona.arcanoId,
      arcano_nombre: persona.arcanoNombre,
      signo_id: persona.signoId,
      signo_nombre: persona.signoNombre,
      numero_expresion: persona.numeroExpresion,
      numero_alma: persona.numeroAlma,
      arquetipo: persona.arquetipo,
      superpoder: persona.superpoder,
      punto_ciego: persona.puntoCiego,
      consejo: persona.consejo,
    })
    .select(
      'id, nombre, fecha_nacimiento, numero_vida, arcano_id, arcano_nombre, signo_id, signo_nombre, numero_expresion, numero_alma, arquetipo, superpoder, punto_ciego, consejo'
    )
    .single();

  return data ? filaAPersona(data) : null;
}

export async function quitarDelCirculoSupabase(userId: string, id: string): Promise<void> {
  const supabase = crearClienteNavegador();
  await supabase.from('circulo_perfiles').delete().eq('id', id).eq('user_id', userId);
}
