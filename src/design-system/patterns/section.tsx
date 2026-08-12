import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Espaçamento sempre no eixo, nunca shorthand: `padding: 62px 0` numa classe
 * que também carrega o recuo horizontal zera o eixo errado na cascata.
 */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-[1080px] px-[26px]", className)}>
      {children}
    </div>
  );
}

export function Section({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  // só padding inferior: o espaço superior vem do bloco anterior, senão as
  // seções empilham 62 + 62 e abrem um vão de 124 px entre elas
  return (
    <section className={cn("pb-[62px]", className)}>
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHead({
  kicker,
  title,
  lede,
  action,
}: {
  kicker?: string;
  title?: string;
  lede?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-7 grid gap-[11px]">
      {kicker ? (
        <p className="m-0 flex items-center gap-[9px]">
          <span
            aria-hidden
            className="size-[7px] shrink-0 rounded-full bg-teal-solid"
          />
          <span className="label text-[11px] tracking-[0.16em] text-teal">
            {kicker}
          </span>
          {action ? <span className="ml-auto">{action}</span> : null}
        </p>
      ) : null}
      {title ? (
        <h2 className="m-0 text-[clamp(24px,3.2vw,34px)] leading-[1.14] font-bold tracking-[-0.03em] text-balance">
          {title}
        </h2>
      ) : null}
      {lede ? (
        <p className="m-0 max-w-[58ch] text-[16.5px] text-fg-2">{lede}</p>
      ) : null}
    </div>
  );
}
