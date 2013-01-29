function preview() {
    $(document).off('input keydown', '[data-parse]')
        .on('input keydown', '[data-parse]', function() {
            var target = $(this).data('parse');
            $(target).html(markdownToHtml($(this).val()));
            $(target).find('code').parent().each(function() {
                highlightCode($this);
            });
        });
}