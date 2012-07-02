/* google prettyprint  */
function styleCode() {
    var a = false;

    $("pre code").parent().each(function() {
	if (!$(this).hasClass("prettyprint")) {
	    $(this).addClass("prettyprint");
	    a = true;
	}
    });

    if (a) {
	prettyPrint();
    }
}

$(function() {
    var navbar_current = $('#navbar-main-list > li.active').offset();
    var navbar_img = $('<div>');
    navbar_img.attr('id', 'navbar_img');
    navbar_img.offset(navbar_current);
    $('#navbar').prepend(navbar_img);
    $('#navbar-main-list > li.active').removeClass('active');
    $('#navbar-main-list > li').click(function(){
	var left = $(this).offset()['left'];
	var that = this;
    	navbar_img.animate({
	    left: left,
     	}, 200);
    });

    $('[rel=tooltip]').tooltip();
    $('.animated-thumbnails > li').hoverdir();

    $.fn.animateHighlight = function(highlightColor, duration) {
	var highlightBg = highlightColor || "#FFFF9C";
	var animateMs = duration || 1500;
	var originalBg = this.css("backgroundColor");
	this.stop().css("background-color", highlightBg).animate({backgroundColor: originalBg}, animateMs);
    };

    styleCode();
});



    // $(window).konami(function() {
    // 	$('body').append('<script src="http://hi.kickassapp.com/kickass.js"></script>');
    // });

    // $('.dropdown input, .dropdown label').click(function(e) {
    // 	e.stopPropagation();
    // });
