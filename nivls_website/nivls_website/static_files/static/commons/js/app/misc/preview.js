$(document).off('input keydown wysiwygClicked', '[data-parse]')
    .on('input keydown wysiwygClicked', '[data-parse]', function() {
        var target = $(this).data('parse');
        $(target).html(markdownToHtml($(this).val()));
        $(target).prettify();
    });

 function loadPreviews() {
    $('[data-storage][value!=""]').trigger('wysiwygClicked');
 }