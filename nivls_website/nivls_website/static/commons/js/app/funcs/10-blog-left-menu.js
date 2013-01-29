function loadBlogLeftMenu() {
    $('#left-menu > li').off('hover').hover(
        function() {
            if (!($(this).hasClass('animate'))) {
                var that = this;
                var height = $(this).find('.content').innerHeight();

                if (height
                    && $(this).nextAll().length > 0
                    && height > $(this).innerHeight()) {

                    var diff = height - $(this).innerHeight();

                    $(this).next().animate({'marginTop': diff}, 50, 'linear',
                                           function() {
                                               $(that).toggleClass('animate');
                                           });
                } else {
                    $(this).toggleClass('animate');
                }
            }
        },
        function() {
            if ($(this).hasClass('animate')) {
                $(this).toggleClass('animate');

                var height = $(this).find('.content').innerHeight();
                if (height && height > $(this).innerHeight()) {
                    var diff = height - $(this).innerHeight();
                    $(this).next().animate({'marginTop': 0}, 100, 'linear');
                }
            }
        }
    );
}