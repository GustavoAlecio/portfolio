import { getTranslations } from "next-intl/server";
import type { Project } from "@/content/schema";
import { MediaFrame } from "@/design-system/components/media-frame";
import { Measures } from "@/design-system/components/measures";
import { Pill } from "@/design-system/components/pill";
import { Link } from "@/i18n/navigation";

const card =
  "reveal group block overflow-hidden rounded-card border border-line bg-surface no-underline shadow-e1 " +
  "transition-[border-color,box-shadow,transform] duration-250 ease-ui " +
  "hover:border-line-strong hover:shadow-e3 hover:-translate-y-[2px]";

export async function ProjectCard({
  project,
  wide = false,
}: {
  project: Project;
  wide?: boolean;
}) {
  const t = await getTranslations();
  const { data } = project;
  const cover = data.media[0];

  return (
    <Link
      href={{ pathname: "/projetos/[slug]", params: { slug: project.slug } }}
      className={card}
    >
      <article
        className={wide ? "grid lg:grid-cols-[1.06fr_0.94fr]" : "grid"}
      >
        <div className="grid content-start gap-[15px] p-[25px]">
          <div className="flex flex-wrap items-center gap-[10px]">
            {data.status === "production" ? (
              <Pill tone="teal" caps>
                {t("projects.inProduction")}
              </Pill>
            ) : null}
            <span className="label text-[11px]">
              {data.period.from} — {data.period.to ?? t("projects.present")} ·{" "}
              {data.role}
            </span>
          </div>
          <h3 className="m-0 text-2xl leading-[1.16] font-bold tracking-[-0.025em] transition-colors duration-200 ease-ui group-hover:text-teal">
            {data.title}
          </h3>
          <p className="m-0 text-[15.5px] text-fg-2">{data.summary}</p>
          <Measures items={data.measures.slice(0, 3)} />
          <div className="flex flex-wrap gap-[6px]">
            {data.stack.map((s) => (
              <Pill key={s}>{s}</Pill>
            ))}
          </div>
        </div>

        {wide && cover ? (
          <div className="grid place-items-center border-t border-line bg-recess p-6 lg:border-t-0 lg:border-l">
            <MediaFrame item={cover} className="w-full" />
          </div>
        ) : null}
      </article>
    </Link>
  );
}
