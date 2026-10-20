// Dice qué versión del código está publicada (para comprobar que lo que se ve en internet es lo último que se subió).
export const dynamic = 'force-dynamic';

export function GET() {
  return Response.json({ commit: (process.env.VERCEL_GIT_COMMIT_SHA ?? 'local').slice(0, 7), entorno: process.env.VERCEL_ENV ?? 'local' });
}
