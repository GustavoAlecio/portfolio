import { getPosts } from "@/content/repository";
import { getPathname } from "@/i18n/navigation";
import { htmlLang, type Locale } from "@/i18n/routing";
import { siteUrl } from "./format";

/**
 * Um feed por idioma. Misturar os três num arquivo só entrega ao leitor de RSS
 * o mesmo artigo três vezes, em idiomas que ele não pediu.
 */

function escape(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function absolute(locale: Locale, href: Parameters<typeof getPathname>[0]["href"]) {
  return new URL(getPathname({ href, locale }), siteUrl()).toString();
}

export async function buildFeed(locale: Locale, siteName: string, description: string) {
  const posts = await getPosts(locale);
  const self = new URL(
    locale === "pt" ? "/feed.xml" : `/${locale}/feed.xml`,
    siteUrl(),
  ).toString();

  const items = posts
    .map((post) => {
      const link = absolute(locale, {
        pathname: "/blog/[slug]",
        params: { slug: post.slug },
      });
      // RFC 822 exige data completa; o frontmatter só tem o dia
      const date = new Date(`${post.data.publishedAt}T12:00:00Z`).toUTCString();
      return `    <item>
      <title>${escape(post.data.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${date}</pubDate>
      <description>${escape(post.data.summary)}</description>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(siteName)}</title>
    <link>${absolute(locale, "/blog")}</link>
    <atom:link href="${self}" rel="self" type="application/rss+xml" />
    <description>${escape(description)}</description>
    <language>${htmlLang[locale]}</language>
${items}
  </channel>
</rss>
`;
}
