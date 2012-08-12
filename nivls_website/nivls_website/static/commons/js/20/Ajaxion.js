/*
  Infos
  -----

  Each function in callbacks['xhr'] take the xhr as argument.

  url :      Request URL
  bind :     Bind information (selector, [event])
  method:    Request method
  to_reload: Callbacks when success (from a specific URL)
  callbacks: Callbacs for error, success and xhr (based on the current URL)
  before   : Callbacks to call right after the trigger and before the request

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
		  'selectors' : [
                                  {
				    'current': '#comments'.
				    'target': '*'
		  		    'insert': false
				  }
				]
		},

		{
		  'url': 'current_url',
		  'callbacks' : [],
		  'visible': true,
		  'disabled': false,
		  'selectors' : [
                                  {
				    'current': '#form'.
				    'target': '#form'
		  		    'insert': true
				  }
				]
		},
     	 ],
	 {
	   'success': [{'callback': func, 'force': 0}],
	   'xhr': [func2, func3]
	   'error': [func4, func5]

	 },
	 [callback1, callback2]
       );
*/

function Ajaxion (url, bind, method, to_reload, callbacks, before) {
    bind = typeof bind !== 'undefined' ? bind : {};
    to_reload = typeof to_reload !== 'undefined' ? to_reload : [];
    callbacks = typeof callbacks !== 'undefined' ? callbacks : {};
    before = typeof before !== 'undefined' ? before : [];

    this.url = url;
    this.bind = bind;
    this.method = method;
    this.to_reload = to_reload;
    this.callbacks = callbacks;
    this.before = before;
    this.fileUpload = false;
    this.cache = false;
    this.unbind = false;
    this.dataType = 'html';
    this.data = {};
    this.checkForm = true;
    this.before = before;
}


Ajaxion.prototype.stop = function (that) {
    that = typeof that !== 'undefined' ? that : this;

    if (this.bind && 'events' in this.bind && 'selector' in this.bind) {
	$(document).off(that.bind['events'], that.bind['selector']);
    }

    return that;
}


Ajaxion.prototype.start = function () {
    var that = this;

    if (!this.bind
	|| !('events' in this.bind)
	|| !('selector' in this.bind)) {
	that._started(that);
    } else {
	$(document).on(this.bind['events'],
		       this.bind['selector'],
		       function (e) {
			   that._started(that);
			   return false;
		       });
    }
}


Ajaxion.prototype._started = function (that) {
    that._beforeCallbacks(that);
    var contentType = 'application/x-www-form-urlencoded';
    var selector = that.bind['selector'];
    var clear_data = $.isEmptyObject(that.data);

    if (that.method == 'POST') {
	if ($.isEmptyObject(that.data)) {
	    that.data = $(selector).serialize();

	    if (that.fileUpload) {
		that.data = new FormData($(selector)[0]);
	    }
	}

	if (that.fileUpload) {
	    contentType = false;
	}

	$(selector)
	    .find("button[type='submit']")
	    .button('loading');
    }

    $.ajax({
	type: that.method,
	url: that.url,
	data: that.data,
	cache: that.cache,
	dataType: that.dataType,
	contentType: contentType,
	processData: that.fileUpload == false,
	complete: function (jqXHR, textStatus) {
	    that._complete(jqXHR, textStatus, that);
	},

	xhr: function () {
	    return that._xhr(that);
	},

	error: function (XMLHttpRequest,
			 textStatus,
			 errorThrown) {
	    that._error(XMLHttpRequest, textStatus, errorThrown, that);
	},

	success: function (html, textStatus) {
	    that._success(html, textStatus, that);
	},
    });

    if (clear_data) {
	that.data = {};
    }
}


Ajaxion.prototype._beforeCallbacks = function (that) {
    for (var i=0; i<that.before.length; i++) {
	that.before[i](that);
    }
}


Ajaxion.prototype._complete = function (jqXHR, textStatus, that) {
    if (that.unbind || that.bind['events'] == 'dummy')
	that.stop(that);
}


Ajaxion.prototype._xhr = function (that) {
    var myXhr = $.ajaxSettings.xhr();

    if ('xhr' in that.callbacks) {
	for (var i=0; i<that.callbacks['xhr'].length; i++) {
	    that.callbacks['xhr'][i](myXhr, that);
	}
    }
    if (that.fileUpload && myXhr.upload) {
	myXhr.upload.addEventListener('progress', function(e) {
	    if (e.lengthComputable){
		var percent = Math.round(e.loaded * 100 / e.total);
	    	$('#form-progress-bar').width(percent + '%');
		if (percent == 100) {
		    $('#form-progress').removeClass('active');
		}
	    }
	}, false);
    }
    return myXhr;
}


Ajaxion.prototype._error = function (XMLHttpRequest, textStatus,
				     errorThrown, that) {
    var selector = that.bind['selector'];

    if ('error' in that.callbacks) {
	for (var i=0; i<that.callbacks['error'].length; i++) {
	    that.callbacks['error'][i](XMLHttpRequest, textStatus,
				       errorThrown, that);
	}
    }

    if (that.method == 'POST') {
	$(selector)
	    .find("button[type='submit']")
	    .button('reset')
    }
}


Ajaxion.prototype._success = function (html, textStatus, that) {
    var proceed = true;
    var selector = that.bind['selector'];

    if (that.method == 'POST' && that.checkForm) {
	var form = $('<noexists>' + html + '</noexists>').find(selector);
	if (form.text() != '') {
	    proceed = false;
	    $(selector).replaceWith(form);
	}
    }

    if ('success' in that.callbacks) {
	for (var i=0; i<that.callbacks['success'].length; i++) {
	    if ((proceed
		 || ('force' in that.callbacks['success'][i]
		     && that.callbacks['success'][i]['force'] == true))
		&& (!('disabled' in that.callbacks['success'][i])
		    || that.callbacks['success'][i]['disabled'] == false)) {
		that.callbacks['success'][i]['callback'](html,
							 textStatus,
							 that);
	    }
	}
    }

    if (proceed) {
	that._success_reload_part(that);
    }
}


Ajaxion.prototype._success_reload_part = function (that) {
    for (var i=0; i<that.to_reload.length; i++) {
	if (! ('disabled' in that.to_reload[i]) ||
	    that.to_reload[i]['disabled'] == false) {
	    if ('visible' in that.to_reload[i]) {
		if (that.to_reload[i]['visible']
		    && 'selectors' in that.to_reload[i]) {
		    for (var j=0 in that.to_reload[i]['selectors'].length) {
			var key = that.to_reload[i]['selectors'][j]['current']
			$(key)
			    .html('<img src="' + STATIC_URL + '/commons/img/loading-small.gif" alt="loading..." />');
		    }
		}
	    }
	    that._success_reload_part_async_call(i, that);
	}
    }
}


Ajaxion.prototype._success_reload_part_async_call = function(i, obj) {
    if (obj.to_reload[i]['url'] == 'current_url') {
	obj.to_reload[i]['url'] = obj.url;
    }
    $.get(obj.to_reload[i]['url'], function (data) {
	if ('selectors' in obj.to_reload[i]) {
	    for (var j=0; j<obj.to_reload[i]['selectors'].length; j++) {
		var current = obj.to_reload[i]['selectors'][j]
		var key = current['current']
		var target = current['target']
		var content = (target == '*') ? data : $(data).find(target)
		if ('insert' in current && current['insert'] == false) {
		    $(key).replaceWith(content);
		} else {
		    $(key).html(content);
		}
	    }
	}

	if ('callbacks' in obj.to_reload[i]) {
	    for (var j=0; j<obj.to_reload[i]['callbacks'].length; j++) {
		obj.to_reload[i]['callbacks'][j](data, obj);
	    }
	}
    });
}

/*
  Shortcut
*/

Ajaxion.formUpload = function(url, data, success) {
    var ajax = new Ajaxion(url, {}, 'POST');
    var callback = typeof success !== 'undefined' ? success : data;

    if (success !== 'undefined') {
	ajax.data = data;
    }
    ajax.fileUpload = true;
    ajax.callbacks = {'success': [{'callback': callback,
				   'force': true}]};
    ajax.start();
}


/*
  Callbacks
*/

Ajaxion.cb_replace = function(html, textStatus, that) {
    $(that.bind['selector']).replaceWith(html);
}


Ajaxion.cb_insert = function(html, textStatus, that) {
    $(that.bind['selector']).html(html);
}


Ajaxion.cb_push_before = function (html, textStatus, that) {
    $(that.bind['selector']).before(html);
}


Ajaxion.cb_error_push_before = function (XMLHttpRequest, textStatus,
					 errorThrown, that) {
    $(that.bind['selector']).before('<div class="alert alert-error alert-block fade in"><a class="close" data-dismiss="alert">×</a><h4 class="alert-heading">' + gettext('Error!') + '</h4>' + gettext('Your action was unable to be executed at this time. We apologise for the inconvenience.') + '</div>');
}
