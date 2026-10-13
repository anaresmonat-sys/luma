// Modo de revisión de la dueña (solo cambia lo que SE VE en su navegador, nunca da
// ni quita acceso real): "verme como persona nueva" hace que las pantallas se
// comporten como si no hubiera plan (aviso de lectura gratis, ritual del Tarot,
// invitación a elegir plan). El servidor sigue tratándola como administradora, así
// que no hay límites ni se gasta nada real. Ver app/app/revision/page.tsx.

const CLAVE_PERSONA_NUEVA = 'luma_modo_persona_nueva';

// Todo lo que hace que el navegador recuerde "ya usaste tu lectura gratis" y similares.
const CLAVES_A_REINICIAR = [
  'luma_prueba_gratis_usada',
  'luma_tiradas_guardadas',
  'luma_onboarding_respuestas',
];

const CLAVE_EDAD = 'luma_edad_confirmada';

export function modoPersonaNueva(): boolean {
  try {
    return window.localStorage.getItem(CLAVE_PERSONA_NUEVA) === '1';
  } catch {
    return false;
  }
}

export function fijarModoPersonaNueva(activo: boolean): void {
  try {
    if (activo) window.localStorage.setItem(CLAVE_PERSONA_NUEVA, '1');
    else window.localStorage.removeItem(CLAVE_PERSONA_NUEVA);
  } catch {
    // localStorage puede fallar (modo privado, cuota) — la pantalla de revisión avisa.
  }
}

export function reiniciarPruebaGratis(): void {
  try {
    for (const clave of CLAVES_A_REINICIAR) window.localStorage.removeItem(clave);
  } catch {
    // idem
  }
}

export function reiniciarEdad(): void {
  try {
    window.localStorage.removeItem(CLAVE_EDAD);
  } catch {
    // idem
  }
}
