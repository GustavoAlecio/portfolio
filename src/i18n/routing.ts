import { defineRouting } from "next-intl/routing";

export const locales = ["pt", "en", "zh"] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  pt: "PT",
  en: "EN",
  zh: "中文",
};

/**
 * Tag BCP 47 para `<html lang>` e `hreflang`. `zh` genérico não distingue
 * simplificado de tradicional — `zh-Hans` diz explicitamente que é simplificado,
 * e a regra CSS de CJK casa por `[lang^="zh"]`.
 */
export const htmlLang: Record<Locale, string> = {
  pt: "pt-BR",
  en: "en",
  zh: "zh-Hans",
};

/**
 * Ordem de fallback quando a tradução do documento não existe. Não é o locale
 * padrão para todos: para quem lê chinês, inglês é muito mais útil que
 * português.
 */
export const fallbackChain: Record<Locale, Locale[]> = {
  pt: ["en", "zh"],
  en: ["pt", "zh"],
  zh: ["en", "pt"],
};

/**
 * Os segmentos de rota são traduzidos: o caminho interno é sempre o nome em
 * português (que é o nome da pasta em app/), e cada locale expõe o seu.
 */
export const routing = defineRouting({
  locales,
  defaultLocale: "pt",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/sobre": { pt: "/sobre", en: "/about", zh: "/about" },
    "/projetos": { pt: "/projetos", en: "/work", zh: "/work" },
    "/projetos/[slug]": {
      pt: "/projetos/[slug]",
      en: "/work/[slug]",
      zh: "/work/[slug]",
    },
    "/blog": "/blog",
    "/blog/[slug]": "/blog/[slug]",
  },
});
