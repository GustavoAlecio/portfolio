import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { formatDate } from "@/lib/format";
import { extractHeadings, Mdx } from "@/content/mdx";
import {
  getAvailableLocales,
  getPost,
  getPostSlugs,
  getRelatedPosts,
} from "@/content/repository";
import { categoryTone, Pill } from "@/design-system/components/pill";
import { PostCard } from "@/design-system/patterns/post-card";
import { Container } from "@/design-system/patterns/section";
import { htmlLang, locales, routing, type Locale } from "@/i18n/routing";

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPost(locale, slug);
  if (!post) return {};

  // hreflang só para os locales em que a tradução existe de fato
  const available = await getAvailableLocales("posts", slug);
  return {
    title: post.data.title,
    description: post.data.summary,
    alternates: {
      languages: Object.fromEntries(
        available.map((l) => [
          htmlLang[l],
          l === routing.defaultLocale ? `/blog/${slug}` : `/${l}/blog/${slug}`,
        ]),
      ),
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const [post, t] = await Promise.all([
    getPost(locale, slug),
    getTranslations(),
  ]);
  if (!post) notFound();

  const headings = extractHeadings(post.body);
  const related = await getRelatedPosts(locale, slug, post.data.category);

  return (
    <>
      <div className="reading-progress" aria-hidden />
      <Container className="py-[62px]">
        <div className="grid items-start gap-11 lg:grid-cols-[minmax(0,1fr)_216px]">
          <article>
            <header className="mb-[30px]">
              <div className="mb-[14px] flex flex-wrap items-center gap-[10px]">
                <Pill tone={categoryTone[post.data.category] ?? "neutral"} caps>
                  {t(`blog.categories.${post.data.category}`)}
                </Pill>
                <span className="label text-[11px]">
                  {formatDate(post.data.publishedAt, locale)}
                  {" · "}
                  {t("blog.readingTime", { minutes: post.readingMinutes })}
                </span>
              </div>

              <h1 className="m-0 mb-[18px] max-w-[30ch] text-[clamp(28px,4vw,42px)] leading-[1.12] font-bold tracking-[-0.032em] text-balance">
                {post.data.title}
              </h1>

              {post.isFallback ? (
                <div className="flex items-start gap-3 rounded-control border border-amber-line bg-amber-wash px-4 py-[13px] text-[14.5px] text-fg-2">
                  <b className="label pt-[3px] text-[10.5px] whitespace-nowrap text-amber">
                    {t("blog.fallbackLabel")}
                  </b>
                  <span>{t("blog.fallbackNotice")}</span>
                </div>
              ) : null}
            </header>

            <div className="prose">
              <Mdx source={post.body} />
            </div>

            {related.length > 0 ? (
              <section className="mt-[62px] border-t border-line pt-[30px]">
                <span className="label">{t("blog.related")}</span>
                <div className="mt-[18px] grid gap-5 sm:grid-cols-2">
                  {related.map((item) => (
                    <PostCard key={item.slug} post={item} />
                  ))}
                </div>
              </section>
            ) : null}
          </article>

          {headings.length > 1 ? (
            <aside className="grid gap-[11px] lg:sticky lg:top-[84px]">
              <span className="label">{t("blog.onThisPage")}</span>
              <ol className="m-0 grid list-none gap-[2px] border-l border-line p-0">
                {headings.map((h) => (
                  <li key={h.id}>
                    <a
                      href={`#${h.id}`}
                      className="-ml-px block border-l border-transparent py-[6px] pl-[14px] text-sm text-fg-2 no-underline transition-[color,border-color] duration-200 ease-ui hover:border-teal-line hover:text-fg"
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </aside>
          ) : null}
        </div>
      </Container>
    </>
  );
}
