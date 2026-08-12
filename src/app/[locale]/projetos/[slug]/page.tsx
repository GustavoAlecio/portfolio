import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProject, getProjects, getProjectSlugs } from "@/content/repository";
import { Mdx } from "@/content/mdx";
import { MediaFrame } from "@/design-system/components/media-frame";
import { MeasureBand } from "@/design-system/components/measures";
import { Pill } from "@/design-system/components/pill";
import { Container } from "@/design-system/patterns/section";
import { Link } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProject(locale, slug);
  if (!project) return {};
  return { title: project.data.title, description: project.data.summary };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const [project, all, t] = await Promise.all([
    getProject(locale, slug),
    getProjects(locale),
    getTranslations(),
  ]);
  if (!project) notFound();

  const { data } = project;
  const cover = data.media[0];
  const index = all.findIndex((p) => p.slug === slug);
  const next = all[(index + 1) % all.length];

  return (
    <>
      <Container className="pt-[62px] pb-[62px]">
        <div className="mb-7">
          <div className="mb-[14px] flex flex-wrap gap-[6px]">
            {data.status === "production" ? (
              <Pill tone="teal" caps>
                {t("projects.inProduction")}
              </Pill>
            ) : null}
            <Pill>
              {data.period.from} — {data.period.to ?? t("projects.present")}
            </Pill>
            <Pill>{data.role}</Pill>
          </div>
          <h1 className="m-0 mb-[14px] text-[clamp(32px,4.6vw,50px)] leading-[1.06] font-bold tracking-[-0.035em]">
            {data.title}
          </h1>
          <p className="m-0 max-w-[54ch] text-[19px] leading-[1.55] tracking-[-0.012em]">
            {data.summary}
          </p>
        </div>

        <div className="mb-[26px]">
          <MeasureBand items={data.measures} />
        </div>

        {cover ? (
          <div className="mb-[30px]">
            <MediaFrame item={cover} priority />
          </div>
        ) : null}

        <div className="prose">
          <Mdx source={project.body} />
        </div>
      </Container>

      {next && next.slug !== slug ? (
        <Container className="pb-14">
          <Link
            href={{ pathname: "/projetos/[slug]", params: { slug: next.slug } }}
            className="group flex flex-wrap items-center justify-between gap-[18px] rounded-card border border-line bg-surface px-6 py-[22px] no-underline shadow-e1 transition-[border-color,box-shadow,transform] duration-200 ease-ui hover:-translate-y-[2px] hover:border-line-strong hover:shadow-e3"
          >
            <span>
              <span className="label text-[11px]">{t("projects.next")}</span>
              <b className="mt-[5px] block text-[21px] font-bold tracking-[-0.025em]">
                {next.data.title}
              </b>
            </span>
            <span
              aria-hidden
              className="font-mono text-xl text-fg-3 transition-colors duration-200 ease-ui group-hover:text-teal"
            >
              →
            </span>
          </Link>
        </Container>
      ) : null}
    </>
  );
}
