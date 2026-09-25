'use client';

// APP INTERNA — DESCIFRA LA CONVERSACIÓN (blueprint: vista-previa-app.html frame 4,
// aprobado). La función estrella. Sin nav inferior (flujo dedicado, no es pestaña).
// Conectada a IA real vía /api/descifrar (patrón BFF — la clave vive en el
// servidor). El primer análisis real es gratis (lib/prueba-gratis.ts); el
// siguiente intento manda a elegir un plan. Captura/Voz muestran "Próximamente"
// honesto (11: nunca un elemento tocable sin respuesta) hasta que OCR/voz→texto
// estén conectados. El CTA "Analizar" NUNCA se deshabilita (ancla de craft): si
// el texto es muy corto para decir algo real, se explica por qué en vez de
// apagar el botón.

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenHeader } from '@/components/app/ScreenHeader';
import { AppButton, AppLinkButton } from '@/components/app/AppButton';
import { AvisoIA } from '@/components/app/AvisoIA';
import { AvisoPrueba } from '@/components/app/AvisoPrueba';
import { usePruebaDisponible } from '@/lib/use-prueba-gratis';
import { CONVERSACION_EJEMPLO } from '@/lib/seed-datos';
import { pruebaGratisDisponible, consumirPruebaGratis } from '@/lib/prueba-gratis';
import { guardarMensajePendiente } from '@/lib/almacenamiento-coach';

type Modo = 'texto' | 'captura' | 'voz';
type Estado = 'reposo' | 'cargando' | 'error' | 'resultado';

interface ItemAnalisis {
  id: string;
  emoji: string;
  color: string;
  titulo: string;
  texto: string;
}

const MIN_CARACTERES = 15;

const MODOS: { id: Modo; emoji: string; label: string }[] = [
  { id: 'texto', emoji: '📋', label: 'Pega texto' },
  { id: 'captura', emoji: '📸', label: 'Captura' },
  { id: 'voz', emoji: '🎤', label: 'Voz' },
];

const contenedor = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

export default function DescifrarPage() {
  const [modo, setModo] = useState<Modo>('texto');
  const [texto, setTexto] = useState('');
  const [estado, setEstado] = useState<Estado>('reposo');
  const [analisis, setAnalisis] = useState<ItemAnalisis[]>([]);
  const [mensajeError, setMensajeError] = useState('Necesito un poco más de contexto — pega al menos un par de mensajes.');

  const { disponible, refrescar } = usePruebaDisponible();
  const [imagen, setImagen] = useState<{ datos: string; vista: string } | null>(null);

  // La captura se reduce en el navegador (máx. 1600 px, JPEG) antes de enviarla: pesa
  // mucho menos, viaja más rápido y cabe en el límite de tamaño del servidor.
  async function prepararImagen(archivo: File) {
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(archivo.type)) {
      setMensajeError('Usa una imagen PNG, JPG o WebP.');
      setEstado('error');
      return;
    }
    try {
      const bitmap = await createImageBitmap(archivo);
      const escala = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
      const lienzo = document.createElement('canvas');
      lienzo.width = Math.round(bitmap.width * escala);
      lienzo.height = Math.round(bitmap.height * escala);
      const contexto = lienzo.getContext('2d');
      if (!contexto) throw new Error('sin lienzo');
      contexto.fillStyle = 'white';
      contexto.fillRect(0, 0, lienzo.width, lienzo.height);
      contexto.drawImage(bitmap, 0, 0, lienzo.width, lienzo.height);
      const vista = lienzo.toDataURL('image/jpeg', 0.85);
      const datos = vista.split(',')[1] ?? '';
      if (!datos || datos.length > 3_000_000) throw new Error('imagen no válida o muy pesada');
      setImagen({ datos, vista });
      setEstado('reposo');
    } catch {
      setMensajeError('No pude leer esa imagen. Prueba con otra captura.');
      setEstado('error');
    }
  }

  async function analizar() {
    if (!pruebaGratisDisponible()) {
      window.location.href = '/paywall';
      return;
    }
    if (modo === 'captura') {
      if (!imagen) {
        setMensajeError('Elige primero una captura de la conversación.');
        setEstado('error');
        return;
      }
    } else if (texto.trim().length < MIN_CARACTERES) {
      setMensajeError('Necesito un poco más de contexto — pega al menos un par de mensajes.');
      setEstado('error');
      return;
    }
    setEstado('cargando');
    try {
      const res = await fetch('/api/descifrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modo === 'captura' && imagen ? { imagen: { tipo: 'image/jpeg', datos: imagen.datos } } : { texto }),
      });
      if (res.status === 402) {
        window.location.href = '/paywall';
        return;
      }
      if (!res.ok) throw new Error('respuesta no OK');
      const datos: { analisis?: ItemAnalisis[] } = await res.json();
      if (!datos.analisis) throw new Error('sin análisis');
      consumirPruebaGratis();
      refrescar();
      setAnalisis(datos.analisis);
      setEstado('resultado');
    } catch {
      setMensajeError('No se pudo analizar tu mensaje — inténtalo de nuevo.');
      setEstado('error');
    }
  }

  return (
    <div className="relative flex min-h-dvh flex-col px-5 pb-6 pt-3">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 60% 40dvh at 50% 32%, color-mix(in oklab, var(--bloom-vino) 30%, transparent), transparent 68%), ' +
            'radial-gradient(ellipse 60% 36dvh at 50% 78%, color-mix(in oklab, var(--bloom-vino) 23%, transparent), transparent 70%), ' +
            'radial-gradient(ellipse 60% 24dvh at 50% 100%, color-mix(in oklab, var(--bloom-vino) 21%, transparent), transparent 72%)',
        }}
      />

      <motion.div variants={contenedor} initial="hidden" animate="visible" className="flex min-h-0 flex-1 flex-col">
        <motion.div variants={item} className="shrink-0">
          <ScreenHeader titulo="Descifra la conversación" tituloDisplay />
        </motion.div>
        <div className="flex flex-1 flex-col">
        <motion.div variants={item} className="mb-2">
          <AvisoPrueba disponible={disponible} />
        </motion.div>
        <motion.div variants={item} className="grid grid-cols-3 gap-2">
          {MODOS.map((m) => (
            <motion.button
              key={m.id}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => setModo(m.id)}
              aria-pressed={modo === m.id}
              className={`flex flex-col items-center gap-1 rounded-[var(--radius-button)] border py-2.5 text-[11px] font-semibold transition-colors duration-150 ${
                modo === m.id
                  ? 'border-[color-mix(in_oklab,var(--accent)_70%,transparent)] bg-[color-mix(in_oklab,var(--accent)_14%,transparent)] text-[var(--accent-lite)]'
                  : 'border-[color-mix(in_oklab,var(--accent)_28%,transparent)] text-[var(--text-secondary)]'
              }`}
            >
              <span className="text-[17px] leading-none" aria-hidden="true">
                {m.emoji}
              </span>
              {m.label}
            </motion.button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {modo === 'texto' ? (
            <motion.div
              key="texto"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.07 }}
              className={`flex flex-col ${estado === 'resultado' ? '' : 'flex-1'}`}
            >
              <div
                className={`mt-3 flex flex-col rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface-2)] p-3 ${
                  estado === 'resultado' ? '' : 'flex-1'
                }`}
              >
                <textarea
                  value={texto}
                  onChange={(e) => {
                    setTexto(e.target.value);
                    if (estado !== 'cargando') setEstado('reposo');
                  }}
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') analizar();
                  }}
                  placeholder={disponible ? 'Pega aquí la conversación…' : 'Elige tu plan para seguir…'}
                  readOnly={!disponible}
                  rows={4}
                  className="min-h-24 w-full flex-1 resize-none bg-transparent text-[13px] leading-relaxed text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none"
                />
                <div className="mt-2 flex items-center justify-between">
                  <button
                    type="button"
                    aria-label="Grabar nota de voz"
                    onClick={() => setModo('voz')}
                    className="flex size-11 items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[color-mix(in_oklab,var(--accent)_15%,transparent)] text-[15px]"
                  >
                    🎤
                  </button>
                  <span className="text-[11px] text-[var(--text-tertiary)]">o toca para grabar — próximamente</span>
                </div>
              </div>

              <AnimatePresence>
                {estado === 'error' && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 overflow-hidden text-[11px] font-semibold leading-snug text-[var(--an-risk)]"
                  >
                    {mensajeError}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="mt-3">
                <AppButton onClick={analizar} disabled={estado === 'cargando'} busy={estado === 'cargando'}>
                  {estado === 'cargando' && (
                    <motion.span
                      aria-hidden="true"
                      className="size-3.5 rounded-full border-2 border-[var(--on-accent)] border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                    />
                  )}
                  {estado === 'cargando' ? 'Analizando…' : disponible ? 'Analizar' : 'Elegir mi plan'}
                </AppButton>
              </div>

              {texto.trim() === '' && disponible && (
                <button
                  type="button"
                  onClick={() => {
                    setTexto(CONVERSACION_EJEMPLO);
                    setEstado('reposo');
                  }}
                  className="mt-2 self-start text-[11px] font-semibold text-[var(--accent-lite)]"
                >
                  Probar con un ejemplo
                </button>
              )}
            </motion.div>
          ) : modo === 'captura' ? (
            <motion.div
              key="captura"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.07 }}
              className="flex flex-col"
            >
              <div className="mt-3 flex flex-col items-center gap-3 rounded-[var(--radius-card)] border border-dashed border-[color-mix(in_oklab,var(--accent)_45%,transparent)] bg-[var(--surface-2)] p-4 text-center">
                {imagen ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imagen.vista}
                    alt="Vista previa de tu captura"
                    className="max-h-64 w-auto rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)]"
                  />
                ) : (
                  <span className="text-[32px]" aria-hidden="true">
                    📸
                  </span>
                )}
                <label
                  className={`flex h-11 cursor-pointer items-center justify-center rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_45%,transparent)] px-4 text-[13px] font-semibold text-[var(--accent-lite)] ${
                    disponible ? '' : 'pointer-events-none opacity-50'
                  }`}
                >
                  {imagen ? 'Cambiar captura' : 'Elegir captura del chat'}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    disabled={!disponible}
                    onChange={(e) => {
                      const archivo = e.target.files?.[0];
                      if (archivo) void prepararImagen(archivo);
                      e.target.value = '';
                    }}
                  />
                </label>
                <p className="text-[11px] leading-snug text-[var(--text-tertiary)]">
                  Tu captura se envía a la IA solo para leerla y analizarla. No la guardamos.
                </p>
              </div>

              <AnimatePresence>
                {estado === 'error' && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 overflow-hidden text-[11px] font-semibold leading-snug text-[var(--an-risk)]"
                  >
                    {mensajeError}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="mt-3">
                <AppButton onClick={analizar} disabled={estado === 'cargando'} busy={estado === 'cargando'}>
                  {estado === 'cargando' ? 'Analizando…' : disponible ? 'Analizar captura' : 'Elegir mi plan'}
                </AppButton>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="otro-modo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 flex flex-col items-center gap-2 rounded-[var(--radius-card)] border border-dashed border-[color-mix(in_oklab,var(--accent)_35%,transparent)] px-4 py-10 text-center"
            >
              <span className="text-[26px]" aria-hidden="true">
                🎤
              </span>
              <p className="text-[13px] font-semibold text-[var(--text-primary)]">Próximamente</p>
              <p className="text-[11.5px] text-[var(--text-secondary)]">
                Vas a poder contarlo en voz alta y LUMA lo transcribe por ti.
              </p>
              <button type="button" onClick={() => setModo('texto')} className="mt-1 text-[11px] font-bold text-[var(--accent-lite)]">
                Volver a pegar texto
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {estado === 'resultado' && (
            <motion.div
              variants={contenedor}
              initial="hidden"
              animate="visible"
              className="mt-6 flex flex-col gap-4"
            >
              <motion.p
                variants={item}
                className="text-[15px] font-semibold text-[var(--text-primary)] [font-family:var(--font-display)]"
              >
                Lo que hemos detectado
              </motion.p>
              {analisis.map((a) => (
                <motion.div key={a.id} variants={item} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="flex size-[34px] shrink-0 items-center justify-center rounded-full text-[15px]"
                    style={{
                      background: `color-mix(in oklab, ${a.color} 24%, transparent)`,
                      border: `1px solid color-mix(in oklab, ${a.color} 55%, transparent)`,
                      boxShadow: `0 0 16px -4px color-mix(in oklab, ${a.color} 55%, transparent)`,
                    }}
                  >
                    {a.emoji}
                  </span>
                  <div>
                    <h3 className="text-[12.5px] font-bold text-[var(--text-primary)]">{a.titulo}</h3>
                    <p className="mt-0.5 text-[11.5px] leading-snug text-[var(--text-secondary)]">{a.texto}</p>
                  </div>
                </motion.div>
              ))}
              <motion.div variants={item} className="mt-1 flex flex-col gap-2">
                <AppLinkButton href="/app/tarot">Explorar con tarot</AppLinkButton>
                <Link
                  href="/app/coach"
                  onClick={() =>
                    guardarMensajePendiente(
                      `¿Qué podría responderle a esto?\n\n"${texto.trim() || analisis.find((a) => a.id === 'vemos')?.texto || ''}"`
                    )
                  }
                  className="flex h-[46px] w-full items-center justify-center rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_45%,transparent)] text-[13px] font-semibold text-[var(--accent-lite)]"
                >
                  ¿Qué podría responderle?
                </Link>
              </motion.div>
              <motion.div variants={item}>
                <AvisoIA />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
