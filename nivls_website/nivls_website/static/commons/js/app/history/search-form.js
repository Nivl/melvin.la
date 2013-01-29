if (Modernizr.history) {
    $(document).on('submit', '.form-search', function() {
        var search_query = $(this).find('.search-query');
        var query;
        var url;

        if (search_query.val().length > 0) {
            query = replaceAll(
                encodeURIComponent(search_query.val()), '%20', '+');
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

    $(document).on('input', '.form-search .search-query', function(e) {
        if ($.inArray(e.keyCode, [40, 38, 9, 13, 27]) === -1
            && $(this).val().length > 0) {
            var that = this;
            var query = replaceAll(
                encodeURIComponent(
                    $(this).val()
                ), '%20', '+');

            var url = resolve_urls('autocomplete');
            url += '?search=' + query;

            $.getJSON(url, function(data) {
                var items = [];

                if (data) {
                    $.each(data, function(i, val) {
                        items.push(val);
                    });
                }
                $(that).data('typeahead').source = items;
            });
        }
    });
}