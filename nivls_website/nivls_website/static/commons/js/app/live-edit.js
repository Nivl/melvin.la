
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

$('a').click(function(e){
    if (live_edit_enabled) {
        e.preventDefault();
    }
});

$(document).off('click').on('click', uneditElement);

/*
    make an element editable on the fly

    prefix: string - Prefix of the element (ex. single-comment-)
    url_values: dict - Extra values needed by the URL
    unit_url: string - URL name to fetch the parsed data
    unique_field: string - Field name used to differentiate entries in the DB (default slug)
*/
function liveEdit(prefix, url_values, unit_url, unique_field) {
    unique_field = (unique_field === undefined) ? ('slug') : (unique_field);

    var lookup_class = prefix + 'live-edit';
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
            var pk = $(this).prop('id').replace(prefix, '');
            var selector = '#' + $(this).prop('id');

            url_values[unique_field] = pk;

            if ($(this).find(">:first-child").prop("tagName") != 'FORM') {
                var url = resolve_urls(form_url, url_values);

                $.get(url, function(data) {
                    $(selector).html(data);

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
                    $(that).animateHighlight();
                });
            }

            return false;
        });
}