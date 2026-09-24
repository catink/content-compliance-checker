const PLATFORM_META = {
  xiaohongshu: { zh: "小红书", en: "Xiaohongshu" },
  xianyu: { zh: "闲鱼", en: "Xianyu" },
  douyin: { zh: "抖音", en: "Douyin" }
};

const I18N = window.AppI18n || { ui: { zh: {}, en: {} }, rules: {}, labels: {} };
let currentLanguage = "zh";

function text(key, values = {}) {
  let value = (I18N.ui[currentLanguage] && I18N.ui[currentLanguage][key]) || (I18N.ui.zh && I18N.ui.zh[key]) || key;
  if (typeof value !== "string") return value;
  return value.replace(/\{(\w+)\}/g, (_, name) => values[name] == null ? `{${name}}` : String(values[name]));
}

function platformName(platform) { return PLATFORM_META[platform][currentLanguage] || PLATFORM_META[platform].zh; }
function platformNote(platform) { return text("platformNotes")[platform]; }
function quantity(key, count) {
  if (currentLanguage !== "en") return text(key, { count });
  if (key === "riskClasses") return `${count} risk ${count === 1 ? "category" : "categories"}`;
  if (key === "issueCount") return `${count} issue ${count === 1 ? "category" : "categories"}`;
  if (key === "matchCount") return `${count} ${count === 1 ? "match" : "matches"}`;
  return text(key, { count });
}

const COMMON_RULES = [
  rule("绝对化宣传", "high", ["国家级","最高级","最佳","最好","最强","第一品牌","全国第一","全网第一","销量第一","唯一","独一无二","顶级","极致","完美","百分百","100%有效","永久有效","万能","无敌","全网最低价","史上最低价","全球首发","绝无仅有"], "绝对化或无法证明的排名、效果承诺容易构成误导。", "删除绝对化结论，改为可核验的参数、适用条件或真实体验。"),
  rule("医疗与功效宣称", "high", ["治疗","治愈","根治","药到病除","无副作用","抗癌","防癌","降血压","降血糖","降血脂","增强免疫力","提高免疫力","排毒","祛疤","生发","一天见效","立竿见影","返老还童","疗效"], "涉及疾病治疗、预防或确定性身体功效，普通商品和非专业内容风险很高。", "删除诊疗承诺；只描述客观成分、使用感受，并注明个体差异，必要时补充资质。"),
  rule("收益与赚钱承诺", "high", ["稳赚不赔","保本稳赚","保证收益","固定回报","无风险回报","本金翻倍","轻松暴富","躺赚","日入过千","月入过万","零成本创业","无脑赚钱","快速变现","被动收入","稳定收益"], "对收益、回报或赚钱结果作确定性承诺，可能构成虚假或误导宣传。", "改为说明方法、成本和风险，不承诺收入、回报或确定结果。"),
  rule("违法与灰产", "high", ["高仿","精仿","1:1复刻","破解版","破解插件","外挂","刷粉","刷赞","刷评论","刷单","好评返现","套现","假证","代考","代写论文","买卖账号","洗钱","博彩","赌博","黑客接单"], "涉及假冒侵权、作弊、数据造假或违法服务。", "删除相关商品、服务或引导；仅做合法风险科普时要保留清晰语境。"),
  rule("强保证表达", "medium", ["保证","确保","一定有效","必学会","必过","稳过","一次性搞定","永不反弹","不会复发","零风险","无效退款"], "对效果或结果作无条件保证，缺少适用边界。", "改为“适合……参考”“在……条件下可能……”并写明限制。"),
];

const PLATFORM_RULES = {
  xiaohongshu: [
    rule("站外导流", "high", ["加微信","微信号","加vx","加v","wx","v信","薇信","威信","QQ号","QQ群","扫码联系","二维码联系","联系客服微信","站外成交","平台外交易","私发链接","外部平台","店铺链接","复制口令"], "可能引导用户离开平台联系或交易。", "删除站外联系方式和跳转信息，改为使用平台允许的站内沟通、店铺或商品功能。"),
    rule("跨平台引导", "medium", ["淘宝搜","闲鱼搜","抖音搜","拼多多搜","京东搜","去别的平台","跳转店铺","主页链接"], "出现跨平台搜索或跳转指令，可能被识别为导流。", "直接在当前内容中提供必要信息，避免要求用户去其他平台搜索。"),
    rule("医美高风险", "high", ["美白针","童颜针","瘦脸针","水光针","溶脂针","瘦肩针","瘦腿针","除皱针","肉毒素","胎盘素","线雕","注射除皱","超声溶脂"], "医美项目涉及医疗资质、真实功效和安全风险。", "不要用普通种草方式作确定性推荐；补充合规资质、适用范围和风险提示。"),
    rule("迷信营销", "medium", ["招财进宝","提升运气","逢凶化吉","时来运转","旺财","开光","超度","算命","算八字","占卜","作法","护身符","古曼童"], "将商品或服务与转运、消灾等迷信功效绑定，存在内容风险。", "删除确定性的转运功效；如属文化介绍，明确历史、民俗或审美语境。"),
    rule("诱导互动", "review", ["评论区扣1","评论区回复","点赞关注","转发抽奖","私信我","评论区领取"], "可能构成机械诱导互动，但需要结合活动规则和内容语境判断。", "改为真实的问题邀请或平台允许的活动表达，不以福利强制换取互动。"),
  ],
  xianyu: [
    rule("站外交易或联系", "high", ["加微信","微信号","VX","vx","wx","QQ","企鹅","手机号","二维码","转账","私下交易","线下沟通","网盘链接","提取码","发链接","百度云","夸克网盘","阿里云盘"], "可能绕开闲鱼沟通、支付或担保交易。", "删除站外联系方式、网盘口令和转账引导，统一使用闲鱼站内沟通与交易流程。"),
    rule("虚拟资源与直接交付", "high", ["自动发货","秒发","无需物流","虚拟发货","自动交付","自助提取","拍下发全部","下载即用","直接发送文件","直接发文件","发送文件","网盘发送","一次性发完资源"], "可能涉及不受支持的虚拟交付方式或交易风险。", "先确认所属类目是否允许；按平台支持的商品形态、交付和发货方式如实描述。"),
    rule("侵权资源", "high", ["全套课程","完整版课程","付费课","影视全集","影视剧资源","音乐资源","付费素材","会员资源","网盘合集","内部课","高清资源","无删减","正版破解课","剪辑素材合集"], "可能销售未经授权的课程、影视、软件或素材。", "仅发布拥有版权或明确授权的内容，并在描述中说明授权范围与来源凭证。"),
    rule("学术与考试代做", "high", ["代做","代写","毕业论文","课程作业","网课代刷","代答","题库答案","考试答案","简历代写","论文润色","公考押题","考证必过"], "可能帮助完成学业、考试或材料造假。", "改为合法的知识讲解、学习方法或公开资料；不得替用户完成应由本人完成的任务。"),
    rule("工具、账号与自动化", "high", ["Cookie","登录密钥","账号抓取","token","绕过验证","免登录","代登录","账号共享","批量登录","批量抓取","自动脚本","批量发布","自动回复","多开","防封","群发","矩阵工具","注册机"], "可能涉及账号滥用、绕过验证、爬取或破坏平台秩序。", "删除规避平台机制的功能描述；只保留合法、授权且不干扰平台的工具能力。"),
    rule("需要语境复核", "review", ["论文","作业","教程","评论","采集","自动化工具","ChatGPT","GPT4","AI机器人","第一","最"], "这些词在正常商品或教学语境中不必然违规，不能单独判定。", "结合商品实际内容复核；避免与代做、破解、刷量、保证结果等高风险表达组合。"),
  ],
  douyin: [
    rule("站外导流", "high", ["加微信","微信号","VX","wx","QQ号","扫码联系","二维码联系","站外购买","平台外交易","私下转账","私发链接","外链下单"], "可能引导用户脱离平台联系或交易。", "使用抖音允许的私信、企业号、商品卡、团购或店铺功能，不展示站外联系方式。"),
    rule("危险行为", "high", ["请勿模仿","极限挑战","危险驾驶","飙车","自制炸药","开锁教程","翻越护栏","高空挑战","吞火","自残教程"], "画面或口播可能展示可模仿的危险行为；仅加警示语不能自动消除风险。", "删去危险过程和可复制步骤；如属安全科普，突出防护环境、专业资质和风险教育。"),
    rule("隐私与人肉", "high", ["人肉搜索","曝光手机号","曝光住址","身份证照片","家庭住址","实时定位","开房记录","聊天记录曝光","病历曝光","账号密码"], "可能泄露、买卖或鼓励曝光他人个人信息。", "删除或充分打码可识别信息，并确认授权、公共利益和必要性。"),
    rule("低俗或违法引导", "high", ["裸聊","约炮","援交","情色服务","毒品购买","赌博群","下注链接","枪支出售","假证办理","传销项目"], "涉及色情、赌博、毒品、武器、诈骗或其他违法服务。", "删除相关内容和联系方式；合法新闻或科普需避免引流及可操作细节。"),
    rule("时事与不实信息", "review", ["内部消息","官方没说的真相","全网封锁","马上要出政策","震惊全国","紧急扩散","未经证实","据说"], "涉及公共事件或政策时，容易形成无来源、过期或夸张信息。", "补充权威来源、发生时间和地点；无法核实的结论不要发布。"),
    rule("版权与搬运", "medium", ["影视剪辑全集","无授权搬运","去水印搬运","原片下载","盗版音乐","全集资源","未删减资源"], "可能侵犯影视、音乐、图片或他人原创内容权利。", "使用自有或获得授权的素材，保留许可证据；标注来源不等于获得授权。"),
    rule("AI与演绎标识", "review", ["AI生成","数字人","AI换脸","虚构演绎","情景演绎","AI配音","合成画面"], "相关内容可能需要按实际情况作显著标识，但这些词本身并非违规。", "保留真实、清晰的AI生成或虚构演绎标识，不要冒充真实人物或事件。"),
  ]
};

const COMBINATION_RULES = [
  {
    category: "学术代做与接单组合",
    severity: "high",
    platforms: ["xiaohongshu", "xianyu", "douyin"],
    groups: [
      ["接单", "承接", "代做", "代写", "帮做", "包做", "有偿做", "定制完成", "全程完成", "替你做", "帮你做"],
      ["毕业设计", "毕设", "毕业论文", "学位论文", "课程设计", "课程作业", "大作业", "开题报告", "实验报告", "答辩PPT", "答辩稿"]
    ],
    reason: "同时出现承接/代做意图和毕业设计、论文、作业等学术成果，属于明显的学术代做或交易服务信号。",
    suggestion: "删除接单、代做、包做等服务承诺；如提供合规辅导，只能描述知识讲解、方法指导和公开资料，不替用户完成应由本人完成的成果。"
  },
  {
    category: "考试答案与包过组合",
    severity: "high",
    platforms: ["xiaohongshu", "xianyu", "douyin"],
    groups: [
      ["包过", "稳过", "保过", "押题", "答案", "真题答案", "代考", "替考"],
      ["考试", "考证", "公考", "考研", "四六级", "软考", "教资", "雅思", "托福"]
    ],
    reason: "考试或证书场景与答案、代考、包过等结果承诺组合出现，存在作弊或虚假承诺风险。",
    suggestion: "删除答案、代考和结果保证；只保留正规课程介绍、知识点讲解和学习计划。"
  },
  {
    category: "网课/教辅/电子资源与侵权交付组合",
    severity: "high",
    platforms: ["xianyu"],
    groups: [
      ["网课", "课程", "教材", "教辅", "题库", "讲义", "电子书", "试卷"],
      ["资源", "全集", "合集", "PDF", "电子版", "扫描版", "音频", "视频", "网盘", "秒发"]
    ],
    reason: "闲鱼项目实际不会单独因“资源”或“合集”判违规，而是检查其是否与课程、教材、题库等版权对象组合出现。",
    suggestion: "只发布拥有版权或明确授权的内容；写明来源、授权范围和实际交付形式，删除未授权的全集、扫描版、网盘秒发等表述。"
  },
  {
    category: "大厂求职资料与内推组合",
    severity: "high",
    platforms: ["xianyu"],
    groups: [
      ["大厂", "互联网大厂", "名企", "校招", "社招", "大模型", "LLM", "AI"],
      ["面试题", "面经", "面试资料", "内推", "求职", "简历优化", "offer"]
    ],
    reason: "按闲鱼源项目的组合规则，大厂/AI 场景与面试题、面经、内推或求职服务同时出现时属高风险。",
    suggestion: "删除付费内推、保面试、内部题库等承诺；可改为公开来源的求职经验和学习笔记。"
  },
  {
    category: "竞赛代做或获奖承诺组合",
    severity: "high",
    platforms: ["xianyu", "xiaohongshu", "douyin"],
    groups: [
      ["创青春", "大创赛", "大创", "挑战杯", "互联网+", "竞赛", "比赛", "国赛", "省赛"],
      ["代做", "代写", "代参赛", "加绩点", "包拿奖", "保拿奖", "包获奖", "保获奖", "代拿奖"]
    ],
    reason: "竞赛场景与代做、代参赛或获奖保证绑定，涉及不当代办和虚假承诺。",
    suggestion: "只保留规则解读、公开案例和方法辅导，删除代做、代参赛和获奖保证。"
  },
  {
    category: "自动化刷量/托管组合",
    severity: "high",
    platforms: ["xianyu", "xiaohongshu", "douyin"],
    groups: [
      ["批量", "自动", "全自动", "无人值守", "托管", "脚本"],
      ["涨粉", "粉丝", "流量", "排行", "拉新", "投票", "点赞", "播放", "互动", "推广", "混剪"]
    ],
    reason: "按闲鱼源项目的用法，“批量/自动”本身不直接判违规，与涨粉、刷量、拉新、托管等目的结合才是风险锚点。",
    suggestion: "删除刷量、无人值守和规避平台机制的功能承诺；只描述合法、授权的单用户辅助功能。"
  }
];

function rule(category, severity, terms, reason, suggestion) { return { category, severity, terms, reason, suggestion }; }

const els = {
  title: document.querySelector("#title-input"), body: document.querySelector("#body-input"), ocr: document.querySelector("#ocr-text"),
  titleCount: document.querySelector("#title-count"), bodyCount: document.querySelector("#body-count"), imageInput: document.querySelector("#image-input"),
  imageList: document.querySelector("#image-list"), ocrBox: document.querySelector("#ocr-box"), ocrStatus: document.querySelector("#ocr-status"),
  analyze: document.querySelector("#analyze-button"), empty: document.querySelector("#empty-state"), results: document.querySelector("#results"),
  summaries: document.querySelector("#summary-cards"), tabs: document.querySelector("#platform-tabs"), detail: document.querySelector("#platform-detail"),
  copy: document.querySelector("#copy-report"), toast: document.querySelector("#toast"), dropZone: document.querySelector("#drop-zone"),
  lexiconInput: document.querySelector("#lexicon-input"), lexiconStatus: document.querySelector("#lexicon-status"), clearLexicon: document.querySelector("#clear-lexicon"),
  strictToggle: document.querySelector("#strict-toggle"), strictStatus: document.querySelector("#strict-status"), reloadStrict: document.querySelector("#reload-strict"),
  languageToggle: document.querySelector("#language-toggle")
};

let images = [];
let report = null;
let activePlatform = "xiaohongshu";
let customTerms = [];
let strictLexiconSources = [];
let strictLexiconSummary = null;
let strictLoadPromise = null;

els.title.addEventListener("input", updateCounts);
els.body.addEventListener("input", updateCounts);
document.querySelector("#choose-image").addEventListener("click", () => els.imageInput.click());
els.imageInput.addEventListener("change", e => handleFiles([...e.target.files]));
els.dropZone.addEventListener("dragover", e => { e.preventDefault(); els.dropZone.classList.add("dragging"); });
els.dropZone.addEventListener("dragleave", () => els.dropZone.classList.remove("dragging"));
els.dropZone.addEventListener("drop", e => { e.preventDefault(); els.dropZone.classList.remove("dragging"); handleFiles([...e.dataTransfer.files]); });
els.analyze.addEventListener("click", analyzeAll);
els.copy.addEventListener("click", copyReport);
document.querySelector("#choose-lexicon").addEventListener("click", () => els.lexiconInput.click());
els.lexiconInput.addEventListener("change", event => importLexicon(event.target.files[0]));
els.clearLexicon.addEventListener("click", () => {
  customTerms = []; els.lexiconInput.value = ""; els.lexiconStatus.textContent = text("notImported"); els.clearLexicon.classList.add("hidden");
  showToast(text("lexiconCleared"));
});
els.reloadStrict.addEventListener("click", () => { strictLoadPromise = loadStrictLexicons(); });
els.languageToggle.addEventListener("click", () => setLanguage(currentLanguage === "zh" ? "en" : "zh"));
document.querySelector("#fill-example").addEventListener("click", () => {
  els.title.value = "全网第一的AI赚钱课程，保证月入过万";
  els.body.value = "完整版付费课资源，拍下秒发，无需物流。添加微信领取网盘链接，零基础也能百分百学会。";
  updateCounts();
});

function setLanguage(language) {
  currentLanguage = language === "en" ? "en" : "zh";
  document.documentElement.lang = currentLanguage === "en" ? "en" : "zh-CN";
  document.title = text("documentTitle");
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", text("description"));
  document.querySelectorAll("[data-i18n]").forEach(element => {
    const value = text(element.dataset.i18n);
    if (typeof value === "string") element.textContent = value;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
    element.setAttribute("placeholder", text(element.dataset.i18nPlaceholder));
  });
  els.languageToggle.textContent = currentLanguage === "zh" ? "EN" : "中";
  els.languageToggle.setAttribute("aria-label", currentLanguage === "zh" ? "Switch to English" : "切换到中文");
  if (!customTerms.length) els.lexiconStatus.textContent = text("notImported");
  updateCounts();
  renderImages();
  renderStrictStatus();
  if (report) renderReport();
}

function renderStrictStatus() {
  if (!strictLexiconSummary) return;
  const failed = strictLexiconSummary.failures.length;
  els.strictStatus.textContent = text("loadedLexicons", {
    sources: strictLexiconSummary.uniqueSourceCount,
    terms: strictLexiconSummary.uniqueTerms.toLocaleString(currentLanguage === "en" ? "en-US" : "zh-CN"),
    patterns: strictLexiconSummary.patternCount.toLocaleString(currentLanguage === "en" ? "en-US" : "zh-CN"),
    failures: failed ? text("failedSources", { count: failed }) : ""
  });
}

function updateCounts() {
  els.titleCount.textContent = `${els.title.value.length} / 120`;
  els.bodyCount.textContent = currentLanguage === "en" ? `${els.body.value.length} characters` : `${els.body.value.length} 字`;
}

async function importLexicon(file) {
  if (!file) return;
  try {
    const raw = await file.text();
    const parsed = raw
      .split(/[\r\n,\t，、;；]+/)
      .map(term => term.trim())
      .filter(term => term && !term.startsWith("#") && term.length <= 80);
    customTerms = [...new Set(parsed)].slice(0, 50000);
    els.lexiconStatus.textContent = customTerms.length ? text("lexiconImported", { count: customTerms.length.toLocaleString(), file: file.name }) : text("lexiconNoTerms");
    els.clearLexicon.classList.toggle("hidden", customTerms.length === 0);
    showToast(customTerms.length ? text("lexiconImportedToast", { count: customTerms.length.toLocaleString() }) : text("noUsableTerms"));
  } catch (error) {
    customTerms = []; els.lexiconStatus.textContent = text("lexiconReadFailed"); els.clearLexicon.classList.add("hidden");
  }
}

function handleFiles(files) {
  const accepted = files.filter(f => /^image\/(png|jpeg|webp)$/.test(f.type));
  if (!accepted.length) return showToast(text("chooseImageError"));
  accepted.slice(0, Math.max(0, 6 - images.length)).forEach(file => images.push({ file, url: URL.createObjectURL(file), text: "", status: "imageWaiting" }));
  els.ocrBox.classList.remove("hidden");
  renderImages();
  recognizeImages();
}

function renderImages() {
  els.imageList.innerHTML = images.map((item, i) => `<div class="image-chip"><img src="${item.url}" alt="${escapeHtml(text("imageAlt"))} ${i + 1}"><button type="button" data-remove="${i}" aria-label="${escapeHtml(text("removeImage"))}">×</button><span>${escapeHtml(text(item.status))}</span></div>`).join("");
  els.imageList.querySelectorAll("[data-remove]").forEach(btn => btn.addEventListener("click", () => {
    const index = Number(btn.dataset.remove); URL.revokeObjectURL(images[index].url); images.splice(index, 1); renderImages();
    if (!images.length) els.ocrBox.classList.add("hidden");
  }));
}

async function recognizeImages() {
  const waiting = images.filter(x => x.status === "imageWaiting");
  if (!waiting.length) return;
  els.ocrStatus.textContent = text("loadingOcr");
  try {
    await ensureTesseract();
    for (const item of waiting) {
      item.status = "imageRecognizing"; renderImages();
      const result = await window.Tesseract.recognize(item.file, "chi_sim+eng", {
        logger: m => { if (m.status === "recognizing text") els.ocrStatus.textContent = text("recognizingProgress", { percent: Math.round((m.progress || 0) * 100) }); }
      });
      item.text = (result.data.text || "").trim(); item.status = item.text ? "imageRecognized" : "imageNoText"; renderImages();
      els.ocr.value = images.map((x, i) => x.text ? `【${text("imageHeading")}${i + 1}】\n${x.text}` : "").filter(Boolean).join("\n\n");
    }
    els.ocrStatus.textContent = text("ocrDone");
  } catch (error) {
    waiting.forEach(item => item.status = "imageFailed"); renderImages();
    els.ocrStatus.textContent = text("ocrFailed");
    showToast(text("ocrUnavailable"));
  }
}

function ensureTesseract() {
  if (window.Tesseract) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
    script.onload = resolve; script.onerror = reject; document.head.appendChild(script);
  });
}

async function analyzeAll() {
  if (els.strictToggle.checked && strictLoadPromise) await strictLoadPromise;
  const selected = [...document.querySelectorAll('.platform-picker input:checked')].map(x => x.value);
  const sections = [els.title.value.trim(), els.body.value.trim(), els.ocr.value.trim()].filter(Boolean);
  if (!sections.length) return showToast(text("enterContent"));
  if (!selected.length) return showToast(text("choosePlatformError"));
  const fullText = sections.join("\n\n");
  report = Object.fromEntries(selected.map(platform => [platform, analyzePlatform(platform, fullText)]));
  activePlatform = selected.includes(activePlatform) ? activePlatform : selected[0];
  renderReport();
}

function analyzePlatform(platform, text) {
  const hits = [];
  const rules = [...COMMON_RULES, ...PLATFORM_RULES[platform]];
  if (customTerms.length) {
    rules.push(rule("扩展词库命中", "review", customTerms, "命中用户导入的候选词库；来源和适用平台由词库提供者决定，不能仅凭命中认定违规。", "结合词库来源和上下文人工复核；若属于正常表达，可保留或从扩展词库中移除。"));
  }
  rules.forEach(r => {
    const found = [...new Set(r.terms.filter(term => includesTerm(text, term)))];
    if (found.length) hits.push({ ...r, found });
  });
  COMBINATION_RULES
    .filter(ruleItem => ruleItem.platforms.includes(platform))
    .forEach(ruleItem => {
      const matchesByGroup = ruleItem.groups.map(group => group.filter(term => includesTerm(text, term)));
      if (matchesByGroup.every(group => group.length)) {
        hits.push({
          category: ruleItem.category,
          severity: ruleItem.severity,
          reason: ruleItem.reason,
          suggestion: ruleItem.suggestion,
          found: [...new Set(matchesByGroup.flat())]
        });
      }
    });
  const claimed = new Set(hits.flatMap(hit => hit.found.map(term => term.toLocaleLowerCase("zh-CN"))));
  if (els.strictToggle.checked) {
    strictLexiconSources
      .filter(source => source.scope === "common" || source.scope === platform)
      .forEach(source => {
        const found = []; const sourceRanges = [];
        const segmented = source.matchMode === "segment" ? segmentWords(text) : null;
        for (const term of source.terms) {
          const key = term.toLocaleLowerCase("zh-CN");
          if (claimed.has(key) || !sourceTermMatches(text, term, source, segmented)) continue;
          claimed.add(key); found.push(term);
          sourceRanges.push(...literalRanges(text, term));
        }
        if (found.length) {
          const weakOnly = found.every(term => isWeakSourceTerm(term, source));
          hits.push({
            category: `严格词库 · ${source.name}`,
            severity: weakOnly ? "review" : "medium",
            reason: `按该项目自身的词表范围和匹配方式命中。来源：${source.name}；许可证：${source.license || "未声明"}。${weakOnly ? "源项目将单字或极短词作为弱匹配，需结合语境。" : "严格模式下按风险处理。"}`,
            suggestion: "结合发布语境人工修改或删除；若确认是误报，可临时关闭严格词库后重新检查。",
            found,
            _ranges: sourceRanges
          });
        }
        for (const patternRule of source.patterns || []) {
          if (!patternApplies(patternRule, platform)) continue;
          const matchResult = regexMatches(text, patternRule.pattern);
          if (!matchResult.matches.length) continue;
          hits.push({
            category: `源项目正则 · ${patternRule.label || source.name}`,
            severity: patternRule.severity || "medium",
            reason: patternRule.reason || `按 ${source.name} 的实际正则表达式命中，不是简单字符串词表匹配。`,
            suggestion: patternRule.suggestion || "核对语境和可证明性，删除或改成客观、有边界的表述。",
            found: [...new Set(matchResult.matches.map(item => item.text))],
            _ranges: matchResult.matches
          });
        }
      });
  }
  const ranges = [];
  hits.forEach((hit, issueIndex) => hit.found.forEach(term => {
    if (hit._ranges) return;
    let start = 0;
    while ((start = text.toLowerCase().indexOf(term.toLowerCase(), start)) !== -1) {
      ranges.push({ start, end: start + term.length, severity: hit.severity, issueIndex, term }); start += term.length;
    }
  }));
  hits.forEach((hit, issueIndex) => (hit._ranges || []).forEach(item => ranges.push({ ...item, severity: hit.severity, issueIndex, term: item.text || item.term || "" })));
  return { platform, text, hits, ranges, passed: hits.length === 0 };
}

function includesTerm(text, term) {
  const lower = normalizeBasic(text); const target = normalizeBasic(term);
  if (target === "最" || target === "第一") return lower.includes(target);
  if (target.length <= 2 && /^[a-z]+$/i.test(target)) return new RegExp(`(^|[^a-z])${escapeRegExp(target)}([^a-z]|$)`, "i").test(text);
  return lower.includes(target);
}

function normalizeBasic(value) {
  return String(value || "").normalize("NFKC").toLocaleLowerCase("zh-CN").replace(/[\u200b-\u200d\ufeff]/g, "");
}

function sourceTermMatches(text, term, source, segmented) {
  const meta = source.termMeta && source.termMeta[term.toLocaleLowerCase("zh-CN")];
  if (source.matchMode === "segment") return segmented.has(normalizeBasic(term));
  if (source.matchMode === "goofish" && meta) {
    const compact = normalizeBasic(text).replace(/\s+/g, "");
    const target = normalizeBasic(meta.normalized).replace(/\s+/g, "");
    if (!compact.includes(target)) return false;
    if (target === "cad" && !["代画", "替画", "包画", "代做", "代写", "替写", "包完成", "代完成", "破解", "破解版", "永久激活", "盗版"].some(item => compact.includes(normalizeBasic(item)))) return false;
    if (meta.weak && /^[a-z]+$/i.test(target)) {
      if (target === "v") return /(加\s*v|v\s*(信|x|我|:|：)|\bv\b)/i.test(text);
      return new RegExp(`(^|[^a-z0-9])${escapeRegExp(target)}([^a-z0-9]|$)`, "i").test(text);
    }
    return true;
  }
  return includesTerm(text, term);
}

function isWeakSourceTerm(term, source) {
  const meta = source.termMeta && source.termMeta[term.toLocaleLowerCase("zh-CN")];
  return Boolean((meta && meta.weak) || (source.name.includes("WolfeOvO") && term.length <= 1));
}

function segmentWords(text) {
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    return new Set([...new Intl.Segmenter("zh-CN", { granularity: "word" }).segment(text)].filter(item => item.isWordLike).map(item => normalizeBasic(item.segment)));
  }
  return new Set(normalizeBasic(text).split(/[^\p{L}\p{N}]+/u).filter(Boolean));
}

function literalRanges(text, term) {
  const ranges = [];
  const lower = text.toLocaleLowerCase("zh-CN"); const target = term.toLocaleLowerCase("zh-CN");
  let start = 0;
  while (target && (start = lower.indexOf(target, start)) !== -1) { ranges.push({ start, end: start + term.length, text: text.slice(start, start + term.length) }); start += Math.max(1, term.length); }
  return ranges;
}

function patternApplies(ruleItem, platform) {
  const platforms = ruleItem.platforms || ["all"];
  return platforms.includes("all") || platforms.includes(platform);
}

function regexMatches(text, source) {
  const matches = [];
  try {
    const regex = new RegExp(source, "giu");
    for (const match of text.matchAll(regex)) {
      if (!match[0]) continue;
      matches.push({ start: match.index, end: match.index + match[0].length, text: match[0] });
      if (matches.length >= 100) break;
    }
  } catch (_) { /* invalid upstream pattern is ignored, loader reports only usable rules */ }
  return { matches };
}

function renderReport() {
  els.empty.classList.add("hidden"); els.results.classList.remove("hidden"); els.copy.classList.remove("hidden");
  els.summaries.innerHTML = Object.values(report).map(r => `<div class="summary-card ${r.passed ? "pass" : "risk"}"><div class="top"><strong>${platformName(r.platform)}</strong><span class="status-icon">${r.passed ? "✓" : "!"}</span></div><p>${r.passed ? text("noObviousRisk") : quantity("riskClasses", r.hits.length)}</p></div>`).join("");
  els.tabs.innerHTML = Object.keys(report).map(platform => `<button class="platform-tab" role="tab" aria-selected="${platform === activePlatform}" data-platform="${platform}">${platformName(platform)}</button>`).join("");
  els.tabs.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => { activePlatform = btn.dataset.platform; renderReport(); }));
  renderDetail(report[activePlatform]);
}

function renderDetail(r) {
  els.detail.innerHTML = `
    <div class="detail-status"><div><h3>${r.passed ? text("readyForReview") : text("reviseBeforePublish")}</h3><p>${platformNote(r.platform)}</p></div><span class="risk-count ${r.passed ? "pass" : ""}">${r.passed ? text("noMatches") : quantity("issueCount", r.hits.length)}</span></div>
    <div class="highlight-box"><div class="box-title"><span>${text("originalHighlights")}</span><span>${quantity("matchCount", r.ranges.length)}</span></div><div class="highlighted-text">${highlightText(r.text, r.ranges)}</div></div>
    <h3 class="issues-title">${text("issuesAndAdvice")}</h3>
    ${r.passed ? `<div class="no-issue"><strong>${text("noCurrentIssue")}</strong>${text("manualChecksRemain")}</div>` : `<div class="issue-list">${r.hits.map(renderIssue).join("")}</div>`}
    <div class="scope-note">${text("scopeNote")}</div>`;
}

function renderIssue(hit) {
  const localized = localizeHit(hit);
  return `<div class="issue-card ${hit.severity}"><div class="issue-bar"></div><div><h4>${escapeHtml(localized.category)} ${hit.found.map(t => `<span class="term-tag">${escapeHtml(t)}</span>`).join("")}</h4><p>${escapeHtml(localized.reason)}</p><p class="suggestion"><strong>${text("howToRevise")}</strong>${escapeHtml(localized.suggestion)}</p></div></div>`;
}

function localizeHit(hit) {
  if (currentLanguage === "zh") return hit;
  const translated = I18N.rules[hit.category];
  if (translated) return { category: translated[0], reason: translated[1], suggestion: translated[2] };
  if (hit.category.startsWith("严格词库 · ")) {
    return { category: `Strict lexicon · ${hit.category.slice(7)}`, reason: "Matched a candidate term using the source project's own lexicon scope and matching behavior. Review the source and context before publishing.", suggestion: "Revise or remove the expression if the context is risky. If it is a confirmed false positive, temporarily disable strict lexicons and check again." };
  }
  if (hit.category.startsWith("源项目正则 · ")) {
    const label = hit.category.slice(8);
    return { category: `Source regex · ${I18N.labels[label] || (I18N.rules[label] && I18N.rules[label][0]) || label}`, reason: "Matched a regular-expression rule adapted from the source project rather than a simple literal word.", suggestion: "Review the context and substantiation, then remove or rewrite the expression with objective, limited wording." };
  }
  return { category: I18N.labels[hit.category] || hit.category, reason: "Potential platform-compliance risk detected. Review the exact context before publishing.", suggestion: "Remove or rewrite the risky expression while preserving only accurate, verifiable information." };
}

function highlightText(text, ranges) {
  if (!ranges.length) return escapeHtml(text);
  const priority = { high: 3, medium: 2, review: 1 };
  const chars = [...text]; const levels = Array(chars.length).fill(null);
  ranges.forEach(r => { for (let i = r.start; i < r.end; i++) if (!levels[i] || priority[r.severity] > priority[levels[i]]) levels[i] = r.severity; });
  let out = "", open = null;
  chars.forEach((char, i) => {
    if (levels[i] !== open) { if (open) out += "</mark>"; open = levels[i]; if (open) out += `<mark class="${open}">`; }
    out += escapeHtml(char);
  });
  if (open) out += "</mark>";
  return out;
}

async function copyReport() {
  if (!report) return;
  const reportText = Object.values(report).map(r => {
    const head = `【${platformName(r.platform)}】${r.passed ? `✓ ${text("noObviousRisk")}` : quantity("riskClasses", r.hits.length)}`;
    return [head, ...r.hits.map(h => { const value = localizeHit(h); return `- ${value.category}: ${h.found.join(currentLanguage === "en" ? ", " : "、")}\n  ${text("reasonLabel")}${value.reason}\n  ${text("suggestionLabel")}${value.suggestion}`; })].join("\n");
  }).join("\n\n");
  await navigator.clipboard.writeText(reportText); showToast(text("reportCopied"));
}

function showToast(message) { els.toast.textContent = message; els.toast.classList.add("show"); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => els.toast.classList.remove("show"), 2300); }
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" }[c])); }
function escapeRegExp(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

async function loadStrictLexicons() {
  if (!window.PublicLexicons) {
    els.strictStatus.textContent = text("strictUnavailable");
    return;
  }
  els.reloadStrict.disabled = true;
  els.strictStatus.textContent = text("loadingLexicons");
  try {
    strictLexiconSummary = await window.PublicLexicons.loadAll((done, total) => {
      els.strictStatus.textContent = text("loadingLexiconsProgress", { done, total });
    });
    strictLexiconSources = strictLexiconSummary.sources;
    renderStrictStatus();
  } catch (error) {
    els.strictStatus.textContent = text("lexiconLoadFailed");
    strictLexiconSources = Array.isArray(window.BUNDLED_LEXICON_SOURCES) ? window.BUNDLED_LEXICON_SOURCES : [];
  } finally {
    els.reloadStrict.disabled = false;
  }
}

setLanguage("zh");
strictLoadPromise = loadStrictLexicons();
