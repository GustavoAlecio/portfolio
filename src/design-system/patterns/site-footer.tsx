import { getTranslations } from "next-intl/server";
import { localeNames, locales } from "@/i18n/routing";

export async function SiteFooter() {
  const t = await getTranslations();
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-between gap-4 px-[26px] pt-[34px] pb-10">
        <span className="label">
          {t("footer.rights", { year: new Date().getFullYear() })}
        </span>
        <span className="label">
          {locales.map((l) => localeNames[l]).join(" · ")}
        </span>
      </div>
    </footer>
  );
}
