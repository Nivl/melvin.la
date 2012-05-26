function ajax_form(form_selector, form_url, callback, error_msg, remove_form) {
    remove_form = typeof remove_form !== 'undefined' ? remove_form : true;

    $(form_selector).submit(function() {
	$(form_selector)
	    .find("button[type='submit']")
	    .button('loading')
        $.ajax({
            type: "POST",
            data: $(form_selector).serialize(),
            url: form_url,
            cache: false,
            dataType: "html",
            success: function(html, textStatus) {
		var form = $(html).find(form_selector)
		if (form.text() == '') {
		    if (remove_form) {
			$(form_selector).replaceWith(html);
		    } else {
			$(form_selector)
			    .find("button[type='submit']")
			    .button('reset');

			$(form_selector).before(html);
			$(form_selector).replaceWith('<div class="centered-text" id="contact-form"><img src="{{ STATIC_URL }}/commons/img/ajax-loader.gif" alt="loading..." /></div>');

			$('<div>').load(form_url.concat(' ', form_selector), function() {
			    $(form_selector).replaceWith($(this).html());
			    callback();
			});
		    }
		} else {
		    $(form_selector).replaceWith(form)
		}
                callback();
	    },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
		$(form_selector)
		    .find("button[type='submit']")
		    .button('reset')

                $(form_selector).before('<div class="alert alert-error alert-block fade in"><a class="close" data-dismiss="alert">×</a><h4 class="alert-heading">{% trans "Error!" %}</h4>' + error_msg + '</div>');
            }
        });
        return false;
    });
}
