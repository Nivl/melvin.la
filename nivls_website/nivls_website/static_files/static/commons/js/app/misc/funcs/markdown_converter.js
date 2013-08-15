/*jslint browser:true */
/*global $, Markdown */
/*global isString */

function markdownToHtml(elem) {
    'use strict';

    var g_markdown_converter = new Markdown.getSanitizingConverter();
    return g_markdown_converter.makeHtml(elem);
}

function markdownEditor(target, move_submit_buttons) {
    'use strict';

    var $target;

    if (target) {
        if (isString(target)) {
            $target = $(target + ' textarea');
        } else {
            $target = target.find('textarea');
        }
    } else {
        $target = $('textarea');
    }

    move_submit_buttons = move_submit_buttons || false;

    $target.each(function () {
        if ($(this).prop('id')) { // Fix for autosizejs which add weird textareas
            var preview_id = null,
                preview = '',
                markup_bar_id = '',
                markdown_converter = '',
                markdown_editor = '',
                buttons = null;

            if ($(this).data('parse') !== undefined) {
                preview = $(this).data('parse');
                preview_id = $(preview).prop('id');
            }

            markup_bar_id = $(this).prop('id') + '-' + 'markup-bar';

            if ($(this).prev().prop('id') !== markup_bar_id) {
                $(this).before('<div id="' + markup_bar_id + '"></div>');

                // ugly leak
                markdown_converter = new Markdown.getSanitizingConverter();
                markdown_editor = new Markdown.Editor(markdown_converter,
                    {'bar': markup_bar_id, 'preview': preview_id, 'input': $(this).prop('id')});

                markdown_editor.run();

                if (move_submit_buttons) {
                    buttons = $(this).parents('form').find('.form-actions');
                    buttons.removeClass('form-actions');
                    buttons.addClass('btn-group wmd-button-group4');
                    buttons.appendTo('#' +  markup_bar_id + ' .btn-toolbar');
                }
            }
        }
    });
}