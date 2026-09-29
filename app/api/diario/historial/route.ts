// Historial del diario — trae las entradas de UN día concreto para la persona
// con sesión (docs regla UX #13: fechas reales + navegación entre períodos, no
// "solo el período actual"). RLS (select_own) ya limita cada quien a lo suyo;
// esta ruta solo añade el filtro por fecha, que no se puede expresar en el
// select directo del cliente sin duplicar la zona horaria en dos sitios.

import { NextResponse } from 'next/server';
import { crearClienteServidor } from '@/lib/supabase/server';

export const runtime = 'nodejs';

const REGEX_FECHA = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(request: Request) {
  const supabase = await crearClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const fecha = searchParams.get('fecha') ?? '';
  if (!REGEX_FECHA.test(fecha)) {
    return NextResponse.json({ error: 'Fecha inválida' }, { status: 400 });
  }

  // Rango del día en la zona horaria del navegador de la usuaria (recibida ya
  // como YYYY-MM-DD local) — se compara por texto de fecha, no por horas UTC,
  // para no perder registros de la tarde/noche por el desfase horario.
  const { data, error } = await supabase
    .from('journal_entries')
    .select('id, texto, animo, patron, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'No se pudo leer el historial' }, { status: 502 });
  }

  const entradas = (data ?? []).filter((e) => {
    const local = new Date(e.created_at);
    const claveLocal = `${local.getFullYear()}-${String(local.getMonth() + 1).padStart(2, '0')}-${String(local.getDate()).padStart(2, '0')}`;
    return claveLocal === fecha;
  });

  // Días con al menos una entrada, para que la pantalla pueda marcarlos en el
  // selector de fecha (regla UX #13 — no solo navegar, también saber qué días
  // tienen algo que ver antes de saltar a ciegas).
  const diasConEntradas = Array.from(
    new Set(
      (data ?? []).map((e) => {
        const local = new Date(e.created_at);
        return `${local.getFullYear()}-${String(local.getMonth() + 1).padStart(2, '0')}-${String(local.getDate()).padStart(2, '0')}`;
      })
    )
  );

  return NextResponse.json({ entradas, diasConEntradas });
}
