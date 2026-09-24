import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const sources = [
  ...[
    "COVID-19词库.txt", "GFW补充词库.txt", "其他词库.txt", "反动词库.txt", "广告类型.txt", "政治类型.txt",
    "新思想启蒙.txt", "暴恐词库.txt", "民生词库.txt", "涉枪涉爆.txt", "网易前端过滤敏感词库.txt", "色情类型.txt",
    "色情词库.txt", "补充词库.txt", "贪腐词库.txt", "零时-Tencent.txt", "非法网址.txt"
  ].map(file => ({
    name: `konsheng/Sensitive-lexicon · ${file}`,
    scope: "common",
    license: "MIT",
    format: "plain",
    url: `https://raw.githubusercontent.com/konsheng/Sensitive-lexicon/main/Vocabulary/${encodeURIComponent(file)}`
  })),
  ...["广告.txt", "政治类.txt", "涉枪涉爆违法信息关键词.txt", "网址.txt", "色情类.txt"].map(file => ({
    name: `fwwdn/sensitive-stop-words · ${file}`,
    scope: "common",
    license: "Apache-2.0",
    format: "plain",
    url: `https://raw.githubusercontent.com/fwwdn/sensitive-stop-words/master/${encodeURIComponent(file)}`
  })),
  { name: "tomzhang/bannedwords · pub_banned_words.txt", scope: "common", license: "MIT", format: "base64-lines", url: "https://raw.githubusercontent.com/tomzhang/bannedwords/master/pub_banned_words.txt" },
  { name: "tomzhang/bannedwords · pub_sms_banned_words.txt", scope: "common", license: "MIT", format: "base64-lines", url: "https://raw.githubusercontent.com/tomzhang/bannedwords/master/pub_sms_banned_words.txt" }
];

function clean(term) {
  return term.trim().replace(/^["'`]+|["'`]+$/g, "").replace(/\s+/g, " ");
}

function plainTerms(raw) {
  return raw.split(/[\r\n,，、;；\t|]+/).map(clean).filter(term => term && !term.startsWith("#") && !term.startsWith("//") && term.length <= 100);
}

function decodeBase64Lines(raw) {
  const terms = [];
  for (const line of raw.split(/\r?\n/)) {
    const value = line.trim();
    if (!value) continue;
    try { terms.push(Buffer.from(value, "base64").toString("utf8").trim()); } catch {}
  }
  return terms.filter(term => term && term.length <= 100);
}

const seen = new Set();
const compiled = [];
for (const source of sources) {
  const response = await fetch(source.url);
  if (!response.ok) throw new Error(`${source.name}: HTTP ${response.status}`);
  const raw = await response.text();
  const extracted = source.format === "base64-lines" ? decodeBase64Lines(raw) : plainTerms(raw);
  const terms = [];
  for (const term of extracted) {
    const key = term.toLocaleLowerCase("zh-CN");
    if (!seen.has(key)) { seen.add(key); terms.push(term); }
  }
  compiled.push({ name: source.name, scope: source.scope, license: source.license, url: source.url, terms });
}

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const destination = resolve(projectRoot, "dist/lexicon-snapshot.js");
const partsDirectory = resolve(projectRoot, "dist/lexicon-snapshot");
const header = `/* Generated from attributed public wordlists. Do not edit manually.\n * Sources and licenses are preserved per group; regenerate with tools/build_lexicon_snapshot.mjs. */\n`;
await rm(partsDirectory, { recursive: true, force: true });
await mkdir(partsDirectory, { recursive: true });

const groups = [];
for (const source of compiled) {
  const groupCount = Math.max(1, Math.ceil(source.terms.length / 500));
  for (let index = 0; index < groupCount; index += 1) {
    groups.push({
      ...source,
      part: groupCount > 1 ? `${index + 1}/${groupCount}` : null,
      terms: source.terms.slice(index * 500, (index + 1) * 500)
    });
  }
}

const parts = [];
let current = [];
let currentSize = 0;
for (const group of groups) {
  const serialized = JSON.stringify(group);
  if (current.length && currentSize + serialized.length > 25000) {
    parts.push(current); current = []; currentSize = 0;
  }
  current.push(group); currentSize += serialized.length;
}
if (current.length) parts.push(current);

for (let index = 0; index < parts.length; index += 1) {
  const filename = `part-${String(index + 1).padStart(2, "0")}.js`;
  const body = `${header}window.BUNDLED_LEXICON_SOURCES.push(...${JSON.stringify(parts[index])});\n`;
  await writeFile(resolve(partsDirectory, filename), body, "utf8");
}

const loader = `${header}window.BUNDLED_LEXICON_SOURCES = [];\nfor (let index = 1; index <= ${parts.length}; index += 1) {\n  const part = String(index).padStart(2, "0");\n  document.write('<script src="./lexicon-snapshot/part-' + part + '.js"><\\/script>');\n}\n`;
await writeFile(destination, loader, "utf8");

console.log(JSON.stringify({ destination, partsDirectory, parts: parts.length, sources: compiled.length, sourceGroups: groups.length, uniqueTerms: seen.size }));
