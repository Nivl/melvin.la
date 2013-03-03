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

$(document).bind('keydown.e', function() {
    if (live_edit_enabled) {
        uneditElement();

        $(".editable:reallyEmpty").stop().animate({'min-height': '0', 'min-width': '0'}, function(){$(this).css('background-color', 'white')});
        $('#editing-mode-box').stop().animate({'top': '-40'});
        $('#body > header').stop().animate({'margin-top': '0'});
        $(".editable-wrapper").stop().each(function() {
            if ($(this).find('.editable:reallyEmpty').length) {
                $(this).stop().slideToggle();
            }
        });
    } else {
        $(".editable-wrapper:hidden").stop().slideToggle({always: function() {
            $(".editable:reallyEmpty").stop().css('background-color', '#9ccfff').animate({'min-height': '30px', 'min-width': '50px'});
        }});
        $('#editing-mode-box').stop().animate({'top': '0'});
        $('#body > header').stop().animate({'margin-top': '40px'});
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