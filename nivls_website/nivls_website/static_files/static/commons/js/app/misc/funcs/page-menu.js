$(document).off('click', '#page-menu-icon > a')
    .on('click', '#page-menu-icon > a', function(e) {

        if ($('#page-menu-icon').hasClass('clicked') === false) {
            $('#page-menu-icon').css('-webkit-transform', 'rotate(180deg)');
            $('#page-menu-icon').css('-ms-transform', 'rotate(180deg)');
            $('#page-menu-icon').css('transform', 'rotate(180deg)');
            $('#page-menu-icon').css('top', '8px');

            $('#page-menu-wrapper').stop().animate({'left': '0'});
            $('#subtitle-wrapper').stop().animate({'left': '100%'}, function() {
                $('#subtitle-wrapper').css('display', 'none');
                $('#bottom-header').css('overflow', 'visible');
            });
        } else {
            $('#bottom-header').css('overflow', 'hidden');
            $('#subtitle-wrapper').css('display', 'block');

            $('#page-menu-icon').css('-webkit-transform', 'rotate(0deg)');
            $('#page-menu-icon').css('-ms-transform', 'rotate(0deg)');
            $('#page-menu-icon').css('transform', 'rotate(0deg)');
            $('#page-menu-icon').css('top', '14px');

            $('#page-menu-wrapper').stop().animate({'left': '-100%'});
            $('#subtitle-wrapper').stop().animate({'left': '0'});
        }

        $('#page-menu-icon').toggleClass('clicked');
        e.preventDefault();
        return false;
    });
