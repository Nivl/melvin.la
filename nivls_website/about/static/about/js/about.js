

$(document).ready(function(){
    $("#site-title").lettering();

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
