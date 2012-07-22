function reloadJsEffects() {
    styleCode();
    enableBootstrapEffects();
    reloadShareButtons();
    startLabDiagram();
}

function reloadShareButtons() {
    gapi.plusone.go();
}

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

function enableBootstrapEffects() {
    $('.carousel').carousel()
    $('[rel=tooltip]').tooltip();
    $('.animated-thumbnails > li').hoverdir();
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

    function moveNavbar(target) {
	var left;
	$('#navbar-main-list > li.active').removeClass('active');

	if (target === null) {
	    left = '-200px';
	} else {
	    left = $(target).offset()['left'];
	    $(target).addClass('active');
	}

	navbar_img.animate({
	    left: left
     	}, {
	    duration: 'slow',
	    easing: 'easeOutBack'
	});
    }

    $('#navbar-main-list > li a').click(function() {
	moveNavbar($(this).parent('li'));
    });

    $(document).on('click', 'a[data-navbar]', function() {
	moveNavbar($(this).data('navbar'));
    });

    $('.hide-navbar-img').click(function(){
	moveNavbar(null);
    });


    /***********
     * Lab menu
     **********/
    function lab_change_menu(id) {
	var active = $('#lab-nav-list').find('.active');
	active.removeClass('active').addClass('hide');
	active.next().removeClass('hide');

	var current = $('#' + id).find('.hide');
	current.removeClass('hide').addClass('active');
	current.next().addClass('hide');
    }

    $(document).on('click', '#lab-nav-list a', function() {
	lab_change_menu($(this).prop('id'));
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
		    'disabled': true,
		    'callback': function(html, status, that) {
			var response = $('<html />').html(html);
			var to_change = ['#local_link', '#body-content'];
			for (var i=0; i<to_change.length; i++) {
			    $(to_change[i]).hide().html(response
							.find(to_change[i])
							.html()).fadeIn();
			}
		    },
		},
		{
		    'disabled': true,
		    'callback': function(html, status, that) {
			var response = $('<html />').html(html);
			var to_change = ['#local_link', '#body-content-only'];
			for (var i=0; i<to_change.length; i++) {
			    $(to_change[i]).hide().html(response
							.find(to_change[i])
							.html()).fadeIn();
			}
		    },
		},
		{'callback': reloadJsEffects,},
		{'callback': function(){$('#loading-msg').fadeOut();},},
	    ]
	},
	[function(){
	    $('#loading-msg').fadeIn();
	},]

    );

    $(window).bind('statechange', function() {
	var navbar_id = $('#navbar-main-list > li.active').prop('id');
	var lab_tag_id = $('#lab-nav-list .active').parents('a').prop('id');
	var State = window.History.getState();
	var relativeURL = State.url.replace(window.History.getRootUrl(), '');
	relativeURL = '/' + relativeURL;

	var content_only = State.data['content_only'];
	if (content_only === undefined) {
	    window.location = relativeURL;
	}

	if (navbar_id !== State.data['navbar_id']) {
	    var navbar_target;
	    if (State.data['navbar_id'] !== undefined) {
		navbar_target = $('#' + State.data['navbar_id']);
	    } else {
		navbar_target = null;
	    }
	    moveNavbar(navbar_target);
	}

	if (lab_tag_id !== State.data['lab_tag_id']
	    && State.data['lab_tag_id'] !== undefined) {
	    lab_change_menu(State.data['lab_tag_id']);
	}

	if (State.data['breadcrumb'] !== undefined
	    && State.data['breadcrumb'].length) {
	    $('#breadcrumb').html(State.data['breadcrumb']).show();
	} else {
	    $('#breadcrumb').fadeOut(function(){
		$(this).empty();
	    });
	}

	g_page_reload_ajax.callbacks['success'][0]['disabled'] = content_only;
	g_page_reload_ajax.callbacks['success'][1]['disabled'] = !content_only;
	g_page_reload_ajax.url = relativeURL;
	g_page_reload_ajax.start();
    });

    function getNewBreadcrumb(that) {
	var breadcrumb = $('#breadcrumb').clone();

	if ($(that).data('depth') == 0) {
	    breadcrumb.empty();
	    return breadcrumb;
	}

	breadcrumb.children('li').each(function() {
	    var prev = $(this).prev();
	    if ($(this).children('a').data('depth') >= $(that).data('depth')) {
		$(this).nextAll().remove();
		$(this).remove();
		if (prev.length) {
		    prev.children('span').remove();
		}
	    }
	});

	if (breadcrumb.children('li').last().length) {
	    breadcrumb.children('li').last()
		.append('<span class="divider">/<span/>');
	}

	var new_elem = '<li><a';
	new_elem += ' data-depth="' + $(that).data('depth') + '"';
	new_elem += ' rel="' + $(that).attr('rel') + '"';
	if ($(that).attr('title') !== undefined) {
	    new_elem += ' title="' + $(that).attr('title') + '"';
	}

	new_elem += 'href="' + $(that).attr('href') + '">';
	if ($(that).attr('title') !== undefined) {
	    new_elem += $(that).attr('title');
	} else {
	    new_elem += $(that).html();
	}
	new_elem += '</a>';
	breadcrumb.append(new_elem);

	return breadcrumb;
    }

    $(document).on('click', 'a[rel^=ajax]', function(event){
	var content_only = $(this).attr('rel') == 'ajax-content';
	var breadcrumb = getNewBreadcrumb(this);
	var navbar_id = $('#navbar-main-list > li.active').prop('id');
	var lab_tag_id = $('#lab-nav-list .active').parents('a').prop('id');

	options = {'url': window.location.pathname};
	window.History.pushState({'breadcrumb': breadcrumb.html(),
				  'content_only': content_only,
				  'navbar_id': navbar_id,
				  'lab_tag_id': lab_tag_id},
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
    enableBootstrapEffects();
    styleCode();
    preview();

    $(window).konami(function() {
	$('#konami iframe')
	    .attr('src', 'http://www.youtube.com/embed/MytfhzcSF-Y');
	$('#konami').modal('toggle');
	$('#konami').on('hidden', function() {
	    $(this).find('iframe').attr('src', '');
	});
    });
});
