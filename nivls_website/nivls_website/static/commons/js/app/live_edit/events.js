
$(document).bind('keydown.e', function() {
    if (live_edit_enabled === false) {
        if ($(".editable-wrapper:hidden").length) {
            $(".editable-wrapper:hidden").stop().slideToggle(function() {
                $(".editable:reallyEmpty").stop().css('background-color', '#9ccfff').animate({'min-height': '30px', 'min-width': '50px'});
            });
        } else {
            $(".editable:reallyEmpty").stop().css('background-color', '#9ccfff').animate({'min-height': '30px', 'min-width': '50px'});
        }

        $('#editing-mode-box').stop().animate({'top': '0'});
        $('#body > header').stop().animate({'margin-top': '40px'});
    } else {
        uneditElement();

        $(".editable:reallyEmpty").stop().animate({'min-height': '0', 'min-width': '0'}, function(){$(this).css('background-color', 'white')});
        $('#editing-mode-box').stop().animate({'top': '-40'});
        $('#body > header').stop().animate({'margin-top': '0'});
        $(".editable-wrapper").stop().each(function() {
            if ($(this).find('.editable').size() == $(this).find('.editable:reallyEmpty').size()) {
                $(this).stop().slideToggle();
            }
        });
    }
    live_edit_enabled = !live_edit_enabled;
});

$('a').click(function(e){
    if (live_edit_enabled) {
        e.preventDefault();
    }
});

$(document).off('click').on('click', uneditElement);