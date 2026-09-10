import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite que las herramientas de preview locales (Playwright, navegador in-app)
  // carguen recursos de dev sirviéndose por 127.0.0.1 además de localhost.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  devIndicators: false,
};

export default nextConfig;
