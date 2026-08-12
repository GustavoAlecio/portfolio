import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Inter,
  JetBrains_Mono,
  Noto_Sans_SC,
} from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { SiteFooter } from "@/design-system/patterns/site-footer";
import { SiteHeader } from "@/design-system/patterns/site-header";
import { htmlLang, locales, routing, type Locale } from "@/i18n/routing";
import { siteUrl } from "@/lib/format";
import "../globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

/** Face de display: título e cartão. O corpo continua em Inter. */
const bricolage = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  variable: "--font-bricolage",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

/**
 * Noto Sans SC pesa centenas de KB mesmo subsetada, contra ~40 KB do Inter.
 * Carregar só na rota /zh não é otimização opcional, é requisito.
 */
const notoSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sc",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });
  return {
    // hreflang relativo é ignorado pelo Google: precisa de URL absoluta, e é o
    // metadataBase que promove os caminhos abaixo. Domínio próprio vem de
    // SITE_URL; sem ele, a Vercel já expõe o domínio de produção.
    metadataBase: new URL(siteUrl()),
    title: { default: t("name"), template: `%s · ${t("name")}` },
    description: t("description"),
    alternates: {
      languages: {
        ...Object.fromEntries(
          locales.map((l) => [
            htmlLang[l],
            l === routing.defaultLocale ? "/" : `/${l}`,
          ]),
        ),
        "x-default": "/",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  // só o que componente cliente consome — o provider sem escopo serializa o
  // arquivo de mensagens inteiro em cada página, e em zh isso não é trivial
  const messages = await getMessages();

  const isZh = (locale as Locale) === "zh";
  // no zh a face de display não se aplica: nenhuma latina desenha hanzi
  const fontVars = isZh
    ? `${notoSC.variable} ${jetbrains.variable}`
    : `${inter.variable} ${jetbrains.variable} ${bricolage.variable}`;

  return (
    <html lang={htmlLang[locale as Locale]} className={fontVars}>
      <body className="min-h-dvh">
        <NextIntlClientProvider
          messages={{ nav: messages.nav, ui: messages.ui }}
        >
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
