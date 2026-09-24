(function () {
  const ui = {
    zh: {
      documentTitle: "小红书、闲鱼、抖音违禁词与内容合规检测工具",
      description: "免费检测小红书、闲鱼和抖音标题、文案及图片文字中的违禁词、屏蔽词和内容合规风险，提供原文高亮、风险原因和修改建议。",
      brandTitle: "三平台违禁词与内容合规检测",
      brandPlatforms: "小红书 · 闲鱼 · 抖音",
      privacy: "纯本地规则 · 无需大模型 · 无需 API",
      inputEyebrow: "01 · 输入内容", inputTitle: "准备发布什么？", fillExample: "填入示例",
      titleLabel: "标题", titlePlaceholder: "粘贴商品标题、笔记标题或视频标题",
      bodyLabel: "正文 / 商品描述 / 口播稿", bodyPlaceholder: "粘贴正文、字幕、商品描述、直播话术或评论区引导语……",
      uploadTitle: "添加图片并识别其中的文字", uploadHelp: "支持 PNG、JPG、WEBP；可一次选择多张", chooseImage: "选择图片",
      ocrLabel: "图片识别文字", ocrReady: "可手动校正后再检查", ocrPlaceholder: "图片中的文字会显示在这里，也可以手动粘贴或校正。",
      platformsLegend: "检查平台", xiaohongshu: "小红书", xianyu: "闲鱼", douyin: "抖音",
      strictTitle: "最大覆盖严格词库", strictHelp: "默认开启：内置许可词库快照，并联网加载已登记的公开 GitHub 词库。任何命中都会进入风险结果。", enabled: "启用", reload: "重新加载", preparing: "正在准备公开词库…",
      customTitle: "扩展词库（可选）", customHelp: "导入 TXT、CSV 或 TSV；每行一个词。命中项统一标为“需结合语境”，不会自动判定违规。", importLexicon: "导入词库", clear: "清除", notImported: "未导入",
      analyze: "开始检查", localNoteLead: "完全本地运行：", localNote: "不调用大模型，不需要 API Key。检测结果用于发布前自查，不等同于平台官方审核结论。",
      resultEyebrow: "02 · 检查结果", resultTitle: "三个平台，一眼看清", copyReport: "复制报告", waiting: "等待检查", waitingHelp: "输入标题或正文后开始检查。结果会按平台分别展示，并在原文中标出风险位置。",
      highRisk: "高风险", needsEdit: "需修改", needsContext: "需结合语境", footer: "开源本地规则引擎 · 无需大模型与 API · 规则库版本：2026-09 · 关键词命中不自动等于违规",
      imageWaiting: "等待识别", imageRecognizing: "识别中", imageRecognized: "已识别", imageNoText: "未识别到文字", imageFailed: "识别失败", imageAlt: "待检查图片", removeImage: "移除图片",
      chooseImageError: "请选择 PNG、JPG 或 WEBP 图片", loadingOcr: "正在加载本地文字识别组件…", recognizingProgress: "正在识别图片文字 {percent}%", ocrDone: "识别完成，可手动校正", ocrFailed: "自动识别失败，可手动粘贴图片文字", ocrUnavailable: "图片识别暂不可用，可在识别框中手动输入文字", imageHeading: "图片",
      lexiconCleared: "扩展词库已清除", lexiconImported: "已导入 {count} 个去重词条：{file}", lexiconNoTerms: "文件中没有可用词条", lexiconImportedToast: "已导入 {count} 个词条", lexiconReadFailed: "读取失败，请检查文件编码和格式", noUsableTerms: "没有识别到可用词条",
      enterContent: "请先输入标题、正文或图片文字", choosePlatformError: "请至少选择一个平台", reportCopied: "检查报告已复制",
      strictUnavailable: "严格词库加载器不可用，当前仅使用内置精选规则", loadingLexicons: "正在加载公开词库…", loadingLexiconsProgress: "正在加载公开词库 {done} / {total}…", loadedLexicons: "已加载 {sources} 个来源组、{terms} 个去重词条、{patterns} 条正则{failures}", failedSources: "；{count} 个远程来源暂时失败", lexiconLoadFailed: "远程加载失败，继续使用已打包的许可词库快照",
      noObviousRisk: "未发现明显风险", riskClasses: "发现 {count} 类风险", readyForReview: "✓ 可以进入人工发布前复核", reviseBeforePublish: "建议修改后再发布", noMatches: "未命中", issueCount: "{count} 类问题", originalHighlights: "原文风险高亮", matchCount: "{count} 处命中", issuesAndAdvice: "问题与修改建议", noCurrentIssue: "未发现当前规则库中的明显风险", manualChecksRemain: "仍需人工确认事实真实性、素材授权、图片画面和具体类目资质。", scopeNote: "说明：蓝色标记属于“需结合语境复核”，不会被当成必然违规。平台审核还可能结合画面、音轨、账号状态、商品类目、资质和历史行为，本工具不能保证最终审核结果。", howToRevise: "怎么改：", reasonLabel: "原因：", suggestionLabel: "建议：",
      platformNotes: {
        xiaohongshu: "重点检查绝对化宣传、医疗美容功效、收益承诺、站外导流、假货灰产与诱导互动。",
        xianyu: "重点检查站外交易、虚拟资源交付、侵权盗版、学术代做、灰产工具与禁止交易品类。",
        douyin: "重点检查违法不良内容、虚假夸大、危险行为、隐私侵权、站外导流、版权与商业宣传。"
      }
    },
    en: {
      documentTitle: "Prohibited Word & Content Compliance Checker for Xiaohongshu, Xianyu and Douyin",
      description: "Check titles, copy and image text for prohibited words, blocked terms and content-compliance risks on Xiaohongshu, Xianyu and Douyin, with highlights, reasons and revision guidance.",
      brandTitle: "3-Platform Prohibited Word & Compliance Checker", brandPlatforms: "Xiaohongshu · Xianyu · Douyin", privacy: "Local rules · No LLM · No API key",
      inputEyebrow: "01 · CONTENT", inputTitle: "What are you planning to publish?", fillExample: "Load example",
      titleLabel: "Title", titlePlaceholder: "Paste a product, post or video title",
      bodyLabel: "Body / product description / spoken script", bodyPlaceholder: "Paste post copy, subtitles, product descriptions, livestream scripts or comment prompts…",
      uploadTitle: "Add images and recognize their text", uploadHelp: "PNG, JPG and WEBP; multiple images supported", chooseImage: "Choose images",
      ocrLabel: "Recognized image text", ocrReady: "You can correct the text before checking", ocrPlaceholder: "Recognized text will appear here. You can also paste or correct it manually.",
      platformsLegend: "Platforms", xiaohongshu: "Xiaohongshu", xianyu: "Xianyu", douyin: "Douyin",
      strictTitle: "Maximum-coverage strict lexicons", strictHelp: "Enabled by default: bundled licensed snapshots plus registered public GitHub lexicons. Every match is included in the risk report.", enabled: "On", reload: "Reload", preparing: "Preparing public lexicons…",
      customTitle: "Custom lexicon (optional)", customHelp: "Import TXT, CSV or TSV with one term per line. Matches are marked for contextual review rather than treated as automatic violations.", importLexicon: "Import lexicon", clear: "Clear", notImported: "Not imported",
      analyze: "Check content", localNoteLead: "Runs locally: ", localNote: "No large language model or API key is used. Results are pre-publication guidance, not an official platform decision.",
      resultEyebrow: "02 · RESULTS", resultTitle: "Three platforms, one clear report", copyReport: "Copy report", waiting: "Waiting for content", waitingHelp: "Enter a title or body to start. Results are separated by platform and risky text is highlighted in place.",
      highRisk: "High risk", needsEdit: "Needs revision", needsContext: "Context review", footer: "Open-source local rule engine · No LLM or API · Rules: 2026-09 · A keyword match is not automatically a violation",
      imageWaiting: "Waiting", imageRecognizing: "Recognizing", imageRecognized: "Recognized", imageNoText: "No text found", imageFailed: "Recognition failed", imageAlt: "Image to check", removeImage: "Remove image",
      chooseImageError: "Choose PNG, JPG or WEBP images", loadingOcr: "Loading the local OCR component…", recognizingProgress: "Recognizing image text {percent}%", ocrDone: "Recognition complete; you can correct the text", ocrFailed: "Automatic recognition failed; paste the image text manually", ocrUnavailable: "Image recognition is unavailable. Enter the image text manually in the recognition box.", imageHeading: "Image",
      lexiconCleared: "Custom lexicon cleared", lexiconImported: "Imported {count} unique terms from {file}", lexiconNoTerms: "No usable terms were found in the file", lexiconImportedToast: "Imported {count} terms", lexiconReadFailed: "Could not read the file; check its encoding and format", noUsableTerms: "No usable terms found",
      enterContent: "Enter a title, body or image text first", choosePlatformError: "Select at least one platform", reportCopied: "Report copied",
      strictUnavailable: "Strict lexicon loader unavailable; using curated built-in rules only", loadingLexicons: "Loading public lexicons…", loadingLexiconsProgress: "Loading public lexicons {done} / {total}…", loadedLexicons: "Loaded {sources} source groups, {terms} unique terms and {patterns} regex rules{failures}", failedSources: "; {count} remote sources temporarily failed", lexiconLoadFailed: "Remote loading failed; using the bundled licensed snapshot",
      noObviousRisk: "No obvious risk found", riskClasses: "{count} risk categories", readyForReview: "✓ Ready for final human review", reviseBeforePublish: "Revise before publishing", noMatches: "No matches", issueCount: "{count} issue categories", originalHighlights: "Risk highlights in the original text", matchCount: "{count} matches", issuesAndAdvice: "Issues and revision guidance", noCurrentIssue: "No obvious risk found in the current rules", manualChecksRemain: "Still verify factual accuracy, asset rights, visual content and category-specific qualifications manually.", scopeNote: "Note: blue items require contextual review and are not automatic violations. Platforms may also consider visuals, audio, account status, category, qualifications and history. This tool cannot guarantee a final moderation result.", howToRevise: "How to revise: ", reasonLabel: "Reason: ", suggestionLabel: "Suggestion: ",
      platformNotes: {
        xiaohongshu: "Focuses on absolute advertising claims, medical and cosmetic claims, earnings guarantees, off-platform diversion, counterfeit or gray-market services and engagement manipulation.",
        xianyu: "Focuses on off-platform transactions, virtual delivery, copyright infringement, academic ghostwriting, gray-market tools and prohibited product categories.",
        douyin: "Focuses on illegal or harmful content, misleading claims, dangerous conduct, privacy violations, off-platform diversion, copyright and commercial promotion."
      }
    }
  };

  const rules = {
    "绝对化宣传": ["Absolute or unsubstantiated claims", "Absolute rankings or unconditional performance claims may mislead users.", "Remove absolute conclusions and use verifiable specifications, conditions or genuine experience."],
    "医疗与功效宣称": ["Medical and efficacy claims", "Disease-treatment, prevention or guaranteed bodily-effect claims are high risk outside qualified professional contexts.", "Remove diagnostic or treatment promises; describe objective ingredients and experience, note individual variation and provide qualifications where required."],
    "收益与赚钱承诺": ["Earnings and profit guarantees", "Guaranteed income, returns or profit may constitute misleading promotion.", "Describe methods, costs and risks without promising income, returns or guaranteed outcomes."],
    "违法与灰产": ["Illegal and gray-market activity", "The text may involve counterfeiting, cheating, data manipulation or illegal services.", "Remove the product, service or solicitation. Keep a clear educational context only when discussing legitimate risk prevention."],
    "强保证表达": ["Unconditional guarantees", "The statement guarantees a result without stating applicable limits.", "Use conditional language and state the relevant limitations instead of guaranteeing a result."],
    "站外导流": ["Off-platform diversion", "The text may direct users away from the platform for contact or transactions.", "Remove external contact details and use platform-approved messaging, shop or transaction features."],
    "跨平台引导": ["Cross-platform direction", "Instructions to search or jump to another platform may be treated as diversion.", "Provide the necessary information in the current post and avoid directing users to another platform."],
    "医美高风险": ["High-risk medical aesthetics", "Medical-aesthetic services involve qualifications, substantiation and safety risks.", "Do not make definite recommendations as ordinary lifestyle content; provide qualifications, scope and risk disclosures."],
    "迷信营销": ["Superstitious marketing", "The product or service is tied to guaranteed luck, wealth or disaster avoidance.", "Remove definite supernatural effects. If culturally relevant, frame the content as history, folklore or aesthetics."],
    "诱导互动": ["Engagement manipulation", "The wording may mechanically induce engagement and must be reviewed with the activity rules and context.", "Use genuine questions or platform-approved campaign language instead of exchanging benefits for engagement."],
    "站外交易或联系": ["Off-platform contact or transactions", "The text may bypass Xianyu messaging, payment or transaction protection.", "Remove external contact details, cloud-drive codes and transfer instructions; keep communication and payment on Xianyu."],
    "虚拟资源与直接交付": ["Virtual content and direct delivery", "The wording may indicate an unsupported virtual-delivery method or transaction risk.", "Confirm that the category permits the item and describe its form and delivery method truthfully."],
    "侵权资源": ["Potentially infringing resources", "The item may contain unauthorized courses, films, software, music or other materials.", "Publish only material you own or are authorized to distribute, and state the source and authorization scope."],
    "学术与考试代做": ["Academic and exam ghostwriting", "The service may complete academic work, exams or falsified materials for another person.", "Offer legitimate teaching, study methods or public materials only; do not complete work the user must do personally."],
    "工具、账号与自动化": ["Tools, accounts and automation", "The text may involve account abuse, bypassing verification, scraping or platform manipulation.", "Remove features that evade platform controls and retain only lawful, authorized capabilities."],
    "需要语境复核": ["Context-dependent terms", "These terms may be legitimate in ordinary product or educational contexts and are not violations by themselves.", "Review the actual context and avoid combining them with ghostwriting, cracking, manipulation or outcome guarantees."],
    "危险行为": ["Dangerous conduct", "The content may show imitable dangerous conduct; a warning alone does not remove the risk.", "Remove dangerous processes and reproducible steps. For safety education, emphasize controlled conditions, expertise and prevention."],
    "隐私与人肉": ["Privacy and doxxing", "The content may disclose, sell or encourage exposure of another person's information.", "Remove or irreversibly redact identifiable information and confirm consent, necessity and public-interest grounds."],
    "低俗或违法引导": ["Sexual or illegal solicitation", "The content may involve sexual services, gambling, drugs, weapons, fraud or other illegal activity.", "Remove the content and contact details. Legitimate reporting or education must avoid solicitation and actionable instructions."],
    "时事与不实信息": ["Current affairs and unverified claims", "Public-event or policy claims may be unsourced, outdated or exaggerated.", "Add an authoritative source, date and location; do not publish conclusions that cannot be verified."],
    "版权与搬运": ["Copyright and reposting", "The material may infringe video, music, image or original-content rights.", "Use owned or licensed materials and retain evidence of permission; attribution alone is not authorization."],
    "AI与演绎标识": ["AI and dramatization labels", "The content may require a clear AI-generated or fictional-dramatization label, although the terms themselves are not violations.", "Keep an accurate, prominent label and do not impersonate real people or events."],
    "学术代做与接单组合": ["Academic ghostwriting service combination", "Commission-taking language appears together with thesis, assignment or other academic deliverables, creating a strong ghostwriting signal.", "Remove commission, ghostwriting and completion promises. Legitimate tutoring may explain methods but must not complete the learner's work."],
    "考试答案与包过组合": ["Exam answers and pass-guarantee combination", "Exam or certificate terms appear with answers, impersonation or pass guarantees.", "Remove answers, impersonation and outcome guarantees; retain only legitimate teaching and study plans."],
    "网课/教辅/电子资源与侵权交付组合": ["Course, study-material and infringing-delivery combination", "Educational or copyrighted subject matter appears together with resource bundles, scans, cloud drives or instant delivery.", "Publish only owned or authorized materials and clearly state the source, authorization scope and real delivery format."],
    "大厂求职资料与内推组合": ["Major-employer recruiting and referral combination", "Major-employer or AI interview contexts appear with interview banks, referrals or paid job-placement services.", "Remove paid referrals, interview guarantees and internal-question claims; use publicly sourced career experience instead."],
    "竞赛代做或获奖承诺组合": ["Competition ghostwriting or award-guarantee combination", "Competition terms are tied to ghostwriting, proxy participation or guaranteed awards.", "Keep rule explanations, public cases and method coaching only; remove proxy work, proxy participation and award guarantees."],
    "自动化刷量/托管组合": ["Automated manipulation or account-management combination", "Automation or batch terms are tied to followers, traffic, engagement, promotion or unattended management.", "Remove manipulation, unattended operation and platform-evasion promises; describe only lawful, authorized user-assistance features."],
    "扩展词库命中": ["Custom lexicon match", "The term came from the user's imported candidate lexicon; its source and platform scope depend on that file.", "Review the source and context. Keep the term or remove it from the custom lexicon if it is a false positive."]
  };

  const labels = {
    "绝对化与夸大宣传": "Absolute and exaggerated claims", "医疗健康行业敏感词": "Medical and health terms", "食品功效敏感词": "Food efficacy claims",
    "化妆品功效敏感词": "Cosmetic efficacy claims", "承诺保证与见效时效": "Guarantees and time-to-effect claims", "金融投资与收益承诺": "Finance and return guarantees",
    "联系方式与站外导流": "Contact details and off-platform diversion", "灰产违法与违禁服务": "Illegal and gray-market services", "封建迷信与不良价值导向": "Superstition and harmful values",
    "广告绝对化/无法证实主张": "Absolute or unsubstantiated advertising", "医疗健康/功效": "Medical and health efficacy", "金融投资/收益承诺": "Finance and return guarantees",
    "高敏感内容": "High-sensitivity content", "暗号与外部引导绑定": "Aliases tied to external direction", "平台别名/规避线索": "Platform aliases or evasion signals",
    "AI 生成合成线索": "AI-generated or synthetic-content signals", "转载/版权授权": "Reposting and copyright authorization", "商业合作/利益关系": "Commercial relationships",
    "时事/政策/社会事件来源": "Sources for current affairs and policy claims", "个人信息/隐私": "Personal information and privacy", "赠品/抽奖/互动条件": "Giveaways, lotteries and engagement conditions", "其他平台名称": "Other platform names"
  };

  window.AppI18n = { ui, rules, labels };
})();
