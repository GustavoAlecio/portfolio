import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: {
    // metadados de imagem/vídeo local resolvidos em build
    optimizePackageImports: ["shiki"],
  },
  // o matcher do proxy ignora qualquer caminho com ponto, então /feed.xml nunca
  // ganha o prefixo de locale — o pt é servido direto pela raiz, como as páginas
  async rewrites() {
    return [{ source: "/feed.xml", destination: "/pt/feed.xml" }];
  },
};

export default withNextIntl(nextConfig);
