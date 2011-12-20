$(document).ready(function() {
    $(".lab-project").fancybox({
	width: 960,
	height: 600,
	padding: 0,
	margin: 0,
	autoSize: false,
	closeClick: true,
	openEffect: 'elastic',
	closeEffect: 'elastic',
	scrolling: 'no'
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
