/*jslint browser:true */
/*global $, Modernizr, _gaq */
/*global getNewBreadcrumb */
/*global live_edit_enabled */

/*
    getNewBreadcrumb    : utils/get_new_breadcumb.js
    live_edit_enabled   : /live_edit/utils.js
*/

function changePage(url, title, that) {
    'use strict';

    /*jslint nomen: true*/
    if (_gaq !== undefined) {
        _gaq.push(['_trackPageview', url]);
    }
    /*jslint nomen: false*/

    var action = '#' + $(that).data('ajax'),
        breadcrumb = getNewBreadcrumb(that),
        navbar_id = $('#navbar-main-list > li.active').prop('id');

    window.History.pushState({'breadcrumb': breadcrumb.html(),
                              'action': action,
                              'navbar_id': navbar_id},
                              title,
                              url);
}

if (Modernizr.history) {
    $(document).on('click', 'a[data-ajax]', function (event) {
        'use strict';

        if (live_edit_enabled === false) {
            if (!event.shiftKey && !event.ctrlKey) {
                changePage($(this).attr('href'), $(this).attr('title'), this);
                event.preventDefault();
            }
        } else {
            event.preventDefault();
        }
    });
}