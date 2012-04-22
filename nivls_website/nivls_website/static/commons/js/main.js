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
