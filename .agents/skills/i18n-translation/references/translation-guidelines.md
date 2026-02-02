# Translation Best Practices and Guidelines

This reference provides detailed guidance on creating high-quality translations for the web application.

## General Translation Principles

### Natural Language Flow

Translate for meaning and natural flow, not word-for-word:

❌ **Bad**: "Click the button to make the thing start" → "Cliquez le bouton pour faire la chose commencer"  
✅ **Good**: "Click the button to make the thing start" → "Cliquez sur le bouton pour démarrer"

### Cultural Adaptation (Localization vs Translation)

Consider cultural context and adapt accordingly:

- **Idioms**: "It's raining cats and dogs" shouldn't be literally translated
- **Metaphors**: May not work in all cultures
- **Examples**: Use culturally relevant examples (sports, holidays, etc.)
- **Humor**: Often doesn't translate well
- **Colors**: Different cultural meanings (white = purity in West, mourning in East)
- **Icons**: Some symbols have different meanings across cultures

### Consistency

Maintain consistency throughout the application:

- Use the same translation for repeated terms
- Maintain consistent tone (formal vs casual)
- Keep technical terms standardized
- Use consistent capitalization rules for the target language

## Technical Guidelines

### Preserve Placeholders

Keep variable placeholders intact:

```json
{
  "greeting": "Hello, {name}!"
}
```

✅ Correct French: `"Bonjour, {name} !"`  
❌ Wrong: `"Bonjour, {nom} !"` (changed placeholder name)

### Maintain HTML Entities

Preserve HTML entities and tags:

```json
{
  "termsLink": "I agree to the <a>Terms & Conditions</a>"
}
```

✅ Correct French: `"J'accepte les <a>Conditions Générales</a>"`  
❌ Wrong: `"J'accepte les Conditions Générales"` (removed tags)

### Handle Pluralization

Use ICU message format for plurals with next-intl:

```json
{
  "itemCount": "{count, plural, =0 {No items} one {# item} other {# items}}"
}
```

French (2 forms):
```json
{
  "itemCount": "{count, plural, =0 {Aucun élément} one {# élément} other {# éléments}}"
}
```

Russian (4 forms):
```json
{
  "itemCount": "{count, plural, =0 {Нет элементов} one {# элемент} few {# элемента} many {# элементов} other {# элементов}}"
}
```

### Text Length Considerations

Translations often differ in length from English:

- **German**: Often 30% longer than English
- **Chinese/Japanese**: Often 30% shorter than English
- **French**: Generally 15-20% longer than English
- **Korean**: Similar length to English

Design UI components to accommodate text expansion/contraction:

- Use flexible layouts (CSS flexbox, grid)
- Avoid fixed widths where possible
- Test with longest expected translations
- Consider line breaks and word wrapping

## Language-Specific Guidelines

### French

- **Formal vs Informal**: Choose consistent use of "tu" vs "vous"
- **Capitalization**: Capitalize only first word of titles
- **Spaces before punctuation**: Required before `:`, `;`, `!`, `?`
- **Quotes**: Use guillemets « » instead of " "
- **Accents**: Always use proper accents (é, è, ê, à, ù, etc.)

Example:
```json
{
  "welcome": "Bienvenue sur notre site !"
}
```

### Spanish

- **Regional variants**: Decide between European (Castilian) and Latin American Spanish
- **Formal vs Informal**: Choose "tú" vs "usted" consistently
- **Capitalization**: Capitalize only first word of titles
- **Inverted punctuation**: Use ¡ and ¿ at the beginning
- **Accents**: Always use proper accents (á, é, í, ó, ú, ñ)

Example:
```json
{
  "question": "¿Cómo estás?"
}
```

### German

- **Formal vs Informal**: Choose "du" vs "Sie" consistently (formal recommended for business)
- **Capitalization**: Capitalize all nouns
- **Compound words**: German creates long compound words
- **Umlauts**: Use proper umlauts (ä, ö, ü, ß)

Example:
```json
{
  "settings": "Einstellungen"
}
```

### Chinese (Simplified and Traditional)

- **No spaces**: Chinese doesn't use spaces between words
- **Punctuation**: Uses full-width punctuation (，。！？)
- **Simplified vs Traditional**: 
  - Simplified (zh): Mainland China, Singapore
  - Traditional (zh-tw): Taiwan, Hong Kong, Macau
- **Avoid literal translations**: Chinese often requires restructuring

Example:
```json
{
  "welcome": "欢迎来到我们的网站！"
}
```

### Korean

- **Formal vs Informal**: Choose appropriate speech level (존댓말 vs 반말)
- **Particles**: Pay attention to subject/object particles (이/가, 을/를)
- **Spacing**: Unlike Chinese, Korean uses spaces between words
- **Honorifics**: Important in formal contexts

Example:
```json
{
  "welcome": "저희 웹사이트에 오신 것을 환영합니다!"
}
```

### Japanese

- **Writing systems**: Mix of Hiragana, Katakana, and Kanji
- **Formality levels**: Choose appropriate politeness level (丁寧語, 敬語)
- **Particles**: Pay attention to particles (は, が, を, に, で, etc.)
- **No spaces**: Generally no spaces between words
- **Foreign words**: Use Katakana for foreign terms

Example:
```json
{
  "welcome": "私たちのウェブサイトへようこそ！"
}
```

### Arabic (if supported in future)

- **RTL (Right-to-Left)**: Requires special layout handling
- **Text direction**: Content flows right to left
- **Numbers**: May use Western or Arabic-Indic numerals
- **Diacritics**: Consider whether to include diacritical marks
- **Honorifics**: Important in formal contexts

Technical requirements:
- Set `dir="rtl"` on HTML element
- Mirror UI layouts (buttons, icons, etc.)
- Test with long Arabic text

## Quality Assurance

### Translation Review Checklist

Before submitting translations:

- [ ] All placeholder variables preserved (`{name}`, `{count}`, etc.)
- [ ] HTML tags maintained (`<a>`, `<strong>`, etc.)
- [ ] Proper capitalization for target language
- [ ] Correct punctuation and spacing rules
- [ ] No spelling or grammatical errors
- [ ] Natural phrasing (not literal translation)
- [ ] Consistent terminology throughout
- [ ] Appropriate formality level
- [ ] Cultural adaptation where needed
- [ ] Text length doesn't break UI (test in browser)

### Testing in Context

Always test translations in the actual application:

1. View each translated page in browser
2. Check for text overflow or wrapping issues
3. Verify placeholders render correctly with real data
4. Test different device sizes (mobile, tablet, desktop)
5. Verify date/number formatting is correct
6. Check RTL layout if applicable

### Common Translation Mistakes to Avoid

❌ **Literal translations**:
- "Save" → "Sauver" (correct: "Enregistrer" in French)

❌ **Wrong formality**:
- Mixing "tu" and "vous" in French
- Mixing "du" and "Sie" in German

❌ **Incorrect pluralization**:
- Using English plural rules for other languages

❌ **Breaking placeholders**:
- `{userName}` → `{nomUtilisateur}` (should stay as `{userName}`)

❌ **Removing HTML**:
- `<strong>Important</strong>` → `Important` (tags removed)

❌ **Ignoring context**:
- "Close" could mean "near" or "shut" - check context

❌ **Inconsistent terminology**:
- Translating "settings" as "paramètres" in one place and "réglages" in another

## Resources for Translators

### Professional Translation Services

For high-quality translations, consider professional services:
- Specialized technical translation agencies
- Native speakers with domain expertise
- Translation management platforms (Lokalise, Phrase, Crowdin)

### Machine Translation

Use with caution and always review:
- Google Translate: Good for initial drafts
- DeepL: Often more natural than Google for European languages
- ChatGPT/Claude: Can provide contextual translations

**Important**: Always have native speakers review machine translations.

### Language-Specific Resources

- **Unicode CLDR**: Standard for locale data
- **ICU Message Format**: For plurals and formatting
- **Google Material Design**: Language-specific guidelines
- **Apple Human Interface Guidelines**: iOS localization
- **Microsoft Style Guide**: Language-specific style guides

### Glossaries

Maintain a glossary of key terms and their translations:

| English | French | Spanish | German | Japanese |
|---------|--------|---------|--------|----------|
| Account | Compte | Cuenta | Konto | アカウント |
| Settings | Paramètres | Configuración | Einstellungen | 設定 |
| Save | Enregistrer | Guardar | Speichern | 保存 |
| Cancel | Annuler | Cancelar | Abbrechen | キャンセル |
| Submit | Soumettre | Enviar | Absenden | 送信 |

Keep this glossary updated and share with all translators for consistency.

## Accessibility Considerations

Ensure translations maintain accessibility:

- **Alt text**: Translate image alt text descriptively
- **ARIA labels**: Translate all ARIA attributes
- **Form labels**: Clear and descriptive in target language
- **Error messages**: Helpful and actionable in target language
- **Screen reader**: Test with screen readers in target language if possible

## SEO Considerations for Blog Content

When translating blog articles:

- **Title tags**: Optimize for target language search terms
- **Meta descriptions**: Write compelling descriptions, don't just translate literally
- **Headings**: Use natural keyword phrases in target language
- **URL slugs**: Translate slugs for better SEO (keep short and descriptive)
- **Image alt text**: Translate and optimize for target language
- **Internal links**: Ensure they point to translated versions of linked pages

## Workflow Tips

### Efficient Translation Process

1. Start with high-priority pages (home, navigation, common UI)
2. Translate in batches by feature or page
3. Use translation memory tools for consistency
4. Create a review cycle with native speakers
5. Track translation completion per locale
6. Set up continuous localization for new strings

### Collaboration

- Use comments in translation files for context
- Document ambiguous terms in glossary
- Share screenshots for context
- Provide explanation for cultural adaptations
- Create style guide for each language

### Maintenance

- Review translations when features change
- Update translations when user feedback indicates issues
- Keep translations in sync across all locales
- Archive old translations for reference
- Regular audits for consistency and quality
