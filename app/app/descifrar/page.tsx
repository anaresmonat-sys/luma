'use client';

// APP INTERNA — DESCIFRA LA CONVERSACIÓN (blueprint: vista-previa-app.html frame 4,
// aprobado). La función estrella. Sin nav inferior (flujo dedicado, no es pestaña).
// Conectada a IA real vía /api/descifrar (patrón BFF — la clave vive en el
// servidor). El primer análisis real es gratis (lib/prueba-gratis.ts); el
// siguiente intento manda a elegir un plan. No hay modo "Voz" propio (decisión de
// la dueña, 2026-10-13): el teclado del móvil ya dicta; se avisa con una pista. El CTA "Analizar" NUNCA se deshabilita (ancla de craft): si
// el texto es muy corto para decir algo real, se explica por qué en vez de
// apagar el botón.

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Camera, CircleHelp, ClipboardList, ClipboardPaste, Eye, TriangleAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenHeader } from '@/components/app/ScreenHeader';
import { AppButton, AppLinkButton } from '@/components/app/AppButton';
import { AvisoIA } from '@/components/app/AvisoIA';
import { AvisoPrueba } from '@/components/app/AvisoPrueba';
import { InvitacionPlan } from '@/components/app/InvitacionPlan';
import { usePruebaDisponible } from '@/lib/use-prueba-gratis';
import { CONVERSACION_EJEMPLO } from '@/lib/seed-datos';
import { consumirPruebaGratis } from '@/lib/prueba-gratis';
import { guardarMensajePendiente } from '@/lib/almacenamiento-coach';

type Modo = 'texto' | 'captura';
type Estado = 'reposo' | 'cargando' | 'error' | 'resultado';

interface ItemAnalisis {
  id: string;
  emoji: string;
  color: string;
  titulo: string;
  texto: string;
}

const MIN_CARACTERES = 15;

const MODOS: { id: Modo; Icono: typeof Camera; label: string }[] = [
  { id: 'texto', Icono: ClipboardList, label: 'Texto' },
  { id: 'captura', Icono: Camera, label: 'Captura' },
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
  const cajaRef = useRef<HTMLTextAreaElement | null>(null);
  const [avisoPegar, setAvisoPegar] = useState('');
  const [estado, setEstado] = useState<Estado>('reposo');
  const [analisis, setAnalisis] = useState<ItemAnalisis[]>([]);
  const [noConversacion, setNoConversacion] = useState('');
  const [mensajeError, setMensajeError] = useState('Necesito un poco más de contexto — pega al menos un par de mensajes.');

  const { disponible, conPlan, refrescar } = usePruebaDisponible();
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

  // Botón "Pegar": lee el portapapeles (HTTPS + toque del usuario). Si el teléfono lo bloquea, se guía al
  // pegado nativo (mantener pulsado en la caja), que siempre funciona.
  async function pegar() {
    if (!disponible) return;
    setAvisoPegar('');
    try {
      const copiado = (await navigator.clipboard.readText()).trim();
      if (!copiado) {
        setAvisoPegar('Todavía no has copiado nada. Copia la conversación y vuelve a tocar Pegar.');
        return;
      }
      setTexto((previo) => (previo.trim() ? previo.trimEnd() + '\n' : '') + copiado);
      if (estado !== 'cargando') setEstado('reposo');
      cajaRef.current?.focus();
    } catch {
      setAvisoPegar('Tu teléfono no deja pegar con el botón. Mantén pulsada la caja y elige "Pegar".');
      cajaRef.current?.focus();
    }
  }

  async function analizar() {
    // No cortar aquí mirando solo localStorage: ese valor no sabe si ya hay un
    // plan (pagado o de cortesía) — la verdad la decide el servidor con el 402
    // de más abajo (defecto real: bloqueaba a alguien con cortesía activa).
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
    setNoConversacion('');
    setEstado('cargando');
    try {
      const res = await fetch('/api/descifrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modo === 'captura' && imagen ? { imagen: { tipo: 'image/jpeg', datos: imagen.datos } } : { texto }),
      });
      if (res.status === 402) {
        window.location.href = '/paywall?motivo=lectura-usada';
        return;
      }
      if (res.status === 429) {
        const tope: { error?: string; motivo?: string } | null = await res.json().catch(() => null);
        if (tope?.motivo === 'tope_persona' && tope.error) {
          setMensajeError(tope.error);
          setEstado('error');
          return;
        }
      }
      if (!res.ok) throw new Error('respuesta no OK');
      const datos: { analisis?: ItemAnalisis[]; noConversacion?: string } = await res.json();
      if (datos.noConversacion) {
        // No era una conversación: se muestra el aviso amable y no se gasta la lectura gratis.
        setNoConversacion(datos.noConversacion);
        setEstado('reposo');
        return;
      }
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
          {estado !== 'resultado' && <AvisoPrueba disponible={disponible} conPlan={conPlan} />}
        </motion.div>
        {!noConversacion && (
        <>
        <motion.div variants={item} className="grid grid-cols-2 gap-2">
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
              <m.Icono size={20} strokeWidth={1.75} aria-hidden="true" />
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
                  ref={cajaRef}
                  value={texto}
                  onChange={(e) => {
                    setTexto(e.target.value);
                    if (estado !== 'cargando') setEstado('reposo');
                  }}
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') analizar();
                  }}
                  placeholder={disponible ? 'Copia la conversación y pégala aquí, o escríbela…' : 'Elige tu plan para seguir…'}
                  readOnly={!disponible}
                  rows={4}
                  className="min-h-24 w-full flex-1 resize-none bg-transparent text-[13px] leading-relaxed text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none"
                />
                <div className="mt-2 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => void pegar()}
                    disabled={!disponible}
                    className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--accent)_50%,transparent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] px-4 text-[14px] font-semibold text-[var(--accent-lite)] [touch-action:manipulation] disabled:opacity-50"
                  >
                    <ClipboardPaste size={16} strokeWidth={1.9} aria-hidden="true" />
                    Pegar
                  </button>
                  <p className="text-right text-[11px] leading-snug text-[var(--text-tertiary)]">
                    O escribe, o toca el micrófono de tu teclado.
                  </p>
                </div>
                {avisoPegar && (
                  <p role="status" className="mt-1 text-[12px] font-semibold leading-snug text-[var(--accent-lite)]">
                    {avisoPegar}
                  </p>
                )}
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

              {!(estado === 'resultado' && !disponible) && (
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
              )}

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
          ) : (
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
                  <Camera size={32} strokeWidth={1.5} aria-hidden="true" className="text-[var(--accent-lite)]" />
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

              {!(estado === 'resultado' && !disponible) && (
              <div className="mt-3">
                <AppButton onClick={analizar} disabled={estado === 'cargando'} busy={estado === 'cargando'}>
                  {estado === 'cargando' ? 'Analizando…' : disponible ? 'Analizar captura' : 'Elegir mi plan'}
                </AppButton>
              </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        </>
        )}

        {noConversacion && estado !== 'resultado' && (
          <div role="status" className="mt-6 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_35%,transparent)] bg-[var(--surface-2)] p-4">
            {modo === 'texto' && texto.trim() && (
              <div className="mb-3 rounded-[var(--radius-button)] border-l-2 border-[color-mix(in_oklab,var(--accent)_55%,transparent)] bg-[color-mix(in_oklab,var(--accent)_7%,transparent)] px-3 py-2">
                <p className="line-clamp-5 whitespace-pre-line text-[13px] leading-snug text-[var(--text-secondary)]">{texto.trim()}</p>
              </div>
            )}
            <p className="text-[13.5px] leading-relaxed text-[var(--text-primary)]">{noConversacion}</p>
            <div className="mt-3 flex flex-col gap-2">
              <AppLinkButton href="/app/tarot">Hacer una tirada de tarot</AppLinkButton>
              <Link
                href="/app/coach"
                className="flex h-[46px] w-full items-center justify-center rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_45%,transparent)] text-[13px] font-semibold text-[var(--accent-lite)]"
              >
                Hablar con LUMA
              </Link>
              <button
                type="button"
                onClick={() => {
                  setNoConversacion('');
                  setTexto('');
                  setEstado('reposo');
                }}
                className="min-h-11 text-[13px] font-semibold text-[var(--text-secondary)] underline underline-offset-2"
              >
                Analizar otra conversación
              </button>
            </div>
          </div>
        )}

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
                    {a.id === 'riesgo' ? (
                      <TriangleAlert size={16} strokeWidth={2} />
                    ) : a.id === 'pregunta' ? (
                      <CircleHelp size={16} strokeWidth={2} />
                    ) : (
                      <Eye size={16} strokeWidth={2} />
                    )}
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
              {!disponible && conPlan === false && (
                <motion.div variants={item}>
                  <InvitacionPlan />
                </motion.div>
              )}
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
