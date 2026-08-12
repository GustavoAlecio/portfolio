"use client";

import { useRef, useState, type ComponentProps } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";

/**
 * Substitui o `pre` do MDX. Mantém as props que o rehype-pretty-code injeta
 * (`data-language`, tema) e só acrescenta o botão de copiar.
 */
export function CodeBlock({ className, ...props }: ComponentProps<"pre">) {
  const t = useTranslations("ui");
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function copy() {
    const code = ref.current?.textContent;
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard bloqueado (http, permissão): não vale quebrar a página
    }
  }

  return (
    <div className="code-block group/code relative">
      <pre ref={ref} className={className} {...props} />
      <button
        type="button"
        onClick={copy}
        aria-label={t("copy")}
        className={cn(
          "label absolute top-[10px] right-[10px] rounded-[6px] border px-[9px] py-[5px]",
          "text-[10px] transition-[opacity,color,border-color] duration-200 ease-ui",
          // fica fora do caminho até o mouse chegar, mas volta no foco por teclado
          "opacity-0 group-hover/code:opacity-100 focus-visible:opacity-100",
          copied
            ? "border-teal-line text-teal"
            : "border-white/15 text-white/55 hover:border-white/35 hover:text-white/90",
        )}
      >
        {copied ? t("copied") : t("copy")}
      </button>
    </div>
  );
}
