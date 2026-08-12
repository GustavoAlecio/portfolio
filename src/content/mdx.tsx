import GithubSlugger from "github-slugger";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/design-system/components/code-block";
import { MediaFrame } from "@/design-system/components/media-frame";
import { remarkCjkTighten } from "./remark-cjk-tighten";

const components = { MediaFrame, pre: CodeBlock };

export function Mdx({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm, remarkCjkTighten],
          rehypePlugins: [
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: "wrap" }],
            [
              rehypePrettyCode,
              { theme: "github-dark-default", keepBackground: false },
            ],
          ],
        },
      }}
    />
  );
}

/**
 * Sumário: extrai os h2 do MDX sem renderizar duas vezes.
 *
 * O `id` vem do mesmo github-slugger que o rehype-slug usa no pipeline. Calcular
 * o slug à mão aqui produz âncora que não existe na página: o slugger preserva
 * acento, e qualquer normalização diferente quebra o link em silêncio.
 */
export function extractHeadings(body: string) {
  const slugger = new GithubSlugger();
  const headings: { id: string; text: string }[] = [];
  let inFence = false;

  for (const line of body.split("\n")) {
    if (line.startsWith("```")) inFence = !inFence;
    if (inFence) continue;

    const match = /^##\s+(.+)$/.exec(line);
    if (!match) continue;

    // o slug é gerado sobre o texto renderizado, sem a sintaxe inline
    const text = match[1]
      .trim()
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");

    headings.push({ id: slugger.slug(text), text });
  }
  return headings;
}
