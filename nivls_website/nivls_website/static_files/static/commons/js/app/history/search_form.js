if (Modernizr.history) {
    $('.search-form input').typeahead({
        name: 'global',
        remote: resolve_urls('autocomplete') + '?search=%QUERY'
    });

    $(document).on('typeahead:selected', '.search-form input', function(obj, datum) {
        var value = datum.value;
        var url = '';
        var query = '';
        var form = $(this).parents('form');

        if (value.length > 0) {
            query = replaceAll(
                encodeURIComponent(value), '%20', '+');
            url = resolve_urls('update-typeahead');
            url += '?search=' + query;
            $.get(url);
        }

        query = form.serialize();
        url = form.attr('action') + '?' + query;
        changePage(url, form.attr('title'), form);
        moveNavbar(null);
    });
}
