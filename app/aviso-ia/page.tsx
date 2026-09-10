import { PaginaLegal } from '@/components/legal/PaginaLegal';

export const metadata = { title: 'Aviso sobre la IA — LUMA' };

export default function Page() {
  return (
    <PaginaLegal titulo="Aviso sobre la IA">
      <p>Esta página está en preparación.</p>
      <p>
        LUMA es una herramienta de bienestar emocional. No sustituye terapia ni consejo profesional.
        Solo para mayores de 18 años.
      </p>
    </PaginaLegal>
  );
}
