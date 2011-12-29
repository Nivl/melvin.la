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


$(function(){
    $('#slides').slides({
	preload: true,
	preloadImage: STATIC_URL + 'blog/img/slideshow/loading.gif',
	play: 5000,
	pause: 2500,
	slideSpeed: 600,
	hoverPause: true,

	animationStart: function(current){
	    $('.caption').animate({
		bottom: -35
 	    }, 100);
	},
	animationComplete: function(current){
	    $('.caption').animate({
		bottom: 0
	    }, 200);
	},
	slidesLoaded: function() {
	    $('.caption').animate({
		bottom: 0
	    }, 200);
	}
    });
});
