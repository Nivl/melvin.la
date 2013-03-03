if (Modernizr.history) {
    function changePage(url, title, that) {
        var action = '#' + $(that).data('ajax');
        var breadcrumb = getNewBreadcrumb(that);
        var navbar_id = $('#navbar-main-list > li.active').prop('id');
        var lab_tag_id = $('#lab-nav-list .active').parents('a').prop('id');
        var page_subtitle = $(that).data('subtitle');

        if (typeof _gaq !== 'undefined') {
            _gaq.push(['_trackPageview', url]);
        }

        options = {'url': window.location.pathname};
        window.History.pushState({'breadcrumb': breadcrumb.html(),
                                  'action': action,
                                  'navbar_id': navbar_id,
                                  'lab_tag_id': lab_tag_id},
                                  title,
                                  url);
    }

    $(document).on('click', 'a[data-ajax]', function(event) {
        event.preventDefault();

        if (live_edit_enabled === false) {
            if (!event.shiftKey && !event.ctrlKey) {
                changePage($(this).attr('href'), $(this).attr('title'), this);
                return false;
            }
        }
    });
}