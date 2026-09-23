import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite que las herramientas de preview locales (Playwright, navegador in-app)
  // carguen recursos de dev sirviéndose por 127.0.0.1 además de localhost.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  devIndicators: false,
  // Cabeceras de seguridad básicas (auditoría 2026-09-23) — sin CSP todavía:
  // una CSP estricta puede romper la hidratación de Next/motion si no se
  // prueba con cuidado; se deja anotado en ESTADO.md como pendiente aparte,
  // no se metió a medias por no arriesgar romper la app en producción.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
