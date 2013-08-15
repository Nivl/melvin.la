/*jslint browser:true */
/*global $, ajaxPost */
/*global resolve_urls */
/*global current_live_edited_element:true, live_edit_enabled:true */
/*global closeCurrentLiveEdition, markdownEditor, resizeTextarea */

/*
    closeCurrentLiveEdition             : utils.js
    live_edit_enabled                   : utils.js
    current_live_edited_element         : utils.js

    markdownEditor                      : /misc/funcs/markdown_converter.js
    resizeTextarea                      : /misc/utils/utils.js
    ajaxPost                            : /ajax/utils.js
*/

$(document).off('click', '[data-type=live-editable]')
    .on('click', '[data-type=live-editable]', function (e, close) {
        'use strict';

        if (live_edit_enabled) {
            closeCurrentLiveEdition(e);
            e.preventDefault();

            $(this).removeAttr('data-type');
            current_live_edited_element = this;

            var $editable_elem = $(this),
                pk = $(this).data('pk'),
                pk_name = $(this).data('pk-name') || 'pk',
                target = $(this).data('target'),

                form_url = 'get-' + target + '-form',
                value_url = 'get-' + target,
                url_data = {},
                url = '';

            url_data[pk_name] = pk;

            if ($(this).find('>:first-child').prop('tagName') !== 'FORM') {
                // In case the element was empty, we remove the blue bg color
                $editable_elem.stop().css('background-color', '');

                url = resolve_urls(form_url, url_data);

                $.get(url, function (data) {
                    $editable_elem.fancyHide('fast', function () {
                        $editable_elem.html(data);
                        markdownEditor($editable_elem, true);

                        $editable_elem.fadeIn('fast', function () {
                            resizeTextarea();
                        });
                    });

                    $editable_elem.off('submit', 'form')
                        .on('submit', 'form', function () {
                            ajaxPost(
                                url,
                                $(this),
                                function (data, proceed) {
                                    if (proceed) {
                                        closeCurrentLiveEdition();
                                    }
                                }
                            );
                            return false;
                        });
                });
            } else if (close) {
                $(this).attr('data-type', 'live-editable');
                current_live_edited_element = null;
                url = resolve_urls(value_url, url_data);

                $.get(url, function (data) {
                    $editable_elem.fadeOut('fast', function () {
                        $(this).html(data).prettify();
                        $(this).fancyShow('fast', function () {
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
