import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mdx } from "@/content/mdx";
import { getAbout } from "@/content/repository";
import { ButtonAnchor } from "@/design-system/components/button";
import { Pill } from "@/design-system/components/pill";
import { Container } from "@/design-system/patterns/section";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [t, about] = await Promise.all([
    getTranslations({ locale, namespace: "about" }),
    getAbout(locale),
  ]);
  return { title: t("title"), description: about?.data.lede };
}

function BlockTitle({ children }: { children: string }) {
  return (
    <p className="label mb-[18px] flex items-center gap-[11px] text-[11.5px] tracking-[0.16em] text-teal">
      {children}
      <span aria-hidden className="h-px flex-1 bg-line" />
    </p>
  );
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, about] = await Promise.all([getTranslations(), getAbout(locale)]);
  if (!about) notFound();

  const { data } = about;

  return (
    <Container className="py-[62px]">
      <div className="grid items-start gap-11 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="overflow-hidden rounded-card border border-line bg-surface shadow-e2 lg:sticky lg:top-5">
          <div className="grid aspect-4/5 place-items-center bg-recess bg-[radial-gradient(70%_60%_at_30%_20%,rgba(14,148,128,0.2),transparent_70%),radial-gradient(60%_60%_at_80%_85%,rgba(124,58,237,0.18),transparent_72%)]">
            <span className="label px-[18px] text-center text-[10.5px] leading-[1.7]">
              {t("about.portraitSlot")}
              <br />
              4:5 · webp
            </span>
          </div>
          <div className="grid gap-[9px] border-t border-line px-[17px] py-[15px]">
            <b className="text-[15.5px] font-semibold tracking-[-0.01em]">
              {t("site.name")}
            </b>
            <span className="label text-[11px] leading-[1.6] text-fg-2">
              {data.headline}
            </span>
            <span className="label text-[10.5px]">{data.location}</span>
            <div className="flex flex-wrap gap-[6px]">
              {data.links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="label rounded-full border border-line bg-surface-2 px-[9px] py-[4px] text-[10.5px] no-underline transition-colors duration-200 ease-ui hover:border-teal-line hover:text-teal"
                >
                  {l.label}
                </a>
              ))}
              <a
                href={`mailto:${data.email}`}
                className="label rounded-full border border-line bg-surface-2 px-[9px] py-[4px] text-[10.5px] no-underline transition-colors duration-200 ease-ui hover:border-teal-line hover:text-teal"
              >
                {t("about.email")}
              </a>
            </div>
          </div>
        </aside>

        <div className="grid gap-10">
          <div>
            <h1 className="m-0 mb-4 text-[clamp(30px,4.4vw,46px)] leading-[1.08] font-bold tracking-[-0.035em]">
              {t("about.title")}
            </h1>
            <p className="m-0 max-w-[54ch] text-xl leading-[1.55] tracking-[-0.012em]">
              {data.lede}
            </p>
          </div>

          <div className="prose">
            <Mdx source={about.body} />
          </div>

          <div>
            <BlockTitle>{t("about.tools")}</BlockTitle>
            {/* número ímpar de grupos deixaria a última célula vazia: o último
                cartão ocupa a linha inteira em vez de ficar órfão */}
            <div className="grid gap-[13px] sm:grid-cols-2 sm:[&>*:last-child:nth-child(odd)]:col-span-2">
              {data.tools.map((g) => (
                <div
                  key={g.group}
                  className="grid content-start gap-[10px] rounded-card border border-line bg-surface px-5 py-[19px] shadow-e1"
                >
                  <h3 className="label m-0 text-[11px] text-teal">{g.group}</h3>
                  {g.note ? (
                    <p className="m-0 text-[13.5px] leading-[1.55] text-fg-2">
                      {g.note}
                    </p>
                  ) : null}
                  <div className="flex flex-wrap gap-[6px]">
                    {g.items.map((item) => (
                      <Pill key={item}>{item}</Pill>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <BlockTitle>{t("about.howIWork")}</BlockTitle>
            <div className="grid gap-[13px] sm:grid-cols-2">
              {data.principles.map((p, i) => (
                <div
                  key={p.title}
                  className="grid content-start gap-2 rounded-card border border-line bg-surface px-5 py-[19px] shadow-e1"
                >
                  <span className="tabular label text-[10.5px] tracking-[0.12em]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="m-0 text-base font-semibold tracking-[-0.015em]">
                    {p.title}
                  </h3>
                  <p className="m-0 text-[14.5px] leading-[1.62] text-fg-2">
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <BlockTitle>{t("about.timeline")}</BlockTitle>
            <div className="grid">
              {data.timeline.map((item, i) => (
                <div
                  key={`${item.org}-${item.when}`}
                  className={`grid gap-6 border-t border-line py-[18px] lg:grid-cols-[132px_minmax(0,1fr)] ${
                    i === data.timeline.length - 1 ? "border-b" : ""
                  }`}
                >
                  <div className="grid content-start gap-[5px]">
                    <span className="tabular font-mono text-[13px] font-semibold tracking-[0.02em]">
                      {item.when}
                    </span>
                    <span className="label text-[10.5px]">{item.org}</span>
                  </div>
                  <div>
                    <h3 className="m-0 mb-[5px] text-[17.5px] font-semibold tracking-[-0.02em]">
                      {item.role}
                    </h3>
                    <p className="m-0 mb-[9px] max-w-[58ch] text-[15px] text-fg-2">
                      {item.body}
                    </p>
                    <div className="flex flex-wrap gap-[6px]">
                      {item.stack.map((s) => (
                        <Pill key={s}>{s}</Pill>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <BlockTitle>{t("about.talk")}</BlockTitle>
            <p className="m-0 mb-[18px] max-w-[60ch] text-[15.5px] text-fg-2">
              {data.contact}
            </p>
            <div className="flex flex-wrap gap-[11px]">
              <ButtonAnchor href={`mailto:${data.email}`} variant="primary">
                {t("about.email")}
              </ButtonAnchor>
              {data.cv ? (
                <ButtonAnchor href={data.cv} download>
                  {t("about.cv")}
                </ButtonAnchor>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
