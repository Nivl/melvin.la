/*jslint browser:true */
/*global $, Modernizr */
/*global replaceAll, resolve_urls, changePage, moveNavbar */

/*
    replaceAll  : /misc/utils/utils.js
    moveNavbar  : utils/move_navbar.js
    changePage  : funcs/change_page.js
*/

if (Modernizr.history) {
    $(document).on('submit', '.form-search', function () {
        'use strict';

        var search_query = $(this).find('.search-query'),
            query = '',
            url = '';

        if (search_query.val().length > 0) {
            query = replaceAll(
                encodeURIComponent(search_query.val()),
                '%20',
                '+'
            );
            url = resolve_urls('update-typeahead');
            url += '?search=' + query;
            $.get(url);
        }
        query = $(this).serialize();
        url = $(this).attr('action') + '?' + query;
        changePage(url, $(this).attr('title'), this);
        moveNavbar(null);
        return false;
    });

    $(document).on('input', '.form-search .search-query', function (e) {
        'use strict';

        if ($.inArray(e.keyCode, [40, 38, 9, 13, 27]) === -1
                && $(this).val().length > 0) {
            var that = this,
                query = replaceAll(
                    encodeURIComponent($(this).val()),
                    '%20',
                    '+'
                ),
                url = resolve_urls('autocomplete') + '?search=' + query;

            $.getJSON(url, function (data) {
                var items = [];

                if (data) {
                    $.each(data, function (i, val) {
                        items.push(val);
                    });
                }
                $(that).data('typeahead').source = items;
            });
        }
    });
}