import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProjects } from "@/content/repository";
import { ProjectCard } from "@/design-system/patterns/project-card";
import { Section, SectionHead } from "@/design-system/patterns/section";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });
  return { title: t("title"), description: t("lede") };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const projects = await getProjects(locale);

  return (
    <Section className="pt-[62px]">
      <SectionHead title={t("projects.title")} lede={t("projects.lede")} />
      <div className="grid gap-[18px]">
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} wide={i === 0} />
        ))}
      </div>
    </Section>
  );
}
