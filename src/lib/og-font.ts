/**
 * O Satori não lê woff2, e um título em chinês precisaria da Noto Sans SC
 * inteira — vários megabytes numa função que gera imagem.
 *
 * A API do Google Fonts aceita `text=`: ela devolve um subset com exatamente
 * os caracteres pedidos, o que resolve latino e CJK pelo mesmo caminho e mantém
 * a fonte em alguns kilobytes. O User-Agent antigo é proposital — com um
 * moderno o Google responde woff2, que o Satori não consegue usar.
 */
export async function loadGoogleFont(
  family: string,
  weight: number,
  text: string,
): Promise<ArrayBuffer | null> {
  const url =
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}` +
    `:wght@${weight}&text=${encodeURIComponent(text)}`;

  try {
    const css = await fetch(url, {
      headers: { "User-Agent": "Mozilla/4.0 (compatible; MSIE 6.0)" },
    }).then((r) => r.text());

    const src = /src:\s*url\(([^)]+)\)\s*format\('(?:truetype|opentype)'\)/.exec(
      css,
    );
    if (!src?.[1]) return null;

    return await fetch(src[1]).then((r) => r.arrayBuffer());
  } catch {
    // imagem com fonte padrão é melhor que rota quebrada
    return null;
  }
}

/** Fonte por locale: CJK precisa de família própria ou sai tudo em tofu. */
export function fontFamilyFor(locale: string) {
  return locale.startsWith("zh") ? "Noto Sans SC" : "Inter";
}
