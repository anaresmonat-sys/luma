'use client';

// Estado de la prueba gratis para PINTAR avisos ANTES de que la persona escriba
// (guía de conversión: el límite del plan gratis se avisa antes de trabajar, no
// después). localStorage solo existe en el navegador, así que arranca en `true`
// —lo mismo que calcularía el servidor— y se corrige tras montar, para no romper
// la hidratación. La verdad final la decide el servidor (lib/prueba-servidor.ts).
//
// Defecto real corregido 2026-09-29: este aviso solo miraba localStorage, que no
// sabe si la cuenta ya tiene un plan real (cortesía o pago de Hotmart) — alguien
// con acceso completo seguía viendo "Ya usaste tu resultado gratis". Ahora, tras
// montar, se le pregunta también a /api/mi-plan; si la cuenta tiene plan, el
// aviso NUNCA se muestra, sin importar lo que diga el navegador.

import { useCallback, useEffect, useState } from 'react';
import { pruebaGratisDisponible } from '@/lib/prueba-gratis';

export function usePruebaDisponible() {
  const [disponible, setDisponible] = useState(true);
  const refrescar = useCallback(() => setDisponible(pruebaGratisDisponible()), []);
  useEffect(() => {
    refrescar();
    let cancelado = false;
    fetch('/api/mi-plan')
      .then((r) => (r.ok ? r.json() : null))
      .then((datos: { activo?: boolean } | null) => {
        if (!cancelado && datos?.activo) setDisponible(true);
      })
      .catch(() => {
        // Sin conexión o fallo: se queda con lo que ya calculó localStorage.
      });
    return () => {
      cancelado = true;
    };
  }, [refrescar]);
  return { disponible, refrescar };
}
