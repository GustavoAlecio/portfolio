import type { ReactElement } from "react";

/**
 * Satori implementa um subconjunto de CSS: só flexbox, sem gap em alguns casos,
 * sem variável CSS. Por isso os valores aqui são literais, e não tokens.
 */
const TONE = {
  flutter: "#0b7c69",
  arquitetura: "#7c3aed",
  performance: "#a16207",
  seguranca: "#a81d4f",
  infra: "#52525b",
} as const;

export function ogTemplate({
  title,
  eyebrow,
  footer,
  tone = "infra",
}: {
  title: string;
  eyebrow?: string;
  footer: string;
  tone?: keyof typeof TONE;
}): ReactElement {
  const accent = TONE[tone];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#f6f6f7",
        // a mesma aurora do site, achatada em duas manchas
        backgroundImage:
          "radial-gradient(50% 45% at 12% 0%, rgba(14,148,128,0.16), transparent 70%)," +
          "radial-gradient(45% 40% at 90% 8%, rgba(124,58,237,0.14), transparent 72%)",
        padding: "72px 80px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        {eyebrow ? (
          <div
            style={{
              display: "flex",
              fontSize: 24,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: accent,
              marginBottom: 28,
            }}
          >
            {eyebrow}
          </div>
        ) : null}
        <div
          style={{
            display: "flex",
            fontSize: title.length > 62 ? 62 : 76,
            lineHeight: 1.12,
            letterSpacing: "-0.03em",
            fontWeight: 700,
            color: "#18181b",
          }}
        >
          {title}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            width: 12,
            height: 12,
            borderRadius: 12,
            backgroundColor: accent,
            marginRight: 16,
          }}
        />
        <div style={{ display: "flex", fontSize: 26, color: "#52525b" }}>
          {footer}
        </div>
      </div>
    </div>
  );
}

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";
