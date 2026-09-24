(function () {
  const remoteSources = [
    { name: "dvai/xiaohongshu-checker · wordbank.js", scope: "xiaohongshu", license: "未声明", format: "code", url: "https://raw.githubusercontent.com/dvai/xiaohongshu-checker/main/wordbank.js" },
    { name: "ijerryhuang/xiaohongshu-auto-operation · violation-words.md", scope: "xiaohongshu", license: "未声明", format: "markdown", url: "https://raw.githubusercontent.com/ijerryhuang/xiaohongshu-auto-operation/main/references/violation-words.md" },
    { name: "Jiandong7/xiaohongshu-writer · compliance.md", scope: "xiaohongshu", license: "未声明", format: "markdown", url: "https://raw.githubusercontent.com/Jiandong7/xiaohongshu-writer/master/references/compliance.md" },
    { name: "bethel-mark/travel-xhs-content · banned-words.md", scope: "xiaohongshu", license: "未声明", format: "markdown", url: "https://raw.githubusercontent.com/bethel-mark/travel-xhs-content/main/references/banned-words.md" },
    { name: "0x0xfan/goofish-weiguici-skill · prohibited_terms.tsv", scope: "xianyu", license: "未声明", format: "tsv", url: "https://raw.githubusercontent.com/0x0xfan/goofish-weiguici-skill/main/xianyu-prohibited-checker/references/prohibited_terms.tsv" },
    { name: "WolfeOvO/astrbot_plugin_xianyu_compliance · knowledge.py", scope: "xianyu", license: "未声明", format: "code", url: "https://raw.githubusercontent.com/WolfeOvO/astrbot_plugin_xianyu_compliance/main/knowledge.py" },
    ...["广告.txt", "政治类.txt", "涉枪涉爆违法信息关键词.txt", "网址.txt", "色情类.txt"].map(file => ({ name: `jkiss/sensitive-words · ${file}`, scope: "common", license: "未声明", format: "plain", url: `https://raw.githubusercontent.com/jkiss/sensitive-words/master/${encodeURIComponent(file)}` })),
    { name: "lining0806/TextFilter · 敏感词库大全.txt", scope: "common", license: "未声明", format: "plain", url: "https://raw.githubusercontent.com/lining0806/TextFilter/master/%E6%95%8F%E6%84%9F%E8%AF%8D%E5%BA%93%E5%A4%A7%E5%85%A8.txt" },
    ...["其他词库.txt", "反动词库.txt", "暴恐词库.txt", "民生词库.txt", "色情词库.txt", "贪腐词库.txt"].map(file => ({ name: `57ing/Sensitive-word · ${file}`, scope: "common", license: "未声明", format: "plain", url: `https://raw.githubusercontent.com/57ing/Sensitive-word/master/${encodeURIComponent(file)}` })),
    ...["反动词库.txt", "广告类型.txt", "政治类型.txt", "暴恐词库.txt", "民生词库.txt", "涉枪涉爆.txt", "色情词库.txt", "贪腐词库.txt"].map(file => ({ name: `LuYongwang/go-sensitive-word · ${file}`, scope: "common", license: "未声明", format: "plain", url: `https://raw.githubusercontent.com/LuYongwang/go-sensitive-word/main/wordlists/${encodeURIComponent(file)}` }))
  ];

  function clean(term) {
    return term.trim().replace(/^["'`*#>\-\s]+|["'`*\s]+$/g, "").replace(/\s+/g, " ");
  }

  function splitPlain(raw) {
    return raw.split(/[\r\n,，、;；\t|]+/).map(clean).filter(valid);
  }

  function valid(term) {
    return Boolean(term && !term.startsWith("//") && !term.startsWith("http") && term.length <= 100);
  }

  function extract(raw, format) {
    if (format === "tsv") {
      return raw.split(/\r?\n/).slice(1).map(line => clean(line.split("\t")[0] || "")).filter(valid);
    }
    if (format === "code") {
      const terms = [];
      for (const match of raw.matchAll(/["']([^"'\r\n]{1,100})["']/g)) terms.push(clean(match[1]));
      return terms.filter(valid);
    }
    if (format === "markdown") {
      const terms = [];
      for (const match of raw.matchAll(/[`“”"]([^`“”"\r\n]{1,100})[`“”"]/g)) terms.push(clean(match[1]));
      for (const line of raw.split(/\r?\n/)) {
        if (/^\s*[-*]\s+/.test(line)) terms.push(...line.replace(/^\s*[-*]\s+/, "").split(/[、,，/]/).map(clean));
      }
      return terms.filter(valid);
    }
    return splitPlain(raw);
  }

  async function loadAll(onProgress) {
    const bundled = Array.isArray(window.BUNDLED_LEXICON_SOURCES) ? window.BUNDLED_LEXICON_SOURCES : [];
    const collected = bundled.map(source => ({ ...source, bundled: true }));
    let completed = 0;
    const failures = [];
    const results = await Promise.all(remoteSources.map(async source => {
      try {
        const response = await fetch(source.url, { cache: "no-cache" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return { ...source, terms: [...new Set(extract(await response.text(), source.format))], bundled: false };
      } catch (error) {
        failures.push({ name: source.name, error: String(error && error.message || error) });
        return null;
      } finally {
        completed += 1;
        if (onProgress) onProgress(completed, remoteSources.length);
      }
    }));
    collected.push(...results.filter(Boolean));

    const seen = new Set();
    const sources = collected.map(source => {
      const terms = [];
      for (const rawTerm of source.terms || []) {
        const term = clean(String(rawTerm));
        const key = term.toLocaleLowerCase("zh-CN");
        if (valid(term) && !seen.has(key)) { seen.add(key); terms.push(term); }
      }
      return { ...source, terms };
    }).filter(source => source.terms.length);
    return { sources, failures, uniqueTerms: seen.size, uniqueSourceCount: new Set(sources.map(source => source.name)).size, bundledSources: bundled.length, remoteSources: remoteSources.length };
  }

  window.PublicLexicons = { loadAll, remoteSources };
})();
