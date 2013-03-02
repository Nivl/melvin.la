$(document).off('mouseover mouseleave', '#left-menu > li')
    .on({
        mouseenter: function() {
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

        mouseleave: function() {
            if ($(this).hasClass('animate')) {
                $(this).toggleClass('animate');

                var height = $(this).find('.content').innerHeight();
                if (height && height > $(this).innerHeight()) {
                    var diff = height - $(this).innerHeight();
                    $(this).next().animate({'marginTop': 0}, 100, 'linear');
                }
            }
        }
    }, '#left-menu > li');