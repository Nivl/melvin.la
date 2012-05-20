$('[rel=tooltip]').tooltip()

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
