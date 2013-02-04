$(document).off('mouseenter mouseleave', '.live-edit')
    .on({
        mouseenter: function() {
            $(this).find('.edit-link').show()
        },

        mouseleave: function() {
            $(this).find('.edit-link').hide()
        },
    }, '.live-edit');
