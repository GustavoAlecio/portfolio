import type { MetadataRoute } from "next";
import { getPosts } from "@/content/repository";
import { getPathname } from "@/i18n/navigation";
import { htmlLang, locales, type Locale } from "@/i18n/routing";
import { siteUrl } from "@/lib/format";
import type { Post } from "@/content/schema";

type Href = Parameters<typeof getPathname>[0]["href"];

function absolute(locale: Locale, href: Href) {
  return new URL(getPathname({ href, locale }), siteUrl()).toString();
}

/** hreflang do sitemap: só os locales onde a página existe de fato. */
function entry(
  href: Href,
  available: Locale[],
  lastModified?: (locale: Locale) => Date | undefined,
): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    available.map((l) => [htmlLang[l], absolute(l, href)]),
  );
  return available.map((locale) => ({
    url: absolute(locale, href),
    lastModified: lastModified?.(locale),
    alternates: { languages },
  }));
}

function day(iso: string) {
  return new Date(`${iso}T12:00:00Z`);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const byLocale = new Map<Locale, Post[]>(
    await Promise.all(
      locales.map(async (l) => [l, await getPosts(l)] as const),
    ),
  );

  /**
   * Só entra no sitemap o artigo escrito naquele idioma. Rascunho já sai no
   * `getPosts`; fallback é descartado aqui — anunciar ao Google uma URL /zh que
   * serve texto em inglês é pedir para ser rebaixado por conteúdo duplicado.
   */
  const native = new Map<string, Map<Locale, Post>>();
  for (const [locale, posts] of byLocale) {
    for (const post of posts) {
      if (post.isFallback) continue;
      if (!native.has(post.slug)) native.set(post.slug, new Map());
      native.get(post.slug)!.set(locale, post);
    }
  }

  const posts = [...native].map(([slug, perLocale]) =>
    entry(
      { pathname: "/blog/[slug]", params: { slug } },
      [...perLocale.keys()],
      (l) => {
        const data = perLocale.get(l)!.data;
        return day(data.updatedAt ?? data.publishedAt);
      },
    ),
  );

  return [
    ...entry("/", [...locales]),
    ...entry("/blog", [...locales], (l) => {
      const newest = byLocale.get(l)?.[0]?.data.publishedAt;
      return newest ? day(newest) : undefined;
    }),
    ...entry("/sobre", [...locales]),
    ...posts.flat(),
  ];
}
