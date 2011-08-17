$(function(){
    $('#slides').slides({
	preload: true,
	preloadImage: STATIC_URL + 'img/slideshow/loading.gif',
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
