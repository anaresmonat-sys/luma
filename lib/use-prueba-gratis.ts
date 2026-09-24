'use client';

// Estado de la prueba gratis para PINTAR avisos ANTES de que la persona escriba
// (guía de conversión: el límite del plan gratis se avisa antes de trabajar, no
// después). localStorage solo existe en el navegador, así que arranca en `true`
// —lo mismo que calcularía el servidor— y se corrige tras montar, para no romper
// la hidratación. La verdad final la decide el servidor (lib/prueba-servidor.ts).

import { useCallback, useEffect, useState } from 'react';
import { pruebaGratisDisponible } from '@/lib/prueba-gratis';

export function usePruebaDisponible() {
  const [disponible, setDisponible] = useState(true);
  const refrescar = useCallback(() => setDisponible(pruebaGratisDisponible()), []);
  useEffect(() => {
    refrescar();
  }, [refrescar]);
  return { disponible, refrescar };
}
