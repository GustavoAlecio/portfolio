import type { ReactNode } from "react";

/**
 * Root layout mínimo: o <html> real é emitido por app/[locale]/layout.tsx,
 * que é quem conhece o locale e portanto o atributo lang.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
