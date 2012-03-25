$.blockUI.defaults.css = { cursor: 'wait'};
$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);

$(document).ready(function(){
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
});

$(function() {
    $(".lab-project").fancybox({
	'width': 960,
	'height': 600,
	'padding': 0,
	'margin': 0,
	'autoScale': false,
	'type': 'iframe',
	'scrolling': 'no',
	'overlayColor': '#000',
	'overlayOpacity': 0.8
    });
});
