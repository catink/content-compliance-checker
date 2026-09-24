# 源项目用法审计与适配说明

> 审计日期：2026-09-25。本文回答的不是“仓库里有哪些文件”，而是“原项目实际怎样使用这些词”。

## 审计结论

公开项目的资料不能统一当作“每行一个屏蔽词”。实际上至少包含七种用法：

1. 直接子串命中；
2. 正则表达式，包含空格、谐音、号码和数值变体；
3. 多组条件同时成立（AND 组合规则）；
4. 短词/单字只作弱匹配；
5. 某些词必须有上下文才命中；
6. 先分词，再做词集交集；
7. 词语命中只生成“复核候选”，不直接下违规结论。

本项目现在为不同来源分配不同适配器，不再对源代码和 Markdown 做全文引号抽取。

## 逐项目审计

| 项目 | 原项目真实用法 | 本项目的适配 | 明确排除 |
|---|---|---|---|
| `dvai/xiaohongshu-checker` | `app.js` 仅把 `WORD_BANK.categories[].keywords` 转为转义后的精确正则，并单独执行 `patterns` 中的正则；保留分类、严重程度和建议。 | 只解析 `*Terms` 词组和 `patterns` 正则，正则命中保留原项目的分类、等级和建议。 | 版本号、分类 ID、说明、建议、正则标签不当作敏感词。 |
| `ijerryhuang/xiaohongshu-auto-operation` | 文档的示例函数对明确数组做 `word in text`；其余部分是替代表和人工检查流程。 | 只读取表格第一列、明确标记的禁用表达以及示例函数中的两个检测数组。 | 替代词、说明文字、更新记录和代码语句不纳入词表。 |
| `Jiandong7/xiaohongshu-writer` | `check_compliance.py` 从 `VIOLATION_WORDS`/动态词库遍历 `words`，使用转义后的不区分大小写正则查找所有位置，输出等级、建议、替换和原文标记。 | 直接从检测脚本的 `words` 字段取词，不再从生成的 Markdown 说明文件中猜测词条。 | `REPLACEMENTS`、建议文本、在线源 URL 和程序字符串全部排除。 |
| `bethel-mark/travel-xhs-content` | 这是生成型 Skill，要求 LLM 按红/黄/绿等级自查；没有独立执行的检测器。 | 只把“违禁词”表格第一列和明确列出的风险表达当作候选词。 | “可保留清单”、合规替代、自查问句和法规标题不当作禁词。 |
| `0x0xfan/goofish-weiguici-skill` | 先对 TSV 做 NFKC、小写和去空白后的包含检查；`v/pm/tk` 和单字降为弱匹配；`cad` 必须同时出现代画/代做/破解等上下文；另有政策直接规则、多组 AND 组合规则和“姓名+课程/资料”复核规则。 | TSV 保留归一化值、分类和弱匹配元数据；实现 `cad` 上下文、短词边界、学业代做、盗版资源、大厂求职、竞赛代办和刷量托管等组合规则。 | 不再把 Python 脚本的所有字符串当词库；“资源”“批量”“软件”等单独出现不触发对应组合规则。 |
| `WolfeOvO/astrbot_plugin_xianyu_compliance` | 主流程使用 LLM，但始终运行本地兜底：只展平 `SENSITIVE_CATEGORIES[].groups[].words`，按词长降序后做不区分大小写的包含匹配；单字标为 `fuzzy`，非单字为硬命中，硬命中会覆盖 LLM 的“安全”判定。 | 只解析 `words` 数组；单字降为“需结合语境”，非单字在严格模式下按风险处理。 | `CHAT_RED_LINES`、替换方案、LLM prompt、JSON 字段和类别说明不当作词库。 |
| `Zhuticheer/douyin-content-audit` | 以证据、规则场景、风险等级和人工复核为主；项目明确不把“网传违禁词”直接当现行硬规则。 | 用于内置的抖音场景规则和结果边界，不抽取整个文档的字符串。 | 官方快照全文、报告模板和示例不当作“屏蔽词”。 |
| `louiseliu/media-publish-review` | `preflight.py` 读取 `term-patterns.json`，按平台范围执行正则，记录位置和上下文，再用优先级去除被更强命中完全覆盖的结果。它明确说“命中是复核候选，不是发布结论”。 | 直接读取 JSON 正则和平台范围，保留 `urgent/high/normal` 到高风险/语境复核的映射，并使用原项目的复核和处置文字。 | 不将规则 JSON 的 ID、分类、说明和动作文字混入词库。 |
| `fullstackcrew-alpha/skill-cn-content-matrix` | 真正的脚本并不解析 `sensitive-words.md`；它在 `content-check.sh` 里定义通用和平台专属的 `grep -E` 正则列表，同时检查字数、Emoji 和段落。 | 仅解析脚本实际执行的 `COMMON_WORDS` 及小红书/抖音 `PLATFORM_WORDS`，按源脚本范围分组。 | Markdown 中没有被脚本执行的建议和示例不假装成“项目实际检测”。 |
| `lining0806/TextFilter` | 检测器用 jieba 精确分词，再计算分词结果与 `Config/stopwords_chs` 的集合交集。`Config/dict` 只是 jieba 主词典，不是屏蔽词。 | 加载 `stopwords_chs`，浏览器中用 `Intl.Segmenter` 做中文词边界适配；不再整库加载 `Config/dict`。 | `Config/dict`、`user_dict`和“敏感词库大全”不会被冒充为原程序的实际过滤输入。 |
| `LuYongwang/go-sensitive-word` | 词库装入 DFA/AC 自动机；默认归一化为忽略大小写和全角转半角，严格模式还可压缩重复字符、统一数字/繁简/英文变体、去零宽字符和映射同形字；同时保留词条来源。 | 通用匹配使用 NFKC、小写和零宽字符清理，结果保留原文位置和来源。 | 不宣称浏览器实现了该 Go 项目的完整 AC/DFA 性能和全部严格归一化选项。 |
| `fwwdn/sensitive-stop-words` / `jkiss/sensitive-words` / `57ing/Sensitive-word` | 主要是按分类保存的一行一词数据，没有平台语境结论引擎。 | 作为通用候选词库做子串匹配，结果标明公开词库来源，不冒充平台官方规则。 | `stopword.dic` 这类语言停用词不纳入屏蔽词。 |
| `tomzhang/bannedwords` | 每行 Base64 编码，`decrypt.php` 对每行解码后连接成真实词库。 | 构建本地快照时按行 Base64 解码，保留 MIT 来源和文件组。 | 未解码的 Base64 字符串不作为词条。 |
| `konsheng/Sensitive-lexicon` | 数据仓库为主，README 建议使用 Trie/DFA/正则等外部方法，不自带小红书/闲鱼/抖音的处置结论。 | 对许可文件按行构建快照，仅作通用候选词。 | 文件路径、说明文档和统计不当词条。 |

## 结果边界

- “未命中”只表示当前本地规则和已成功加载来源未发现候选风险，不代表平台必然通过。
- 源项目使用 LLM 的部分不会搬入；本工具只实现其可确定、可离线执行的规则部分。
- 开源项目中存在大量“网传限流词”；本工具会显示其来源和复核属性，不把它们写成平台官方事实。
