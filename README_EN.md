# Prohibited Word & Content Compliance Checker for Xiaohongshu, Xianyu and Douyin

[简体中文](README.md) | **English**

A browser-based pre-publication checker for common compliance risks in **Chinese-language content** for Xiaohongshu, Xianyu and Douyin. It checks Chinese titles, posts, product descriptions, spoken scripts and image text without requiring a large language model, API key or installation.

> **Language scope:** This is not an English-content moderation engine. This English README helps English-speaking readers understand, review and deploy the project; it does not mean that the detector can reliably review English copy.

## Use It Online

**Live version: https://catink.github.io/content-compliance-checker/**

Most users do not need to download or deploy the project. Open the live version, enter a title, body or image, and run the check directly.

Titles, body text and detection are processed in the current browser. The project does not send your copy to a project-owned backend and does not call an LLM. The page itself, public GitHub lexicons and the image-OCR component still require network access to load.

## Screenshots

![Chinese interface showing Xiaohongshu, Xianyu and Douyin compliance results](docs/images/compliance-checker-overview.png)

## Detection Language Scope

The detector is designed for Chinese-language platform content. Although the runtime lexicons contain many entries written with Latin characters, most of them are domains, URLs, romanized Chinese variants, platform abbreviations, brand names or auxiliary signals such as `VX`, `QQ` and `token` inside otherwise Chinese content.

A current source audit found that almost all Latin-only entries are domain-like strings, while the rule set contains almost no complete English multi-word policy coverage. Direct regression tests also showed that English medical guarantees, thesis ghostwriting, earnings guarantees and follower-manipulation copy all passed incorrectly in both built-in and strict modes.

Do not rely on this tool to moderate English-language posts. See [`docs/LANGUAGE_SCOPE_AUDIT.md`](docs/LANGUAGE_SCOPE_AUDIT.md) for the measurements and false-negative tests.

## When Self-Hosting Is Useful

Self-hosting is optional, not a requirement. Consider it only when you need to:

- run the tool on a corporate intranet or in an environment that cannot access the public site;
- pin a specific version instead of following updates to the public version;
- operate fully offline after replacing remote lexicons and OCR assets with local files;
- permanently bundle a private organization-specific lexicon;
- customize the interface, branding or domain; or
- add platforms, batch processing or integration with an internal system.

If none of these apply, use the live version. The repository is primarily for source review, version pinning and secondary development.

## Features

- Runs entirely with deterministic JavaScript rules; no LLM is called.
- Produces separate Xiaohongshu, Xianyu and Douyin results.
- Highlights risky expressions in the original text.
- Explains each issue and provides revision guidance.
- Checks titles, body text and OCR-recognized image text together.
- Requires no account, server configuration or API key.
- Ships as a static site that can be hosted on GitHub Pages, Cloudflare Pages or Netlify.
- Uses the MIT License for the project code.
- Enables a maximum-coverage strict mode by default, combining bundled redistributable snapshots with registered public GitHub lexicons.
- Imports custom TXT, CSV or TSV lexicons with up to 50,000 unique terms.
- Clearly documents that the detector targets Chinese-language platform content.

## Optional Local Use

### Option 1: Open the local file

1. Download and extract the repository.
2. Open the `dist` directory.
3. Double-click `index.html`.

Title and body checks do not require a network connection. Image OCR loads Tesseract.js from jsDelivr by default, so the first OCR use requires network access. If OCR cannot load, paste the image text into the OCR text box manually.

### Option 2: Start a local static server

If the browser restricts local-file loading, run this command from the project directory:

```bash
python3 -m http.server 8000 --directory dist
```

Then open:

```text
http://localhost:8000
```

### Option 3: Deploy your own copy

The repository includes `.github/workflows/pages.yml`. Enable GitHub Pages with GitHub Actions as the publishing source; every push to `main` will deploy the `dist` directory.

## How It Works

The checker uses deterministic rules:

1. Combine the title, body and OCR-recognized image text.
2. Load common rules and platform-specific rules.
3. Match risky terms, phrases, regular expressions and context-sensitive combinations.
4. Classify results as `high`, `medium` or `review`.
5. Record every source-text position and render inline highlighting.
6. Display the maintained reason and revision guidance for each rule.

The project is not an AI moderation model. It does not infer unpublished platform algorithms and does not provide instructions for bypassing moderation through homophones, character splitting or hidden characters.

## Lexicon Coverage and Extensions

The built-in rules are curated so that each result can explain the risk and suggest a revision. They are not a copy of any platform's unpublished internal blocklist.

| Platform | Built-in unique terms/phrases |
| --- | ---: |
| Xiaohongshu | 147 |
| Xianyu | 174 |
| Douyin | 152 |

Maximum-coverage strict mode combines:

- bundled snapshots from public lexicons whose licenses permit redistribution; and
- public platform lexicons loaded at runtime from their original GitHub Raw URLs when redistribution rights are not explicit.

Sources are not treated as interchangeable flat word files. The project adapts source-specific behavior such as regular expressions, AND-combination rules, weak matches, tokenization and required context.

The currently verified build loads 48 non-empty source groups, 55,794 unique terms and 51 regular-expression rules. The bundled licensed snapshot contains 53,045 unique terms from 24 source files. Runtime totals may change when upstream repositories or network availability change.

Deterministic combination rules cover cases such as commission-taking language appearing together with thesis, assignment or graduation-project terms. For example, `接单` plus `毕业设计` is treated as a high-risk academic ghostwriting signal even when remote strict lexicons are disabled. By contrast, ordinary phrases such as `毕业设计经验分享` do not trigger that combination.

You can import an industry-specific `.txt`, `.csv` or `.tsv` file in the Custom Lexicon section. Terms separated by lines, commas or tabs are loaded as contextual-review candidates, with a limit of 50,000 unique terms.

Some source repositories do not state redistribution terms. Their full lexicons are therefore not copied into this MIT repository; the browser loads them directly from the original GitHub Raw locations. If those sources are unavailable, the tool continues with its bundled licensed snapshot and built-in platform rules.

For the source-by-source behavior audit and exclusion decisions, see [`docs/SOURCE_ADAPTER_AUDIT.md`](docs/SOURCE_ADAPTER_AUDIT.md). The audit itself is currently maintained in Chinese.

## Privacy

- Titles and body text are processed only in the current browser.
- Selected images are not sent to a project-owned server.
- Tesseract.js performs image OCR in the browser.
- Tesseract.js code and language assets load from a public CDN by default; bundle them locally if you require fully offline operation.
- The project contains no analytics, account system, advertising SDK or user-data collection code.

## Supported Platforms

| Platform | Main review areas |
| --- | --- |
| Xiaohongshu | Absolute claims, medical and cosmetic efficacy, earnings guarantees, off-platform diversion, cross-platform direction, gray-market services, superstitious marketing and engagement manipulation |
| Xianyu | Off-platform transactions, virtual delivery, infringing resources, academic ghostwriting, account or automation tools and prohibited product categories |
| Douyin | Off-platform diversion, dangerous conduct, privacy and doxxing, sexual or illegal solicitation, misinformation, copyright or reposting and AI/dramatization labels |

## Modifying or Adding Rules

Core rules are maintained in:

```text
dist/app.js
```

Rule format:

```javascript
rule(
  "Risk category",
  "high", // high / medium / review
  ["term one", "term two"],
  "Reason for the match",
  "Revision guidance"
)
```

- `COMMON_RULES`: rules shared by all three platforms.
- `PLATFORM_RULES.xiaohongshu`: Xiaohongshu rules.
- `PLATFORM_RULES.xianyu`: Xianyu rules.
- `PLATFORM_RULES.douyin`: Douyin rules.
After adding a rule, open the site and verify its highlighting, category, explanation and revision guidance with both positive and negative Chinese examples.

## Project Structure

```text
content-compliance-checker/
├── dist/
│   ├── index.html       # Page structure
│   ├── styles.css       # Interface styles
│   ├── app.js           # Platform rules, detection engine and interactions
│   ├── lexicon-loader.js   # Public source registry and runtime adapters
│   └── lexicon-snapshot.js # Generated redistributable snapshot entry point
├── docs/
│   ├── RULE_SOURCES.md  # Rule sources and evidence boundaries
│   ├── SOURCE_ADAPTER_AUDIT.md # Source behavior and adapter audit
│   ├── LANGUAGE_SCOPE_AUDIT.md # Dictionary-language and English false-negative audit
│   └── images/          # Real interface screenshot used in README files
├── tools/
│   └── build_lexicon_snapshot.mjs # Refresh licensed lexicon snapshots
├── LICENSE
├── README.md       # Chinese documentation
└── README_EN.md    # English documentation
```

## Important Limitations

The tool can identify only text risks represented by its current rules. It cannot guarantee that content will pass platform moderation. Platforms may also consider visual content, video actions, audio, product category, business qualifications, licensing, account status and account history.

The image feature currently recognizes and checks image text only. It does not evaluate people, actions, nudity, brand logos, copyright status or other visual content.

Platform policies change over time. Maintainers and users should periodically check the latest public platform policies and must not present community-maintained lexicons as complete official platform blocklists.

## Contributing

Issues and pull requests are welcome for:

- platform rules with explicit sources;
- verified false-positive or false-negative cases;
- improvements to Chinese phrasing, homophones, split-character variants and platform-specific auxiliary signals;
- support for additional platforms; and
- accessibility, mobile and offline improvements.

When adding a term, document its source, target platform, risk level and applicable context. Avoid unsupported claims about mysterious or unofficial "traffic-limiting words."

## License

[MIT License](./LICENSE)
