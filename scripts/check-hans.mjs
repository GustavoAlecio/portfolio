#!/usr/bin/env node
/**
 * Garante que todo conteúdo do locale zh está em chinês SIMPLIFICADO.
 *
 * Como funciona: converter tradicional → simplificado é idempotente em texto
 * que já é simplificado. Se a conversão muda algum caractere, aquele caractere
 * era tradicional.
 *
 * Usa o dicionário genérico ("t"), não o de Taiwan ("tw"): o de Taiwan trata
 * 么 como caractere distinto e acusaria 怎么 — que é simplificado correto.
 *
 * Uma tradução futura pode entrar em tradicional sem ninguém notar; este script
 * existe para isso falhar no CI em vez de ir para produção.
 */
import { Converter } from "opencc-js";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = path.resolve(import.meta.dirname, "..");
const ZH_LOCALE = "zh";

const toSimplified = Converter({ from: "t", to: "cn" });

/** Arquivos que devem estar em simplificado: mensagens + tudo em content/**\/zh. */
function collectTargets() {
  const targets = [path.join(ROOT, "messages", `${ZH_LOCALE}.json`)];

  const contentRoot = path.join(ROOT, "content");
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) {
        walk(full);
      } else if (
        entry.endsWith(".mdx") &&
        path.basename(path.dirname(full)) === ZH_LOCALE
      ) {
        targets.push(full);
      }
    }
  };

  try {
    walk(contentRoot);
  } catch {
    // sem content/ ainda: só valida as mensagens
  }

  return targets;
}

function findTraditional(text) {
  const findings = [];
  const lines = text.split("\n");

  lines.forEach((line, index) => {
    const converted = toSimplified(line);
    if (converted === line) return;

    const chars = [];
    for (let i = 0; i < line.length; i++) {
      if (line[i] !== converted[i]) chars.push(`${line[i]} → ${converted[i]}`);
    }
    findings.push({ line: index + 1, chars: [...new Set(chars)] });
  });

  return findings;
}

/** Controle: se o detector não acusa tradicional conhecido, ele está quebrado. */
function selfTest() {
  const traditional = "項目 關於 架構 實時響應";
  if (toSimplified(traditional) === traditional) {
    console.error(
      "check:hans — detector quebrado: não reconheceu tradicional conhecido.",
    );
    process.exit(2);
  }
}

selfTest();

const targets = collectTargets();
let failed = 0;

for (const file of targets) {
  const relative = path.relative(ROOT, file);
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch {
    console.error(`✗ ${relative} — não foi possível ler`);
    failed++;
    continue;
  }

  const findings = findTraditional(text);
  if (!findings.length) {
    console.log(`✓ ${relative}`);
    continue;
  }

  failed++;
  console.error(`✗ ${relative} — chinês tradicional encontrado:`);
  for (const finding of findings) {
    console.error(`    linha ${finding.line}: ${finding.chars.join(", ")}`);
  }
}

if (failed) {
  console.error(
    `\ncheck:hans falhou em ${failed} arquivo(s). O locale zh precisa ser simplificado (zh-Hans).`,
  );
  process.exit(1);
}

console.log(`\ncheck:hans — ${targets.length} arquivo(s) em chinês simplificado.`);
