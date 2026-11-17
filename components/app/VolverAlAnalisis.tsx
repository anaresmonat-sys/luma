'use client';

// «← Volver a tu análisis»: aparece en Tarot y en el Coach solo si hay un análisis reciente de Descifrar en esta sesión.
// Resuelve la queja «sales y ya no puedes regresar»: el análisis sigue ahí y se recupera en Descifrar.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { leerUltimoAnalisis } from '@/lib/almacenamiento-analisis';

export function VolverAlAnalisis({ className = '' }: { className?: string }) {
  const [hay, setHay] = useState(false);
  useEffect(() => {
    setHay(leerUltimoAnalisis() !== null);
  }, []);
  if (!hay) return null;
  return (
    <Link
      href="/app/descifrar"
      className={`inline-flex min-h-11 items-center gap-1.5 text-[13px] font-semibold text-[var(--accent-lite)] underline underline-offset-2 ${className}`}
    >
      <span aria-hidden="true">←</span> Volver a tu análisis
    </Link>
  );
}
