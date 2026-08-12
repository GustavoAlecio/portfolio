import { z } from "zod";

/**
 * Frontmatter inválido quebra o build, não a página em produção.
 * Este arquivo é o contrato entre o que eu escrevo em MDX e o que a UI recebe.
 */

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "use o formato YYYY-MM-DD");

export const mediaItemSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("video"),
    src: z.string(),
    poster: z.string(),
    alt: z.string(),
    aspect: z.string().default("16/9"),
    caption: z.string().optional(),
  }),
  z.object({
    kind: z.literal("image"),
    src: z.string(),
    alt: z.string(),
    aspect: z.string().default("16/9"),
    caption: z.string().optional(),
  }),
  z.object({
    kind: z.literal("shot"),
    src: z.string(),
    alt: z.string(),
    caption: z.string(),
  }),
]);
export type MediaItem = z.infer<typeof mediaItemSchema>;

export const postFrontmatterSchema = z.object({
  title: z.string(),
  summary: z.string(),
  publishedAt: isoDate,
  updatedAt: isoDate.optional(),
  category: z.enum([
    "flutter",
    "arquitetura",
    "performance",
    "seguranca",
    "infra",
  ]),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});
export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>;

export type Doc<T> = {
  slug: string;
  locale: string;
  /** locale em que o texto realmente está — difere de `locale` quando há fallback */
  sourceLocale: string;
  isFallback: boolean;
  readingMinutes: number;
  body: string;
  data: T;
};

export const aboutFrontmatterSchema = z.object({
  lede: z.string(),
  /** Posicionamento de senioridade — o que você é, não onde trabalha. */
  headline: z.string(),
  location: z.string(),
  links: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
  /**
   * Agrupado por papel, com nota de profundidade onde importa. Nuvem de 30
   * badges sinaliza amplitude e destrói credibilidade; grupo rotulado com
   * ressalva explícita faz o contrário.
   */
  tools: z.array(
    z.object({
      group: z.string(),
      note: z.string().optional(),
      items: z.array(z.string()),
    }),
  ),
  principles: z.array(z.object({ title: z.string(), body: z.string() })),
  timeline: z.array(
    z.object({
      when: z.string(),
      org: z.string(),
      role: z.string(),
      body: z.string(),
      stack: z.array(z.string()).default([]),
    }),
  ),
  contact: z.string(),
  email: z.string(),
});
export type AboutFrontmatter = z.infer<typeof aboutFrontmatterSchema>;

export type Post = Doc<PostFrontmatter>;
export type About = Doc<AboutFrontmatter>;
