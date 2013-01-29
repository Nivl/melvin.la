var markdown_converter = new Markdown.getSanitizingConverter();

function markdownToHtml(elem) {
    return markdown_converter.makeHtml(elem);
}