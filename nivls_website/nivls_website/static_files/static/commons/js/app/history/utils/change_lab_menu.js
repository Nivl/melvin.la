if (Modernizr.history) {
    function labChangeMenu(id) {
        var active = $('#lab-nav-list').find('.active');
        active.removeClass('active').addClass('hide');
        active.next().removeClass('hide');

        var current = $('#' + id).find('.hide');
        current.removeClass('hide').addClass('active');
        current.next().addClass('hide');
    }

    $(document).on('click', '#lab-nav-list a', function(e) {
        if (live_edit_enabled == false) {
            if (e.which != 2 && !e.shiftKey && !e.ctrlKey) {
                labChangeMenu($(this).prop('id'));
                e.preventDefault();
            }
        } else {
            e.preventDefault();
        }
    });
}