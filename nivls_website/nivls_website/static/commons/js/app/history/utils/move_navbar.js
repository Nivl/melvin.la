/*jslint browser:true */
/*global $, Modernizr */
/*global live_edit_enabled */

/*
    live_edit_enabled   : /live_edit/utils.js
*/

function getWorld($target) {
    'use strict';

    var worlds = ['blog', 'lab', 'about', 'portfolio', 'contact', 'user'],
        i = 0;

    for (i = 0; i < worlds.length; i = i + 1) {
        if ($target.hasClass(worlds[i])) {
            return worlds[i];
        }
    }
    return null;
}

function moveNavbar(target) {
    'use strict';

    var $current_active = $('#navbar-main-list > li.active'),
        current_world = getWorld($current_active),
        target_world = null;

    if (target !== null && $(target)[0] === $current_active[0]) {
        return;
    }

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
        target_world = null;

        // We check if we're in a dropdown, and get the proper "world"
        if ($(target).parents('.dropdown').length !== 0) {
            $(target).parents('.dropdown').addClass('active');
            target_world = getWorld($(target).parents('.dropdown'));
        } else {
            target_world = getWorld($(target));
        }

        if (current_world) {
            $('body').removeClass(current_world + '-world');
        }
        if (target_world) {
            $('body').addClass(target_world + '-world');
        }
    } else {
        $current_active.removeClass('active');
        $('#navbar-main-list .dropdown li.active').removeClass('active');
    }
}

if (Modernizr.history) {
    $('#navbar-main-list > li a').click(function (e) {
        'use strict';

        if (live_edit_enabled === false) {
            if ($(this).data('ajax') !== undefined) {
                if (e.which !== 2 && !e.shiftKey && !e.ctrlKey) {
                    e.preventDefault();
                    moveNavbar($(this).parent('li'));
                }
            }
        } else {
            e.preventDefault();
        }
    });

    $(document).on('click', 'a[data-navbar]', function (e) {
        'use strict';

        if (live_edit_enabled === false) {
            if (e.which !== 2 && !e.shiftKey && !e.ctrlKey) {
                moveNavbar($(this).data('navbar'));
                e.preventDefault();
            }
        } else {
            e.preventDefault();
        }
    });
}