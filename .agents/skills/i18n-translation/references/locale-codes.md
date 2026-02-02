# Common Locale Codes Reference

This reference provides standard locale codes and naming conventions for internationalization.

## Currently Supported Locales

| Code | Language | Native Name | Notes |
|------|----------|-------------|-------|
| `en` | English | English | Source of truth |
| `fr` | French | Français | |
| `es` | Spanish | Español | |
| `ja` | Japanese | 日本語 | Requires Noto Sans JP |
| `ko` | Korean | 한국어 | Requires Noto Sans KR |
| `zh` | Chinese (Simplified) | 简体中文 | Requires Noto Sans SC |
| `zh-tw` | Chinese (Traditional) | 繁體中文 | Requires Noto Sans TC |

## Common Locale Codes for Future Reference

### European Languages

| Code | Language | Native Name | Font Needs |
|------|----------|-------------|------------|
| `de` | German | Deutsch | Latin |
| `it` | Italian | Italiano | Latin |
| `pt` | Portuguese | Português | Latin |
| `pt-br` | Portuguese (Brazil) | Português (Brasil) | Latin |
| `nl` | Dutch | Nederlands | Latin |
| `pl` | Polish | Polski | Latin |
| `ru` | Russian | Русский | Cyrillic |
| `uk` | Ukrainian | Українська | Cyrillic |
| `sv` | Swedish | Svenska | Latin |
| `no` | Norwegian | Norsk | Latin |
| `da` | Danish | Dansk | Latin |
| `fi` | Finnish | Suomi | Latin |
| `cs` | Czech | Čeština | Latin |
| `el` | Greek | Ελληνικά | Greek |
| `tr` | Turkish | Türkçe | Latin |

### Asian Languages

| Code | Language | Native Name | Font Needs |
|------|----------|-------------|------------|
| `ja` | Japanese | 日本語 | Noto Sans JP |
| `th` | Thai | ไทย | Noto Sans Thai |
| `vi` | Vietnamese | Tiếng Việt | Latin + Vietnamese |
| `id` | Indonesian | Bahasa Indonesia | Latin |
| `ms` | Malay | Bahasa Melayu | Latin |
| `hi` | Hindi | हिन्दी | Devanagari |
| `bn` | Bengali | বাংলা | Bengali |
| `ta` | Tamil | தமிழ் | Tamil |

### Middle Eastern Languages

| Code | Language | Native Name | Font Needs | Direction |
|------|----------|-------------|------------|-----------|
| `ar` | Arabic | العربية | Arabic | RTL |
| `he` | Hebrew | עברית | Hebrew | RTL |
| `fa` | Persian | فارسی | Arabic | RTL |

### Other Languages

| Code | Language | Native Name | Font Needs |
|------|----------|-------------|------------|
| `af` | Afrikaans | Afrikaans | Latin |
| `sw` | Swahili | Kiswahili | Latin |

## Locale Code Conventions

### Format
- Use ISO 639-1 two-letter codes for languages: `en`, `fr`, `ja`
- Use ISO 3166-1 alpha-2 for country/region: `en-us`, `zh-cn`
- Use lowercase for language codes
- Use lowercase with dash for region codes

### Examples
- `en` - English (generic)
- `en-us` - English (United States)
- `en-gb` - English (United Kingdom)
- `zh` - Chinese Simplified (generic)
- `zh-cn` - Chinese Simplified (China)
- `zh-tw` - Chinese Traditional (Taiwan)
- `zh-hk` - Chinese Traditional (Hong Kong)
- `pt` - Portuguese (generic)
- `pt-br` - Portuguese (Brazil)
- `pt-pt` - Portuguese (Portugal)

## Font Recommendations by Script

### Latin Script
- Default system fonts work well
- Consider custom fonts for branding (e.g., Baikal, Inter)
- Most European languages use Latin script

### CJK (Chinese, Japanese, Korean)
- **Simplified Chinese**: Noto Sans SC, Source Han Sans SC
- **Traditional Chinese**: Noto Sans TC, Source Han Sans TC
- **Japanese**: Noto Sans JP, Source Han Sans JP
- **Korean**: Noto Sans KR, Source Han Sans KR

### Cyrillic Script
- Noto Sans, Roboto (have good Cyrillic support)
- Many Latin fonts include Cyrillic glyphs

### Arabic Script
- Noto Sans Arabic, Noto Naskh Arabic
- Consider different styles: Naskh, Kufi, etc.
- Requires RTL support

### Devanagari Script (Hindi, Marathi, Nepali)
- Noto Sans Devanagari
- Requires complex text rendering

### Thai Script
- Noto Sans Thai
- Requires special line-breaking rules

## Next.js next-intl Configuration

When adding a new locale to the Next.js app:

1. Add to `locales` array in `src/i18n/locales.ts`
2. Create `messages/[locale].json` file
3. Create blog MDX files for each article: `src/bundled_static/content/blog/[article]/[locale].mdx`
4. Import necessary fonts in `src/app/[locale]/layout.tsx` if needed
5. Add font CSS variables to `src/app/globals.css` if needed

## Character Encoding

Always use UTF-8 encoding for all translation files to ensure proper display of special characters across all languages.

## Pluralization Rules

Different languages have different pluralization rules:

- **English**: one, other (2 forms)
- **French**: one, other (2 forms)
- **Russian**: one, few, many, other (4 forms)
- **Arabic**: zero, one, two, few, many, other (6 forms)
- **Japanese**: other (1 form - no plural)
- **Chinese**: other (1 form - no plural)

next-intl handles pluralization automatically based on ICU message format.

## Date and Number Formatting

Consider locale-specific formatting:

- **Date formats**: MM/DD/YYYY (US) vs DD/MM/YYYY (EU) vs YYYY-MM-DD (ISO)
- **Number formats**: 1,234.56 (US) vs 1.234,56 (EU)
- **Currency symbols**: $, €, ¥, £, etc.
- **First day of week**: Sunday (US) vs Monday (EU)

next-intl provides built-in formatters for these via `useFormatter()` hook.
