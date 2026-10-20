import type { NextConfig } from "next";

const esDev = process.env.NODE_ENV !== "production";
// 'unsafe-eval' solo en desarrollo (React lo usa para depurar).
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${esDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self' https://*.supabase.co wss://*.supabase.co${esDev ? " ws://localhost:* ws://127.0.0.1:*" : ""}`,
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://pay.hotmart.com",
].join("; ");

const nextConfig: NextConfig = {
  // Permite que las herramientas de preview locales (Playwright, navegador in-app)
  // carguen recursos de dev sirviéndose por 127.0.0.1 además de localhost.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  devIndicators: false,
  // Cabeceras de seguridad. La CSP permite 'unsafe-inline' porque Next inyecta scripts/estilos
  // en línea; bloquea incrustar la app en otro sitio, plugins, <base> ajeno, formularios hacia
  // otros dominios y conexiones a dominios que no usamos.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: CSP },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // Fuerza HTTPS durante 1 año; sin includeSubDomains/preload a propósito
          // (no se sabe qué subdominios tendrá el dominio propio futuro).
          { key: "Strict-Transport-Security", value: "max-age=31536000" },
        ],
      },
    ];
  },
};

export default nextConfig;
