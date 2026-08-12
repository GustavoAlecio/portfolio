import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { getPost } from "@/content/repository";
import type { Locale } from "@/i18n/routing";
import { formatDate } from "@/lib/format";
import { fontFamilyFor, loadGoogleFont } from "@/lib/og-font";
import { ogContentType, ogSize, ogTemplate } from "@/lib/og-template";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Gustavo Alecio";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const [post, t] = await Promise.all([
    getPost(locale, slug),
    getTranslations({ locale }),
  ]);

  const title = post?.data.title ?? t("site.name");
  const category = post ? t(`blog.categories.${post.data.category}`) : "";
  const date = post ? formatDate(post.data.publishedAt, locale) : "";
  const footer = [t("site.name"), date].filter(Boolean).join(" · ");

  const family = fontFamilyFor(locale);
  const font = await loadGoogleFont(family, 700, title + category + footer);

  return new ImageResponse(
    ogTemplate({
      title,
      eyebrow: category,
      footer,
      tone: post?.data.category as never,
    }),
    {
      ...size,
      fonts: font
        ? [{ name: family, data: font, style: "normal", weight: 700 }]
        : undefined,
    },
  );
}
