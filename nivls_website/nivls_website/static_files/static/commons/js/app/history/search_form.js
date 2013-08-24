/*jslint browser:true */
/*global $, Modernizr */
/*global replaceAll, resolve_urls, changePage, moveNavbar */

/*
    replaceAll  : /misc/utils/utils.js
    moveNavbar  : utils/move_navbar.js
    changePage  : funcs/change_page.js
*/

function checkAndGet(value) {
    'use strict';

    var url,
        query;

    if (value.length > 0) {
        query = replaceAll(
            encodeURIComponent(value),
            '%20',
            '+'
        );

        url = resolve_urls('update-typeahead');
        url += '?search=' + query;
        $.get(url);
    }
}

if (Modernizr.history) {
    $('.search-form input').typeahead({
        name: 'global',
        remote: resolve_urls('autocomplete') + '?search=%QUERY'
    });

    $(document).on('typeahead:selected', '.search-form input', function (obj, datum) {
        'use strict';

        var url = '',
            query = '',
            form = $(this).parents('form');

        checkAndGet(datum.value);

        query = form.serialize();
        url = form.attr('action') + '?' + query;
        changePage(url, form.attr('title'), form);
        moveNavbar(null);
    });

    $(document).on('submit', '.search-form', function (e) {
        'use strict';

        var query,
            url;

        checkAndGet($(this).find('input'));

        query = $(this).serialize();
        url = $(this).attr('action') + '?' + query;
        changePage(url, $(this).attr('title'), this);
        moveNavbar(null);
        e.preventDefault();
        return false;
    });
}
