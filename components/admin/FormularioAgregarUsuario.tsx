'use client';

// Formulario para agregar un usuario a mano (correo + nombre) — pedido
// explícito del usuario, 2026-09-22: "por si a alguien no le llega el
// acceso correctamente". Llama a /api/admin/usuarios (verificado como admin
// en el servidor) y muestra el error real si falla, nunca un "listo" falso.

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function FormularioAgregarUsuario() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [estado, setEstado] = useState<'reposo' | 'enviando' | 'error'>('reposo');
  const [mensajeError, setMensajeError] = useState('');
  const [abierto, setAbierto] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEstado('enviando');
    setMensajeError('');
    try {
      const res = await fetch('/api/admin/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, nombre }),
      });
      const datos: { error?: string } = await res.json();
      if (!res.ok) throw new Error(datos.error || 'No se pudo agregar el usuario');
      setEmail('');
      setNombre('');
      setAbierto(false);
      setEstado('reposo');
      router.refresh();
    } catch (error) {
      setMensajeError(error instanceof Error ? error.message : 'No se pudo agregar el usuario');
      setEstado('error');
    }
  }

  if (!abierto) {
    return (
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="flex h-11 items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] px-5 text-[13px] font-bold text-[var(--on-accent)]"
      >
        + Agregar usuario a mano
      </button>
    );
  }

  return (
    <form
      onSubmit={enviar}
      className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface)] p-4 sm:flex-row sm:items-end"
    >
      <div className="flex-1">
        <label className="text-[11px] font-semibold text-[var(--text-tertiary)]" htmlFor="nombre-nuevo">
          Nombre
        </label>
        <input
          id="nombre-nuevo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre completo"
          required
          className="mt-1 h-11 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface-2)] px-3 text-[13px] text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]"
        />
      </div>
      <div className="flex-1">
        <label className="text-[11px] font-semibold text-[var(--text-tertiary)]" htmlFor="email-nuevo">
          Correo
        </label>
        <input
          id="email-nuevo"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correo@ejemplo.com"
          required
          className="mt-1 h-11 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface-2)] px-3 text-[13px] text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={estado === 'enviando'}
          className="flex h-11 items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] px-5 text-[13px] font-bold text-[var(--on-accent)] disabled:opacity-60"
        >
          {estado === 'enviando' ? 'Enviando…' : 'Enviar invitación'}
        </button>
        <button
          type="button"
          onClick={() => setAbierto(false)}
          className="flex h-11 items-center justify-center rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] px-4 text-[13px] font-semibold text-[var(--text-secondary)]"
        >
          Cancelar
        </button>
      </div>
      {estado === 'error' && (
        <p className="text-[12px] font-semibold text-[var(--an-risk)] sm:basis-full">{mensajeError}</p>
      )}
    </form>
  );
}
