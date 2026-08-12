"use client";

import { useParams } from "next/navigation";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { localeNames, locales, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";

export function LangSwitcher({ label }: { label: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [pending, startTransition] = useTransition();
  const current = params.locale as Locale;

  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "flex gap-[2px] rounded-full border border-line bg-surface p-[2px] shadow-e1",
        pending && "opacity-60",
      )}
    >
      {locales.map((locale) => {
        const active = locale === current;
        return (
          <button
            key={locale}
            type="button"
            aria-pressed={active}
            disabled={pending}
            onClick={() =>
              startTransition(() => {
                // pathname é o caminho interno; o router traduz o segmento
                router.replace(
                  { pathname, params: params as never },
                  { locale },
                );
              })
            }
            className={cn(
              "label rounded-full px-[11px] py-[5px] text-[10.5px] tracking-[0.08em] transition-colors duration-200 ease-ui",
              active
                ? "bg-teal-solid text-on-accent"
                : "text-fg-3 hover:bg-surface-2 hover:text-fg",
            )}
          >
            {localeNames[locale]}
          </button>
        );
      })}
    </div>
  );
}
