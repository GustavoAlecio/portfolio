/**
 * Em Markdown, quebra de linha simples dentro de um parágrafo vira espaço. Isso
 * é correto em escrita alfabética e errado em CJK, onde não há espaço entre
 * palavras: "熟悉到\n足以" renderiza como "熟悉到 足以".
 *
 * Confiar em não quebrar linha nos arquivos zh é frágil — qualquer formatador
 * reintroduz o problema. Então o pipeline remove o espaço quando ele está entre
 * dois caracteres CJK, inclusive na fronteira com inline (**negrito**, `código`).
 *
 * Espaço entre CJK e latino é preservado: "Flutter 与原生 Android" é correto e
 * é a convenção de espaçamento do chinês para termos estrangeiros.
 */

const CJK_SOURCE =
  "\\u3040-\\u30FF" + // hiragana e katakana
  "\\u3400-\\u4DBF" + // extensão A
  "\\u4E00-\\u9FFF" + // unificado
  "\\uF900-\\uFAFF" + // compatibilidade
  "\\u3000-\\u303F" + // pontuação CJK
  "\\uFF00-\\uFF60"; // formas largas

const BETWEEN_CJK = new RegExp(
  `([${CJK_SOURCE}])[ \\t]+(?=[${CJK_SOURCE}])`,
  "g",
);
const CJK_AT_END = new RegExp(`[${CJK_SOURCE}]$`);
const CJK_AT_START = new RegExp(`^[${CJK_SOURCE}]`);

type Node = {
  type: string;
  value?: string;
  children?: Node[];
};

const INLINE_WITH_TEXT = new Set([
  "strong",
  "emphasis",
  "inlineCode",
  "link",
  "delete",
]);

function firstChar(node: Node): string {
  if (typeof node.value === "string") return node.value.charAt(0);
  const child = node.children?.[0];
  return child ? firstChar(child) : "";
}

function lastChar(node: Node): string {
  if (typeof node.value === "string") return node.value.slice(-1);
  const children = node.children;
  const child = children?.[children.length - 1];
  return child ? lastChar(child) : "";
}

function walk(node: Node) {
  const children = node.children;
  if (!children?.length) return;

  for (const child of children) {
    if (child.type === "text" && typeof child.value === "string") {
      child.value = child.value.replace(BETWEEN_CJK, "$1");
    }
    walk(child);
  }

  for (let i = 0; i < children.length - 1; i++) {
    const left = children[i];
    const right = children[i + 1];

    // "…修改它 " + <strong>状态…</strong>
    if (
      left.type === "text" &&
      typeof left.value === "string" &&
      /[ \t]$/.test(left.value) &&
      INLINE_WITH_TEXT.has(right.type) &&
      CJK_AT_START.test(firstChar(right)) &&
      CJK_AT_END.test(left.value.replace(/[ \t]+$/, "").slice(-1))
    ) {
      left.value = left.value.replace(/[ \t]+$/, "");
    }

    // <strong>…哪里</strong> + " ，以及…"
    if (
      right.type === "text" &&
      typeof right.value === "string" &&
      /^[ \t]/.test(right.value) &&
      INLINE_WITH_TEXT.has(left.type) &&
      CJK_AT_END.test(lastChar(left)) &&
      CJK_AT_START.test(right.value.replace(/^[ \t]+/, "").charAt(0))
    ) {
      right.value = right.value.replace(/^[ \t]+/, "");
    }
  }
}

export function remarkCjkTighten() {
  return (tree: Node) => walk(tree);
}
