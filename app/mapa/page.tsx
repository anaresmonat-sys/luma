// Enlace corto para la campaña de redes: tuluma.app/mapa lleva directo al Mapa de poder (conserva el código ?f= de origen).
import { redirect } from 'next/navigation';

export default async function MapaCorto({ searchParams }: { searchParams: Promise<{ f?: string }> }) {
  const { f } = await searchParams;
  redirect('/app/mapa-poder' + (f ? `?f=${encodeURIComponent(f)}` : ''));
}
