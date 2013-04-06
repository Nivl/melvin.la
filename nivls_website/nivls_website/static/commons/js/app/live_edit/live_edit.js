$(document).off('click', '[data-type=live-editable]')
    .on('click', '[data-type=live-editable]', function (e, close) {
         if (live_edit_enabled) {
            closeCurrentLiveEdition(e);
            e.preventDefault();

            $(this).removeAttr('data-type');
            current_live_edited_element = this;

            var editable_elem = this;
            var pk = $(this).data('pk');
            var pk_name = $(this).data('pk-name') || 'pk';
            var target = $(this).data('target');

            var form_url = 'get-' + target + '-form';
            var value_url = 'get-' + target;
            var url_data = {};
            url_data[pk_name] = pk;

            if ($(this).find(">:first-child").prop("tagName") != 'FORM') {
                // In case the element was empty, we remove the blue bg color
                $(editable_elem).stop().css('background-color', '');

                var url = resolve_urls(form_url, url_data);

                $.get(url, function(data) {
                    $(editable_elem).fancyHide('fast', function() {
                        $(editable_elem).html(data);
                        //markdownEditor(editable_elem, true);

                        $(editable_elem).fadeIn('fast', function() {
                            resizeTextarea();
                        });
                    });

                    var post_selector = '#' + target + '-form-' + pk;

                    $(document).off('submit', post_selector)
                        .on('submit', post_selector, function(){
                            Ajaxion_post(
                                url, this,
                                function(data, proceed){
                                    if (proceed) {
                                    closeCurrentLiveEdition();
                                }
                            });
                            return false;
                        });
                });
            } else if (close) {
                $(this).attr('data-type', 'live-editable');
                current_live_edited_element = null;
                var url = resolve_urls(value_url, url_data);

                $.get(url, function(data){
                    $(editable_elem).fadeOut('fast', function(){
                        $(this).html(data).prettify();
                        $(this).fancyShow('fast', function(){
                            if ($(this).isReallyEmpty()) {
                                $(this).css('min-height', '30px');
                                $(this).animateHighlight('#9ccfff');
                            }
                        });
                    });
                });
            }
         }
    });