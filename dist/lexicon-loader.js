(function () {
  const remoteSources = [
    { name: "dvai/xiaohongshu-checker · wordbank.js", scope: "xiaohongshu", license: "未声明", adapter: "dvai", url: "https://raw.githubusercontent.com/dvai/xiaohongshu-checker/main/wordbank.js" },
    { name: "ijerryhuang/xiaohongshu-auto-operation · violation-words.md", scope: "xiaohongshu", license: "未声明", adapter: "ijerryMarkdown", url: "https://raw.githubusercontent.com/ijerryhuang/xiaohongshu-auto-operation/main/references/violation-words.md" },
    { name: "Jiandong7/xiaohongshu-writer · check_compliance.py", scope: "xiaohongshu", license: "未声明", adapter: "pythonWords", url: "https://raw.githubusercontent.com/Jiandong7/xiaohongshu-writer/master/scripts/check_compliance.py" },
    { name: "bethel-mark/travel-xhs-content · banned-words.md", scope: "xiaohongshu", license: "MIT", adapter: "riskMarkdown", url: "https://raw.githubusercontent.com/bethel-mark/travel-xhs-content/main/references/banned-words.md" },
    { name: "0x0xfan/goofish-weiguici-skill · prohibited_terms.tsv", scope: "xianyu", license: "未声明", adapter: "goofishTsv", url: "https://raw.githubusercontent.com/0x0xfan/goofish-weiguici-skill/main/xianyu-prohibited-checker/references/prohibited_terms.tsv" },
    { name: "WolfeOvO/astrbot_plugin_xianyu_compliance · SENSITIVE_CATEGORIES", scope: "xianyu", license: "未声明", adapter: "wolfe", url: "https://raw.githubusercontent.com/WolfeOvO/astrbot_plugin_xianyu_compliance/main/knowledge.py" },
    { name: "louiseliu/media-publish-review · term-patterns.json", scope: "common", license: "MIT", adapter: "mediaPatterns", url: "https://raw.githubusercontent.com/louiseliu/media-publish-review/main/references/term-patterns.json" },
    { name: "fullstackcrew-alpha/skill-cn-content-matrix · content-check.sh", scope: "common", license: "MIT", adapter: "contentCheckShell", url: "https://raw.githubusercontent.com/fullstackcrew-alpha/skill-cn-content-matrix/main/scripts/content-check.sh" },
    ...["广告.txt", "政治类.txt", "涉枪涉爆违法信息关键词.txt", "网址.txt", "色情类.txt"].map(file => ({ name: `jkiss/sensitive-words · ${file}`, scope: "common", license: "未声明", adapter: "plain", url: `https://raw.githubusercontent.com/jkiss/sensitive-words/master/${encodeURIComponent(file)}` })),
    { name: "lining0806/TextFilter · Config/stopwords_chs", scope: "common", license: "未声明", adapter: "plain", matchMode: "segment", url: "https://raw.githubusercontent.com/lining0806/TextFilter/master/Config/stopwords_chs" },
    ...["其他词库.txt", "反动词库.txt", "暴恐词库.txt", "民生词库.txt", "色情词库.txt", "贪腐词库.txt"].map(file => ({ name: `57ing/Sensitive-word · ${file}`, scope: "common", license: "未声明", adapter: "plain", url: `https://raw.githubusercontent.com/57ing/Sensitive-word/master/${encodeURIComponent(file)}` })),
    ...["反动词库.txt", "广告类型.txt", "政治类型.txt", "暴恐词库.txt", "民生词库.txt", "涉枪涉爆.txt", "色情词库.txt", "贪腐词库.txt"].map(file => ({ name: `LuYongwang/go-sensitive-word · ${file}`, scope: "common", license: "未声明", adapter: "plain", matchMode: "nfkc", url: `https://raw.githubusercontent.com/LuYongwang/go-sensitive-word/main/wordlists/${encodeURIComponent(file)}` }))
  ];

  function clean(term) {
    return String(term || "").trim().replace(/^["'`*#>「」“”\-\s]+|["'`*「」“”\s]+$/g, "").replace(/\s+/g, " ");
  }

  function valid(term) {
    return Boolean(term && !term.startsWith("//") && !term.startsWith("http") && term.length <= 100 && !/^(?:违禁词|替代词|类别|处理|说明|合规替代|替代表达)$/.test(term));
  }

  function decodeQuoted(token) {
    if (!token) return "";
    if (token[0] === '"') {
      try { return JSON.parse(token); } catch (_) { /* fall through */ }
    }
    return token.slice(1, -1).replace(/\\([\\'"nrt])/g, (_, c) => ({ n: "\n", r: "\r", t: "\t" }[c] || c));
  }

  function quotedValues(raw) {
    return [...raw.matchAll(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g)].map(match => decodeQuoted(match[1]));
  }

  function splitPlain(raw) {
    return raw.split(/[\r\n,，、;；\t|]+/).map(clean).filter(valid);
  }

  function parseDvai(raw, source) {
    const terms = [];
    for (const match of raw.matchAll(/const\s+\w+Terms\s*=\s*Object\.freeze\(\s*\[([\s\S]*?)\]\s*\)/g)) terms.push(...quotedValues(match[1]));
    const patterns = [];
    const categories = raw.split(/\n\s*\{\s*\n\s*id:\s*/).slice(1);
    for (const category of categories) {
      const label = decodeQuoted((category.match(/label:\s*("(?:\\.|[^"\\])*")/) || [])[1]) || "公开项目正则";
      const severity = decodeQuoted((category.match(/severity:\s*("(?:\\.|[^"\\])*")/) || [])[1]) || "medium";
      const suggestion = decodeQuoted((category.match(/suggestion:\s*("(?:\\.|[^"\\])*")/) || [])[1]) || "结合语境修改或删除命中表达。";
      for (const patternMatch of category.matchAll(/pattern:\s*("(?:\\.|[^"\\])*")/g)) patterns.push({ pattern: decodeQuoted(patternMatch[1]), label, severity, suggestion, priority: severity });
    }
    return [{ ...source, terms, patterns }];
  }

  function parsePythonWords(raw, source) {
    const terms = [];
    for (const match of raw.matchAll(/["']words["']\s*:\s*\[([\s\S]*?)\]/g)) terms.push(...quotedValues(match[1]));
    return [{ ...source, terms }];
  }

  function tableFirstColumn(raw) {
    const terms = [];
    for (const line of raw.split(/\r?\n/)) {
      if (!/^\s*\|/.test(line) || /^\s*\|?\s*[-:]+/.test(line)) continue;
      const cell = clean(line.split("|")[1] || "");
      if (!valid(cell)) continue;
      terms.push(...cell.split(/\s*[\/／、]​?\s*/).map(clean).filter(valid));
    }
    return terms;
  }

  function parseIjerry(raw, source) {
    const terms = tableFirstColumn(raw);
    for (const match of raw.matchAll(/^\s*-\s*❌\s*["'“「]([^"'”」\r\n]+)["'”」]/gm)) terms.push(clean(match[1]));
    const example = raw.match(/absolute_words\s*=\s*\[([\s\S]*?)\][\s\S]*?interaction_words\s*=\s*\[([\s\S]*?)\]/);
    if (example) terms.push(...quotedValues(example[1]), ...quotedValues(example[2]));
    return [{ ...source, terms }];
  }

  function parseRiskMarkdown(raw, source) {
    const terms = tableFirstColumn(raw);
    for (const match of raw.matchAll(/^\s*-\s*[「“]([^」”\r\n]+)[」”](?:\s*\/\s*[「“]([^」”\r\n]+)[」”])?/gm)) {
      terms.push(clean(match[1]));
      if (match[2]) terms.push(clean(match[2]));
    }
    return [{ ...source, terms }];
  }

  function parseGoofishTsv(raw, source) {
    const lines = raw.split(/\r?\n/);
    const headers = (lines.shift() || "").split("\t");
    const termIndex = headers.indexOf("term");
    const normalizedIndex = headers.indexOf("normalized");
    const categoryIndex = headers.indexOf("categories");
    const terms = [];
    const termMeta = {};
    for (const line of lines) {
      const columns = line.split("\t");
      const term = clean(columns[termIndex]);
      const normalized = clean(columns[normalizedIndex]);
      if (!valid(term) || !normalized) continue;
      terms.push(term);
      termMeta[term.toLocaleLowerCase("zh-CN")] = { normalized, categories: columns[categoryIndex] || "", weak: normalized.length <= 1 || ["v", "pm", "tk"].includes(normalized) };
    }
    return [{ ...source, terms, termMeta, matchMode: "goofish" }];
  }

  function parseMediaPatterns(raw, source) {
    const rules = JSON.parse(raw);
    const patterns = [];
    for (const item of rules) {
      const scopes = item.platforms || ["all"];
      if (!scopes.includes("all") && !scopes.includes("xiaohongshu") && !scopes.includes("douyin")) continue;
      patterns.push({ pattern: item.pattern, label: item.category, priority: item.priority, severity: item.priority === "normal" ? "review" : "high", suggestion: item.action, reason: item.review, platforms: scopes });
    }
    return [{ ...source, terms: [], patterns }];
  }

  function parseContentCheckShell(raw, source) {
    const groups = [];
    const common = (raw.match(/COMMON_WORDS="([^"]*)"/) || [])[1] || "";
    groups.push({ ...source, name: `${source.name} · 通用`, scope: "common", terms: common.split("|") });
    const platformMap = { xhs: "xiaohongshu", douyin: "douyin" };
    for (const [shellName, scope] of Object.entries(platformMap)) {
      const block = raw.match(new RegExp(`${shellName}\\)\\s*\\n\\s*PLATFORM_WORDS="([^"]*)"`));
      if (block && block[1]) groups.push({ ...source, name: `${source.name} · ${shellName}`, scope, terms: block[1].split("|") });
    }
    return groups;
  }

  function extract(raw, source) {
    switch (source.adapter) {
      case "dvai": return parseDvai(raw, source);
      case "pythonWords":
      case "wolfe": return parsePythonWords(raw, source);
      case "ijerryMarkdown": return parseIjerry(raw, source);
      case "riskMarkdown": return parseRiskMarkdown(raw, source);
      case "goofishTsv": return parseGoofishTsv(raw, source);
      case "mediaPatterns": return parseMediaPatterns(raw, source);
      case "contentCheckShell": return parseContentCheckShell(raw, source);
      default: return [{ ...source, terms: splitPlain(raw) }];
    }
  }

  async function loadAll(onProgress) {
    const bundled = Array.isArray(window.BUNDLED_LEXICON_SOURCES) ? window.BUNDLED_LEXICON_SOURCES : [];
    const collected = [];
    let completed = 0;
    const failures = [];
    const results = await Promise.all(remoteSources.map(async source => {
      try {
        const response = await fetch(source.url, { cache: "no-cache" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return extract(await response.text(), source).map(group => ({ ...group, bundled: false }));
      } catch (error) {
        failures.push({ name: source.name, error: String(error && error.message || error) });
        return [];
      } finally {
        completed += 1;
        if (onProgress) onProgress(completed, remoteSources.length);
      }
    }));
    // 平台专属适配源优先，通用快照随后。这样相同词条会先按
    // 源项目的弱匹配、上下文和平台范围处理，而不是被通用词库抢先。
    collected.push(...results.flat(), ...bundled.map(source => ({ ...source, bundled: true })));

    const seen = new Set();
    const sources = collected.map(source => {
      const terms = [];
      const sourceSeen = new Set();
      for (const rawTerm of source.terms || []) {
        const term = clean(rawTerm);
        const key = term.toLocaleLowerCase("zh-CN");
        // 单字只在源项目明确定义了弱匹配规则时保留，
        // 避免把通用数字、字母或普通汉字当作平台风险。
        if (term.length <= 1 && source.matchMode !== "goofish" && !source.name.includes("WolfeOvO")) continue;
        if (valid(term) && !sourceSeen.has(key)) { sourceSeen.add(key); seen.add(key); terms.push(term); }
      }
      return { ...source, terms, patterns: Array.isArray(source.patterns) ? source.patterns : [] };
    }).filter(source => source.terms.length || source.patterns.length);
    return { sources, failures, uniqueTerms: seen.size, uniqueSourceCount: new Set(sources.map(source => source.name)).size, bundledSources: bundled.length, remoteSources: remoteSources.length, patternCount: sources.reduce((sum, source) => sum + source.patterns.length, 0) };
  }

  window.PublicLexicons = { loadAll, remoteSources };
})();
