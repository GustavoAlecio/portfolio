import type { z } from "zod";
import type { measureSchema } from "@/content/schema";

type Measure = z.infer<typeof measureSchema>;

/** Tabela antes/depois. Número tabular e alinhado é o ponto. */
export function Measures({ items }: { items: Measure[] }) {
  if (!items.length) return null;
  return (
    <dl className="grid">
      {items.map((m, i) => (
        <div
          key={m.label}
          className={cnRow(i === items.length - 1)}
        >
          <dt className="label text-[11px]">{m.label}</dt>
          <dd className="tabular m-0 font-mono text-sm font-semibold whitespace-nowrap text-teal">
            {m.before ? (
              <s className="mr-[7px] text-[11.5px] font-normal text-fg-3">
                {m.before}
              </s>
            ) : null}
            {m.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function cnRow(last: boolean) {
  return [
    "grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 border-t border-line py-[10px]",
    last && "border-b",
  ]
    .filter(Boolean)
    .join(" ");
}

/** Faixa de destaque no topo do estudo de caso. */
export function MeasureBand({ items }: { items: Measure[] }) {
  if (!items.length) return null;
  return (
    <div className="grid overflow-hidden rounded-card border border-line bg-surface shadow-e1 sm:grid-cols-2 lg:grid-cols-4">
      {items.slice(0, 4).map((m) => (
        <div
          key={m.label}
          className="flex min-h-[84px] flex-col justify-between gap-2 border-b border-line px-[19px] pt-4 pb-[17px] last:border-b-0 lg:border-r lg:border-b-0 lg:last:border-r-0"
        >
          <span className="label block text-[10.5px] leading-[1.5]">
            {m.label}
          </span>
          <b className="tabular block text-[21px] leading-none font-bold tracking-[-0.025em]">
            {m.value}
          </b>
        </div>
      ))}
    </div>
  );
}
