$(document).ready(function(){
    $(".modal_box").colorbox(
	{
	    width: "50%",
	    inline: true,
	    href: "#whoAmI"}
    );

    var konamiCount = 1;
    $(window).konami(function() {
	if (konamiCount == 1) {
	    $("head").append('<link rel="stylesheet" href="' +
			     STATIC_URL + 'css/about/konami.less.min.css" />');
	    $("#image_about").attr("src",
				   STATIC_URL + "/img/about/about-konami.png");
	    $("#image_contact")
		.attr("src", STATIC_URL + "/img/about/contact-konami.png");
	    $("#image_portfolio")
		.attr("src", STATIC_URL + "/img/about/portfolio-konami.png");
	    ++konamiCount;
	}
	else {
	    $.colorbox({
		href:"http://www.youtube.com/embed/jl3cNC3WSNQ",
		iframe:true,
		innerWidth:425,
		innerHeight:344
	    });
	}
    });
});
