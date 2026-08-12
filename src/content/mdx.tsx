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

/** Sumário: extrai os h2 do MDX sem renderizar duas vezes. */
export function extractHeadings(body: string) {
  const headings: { id: string; text: string }[] = [];
  const lines = body.split("\n");
  let inFence = false;
  for (const line of lines) {
    if (line.startsWith("```")) inFence = !inFence;
    if (inFence) continue;
    const match = /^##\s+(.+)$/.exec(line);
    if (!match) continue;
    const text = match[1].trim();
    const id = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .trim()
      .replace(/\s+/g, "-");
    headings.push({ id, text });
  }
  return headings;
}
