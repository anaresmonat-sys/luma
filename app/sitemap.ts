import type { MetadataRoute } from 'next';

const BASE = 'https://www.tuluma.app';
const RUTAS = ['/', '/privacidad', '/terminos', '/cookies', '/reembolsos', '/aviso-ia'];

export default function sitemap(): MetadataRoute.Sitemap {
  return RUTAS.map((ruta) => ({ url: `${BASE}${ruta}`, lastModified: new Date('2026-10-20') }));
}
