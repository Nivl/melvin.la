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
    $('[rel=tooltip]').tooltip()

    $.fn.animateHighlight = function(highlightColor, duration) {
	var highlightBg = highlightColor || "#FFFF9C";
	var animateMs = duration || 1500;
	var originalBg = this.css("backgroundColor");
	this.stop().css("background-color", highlightBg).animate({backgroundColor: originalBg}, animateMs);
    };

    $(window).konami(function() {
	$('body').append('<script src="http://hi.kickassapp.com/kickass.js"></script>');
    });

    $('.dropdown input, .dropdown label').click(function(e) {
	e.stopPropagation();
    });

    styleCode();
});
