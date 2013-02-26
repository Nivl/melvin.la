function markdownToHtml(elem) {
    var g_markdown_converter = new Markdown.getSanitizingConverter();

    return g_markdown_converter.makeHtml(elem);
}

function markdownEditor(target) {
    if (target === undefined) {
        target = '';
    }

    $(target + ' textarea').each(function () {
        if ($(this).prop('id')) { // Fix for autosizejs wich add weird textareas
            var preview_id = null;

            if ($(this).data('parse') !== undefined) {
                var preview = $(this).data('parse');
                preview_id = $(preview).prop('id');
            }

            if ($(this).prev().prop('id') != 'markup-bar') {
                $(this).before('<div id="markup-bar"></div>');

                // ugly leak
                var markdown_converter = new Markdown.getSanitizingConverter();
                var markdown_editor = new Markdown.Editor(markdown_converter,
                    {'bar': 'markup-bar', 'preview': preview_id, 'input': $(this).prop('id')});

                markdown_editor.run();
            }
        }
    });
}