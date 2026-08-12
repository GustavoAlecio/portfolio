import { useLocale, useTranslations } from "next-intl";
import type { Post } from "@/content/schema";
import { CoverBand } from "@/design-system/components/cover-band";
import { categoryTone, Pill } from "@/design-system/components/pill";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/format";

export function PostCard({ post }: { post: Post }) {
  const t = useTranslations();
  const locale = useLocale();
  const { data } = post;

  return (
    <Link
      href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
      className="reveal group grid content-start overflow-hidden rounded-card border border-line bg-surface no-underline shadow-e1 transition-[border-color,box-shadow,transform] duration-250 ease-ui hover:-translate-y-[2px] hover:border-line-strong hover:shadow-e3"
    >
      <CoverBand
        seed={post.slug}
        category={data.category}
        className="h-[76px] border-b border-line"
      />
      <div className="grid content-start gap-[14px] p-6">
        <div className="flex flex-wrap items-center gap-[10px]">
          <Pill tone={categoryTone[data.category] ?? "neutral"} caps>
            {t(`blog.categories.${data.category}`)}
          </Pill>
          <span className="label text-[11px]">
            {formatDate(data.publishedAt, locale)}
            {" · "}
            {t("blog.readingTime", { minutes: post.readingMinutes })}
          </span>
          {/* o índice também avisa: senão o leitor abre esperando o próprio idioma */}
          {post.isFallback ? (
            <Pill tone="amber">{t("blog.fallbackLabel")}</Pill>
          ) : null}
        </div>
        <h3 className="m-0 text-[19px] leading-[1.32] font-semibold tracking-[-0.02em]">
          {data.title}
        </h3>
        <p className="m-0 text-[14.5px] text-fg-2">{data.summary}</p>
        <span className="label mt-[2px] inline-flex items-center gap-[7px] text-[11px] transition-[color,gap] duration-200 ease-ui group-hover:gap-3 group-hover:text-teal">
          {t("blog.read")} →
        </span>
      </div>
    </Link>
  );
}
