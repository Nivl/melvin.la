/*global $, UAParser */
/*global markdownToHtml */
/*jslint browser:true */

$(document).off('input keydown wysiwygClicked', '[data-parse]')
    .on('input keydown wysiwygClicked', '[data-parse]', function () {
        'use strict';

        var target = $(this).data('parse');
        $(target).html(markdownToHtml($(this).val()));
        $(target).prettify();
    });

function loadPreviews() {
    'use strict';

    $('[data-storage][value!=""]').trigger('wysiwygClicked');
}