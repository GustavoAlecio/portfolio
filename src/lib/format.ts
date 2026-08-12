/**
 * Origem pública do site, em ordem de precedência: domínio próprio, domínio de
 * produção da Vercel, localhost. Sem uma origem absoluta o Google descarta o
 * hreflang, e o trabalho de i18n não conta para busca.
 */
export function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}

/**
 * `new Date("2026-07-22")` é meia-noite UTC. Formatado em America/Sao_Paulo
 * (UTC-3) isso vira 21/07 — off-by-one em toda data do site. Ancorar ao
 * meio-dia UTC e formatar em UTC resolve para qualquer fuso.
 */
export function formatDate(iso: string, locale: string) {
  // zh sem região devolve "7" em `month: short`, não "7月" — montar à mão a
  // partir do ISO evita isso e dispensa fuso por completo
  if (locale.startsWith("zh")) {
    const [y, m, d] = iso.split("-");
    return `${y}年${Number(m)}月${Number(d)}日`;
  }

  const date = new Date(`${iso}T12:00:00Z`);
  const parts = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";

  // descarta as partículas do pt ("22 de jul. de 2026" → "22 jul 2026")
  return `${get("day")} ${get("month").replace(".", "")} ${get("year")}`;
}
