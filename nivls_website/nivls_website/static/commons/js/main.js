$('[rel=tooltip]').tooltip()

$.fn.animateHighlight = function(highlightColor, duration) {
    var highlightBg = highlightColor || "#FFFF9C";
    var animateMs = duration || 1500;
    var originalBg = this.css("backgroundColor");
    this.stop().css("background-color", highlightBg).animate({backgroundColor: originalBg}, animateMs);
};

var konamiCount = 1;
$(window).konami(function() {
    if (konamiCount == 1) {
	$("body").css("overflow", "hidden");
	dream_force_stop = false;
	dream();
	++konamiCount;
    }
    else if (konamiCount == 2) {
	dream_force_stop = true;
	konamiCount = 1
    }
});

$(function() {
    $('.dropdown input, .dropdown label').click(function(e) {
	e.stopPropagation();
    });
});

/* google prettyprint  */
function styleCode()
{
    var a = false;

    $("pre code").parent().each(function()
				{
				    if (!$(this).hasClass("prettyprint"))
				    {
					$(this).addClass("prettyprint");
					a = true
				    }
				});

    if (a) { prettyPrint() }
}
styleCode();
