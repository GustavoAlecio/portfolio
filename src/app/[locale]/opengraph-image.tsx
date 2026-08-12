import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { fontFamilyFor, loadGoogleFont } from "@/lib/og-font";
import { ogContentType, ogSize, ogTemplate } from "@/lib/og-template";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Gustavo Alecio";

/** Imagem padrão: vale para home, sobre e qualquer rota sem uma própria. */
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const title = `${t("home.headlineStart")} ${t("home.headlineAccent")}${t("home.headlineEnd")}`;
  const footer = `${t("site.name")} · ${t("site.role")}`;

  const family = fontFamilyFor(locale);
  const font = await loadGoogleFont(family, 700, title + footer);

  return new ImageResponse(ogTemplate({ title, footer, tone: "flutter" }), {
    ...size,
    fonts: font
      ? [{ name: family, data: font, style: "normal", weight: 700 }]
      : undefined,
  });
}
