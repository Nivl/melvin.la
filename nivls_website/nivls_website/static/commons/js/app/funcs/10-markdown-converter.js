function markdownToHtml(elem) {
    var g_markdown_converter = new Markdown.getSanitizingConverter();

    return g_markdown_converter.makeHtml(elem);
}

function markdownEditor() {
    $('[data-parse]').each(function () {
        var target = $(this).data('parse');
        $(this).before('<div id="markup-bar"></div>');

        // ugly leak
        var markdown_converter = new Markdown.getSanitizingConverter();
        var markdown_editor = new Markdown.Editor(markdown_converter,
            {'bar': 'markup-bar', 'preview': $(target).prop('id'), 'input': $(this).prop('id')});
        markdown_editor.run();
    });
}