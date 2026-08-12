import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: {
    // metadados de imagem/vídeo local resolvidos em build
    optimizePackageImports: ["shiki"],
  },
};

export default withNextIntl(nextConfig);
