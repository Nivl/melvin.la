---
name: i18n-translation
description: Translate the Next.js web application to different languages using next-intl. Use this skill when the user requests to add a new language, translate content to an existing locale, update translation strings, fix missing translations, or work with internationalization (i18n) features including locale configuration, message files, and blog content translation.
---

# i18n Translation Skill

Translate the Next.js web application to different languages using `next-intl`.

## Project Structure

```
web/
├── src/
│   ├── i18n/
│   │   ├── locales.ts           # Locale definitions and types
│   │   ├── request.ts           # next-intl request configuration
│   │   └── routing.ts           # Routing configuration
│   ├── app/
│   │   └── [locale]/            # Locale-based routes
│   │       └── layout.tsx       # Layout with font configuration
│   └── bundled_static/
│       └── content/blog/        # Blog content by article and locale
│           └── [article]/
│               ├── en.mdx
│               ├── fr.mdx
│               └── ...
└── messages/
    ├── en.json                  # English (source of truth)
    ├── en.d.json.ts             # TypeScript definitions
    ├── fr.json                  # French translations
    ├── es.json                  # Spanish translations
    ├── ja.json                  # Japanese translations
    ├── ko.json                  # Korean translations
    ├── zh.json                  # Chinese Simplified translations
    └── zh-tw.json               # Chinese Traditional translations
```

## Supported Locales

Current supported locales are defined in `src/i18n/locales.ts`:
- `en` - English (source of truth)
- `fr` - French
- `es` - Spanish
- `ja` - Japanese
- `ko` - Korean
- `zh` - Chinese Simplified
- `zh-tw` - Chinese Traditional

## Workflows

### Adding a New Locale

Follow these steps to add a new language to the application:

1. **Update locale definitions** in `src/i18n/locales.ts`:
   - Add the new locale code to the `locales` array
   - Example: `export const locales = ['en', 'fr', 'es', 'ko', 'zh', 'zh-tw', 'ja'] as const;`

2. **Add language to LanguageSwitcher** in `src/components/layout/NavBar/LanguageSwitcher.tsx`:
   - Add a new entry to the `languages` array with the locale key, native language label, and `isAI` flag
   - **CRITICAL**: Set `isAI: true` for all AI-generated translations (all new languages added via this skill)
   - **CRITICAL**: The `languages` array MUST be ordered alphabetically by the `key` field (locale code)
   - Example:
     ```typescript
     {
       key: 'ja',
       label: '日本語',
       isAI: true,
     }
     ```
   - This adds an "AI" superscript indicator in the language dropdown to inform users the translation is AI-generated

3. **Create message file** at `messages/[locale].json`:
   - Copy the structure from `messages/en.json` (source of truth)
   - Translate all strings to the target language
   - Maintain the same JSON structure and key names

4. **Translate blog content**:
   - For each article in `src/bundled_static/content/blog/[article]/`
   - Create a new `[locale].mdx` file (e.g., `ja.mdx`)
   - Translate the MDX content including frontmatter and body
   - Keep frontmatter structure consistent (title, slug, excerpt, etc.)

5. **Configure fonts** (if needed):
   - Check if the language requires a specific Noto font (e.g., `Noto Sans JP` for Japanese)
   - If needed, import the font in `src/app/[locale]/layout.tsx`
   - Add the font variable to `src/app/globals.css`
   - Note: Latin-specific fonts (like Baikal) have dedicated variables (e.g., `--font-condensed-latin`) for design-specific usage

6. **Update this skill documentation** (`.agents/skills/i18n-translation/SKILL.md`):
   - Add the new locale to the "Supported Locales" section
   - Maintain alphabetical order by locale code for consistency
   - Example: `- 'ja' - Japanese`

7. **Restart development server** for changes to take effect

### Translating Existing Strings

To translate strings that are already defined in English:

1. **Locate the key** in `messages/en.json`
2. **Find the same key** in the target locale file (e.g., `messages/fr.json`)
3. **Translate the value** while preserving:
   - JSON structure
   - Key names
   - Variable placeholders (e.g., `{count}`, `{name}`)
   - HTML entities if present

### Adding New Translation Strings

When new UI text is added to the application:

1. **Add to English source** (`messages/en.json`):
   - Use nested keys for organization (e.g., `"HomePage": { "title": "..." }`)
   - Choose clear, descriptive key names

2. **Add to all other locale files**:
   - Add the same key structure to every `messages/[locale].json`
   - Translate the value appropriately for each language

3. **Use in components**:
   ```typescript
   import { useTranslations } from 'next-intl';
   
   export function MyComponent() {
     const t = useTranslations('HomePage');
     return <h1>{t('title')}</h1>;
   }
   ```

4. **Verify consistency** using `pnpm i18n:check` command

### Translating Blog Articles

Blog articles are stored as MDX files organized by article and locale:

1. **Navigate to** `src/bundled_static/content/blog/[article]/`
2. **Create or edit** the locale-specific MDX file (e.g., `fr.mdx`)
3. **Translate frontmatter**:
   ```yaml
   ---
   title: "Titre de l'article"
   slug: "slug-url"
   excerpt: "Courte description"
   image: "cover.avif"
   ogImage: "cover.jpg"
   createdAt: "2025-07-03"
   updatedAt: "2025-07-03"
   ---
   ```

4. **Translate body content**:
   - Translate all markdown content
   - Keep code blocks and syntax intact
   - Maintain heading structure and links

5. **Restart dev server** after making changes for them to take effect

### Fixing Missing Translations

To identify and fix missing translations:

1. **Run consistency check**: `pnpm i18n:check`
2. **Review errors** showing missing keys or locale files
3. **Add missing translations** to the appropriate locale files
4. **Ensure structure matches** `messages/en.json`

## Best Practices

### Translation Quality

- Maintain **natural phrasing** in the target language, not literal translations
- Preserve **tone and voice** consistent with the brand
- Keep **technical terms** consistent (e.g., "API", "GitHub")
- Use **proper capitalization** and punctuation for the target language
- Consider **cultural context** for idioms and expressions

### JSON Structure

- Always preserve the **nested key structure** from English
- Use **double quotes** for JSON strings
- Maintain **proper indentation** (2 spaces)
- Keep keys in the **same order** as the English file for easier comparison
- Do not include **comments** in JSON files

### Font Configuration

- Latin scripts (English, French, Spanish): Use default fonts
- CJK languages (Chinese, Japanese, Korean): Configure Noto CJK fonts
- Right-to-left languages (Arabic, Hebrew): Ensure RTL support is configured
- Use `--font-condensed-latin` variable for design-specific Latin fonts regardless of locale

### Blog Content

- Translate **all frontmatter fields** except dates and image paths
- Keep **slug values** in the target language for SEO
- Maintain **markdown formatting** (headings, lists, links)
- Preserve **code blocks** without translation
- Keep **image paths** and **links** functional

## Validation

After making translation changes:

1. Run linting: `pnpm run lint --fix`
2. Check i18n consistency: `pnpm i18n:check`
3. Run tests: `pnpm run test:unit`
4. Restart dev server: `pnpm run dev`
5. Verify changes in browser for each affected locale

## Common Issues

### Missing Translation Keys

**Symptom**: Console warnings about missing translation keys  
**Solution**: Add the missing key to all locale files with appropriate translations

### Inconsistent JSON Structure

**Symptom**: i18n:check fails with structure errors  
**Solution**: Ensure all locale files have the same nested key structure as `en.json`

### Blog Content Not Updating

**Symptom**: Changes to MDX files not reflected in the app  
**Solution**: Restart the development server (`pnpm run dev`)

### Font Not Displaying Correctly

**Symptom**: Characters appear with wrong font or as boxes  
**Solution**: Verify the correct Noto font is imported and configured in `layout.tsx` and `globals.css`

### Build Failures After Translation

**Symptom**: Build fails with MDX processing errors  
**Solution**: Check MDX frontmatter syntax and ensure all required fields are present

## Quick Reference

### Commands
- `pnpm i18n:check` - Check translation consistency
- `pnpm run dev` - Start dev server (restart after blog changes)
- `pnpm run build` - Production build (validates all content)

### File Locations
- Locale definitions: `src/i18n/locales.ts`
- Language switcher: `src/components/layout/NavBar/LanguageSwitcher.tsx`
- Message files: `messages/[locale].json`
- Blog content: `src/bundled_static/content/blog/[article]/[locale].mdx`
- Font config: `src/app/[locale]/layout.tsx` and `src/app/globals.css`

### Key Patterns
```typescript
// In components
const t = useTranslations('SectionName');
const text = t('keyName');

// Message structure
{
  "SectionName": {
    "keyName": "Translated text"
  }
}

// LanguageSwitcher entry for new locale
{
  key: 'ja',           // Locale code (array MUST be sorted alphabetically by this key)
  label: '日本語',      // Native language name
  isAI: true,          // Always true for AI-generated translations
}
```
