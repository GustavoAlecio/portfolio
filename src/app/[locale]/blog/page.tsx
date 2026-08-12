import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPosts } from "@/content/repository";
import { PostCard } from "@/design-system/patterns/post-card";
import { Section, SectionHead } from "@/design-system/patterns/section";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return { title: t("title"), description: t("lede") };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const posts = await getPosts(locale);

  return (
    <Section className="pt-[62px]">
      <SectionHead title={t("blog.title")} lede={t("blog.lede")} />
      {posts.length ? (
        <div className="grid gap-[18px] md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-fg-2">{t("blog.empty")}</p>
      )}
    </Section>
  );
}
