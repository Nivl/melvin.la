if (Modernizr.history) {
    function getWorld($target) {
        var worlds = ['blog', 'lab', 'about', 'portfolio', 'contact', 'user'];

        for (var i=0; i<worlds.length; ++i) {
            if ($target.hasClass(worlds[i])) {
                return worlds[i];
            }
        }
        return null;
    }

    function moveNavbar(target) {
        var $current_active = $('#navbar-main-list > li.active');
        var current_world = getWorld($current_active);

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
            // We now set the new "world"
            var target_world = getWorld($(target));
            if (current_world) {
                $('#body').removeClass(current_world + '-world');
            }
            if (target_world) {
                $('#body').addClass(target_world + '-world');
            }
        } else {
            $current_active.removeClass('active');
            $('#navbar-main-list .dropdown li.active').removeClass('active');
        }
    }

    $('#navbar-main-list > li a').click(function(e) {
        if (live_edit_enabled === false) {
            if ($(this).data('ajax') !== undefined) {
                if (e.which != 2 && !e.shiftKey && !e.ctrlKey) {
                    e.preventDefault();
                    moveNavbar($(this).parent('li'));
                }
            }
        } else {
            e.preventDefault();
        }
    });

    $(document).on('click', 'a[data-navbar]', function(e) {
        if (live_edit_enabled === false) {
            if (e.which != 2 && !e.shiftKey && !e.ctrlKey) {
                moveNavbar($(this).data('navbar'));
                e.preventDefault();
            }
        } else {
            e.preventDefault();
        }
    });
}