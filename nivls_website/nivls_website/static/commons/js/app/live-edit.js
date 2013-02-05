/*
    make an element editable on the fly

    prefix: string - Prefix of the element (ex. single-comment-)
    url_values: dict - Extra values needed by the URL
    unit_url: string - URL name to fetch the parsed data
    form_url: string - URL name to fetch the form
    lookup_elem: string - Element to bind to the action (default .edit-link)
    unique_field: string - Field name used to differentiate entries in the DB (default slug)
    first_tag: string - Name of the first tag inside the .editable_area (default P)
    to_form: callback - Function to call before the form appears
    to_text: callback - Function to call after the form disappeared
*/

function liveEdit(prefix, url_values, unit_url, form_url, lookup_elem, unique_field, first_tag, to_form, to_text) {
    lookup_elem = (lookup_elem === undefined) ? ('.edit-link') : (lookup_elem);
    unique_field = (unique_field === undefined) ? ('slug') : (unique_field);
    first_tag = (first_tag === undefined) ? ('P') : (first_tag.toUpperCase());
    to_form = (to_form === undefined) ? ($.noop) : (to_form);
    to_text = (to_text === undefined) ? ($.noop) : (to_text);


    $(document).off('mouseenter mouseleave', '.live-edit')
        .on({
            mouseenter: function() {
                $(this).find(lookup_elem).show()
            },

            mouseleave: function() {
                $(this).find(lookup_elem).hide()
            },
        }, '.live-edit');



    $(document).off('click', lookup_elem)
        .on('click', lookup_elem, function (e) {
            var that = this;
            var area = $(this).parents('.live-edit').find('.editable_area');
            var pk = $(area).prop('id').replace(prefix, '');
            url_values[unique_field] = pk;

            var selector = '#' + $(area).prop('id');
            if ($(area).find(">:first-child").prop("tagName") == first_tag) {
                var url = resolve_urls(form_url, url_values);

                $.get(url, function(data) {
                    $(selector).html(data);
                    to_form(pk, data);

                    var post_selector = '#' + prefix + 'form-' + pk;

                    $(post_selector).on('submit', function(){
                        Ajaxion_post(
                            url, post_selector,
                            function(data, proceed){
                                if (proceed) {
                                    $(that).trigger('click');
                                }
                            });
                        return false;
                    });
                });
            } else {
                var url = resolve_urls(unit_url, url_values);

                $.get(url, function(data){
                    $(selector).html(data);
                    to_text(pk, data);
                    $(that).parents('.live-edit').animateHighlight();
                });
            }

            return false;
        });
}
