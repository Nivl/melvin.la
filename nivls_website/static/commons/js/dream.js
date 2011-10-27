// http://motyar.blogspot.com/2010/03/dream-night-animation-with-jquery.html

function pass(){

}

var dream_force_stop = false;

function dream(){
    //calculating random color of dream
    var color = 'rgb('+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+')';

    //calculating random X position
    var x = Math.floor(Math.random()*$(window).width());
    //calculating random Y position
    var y = Math.floor(Math.random()*$(window).height());

    //creating the dream and hide
    drawingpix = $('<span>').attr({class: 'drawingpix'}).hide();

    //appending it to body
    $(document.body).append(drawingpix);

    //styling dream.. filling colors.. positioning.. showing.. growing..fading
    drawingpix.css({
        'background-color':color,
        'border-radius':'100px',
        '-moz-border-radius': '100px',
        '-webkit-border-radius': '100px',
        top: y-14,    //offsets
        left: x-14 //offsets
    }).show().animate({
        height:'500px',
        width:'500px',
        'border-radius':'500px',
        '-moz-border-radius': '500px',
        '-webkit-border-radius': '500px',
        opacity: 0.1,
        top: y-250,    //offsets
        left: x-250
    }, 3000).fadeOut(2000);

    //Every dream's end starts a new dream
    if (dream_force_stop == false)
	window.setTimeout('dream()',200);
    else {
	setTimeout(function(){
	    $("body").css("overflow", "visible");
	}, 5000);
    }
}
