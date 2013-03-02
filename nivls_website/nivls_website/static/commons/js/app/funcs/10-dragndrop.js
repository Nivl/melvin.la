if (Modernizr.draganddrop) {
    $(document).on({
        dragenter: function() {
            $(this).addClass('dragging');
            return false;
        },

        dragleave: function() {
            $(this).removeClass('dragging');
            return false;
        },

        drop: function(e) {
            var $that = $(this);

            $(this).removeClass('dragging');
            e.preventDefault();
            e = e.originalEvent || e;

            if (e.dataTransfer.files.length == 1) {
                var data = new FormData($(this).find('form')[0]);
                data.append('picture', e.dataTransfer.files[0]);

                Ajaxion_formUpload(
                    resolve_urls('handle_dropped_picture'),
                    data,
                    null,
                    function(html) {
                        if (html == '200') {
                            $that.removeClass('invalid-drop');
                            $that.addClass('valid-drop');
                            window.location = resolve_urls('edit-avatar');
                        } else {
                            $that.find('form').replaceWith(html);
                            $('#profile-picture-form [name="csrfmiddlewaretoken"]').val($that.find('form [name="csrfmiddlewaretoken"]').val());
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