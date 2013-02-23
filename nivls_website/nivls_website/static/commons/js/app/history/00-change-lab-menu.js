if (Modernizr.history) {
    function labChangeMenu(id) {
        var active = $('#lab-nav-list').find('.active');
        active.removeClass('active').addClass('hide');
        active.next().removeClass('hide');

        var current = $('#' + id).find('.hide');
        current.removeClass('hide').addClass('active');
        current.next().addClass('hide');
    }

    $(document).on('click', '#lab-nav-list a', function() {
        if (live_edit_enabled === false) {
            labChangeMenu($(this).prop('id'));
        }
    });
}