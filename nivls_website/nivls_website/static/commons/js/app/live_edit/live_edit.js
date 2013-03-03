/*
    make an element editable on the fly

    prefix: string - Prefix of the element (ex. single-comment-)
    unique_field: string - Field name used to differentiate entries in the DB (default slug)
*/
function liveEdit(prefix, unique_field) {
    unique_field = (unique_field === undefined) ? ('pk') : (unique_field);

    var lookup_class = prefix + '-live-edit';
    var unit_url = 'get-' + prefix
    var form_url = unit_url + '-form';

    $(document).off('click', '.'+lookup_class)
        .on('click', '.'+lookup_class, function (e) {
            if (live_edit_enabled == false)
                return;

            $(this).toggleClass(lookup_class);
            uneditElement(e);
            e.preventDefault();

            current_live_editing_element = {
                'id'    : $(this).prop('id'),
                'class' : lookup_class
            };

            var that = this;
            var pk = $(this).prop('id').replace(prefix + '-', '');
            var selector = '#' + $(this).prop('id');
            var url_values = {};
            url_values[unique_field] = pk;

            if ($(this).find(">:first-child").prop("tagName") != 'FORM') {
                // In case the element was empty, we remove the blue bg color
                $(selector).stop().css('background-color', '');

                var url = resolve_urls(form_url, url_values);

                $.get(url, function(data) {
                    $(selector).hide();
                    $(selector).html(data);
                    markdownEditor(selector, true);
                    $(selector).fadeIn('fast', function(){
                        resizeTextarea();
                    });

                    var post_selector = '#' + prefix + '-form-' + pk;

                    $(document).off('submit', post_selector)
                               .on('submit', post_selector, function(){
                        Ajaxion_post(
                            url, post_selector,
                            function(data, proceed){
                                if (proceed) {
                                    uneditElement();
                                }
                            });
                        return false;
                    });
                });
            } else {
                $(that).toggleClass(lookup_class);
                current_live_editing_element = null;
                var url = resolve_urls(unit_url, url_values);

                $.get(url, function(data){
                    $(selector).hide().html(data).fadeIn('fast');

                    $(selector).prettify();
                    if ($(selector).isReallyEmpty()) {
                        $(that).css('min-height', '30px');
                        $(that).animateHighlight('#9ccfff');
                    }
                });
            }

            return false;
        });
}