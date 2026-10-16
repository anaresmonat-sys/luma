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

import { useCallback, useEffect, useRef, useState } from 'react';
import { pruebaGratisDisponible } from '@/lib/prueba-gratis';
import { modoPersonaNueva } from '@/lib/modo-revision';

export function usePruebaDisponible() {
  const [disponible, setDisponible] = useState(true);
  // null = todavía no sabemos si hay plan: en ese caso no se pinta ningún aviso (evita que
  // alguien con plan vea un instante "Tu primer resultado es gratis", que sería falso).
  const [conPlan, setConPlan] = useState<boolean | null>(null);
  // Si la cuenta tiene plan, "refrescar" (se llama tras cada respuesta de la IA) NO debe volver a cerrar la
  // puerta: antes, al gastar la marca local de la primera lectura gratis, la caja de escribir pasaba a
  // "Elige tu plan para seguir…" aunque la persona ya pagara (defecto real, 2026-10-16).
  const conPlanRef = useRef(false);
  const refrescar = useCallback(() => setDisponible(conPlanRef.current || pruebaGratisDisponible()), []);
  useEffect(() => {
    refrescar();
    let cancelado = false;
    fetch('/api/mi-plan')
      .then((r) => (r.ok ? r.json() : null))
      .then((datos: { activo?: boolean } | null) => {
        if (cancelado) return;
        // Modo revisión de la dueña: se ve como una persona nueva aunque tenga acceso completo.
        const activo = Boolean(datos?.activo) && !modoPersonaNueva();
        conPlanRef.current = activo;
        if (activo) setDisponible(true);
        setConPlan(activo);
      })
      .catch(() => {
        // Sin conexión o fallo: se queda con lo que ya calculó localStorage.
        if (!cancelado) setConPlan(false);
      });
    return () => {
      cancelado = true;
    };
  }, [refrescar]);
  return { disponible, conPlan, refrescar };
}
