$(function() {

    /* when page loads animate the about section by default */
    //move($('#about'),2000,2);

    $('#menu > a').mouseover(
	function(){
	    var $this = $(this);
	    move($this,800,1);
	}
    );

    /*
      function to animate / show one circle.
      speed is the time it takes to show the circle
      turns is the turns the circle gives around the big circle
       */
    function move($elem,speed,turns){
	var id = $elem.attr('id');
	var $circle = $('#circle_'+id);

	/* if hover the same one nothing happens */
	if($circle.css('opacity')==1)
	    return;

	/* change the image */
	$('#image_'+id).stop(true,true)
	    .fadeIn(650)
	    .siblings()
	    .not(this)
	    .fadeOut(650);

	/*
	  if there's a circle already, then let's remove it:
	  either animate it in a circular movement or just fading
	  out, depending on the current position of it
	   */
	$('#content .circle').each(function(i){
	    var $theCircle = $(this);
	    if($theCircle.css('opacity')==1)
		$theCircle.stop()
		.animate({
		    path : new $.path.arc({
			center: [409,359],
			radius: 257,
			start: 65,
			end     : -110,
			dir: -1
		    }),
		    opacity: '0'
		},1500);
	    else
		$theCircle.stop()
		.animate({opacity: '0'},200);
	});

	/* make the circle appear in a circular movement */
	var end = 65 - 360 * (turns-1);
	$circle.stop()
	    .animate({
		path : new $.path.arc({
		    center: [409,359],
		    radius: 257,
		    start: 180,
		    end: end,
		    dir: -1
		}),
		opacity: '1'
	    },speed);
    }
});
