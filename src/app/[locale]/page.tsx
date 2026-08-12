import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPosts, getProjects } from "@/content/repository";
import { ButtonLink } from "@/design-system/components/button";
import { PostCard } from "@/design-system/patterns/post-card";
import { ProjectCard } from "@/design-system/patterns/project-card";
import {
  Container,
  Section,
  SectionHead,
} from "@/design-system/patterns/section";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";


export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const [projects, posts] = await Promise.all([
    getProjects(locale),
    getPosts(locale),
  ]);
  const featured = projects.find((p) => p.data.featured) ?? projects[0];

  return (
    <>
      <Container className="pt-[74px] pb-[62px]">
        <p className="mb-[22px] inline-flex items-center gap-[9px] rounded-full border border-teal-line bg-surface px-[13px] py-[6px] shadow-e1">
          <span
            aria-hidden
            className="size-[7px] shrink-0 rounded-full bg-teal-solid"
          />
          <span className="label text-[11px] tracking-[0.12em] text-teal">
            {t("home.available")}
          </span>
        </p>

        <h1 className="m-0 mb-5 max-w-[20ch] text-[clamp(34px,5.4vw,60px)] leading-[1.06] font-bold tracking-[-0.035em] text-balance">
          {t("home.headlineStart")}{" "}
          <span className="bg-linear-135 from-teal-solid to-violet bg-clip-text text-transparent">
            {t("home.headlineAccent")}
          </span>
          {t("home.headlineEnd")}
        </h1>

        <p className="m-0 mb-[30px] max-w-[56ch] text-[17.5px] text-fg-2">
          {t("home.lede")}
        </p>

        {/* CTA acompanha o que existe publicado: mandar para um índice vazio é
            pior que não oferecer o link. Volta sozinho quando houver conteúdo. */}
        <div className="flex flex-wrap gap-[11px]">
          {projects.length ? (
            <ButtonLink href="/projetos" variant="primary">
              {t("home.ctaProjects")}
            </ButtonLink>
          ) : (
            <ButtonLink href="/sobre" variant="primary">
              {t("home.ctaAbout")}
            </ButtonLink>
          )}
          {posts.length ? (
            <ButtonLink href="/blog">{t("home.ctaBlog")}</ButtonLink>
          ) : null}
        </div>
      </Container>

      {featured ? (
        <Section>
          <SectionHead
            kicker={t("home.featured")}
            action={
              <Link href="/projetos" className="label text-[11px] no-underline hover:text-teal">
                {t("home.allProjects")} →
              </Link>
            }
          />
          <ProjectCard project={featured} wide />
        </Section>
      ) : null}

      {posts.length ? (
        <Section>
          <SectionHead
            kicker={t("home.latest")}
            action={
              <Link href="/blog" className="label text-[11px] no-underline hover:text-teal">
                {t("home.allPosts")} →
              </Link>
            }
          />
          <div className="grid gap-[18px] md:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
