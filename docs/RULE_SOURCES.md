# 规则来源与证据边界

本项目不是小红书、闲鱼或抖音官方工具，也不声称拥有平台内部完整屏蔽词库。

规则库的用途是发布前风险提示。词语命中不自动等于违规，未命中也不等于一定合规。

## 开源参考

### 小红书

- `dvai/xiaohongshu-checker`
  - https://github.com/dvai/xiaohongshu-checker
  - 用于参考绝对化宣传、医疗美容、食品功效、金融收益、站外导流和灰产等分类。
- `ijerryhuang/xiaohongshu-auto-operation`
  - https://github.com/ijerryhuang/xiaohongshu-auto-operation/blob/main/references/violation-words.md
  - 用于参考常见风险类别和人工替换方向。
- `Jiandong7/xiaohongshu-writer`
  - https://github.com/Jiandong7/xiaohongshu-writer
  - 运行时读取其公开合规词表。
- `bethel-mark/travel-xhs-content`
  - https://github.com/bethel-mark/travel-xhs-content
  - 运行时读取其公开跨平台与旅游场景词表。

### 闲鱼

- `0x0xfan/goofish-weiguici-skill`
  - https://github.com/0x0xfan/goofish-weiguici-skill
  - 用于参考商品发布风险、处罚案例边界和公开规则归类。
- `WolfeOvO/astrbot_plugin_xianyu_compliance`
  - https://github.com/WolfeOvO/astrbot_plugin_xianyu_compliance
  - 用于参考虚拟商品、站外交易、侵权资源、直接交付和自动化工具等分类。

### 抖音

- `Zhuticheer/douyin-content-audit`
  - https://github.com/Zhuticheer/douyin-content-audit
  - 用于参考公开规则、危险行为、隐私、违法不良信息、版权和常见误判。

### 通用中文敏感词库

- `konsheng/Sensitive-lexicon`
  - https://github.com/konsheng/Sensitive-lexicon
- `fwwdn/sensitive-stop-words`
  - https://github.com/fwwdn/sensitive-stop-words
- `jkiss/sensitive-words`
  - https://github.com/jkiss/sensitive-words
- `tomzhang/bannedwords`
  - https://github.com/tomzhang/bannedwords
  - MIT；项目中的 Base64 词库按行解码后纳入严格模式。
- `lining0806/TextFilter`
  - https://github.com/lining0806/TextFilter
- `57ing/Sensitive-word`
  - https://github.com/57ing/Sensitive-word
- `LuYongwang/go-sensitive-word`
  - https://github.com/LuYongwang/go-sensitive-word

通用词库只作为候选风险词来源，不能直接视为任何特定平台的现行规则。

许可证允许再分发的词库会由 `tools/build_lexicon_snapshot.mjs` 生成本地快照，保留来源和许可证。没有明确许可证的词库不复制进 MIT 快照，而是由浏览器直接从原 GitHub Raw 地址加载，结果仍保留原仓库名称。严格模式会把这些公开词库的任何命中视为风险，同时明确区分它们与平台官方规则。

截至 2026-09-25 的验证构建中，页面成功加载 48 个非空来源组，共 55,794 个去重词条和 51 条正则；其中本地许可快照包含 24 个来源文件、53,045 个去重词条。数量比旧版少，是因为源语义审计后排除了说明文字、替代词、源代码字符串、分词主词典和无语义单字。远程仓库更新或个别来源不可访问时，运行时数量会变化。

闲鱼来源不仅读取最终 TSV，也按其公开检测脚本实现高风险组合规则、弱匹配和上下文要求。例如“学业对象 + 代做动作”才形成学业代做组合，`cad` 必须有代画、代做、破解等上下文，不再把 Python 脚本里的所有字符串当词库。通用分词主词典不属于屏蔽词库，不得因为包含普通词语而整库纳入。

详细的逐项目审计见 [`SOURCE_ADAPTER_AUDIT.md`](SOURCE_ADAPTER_AUDIT.md)。

## 收录原则

1. 平台公开规则优先于运营教程和民间合集。
2. 能依赖语境判断的词语应标为 `review`，不应自动判为违规。
3. 不收录用于绕过审核的谐音、拆字或隐藏字符教程。
4. 新增规则必须写明平台、类别、原因、建议和适用边界。
5. 对过短、含义宽泛或误报率高的词语保持谨慎。

## 更新日期

当前规则快照：2026-09。

规则会随法律、平台政策和产品功能变化。维护者应在修改规则时更新本文件和网页页脚中的版本日期。
