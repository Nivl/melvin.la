/*jslint browser:true */
/*global $, Modernizr */
/*global ajaxFormUpload, resolve_urls */

if (Modernizr.draganddrop) {
    $(document).on({
        dragenter: function (e) {
            'use strict';

            e.preventDefault();
            e.stopPropagation();

            $(this).addClass('dragging');
            return false;
        },

        dragleave: function (e) {
            'use strict';

            e.preventDefault();
            e.stopPropagation();
            $(this).removeClass('dragging');
        },

        dragover: function (e) {
            'use strict';

            e.preventDefault();
            e.stopPropagation();
        },

        drop: function (e) {
            'use strict';

            var $that = $(this),
                data = '';

            $(this).removeClass('dragging');
            e.preventDefault();
            e = e.originalEvent || e;

            if (e.dataTransfer.files.length === 1) {
                data = new FormData($(this).find('form')[0]);
                data.append('picture', e.dataTransfer.files[0]);

                ajaxFormUpload(
                    resolve_urls('handle_dropped_picture'),
                    data,
                    null,
                    function (html) {
                        if (html === '200') {
                            $that.removeClass('invalid-drop');
                            $that.addClass('valid-drop');
                            window.location = resolve_urls('edit-avatar');
                        } else {
                            $that.find('form').replaceWith(html);
                            $that.removeClass('valid-drop');
                            $that.addClass('invalid-drop');
                        }
                    }
                );
            }
            return false;
        }
    }, '.drop-area');
}