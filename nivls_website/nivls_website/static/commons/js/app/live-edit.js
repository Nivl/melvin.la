
var current_live_editing_element = null;
var live_edit_enabled = false;

uneditElement = function (e) {
    if (current_live_editing_element != null) {
        var $container = $('#' + current_live_editing_element['id']);
        if (e === undefined
            || ($container.is(e.target) == false
                && $container.has(e.target).length === 0)) {
            $container.toggleClass(current_live_editing_element['class']);
            $container.trigger('click');
        }
    }
};

$(document).bind('keydown', 'e', function() {
    if (live_edit_enabled) {
        uneditElement();
        $('#editing-mode-box').animate({'top': '-40'});
        $('#body > header').animate({'margin-top': '0'});

    } else {
        $('#editing-mode-box').animate({'top': '0'});
        $('#body > header').animate({'margin-top': '40px'});
    }
    live_edit_enabled = !live_edit_enabled;
});

$(document).off('click').on('click', uneditElement);

/*
    make an element editable on the fly

    prefix: string - Prefix of the element (ex. single-comment-)
    url_values: dict - Extra values needed by the URL
    unit_url: string - URL name to fetch the parsed data
    form_url: string - URL name to fetch the form
    lookup_class: string - Class to bind to the action (default edit-link)
    first_tag: list - Name UPPERCASE of the first tag inside the .editable_area (default P)
    unique_field: string - Field name used to differentiate entries in the DB (default slug)
    to_form: callback - Function to call before the form appears
    to_text: callback - Function to call after the form disappeared
*/
function liveEdit(prefix, url_values, unit_url, form_url, lookup_class, first_tag, unique_field, to_form, to_text) {
    lookup_class = (lookup_class === undefined) ? ('edit-link') : (lookup_class);
    unique_field = (unique_field === undefined) ? ('slug') : (unique_field);
    first_tag = (first_tag === undefined) ? (['P']) : (first_tag);
    to_form = (to_form === undefined) ? ($.noop) : (to_form);
    to_text = (to_text === undefined) ? ($.noop) : (to_text);
    var was_a_link = false;

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
            var pk = $(this).prop('id').replace(prefix, '');

            url_values[unique_field] = pk;

            var selector = '#' + $(this).prop('id');
            var tag_name = $(this).find(">:first-child").prop("tagName");

            if (first_tag.indexOf(tag_name) >= 0
                || (tag_name === undefined && first_tag.indexOf(null) >= 0)) {
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
                    $(selector).html(data);
                    to_text(pk, data);
                    $(that).animateHighlight();
                });
            }

            return false;
        });
}