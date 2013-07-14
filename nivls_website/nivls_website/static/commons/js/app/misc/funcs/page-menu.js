$(document).off('click', '#page-menu-icon > a')
    .on('click', '#page-menu-icon > a', function() {

        if ($('#page-menu-icon').hasClass('clicked') === false) {

            $('#page-menu-icon').css('-webkit-transform', 'rotate(180deg)');
            $('#page-menu-icon').css('-ms-transform', 'rotate(180deg)');
            $('#page-menu-icon').css('transform', 'rotate(180deg)');
            $('#page-menu-wrapper').stop().animate({'left': '0'});
            $('#subtitle-wrapper').stop().animate({'left': '100%'});
        } else {
            $('#page-menu-icon').css('-webkit-transform', 'rotate(0deg)');
            $('#page-menu-wrapper').stop().animate({'left': '-100%'});
            $('#subtitle-wrapper').stop().animate({'left': '0'});
        }

        $('#page-menu-icon').toggleClass('clicked');
    });
