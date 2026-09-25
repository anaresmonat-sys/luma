'use client';

// Cuenta UNA visita a una pantalla del camino de compra (página de ventas,
// recorrido de inicio, planes). Sin cookies ni identificadores: solo suma un
// número en event_log, que el panel de administración muestra como embudo.

import { useEffect } from 'react';
import { registrarEventoUnaVez } from '@/lib/registrar-evento';

export function MedirVista({ tipo }: { tipo: string }) {
  useEffect(() => {
    registrarEventoUnaVez(tipo);
  }, [tipo]);
  return null;
}
