import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** A cor da pill carrega categoria, não decoração. */
const tones = {
  neutral: "bg-surface-2 border-line text-fg-2",
  teal: "bg-teal-wash border-teal-line text-teal",
  violet: "bg-violet-wash border-violet-line text-violet",
  amber: "bg-amber-wash border-amber-line text-amber",
  rose: "bg-rose-wash border-rose-line text-rose",
} as const;

export type PillTone = keyof typeof tones;

/** Categoria de artigo → tom. Mudar aqui muda o site inteiro. */
export const categoryTone: Record<string, PillTone> = {
  flutter: "teal",
  arquitetura: "violet",
  performance: "amber",
  seguranca: "rose",
  infra: "neutral",
};

export function Pill({
  tone = "neutral",
  caps = false,
  children,
  className,
}: {
  tone?: PillTone;
  /** Caixa alta só em rótulo de sistema. Nome de tecnologia tem caixa própria:
   *  "gRPC" e "iOS" viram "GRPC" e "IOS" e ficam errados. */
  caps?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "label rounded-full border px-[9px] py-[4px] text-[10.5px] tracking-[0.08em]",
        caps ? "uppercase" : "normal-case",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
