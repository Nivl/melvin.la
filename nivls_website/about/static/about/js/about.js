$(function() {
    /* Header */
    $("#site-title").lettering();

    $("#site-title .char16").mouseover(function(){
	$(this).text("ı");
	$("#site-title .char15").animate({
	    left: '0',
	    top: '0'
	});
    }).mouseleave(function(){
	$("#site-title .char15").animate({
	    top: '-33',
	    left: '13'
	}, "normal", "linear");
    });
});
