
$(document).ready(function(){
    $(".modal_box").colorbox(
	{
	    width: "50%",
	    inline: true,
	    href: "#whoAmI"
	}
    );

    $('#slider').css({'overflow': 'hidden',});
    $('.slide').wrapAll('<div id="slideContainer"></div>');
    $('#slideContainer').css({'width': '100%',});

    $('#home-link > a').live("click", gotoHome);
    $('#resume-link > a').live("click", gotoResume);


    function gotoResume()
    {
	$('#slideContainer').stop().animate({
            'marginLeft' : "-100%"
	}, 800);
    }

    function gotoHome()
    {
	$('#slideContainer').stop().animate({
            'marginLeft' : "0%"
	}, 800);
    }

    $(".tab > a").click(function() {
	$(".active").removeClass("active");
	$(this).addClass("active");
	$(".content").slideUp();

	var content_show = $(this).attr("id").replace("tab", "content");
	$("#"+content_show).slideDown();
    });

    var konamiCount = 1;
    $(window).konami(function() {
	if (konamiCount == 1) {
	    $("head").append('<link rel="stylesheet" href="' +
			     STATIC_URL + 'about/css/konami.less.min.css" />');
	    $("#image_about").attr("src",
				   STATIC_URL + "about/img/about-konami.png");
	    $("#image_contact")
		.attr("src", STATIC_URL + "about/img/contact-konami.png");
	    $("#image_portfolio")
		.attr("src", STATIC_URL + "about/img/portfolio-konami.png");
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
