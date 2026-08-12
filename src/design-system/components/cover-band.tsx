import type { PostFrontmatter } from "@/content/schema";
import { cn } from "@/lib/cn";

/**
 * Faixa de capa gerada em código: nenhum arquivo no repo, e o artigo que eu
 * escrever daqui a seis meses já nasce com a dele.
 *
 * O desenho é um traço de atividade — o assunto do site é aplicação que
 * responde ao vivo, e é a única metáfora aqui que não é enfeite. As alturas
 * saem de um hash do slug, então a mesma URL tem sempre a mesma assinatura.
 */

const tones: Record<
  PostFrontmatter["category"],
  { stroke: string; wash: string }
> = {
  flutter: { stroke: "var(--color-teal)", wash: "var(--color-teal-wash)" },
  arquitetura: {
    stroke: "var(--color-violet)",
    wash: "var(--color-violet-wash)",
  },
  performance: {
    stroke: "var(--color-amber)",
    wash: "var(--color-amber-wash)",
  },
  seguranca: { stroke: "var(--color-rose)", wash: "var(--color-rose-wash)" },
  infra: { stroke: "var(--color-fg-3)", wash: "var(--color-surface-2)" },
};

/** FNV-1a: barato, estável entre servidor e cliente, e sem dependência. */
function hash(text: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

const BARS = 56;
const VIEW_W = 560;
const VIEW_H = 80;

export function CoverBand({
  seed,
  category,
  className,
}: {
  seed: string;
  category: PostFrontmatter["category"];
  className?: string;
}) {
  const tone = tones[category];
  let state = hash(seed);
  const next = () => {
    // xorshift32 sobre o hash: sequência determinística a partir do slug
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return ((state >>> 0) % 1000) / 1000;
  };

  // a inclinação também sai do slug: cada artigo tem sua hachura
  const slant = 18 + (hash(seed) % 3) * 9;
  const dx = VIEW_H * Math.tan((slant * Math.PI) / 180);

  let cursor = -dx;
  const strokes: { x: number; w: number; opacity: number }[] = [];
  while (cursor < VIEW_W + dx) {
    const r = next();
    strokes.push({
      x: cursor,
      w: r > 0.86 ? 5 : r > 0.62 ? 2.5 : 1.25,
      opacity: r > 0.86 ? 0.5 : r > 0.62 ? 0.32 : 0.2,
    });
    cursor += 5 + r * 16;
  }

  return (
    <div
      className={cn("overflow-hidden", className)}
      style={{ backgroundColor: tone.wash }}
      aria-hidden
    >
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        className="block h-full w-full"
        role="presentation"
      >
        {strokes.map((s) => (
          <line
            key={s.x}
            x1={s.x}
            y1={VIEW_H}
            x2={s.x + dx}
            y2={0}
            stroke={tone.stroke}
            strokeWidth={s.w}
            opacity={s.opacity}
          />
        ))}
      </svg>
    </div>
  );
}
