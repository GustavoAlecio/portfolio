import { getLocale, getTranslations } from "next-intl/server";
import { getPosts } from "@/content/repository";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { LangSwitcher } from "./lang-switcher";

const navItem =
  "block rounded-[8px] px-[11px] py-[7px] no-underline label text-[11.5px] " +
  "tracking-[0.08em] transition-colors duration-200 ease-ui " +
  "hover:bg-surface-2 hover:text-fg aria-[current=page]:bg-teal-wash aria-[current=page]:text-teal";

export async function SiteHeader() {
  const [t, locale] = await Promise.all([getTranslations(), getLocale()]);

  // índice vazio no nav passa impressão de obra inacabada; o item liga sozinho
  // quando existir conteúdo publicado
  const posts = await getPosts(locale as Locale);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-[8px]">
      <div className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-between gap-4 px-[26px] py-2">
        <Link href="/" className="flex items-center gap-[10px] no-underline">
          <span
            aria-hidden
            className="grid size-[30px] shrink-0 place-items-center rounded-[8px] bg-linear-135 from-teal-solid to-violet font-mono text-[11px] font-bold tracking-[-0.02em] text-white shadow-e1"
          >
            GA
          </span>
          <span>
            <b className="block text-[15px] leading-tight font-semibold tracking-[-0.01em]">
              {t("site.name")}
            </b>
            <span className="label block text-[9.5px] tracking-[0.16em]">
              {t("site.role")}
            </span>
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-[14px]">
          <nav>
            <ul className="flex list-none gap-1 p-0">
              {posts.length ? (
                <li>
                  <Link href="/blog" className={navItem}>
                    {t("nav.blog")}
                  </Link>
                </li>
              ) : null}
              <li>
                <Link href="/sobre" className={navItem}>
                  {t("nav.about")}
                </Link>
              </li>
            </ul>
          </nav>
          <LangSwitcher label={t("nav.language")} />
        </div>
      </div>
    </header>
  );
}
