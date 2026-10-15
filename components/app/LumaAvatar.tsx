// Avatar de LUMA en la app (cabecera del Coach, saludo del Diario, presentación del Coach): el emblema
// con luna en medallón (components/app/LumaMedallon.tsx). Se dibuja un 30 % más grande que el tamaño
// pedido (decisión de la dueña, 2026-10-15: "un poco más grande"). Este archivo se mantiene para no
// tocar los sitios donde ya se usa.

import { LumaMedallon } from '@/components/app/LumaMedallon';

export function LumaAvatar({ size = 34 }: { size?: number }) {
  return <LumaMedallon size={Math.round(size * 1.3)} luna />;
}
