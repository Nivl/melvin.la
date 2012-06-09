
/*
  Infos
  -----

  Each function in callbacks['xhr'] take the xhr as argument.

  Example
  -------

  ajaxion('/post/form',
         {
	   'selector': '#my_form',
	   'events': 'submit'
	 },
	 'POST',
	 [
	        {
		  'url': '/blog/my_post/comments/',
		  'callbacks' : [],
		  'visible': false,
		  'selectors' : ['#comments': '*']
		},

		{
		  'url': '/blog/my_post/',
		  'callbacks' : [],
		  'visible': true,
		  'selectors' : {'#form': '#form'}
		},
     	 ],
	 {
	   'success': [{'callback': func, 'force': 0}],
	   'xhr': [func2, func3]
	   'error': [func4, func5]

	 },
	 );

*/

var _Ajaxion_this = '';

function Ajaxion(url, bind, method, to_reload, callbacks) {
    to_reload = typeof to_reload !== 'undefined' ? to_reload : [];
    callbacks = typeof callbacks !== 'undefined' ? callbacks : {};

    _Ajaxion_this = this;

    this.url = url;
    this.bind = bind;
    this.method = method;
    this.to_reload = to_reload;
    this.callbacks = callbacks;
    this.fileUpload = false;
    this.useFormOptions = true;
    this.cache = false;
    this.dataType = 'html';
    this.checkForm = true;
    this.error_msg = gettext('Your action was unable to be executed at this time. We apologise for the inconvenience.');

    this.start = ajaxion_start;
    this._xhr = _ajaxion_xhr;
    this._success = _ajaxion_success;
    this._error = _ajaxion_error;
    this._success_reload_part = _ajaxion_success_reload_part;
}

function ajaxion_start() {
    var obj = this;

    $(this.bind['selector']).bind(this.bind['events'], function() {
	var data = {};
	var contentType = 'application/x-www-form-urlencoded';
	var selector = obj.bind['selector'];

	if (obj.method == 'POST') {
	    data = $(selector).serialize();

	    if (obj.fileUpload) {
		data = new FormData($(selector)[0]);
		contentType = false;
	    }

	    if (obj.useFormOptions) {
		$(selector)
		    .find("button[type='submit']")
		    .button('loading');
	    }
	}

	$.ajax({
	    type: obj.method,
	    url: obj.url,
	    data:  data,
	    cache: obj.cache,
	    dataType: obj.dataType,
	    contentType: contentType,
	    rocessData: obj.fileUpload != true,
	    xhr: obj._xhr,
	    error: obj._error,
	    success: obj._success,
	});
	return false;
    });
}


function _ajaxion_xhr() {
    that = _Ajaxion_this;

    var myXhr = $.ajaxSettings.xhr();

    if ('xhr' in that.callbacks) {
	for (var i=0; i<that.callbacks['xhr'].length; i++) {
	    that.callbacks['xhr'][i](myXhr);
	}
    }
    if (that.fileUpload && that.useFormOptions && myXhr.upload) {
	myXhr.upload.addEventListener('progress', function(e) {
	    if(e.lengthComputable){
		var percent = Math.round(e.loaded * 100 / e.total);
	    	$('form-progress-bar').width(percent + '%');
		if (percent == 100) {
		    $('form-progress').removeClass('active');
		}
	    }
	}, false);
    }
    return myXhr;
}


function _ajaxion_error(XMLHttpRequest, textStatus, errorThrown) {
    that = _Ajaxion_this;
    var selector = that.bind['selector'];

    if ('error' in that.callbacks) {
	for (var i=0; i<that.callbacks['error'].length; i++) {
	    that.callbacks['error'][i](XMLHttpRequest, textStatus,
				       errorThrown);
	}
    }

    if (that.method == 'POST' && that.useFormOptions) {
	$(selector)
	    .find("button[type='submit']")
	    .button('reset')

	$(selector).before('<div class="alert alert-error alert-block fade in"><a class="close" data-dismiss="alert">×</a><h4 class="alert-heading">' + gettext('Error!') + '</h4>' + that.error_msg + '</div>');
    }
}


function _ajaxion_success(html, textStatus) {
    that = _Ajaxion_this;

    var proceed = true;
    var selector = that.bind['selector'];

    if (that.method == 'POST' && that.checkForm) {
	var form = $(html).find(selector);
	if (form.text() != '') {
	    proceed = false;
	    $(selector).replaceWith(form);
	}
	else {
	    console.log(form);
	}
    }


    if ('success' in that.callbacks) {
	for (var i=0; i<that.callbacks['success'].length; i++) {
	    if (proceed
		|| ('force' in that.callbacks['success'][i]
		 && that.callbacks['success'][i]['force'] == true))
	    that.callbacks['success'][i]['callback'](html, textStatus);
	}
    }

    if (proceed) {
	that._success_reload_part();
    }
}


function _ajaxion_success_reload_part() {
    that = _Ajaxion_this;
    for (var i=0; i<that.to_reload.length; i++) {
	if ('visible' in that.to_reload[i]) {
	    if (that.to_reload[i]['visible']
		&& 'selectors' in that.to_reload[i]) {
		for (var key in that.to_reload[i]['selectors']) {
		    if (that.to_reload[i]['selectors'].hasOwnProperty(key)) {
			$(key)
			    .html('<img src="' + STATIC_URL + '/commons/img/ajax-loader.gif" alt="' + gettext('loading...') + '" />');
		    }
		}
	    }
	}
	_ajaxion_success_reload_part_async_call(i, that);
    }
}

function _ajaxion_success_reload_part_async_call(i, obj) {
    $.get(obj.to_reload[i]['url'], function (data) {
	if ('selectors' in obj.to_reload[i]) {
	    var rep = '';
	    for (var key in obj.to_reload[i]['selectors']) {
		if (obj.to_reload[i]['selectors'].hasOwnProperty(key)) {
		    rep = obj.to_reload[i]['selectors'][key];
		    $(key).replaceWith($(data).find(rep));
		}
	    }
	}

	if ('callbacks' in obj.to_reload[i]) {
	    for (var j=0; j<obj.to_reload[i]['callbacks'].length; j++) {
		obj.to_reload[i]['callbacks'][j](data);
	    }
	}
    });
}

function ajaxion_success_callback_replace(html, textStatus) {
    $(this.bind['selector']).replaceWith(html);
}

function ajaxion_success_callback_push_before(html, textStatus) {
    $(this.bind['selector']).before(html);
}

/*
function ajax_form(obj.form_selector, obj.form_url, main_callback, error_msg, remove_form, success_callback, success_callback_async, to_reload, file_upload, progress_selector) {
    remove_form = typeof remove_form !== 'undefined' ? remove_form : true;
    file_upload = typeof file_upload !== 'undefined' ? file_upload : false;
    to_reload = typeof to_reload !== 'undefined' ? to_reload : [];
    success_callback = typeof success_callback !== 'undefined' ? success_callback : function () {};
    success_callback_get = typeof success_callback !== 'undefined' ? success_callback : function () {};
    progress_selector = typeof progress_selector !== 'undefined' ? progress_selector : 'progress';

    var target_name = obj.form_selector;
    if (target_name[0] == '#' || target_name[0] == '.')
	target_name = target_name.substring(1);

    $(obj.form_selector).submit(function() {
	var form_data = new FormData($(obj.form_selector)[0]);

	$(obj.form_selector)
	    .find("button[type='submit']")
	    .button('loading');

        $.ajax({
            type: "POST",
            data: file_upload ? form_data : $(obj.form_selector).serialize(),
            url: obj.form_url,
            cache: false,
            dataType: "html",
            contentType: file_upload ? false : 'application/x-www-form-urlencoded',
            processData: file_upload != true,

	    xhr: function() {
	    	if (file_upload == false)
	    	    return $.ajaxSettings.xhr();

	    	myXhr = $.ajaxSettings.xhr();
	    	if(myXhr.upload){
                    myXhr.upload.addEventListener('progress', function(e) {
	    		if(e.lengthComputable)
			{
			    var percent = Math.round(e.loaded * 100 / e.total);
	    		    $(progress_selector + '-bar').width(percent + '%');
			    if (percent == 100)
				$(progress_selector).removeClass('active');
			}
	    	    }, false);
	    	}
	    	return myXhr;
            },

            success: function(html, textStatus) {
		var form = $(html).find(obj.form_selector);
		if (form.text() == '') {
		    if (remove_form) {
			$(obj.form_selector).replaceWith(html);
		    } else if (!remove_form || to_reload != {}) {
			if (remove_form == false) {
			    $(obj.form_selector)
				.find("button[type='submit']")
				.button('reset');

			    $(obj.form_selector).before(html);
			    $(obj.form_selector)
				.replaceWith('<div class="centered-text" id="' + target_name + '"><img src="' + STATIC_URL + '/commons/img/ajax-loader.gif" alt="' + gettext('loading...') + '" /></div>');
			}

			$.get(obj.form_url, function(data) {
			    if (remove_form == false) {
				$(obj.form_selector)
				    .replaceWith($(data).find(obj.form_selector));
				main_callback();
			    }

			    var selector = '';
			    for (var i=0; i<to_reload.length; i++) {
				selector = to_reload[i];
				$(selector)
				    .replaceWith($(data).find(selector));
			    }
			    success_callback_async();
			});
		    }
		} else {
		    $(obj.form_selector).replaceWith(form)
		}
		success_callback();
                main_callback();
	    },

            error: function (XMLHttpRequest, textStatus, errorThrown) {
		$(obj.form_selector)
		    .find("button[type='submit']")
		    .button('reset')

                $(obj.form_selector).before('<div class="alert alert-error alert-block fade in"><a class="close" data-dismiss="alert">×</a><h4 class="alert-heading">' + gettext('Error!') + '</h4>' + error_msg + '</div>');
            }
        });
        return false;
    });
}
*/
