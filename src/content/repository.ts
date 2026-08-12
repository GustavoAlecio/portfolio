import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { fallbackChain, locales, type Locale } from "@/i18n/routing";
import {
  aboutFrontmatterSchema,
  postFrontmatterSchema,
  projectFrontmatterSchema,
  type About,
  type AboutFrontmatter,
  type Doc,
  type Post,
  type PostFrontmatter,
  type Project,
  type ProjectFrontmatter,
} from "./schema";
import type { ZodType } from "zod";

/**
 * Única porta de entrada para conteúdo. As páginas não sabem que existe
 * filesystem — trocar MDX por um CMS depois é reescrever só este arquivo.
 */

const ROOT = path.join(process.cwd(), "content");

function readingMinutes(body: string, locale: string) {
  // CJK conta caracteres, alfabético conta palavras
  const cjk = (body.match(/[一-鿿]/g) ?? []).length;
  if (locale === "zh" || cjk > 200) return Math.max(1, Math.round(cjk / 400));
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

async function listSlugs(kind: string, locale: string): Promise<string[]> {
  try {
    const files = await readdir(path.join(ROOT, kind, locale));
    return files
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => f.replace(/\.mdx$/, ""));
  } catch {
    return [];
  }
}

async function readDoc<T>(
  kind: string,
  locale: string,
  slug: string,
  schema: ZodType<T>,
): Promise<Doc<T> | null> {
  let raw: string;
  try {
    raw = await readFile(path.join(ROOT, kind, locale, `${slug}.mdx`), "utf8");
  } catch {
    return null;
  }
  const { data, content } = matter(raw);
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `Frontmatter inválido em content/${kind}/${locale}/${slug}.mdx\n${parsed.error.message}`,
    );
  }
  return {
    slug,
    locale,
    sourceLocale: locale,
    isFallback: false,
    readingMinutes: readingMinutes(content, locale),
    body: content,
    data: parsed.data,
  };
}

/**
 * Tradução de artigo é parcial por decisão de produto: exigir três versões de
 * cada texto longo mata a cadência de escrita. Faltando o locale pedido, serve
 * o original e marca `isFallback` — a UI avisa e o hreflang não é emitido.
 */
async function readWithFallback<T>(
  kind: string,
  locale: Locale,
  slug: string,
  schema: ZodType<T>,
): Promise<Doc<T> | null> {
  const direct = await readDoc(kind, locale, slug, schema);
  if (direct) return direct;

  for (const candidate of fallbackChain[locale]) {
    const doc = await readDoc(kind, candidate, slug, schema);
    if (doc) return { ...doc, locale, isFallback: true };
  }
  return null;
}

/** Todos os slugs que existem em qualquer locale — base do fallback. */
async function allSlugs(kind: string): Promise<string[]> {
  const perLocale = await Promise.all(locales.map((l) => listSlugs(kind, l)));
  return [...new Set(perLocale.flat())];
}

export async function getPosts(locale: Locale): Promise<Post[]> {
  const slugs = await allSlugs("posts");
  const docs = await Promise.all(
    slugs.map((slug) =>
      readWithFallback("posts", locale, slug, postFrontmatterSchema),
    ),
  );
  return (docs.filter(Boolean) as Post[])
    .filter((p) => !p.data.draft)
    .sort((a, b) => b.data.publishedAt.localeCompare(a.data.publishedAt));
}

export async function getPost(
  locale: Locale,
  slug: string,
): Promise<Post | null> {
  return readWithFallback<PostFrontmatter>(
    "posts",
    locale,
    slug,
    postFrontmatterSchema,
  );
}

export async function getProjects(locale: Locale): Promise<Project[]> {
  const slugs = await allSlugs("projects");
  const docs = await Promise.all(
    slugs.map((slug) =>
      readWithFallback("projects", locale, slug, projectFrontmatterSchema),
    ),
  );
  return (docs.filter(Boolean) as Project[])
    .filter((p) => !p.data.draft)
    .sort((a, b) => a.data.order - b.data.order);
}

export async function getProject(
  locale: Locale,
  slug: string,
): Promise<Project | null> {
  return readWithFallback<ProjectFrontmatter>(
    "projects",
    locale,
    slug,
    projectFrontmatterSchema,
  );
}

/** Locales em que o documento existe de fato — alimenta hreflang. */
export async function getAvailableLocales(
  kind: "posts" | "projects",
  slug: string,
): Promise<Locale[]> {
  const found = await Promise.all(
    locales.map(async (l) => ((await listSlugs(kind, l)).includes(slug) ? l : null)),
  );
  return found.filter(Boolean) as Locale[];
}

/**
 * A Sobre é uma página só, e é portfólio — traduzida 100%. Fica em
 * content/about/{locale}.mdx para ser editada como qualquer outro texto,
 * em vez de morar dentro do JSX.
 */
export async function getAbout(locale: Locale): Promise<About | null> {
  return readWithFallback<AboutFrontmatter>(
    "about",
    locale,
    "index",
    aboutFrontmatterSchema,
  );
}

export async function getPostSlugs() {
  return allSlugs("posts");
}
export async function getProjectSlugs() {
  return allSlugs("projects");
}
