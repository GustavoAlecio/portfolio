import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

const base =
  "inline-flex items-center gap-2 font-mono text-xs tracking-[0.08em] uppercase " +
  "px-[18px] py-[11px] rounded-[8px] border shadow-e1 no-underline cursor-pointer " +
  "transition-[color,border-color,box-shadow,transform,background] duration-200 ease-ui";

const variants = {
  primary:
    "bg-teal-solid border-teal-solid text-on-accent font-semibold hover:bg-teal-deep hover:border-teal-deep",
  outline:
    "bg-surface border-line-strong text-fg hover:border-teal-line hover:text-teal hover:shadow-e2 hover:-translate-y-px",
} as const;

type Variant = keyof typeof variants;

export function Button({
  variant = "outline",
  className,
  children,
  ...rest
}: ComponentProps<"button"> & { variant?: Variant; children: ReactNode }) {
  return (
    <button className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "outline",
  className,
  children,
  ...rest
}: ComponentProps<typeof Link> & { variant?: Variant; children: ReactNode }) {
  return (
    <Link className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </Link>
  );
}

export function ButtonAnchor({
  variant = "outline",
  className,
  children,
  ...rest
}: ComponentProps<"a"> & { variant?: Variant; children: ReactNode }) {
  return (
    <a className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </a>
  );
}
