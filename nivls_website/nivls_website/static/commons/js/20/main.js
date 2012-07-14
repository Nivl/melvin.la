/* google prettyprint  */

function preview() {
    var markdownConverter = new Markdown.getSanitizingConverter();

    $(document).on('input keydown', '[data-parse="1"]', function() {
	var target = $(this).data('target');
	$(target).html(markdownConverter.makeHtml($(this).val()));
    }).trigger('input');

    $(document).on('keydown', '[data-parse="1"]', function() {
	$(this).stopTime();
	$(this).oneTime(500, function() { styleCode(); });
    });
}

function styleCode() {
    var a = false;

    $("pre code").parent().each(function() {
	if (!$(this).hasClass("prettyprint")) {
	    $(this).addClass("prettyprint");
	    a = true;
	}
    });

    if (a) {
	prettyPrint();
    }
}

$(function() {

    /***********
     * Nav bar
     **********/
    var navbar_current = $('#navbar-main-list > li.active').offset();
    var navbar_img = $('<div>');
    navbar_img.attr('id', 'navbar_img');
    if (navbar_current != null)
	navbar_img.offset(navbar_current);
    navbar_img.css('top', '0px');
    $('#navbar').prepend(navbar_img);
    $('#navbar-main-list > li.active').removeClass('active');
    $('#navbar-main-list > li a').click(function() {
	var parent = $(this).parent('li');
	var left = $(parent).offset()['left'];
    	navbar_img.animate({
	    left: left
     	}, {
	    duration: 'slow',
	    easing: 'easeOutBack'
	});
    });

    $('.hide-navbar-img').click(function(){
    	navbar_img.animate({
	    left: '-100px',
     	}, 200);
    });

    /***********
     * Ajax
     **********/
    var g_page_reload_ajax = new Ajaxion(
	'',
	{selector: 'body'},
	'GET',
	[],
	{
	    'success': [
		{
		    'callback': function(html, status, that) {
			var response = $('<html />').html(html);
			var to_change = ['#local_link', '#body-content',
					 '#app_js'];
			for (var i=0; i<to_change.length; i++) {
			    $(to_change[i]).hide().html(response
							.find(to_change[i])
							.html()).fadeIn();
			}
		    },
		},
	    ]
	}
    )

    $(window).bind('statechange', function() {
	var State = window.History.getState();
	var relativeURL = State.url.replace(window.History.getRootUrl(), '');
	relativeURL = '/' + relativeURL
	g_page_reload_ajax.url = relativeURL;
	g_page_reload_ajax.start();
    });

    $('a[rel=ajax]').on('click', function(event){
	options = {'url': window.location.pathname};
	window.History.pushState(null,
				 $(this).attr('title'),
				 $(this).attr('href'));
	return false;
    });

    /***********
     * animateHighlight
     **********/
    $.fn.animateHighlight = function(highlightColor, duration) {
	var highlightBg = highlightColor || "#FFFF9C";
	var animateMs = duration || 1500;
	var originalBg = this.css("backgroundColor");
	this.stop().css("background-color", highlightBg).animate({backgroundColor: originalBg}, animateMs);
    };


    /***********
     * Global
     **********/
    $('.carousel').carousel()
    $('[rel=tooltip]').tooltip();
    $('.animated-thumbnails > li').hoverdir();

    styleCode();
    preview();
});