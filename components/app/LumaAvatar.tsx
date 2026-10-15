// Avatar de LUMA en la app (cabecera del Coach, saludo del Diario, presentación del Coach).
// Es el retrato de LUMA: ver components/app/LumaRetrato.tsx. Este archivo se mantiene para no tocar
// los sitios donde ya se usa.

import { LumaRetrato } from '@/components/app/LumaRetrato';

export function LumaAvatar({ size = 34 }: { size?: number }) {
  return <LumaRetrato size={size} />;
}
