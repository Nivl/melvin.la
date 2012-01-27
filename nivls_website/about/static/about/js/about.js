

$(document).ready(function(){
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

    /***********************************************************/
    /* Portfolio */

    $('.acc_container').hide();
    $('.acc_trigger:first').addClass('active').next().show();

    $('.acc_trigger').click(function(){
	if( $(this).next().is(':hidden') ) {
	    $('.acc_trigger').removeClass('active').next().slideUp();
	    $(this).toggleClass('active').next().slideDown();
	}
	return false;
    });
});
