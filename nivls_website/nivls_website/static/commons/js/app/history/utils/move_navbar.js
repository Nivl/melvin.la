if (Modernizr.history) {
    function moveNavbar(target) {
        var $current_active = $('#navbar-main-list > li.active');

        if (target !== null && $(target)[0] == $current_active[0])
            return;

        if (target !== null) {
            if ($current_active.hasClass('dropdown')) {
                $('#navbar-main-list .dropdown li.active')
                    .removeClass('active');

                if ($(target).parents('.dropdown').length === 0) {
                    $current_active.removeClass('active');
                }
            } else {
                $current_active.removeClass('active');
            }
            $(target).addClass('active');
        } else {
            $current_active.removeClass('active');
            $('#navbar-main-list .dropdown li.active').removeClass('active');
        }
    }

    $('#navbar-main-list > li a').click(function(e) {
        if ($(this).data('ajax') !== undefined) {
            e.preventDefault();
        }

        if (live_edit_enabled === false) {
            if (e.which != 2 && !e.shiftKey && !e.ctrlKey) {
                moveNavbar($(this).parent('li'));
            }
        }
    });

    $(document).on('click', 'a[data-navbar]', function(e) {
        e.preventDefault();

        if (live_edit_enabled === false) {
            if (e.which != 2 && !e.shiftKey && !e.ctrlKey) {
                moveNavbar($(this).data('navbar'));
            }
        }
    });
}