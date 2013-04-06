 function ajaxPost(url, form_id, options, success, error, xhr) {
    if (form_id) {
        $(form_id).find("button[type='submit']").button('loading');
    }

    if (typeof options !== 'undefined') {
        if ($.isFunction(options)) {
            xhr = error;
            error = success;
            success = options;
            options = {};
        }
    } else {
        options = {};
    }

    if (!('data' in options)) {
        options['data'] = $(form_id).serialize();
    }

    options['success'] = function (data) {
        var proceed = true;

        if (form_id) {
            var form = $('<noexists>' + data + '</noexists>').find(form_id);

            if (form.text() !== '') {
                proceed = false;
                $(form_id).replaceWith(form);
            }
        }

        if (typeof success !== 'undefined') {
            success(data, proceed);
        }
    };

    options['error'] = function() {
        if (form_id) {
            $(form_id).find("button[type='submit']").button('reset');
        }
        if (typeof error !== 'undefined') {
            error();
        }
    };

    if (typeof xhr !== 'undefined') {
        options['xhr'] = xhr;
    }

    options['type'] = 'POST';
    options['url'] = url;
    $.ajax(options);
}


function ajaxFormUpload(url, data, form_id, success, error, xhr) {
    if (data === null) {
        data = new FormData($(form_id)[0]);
    }
    var options = {'data': data,
                   'contentType': false,
                   'processData': false
                  };
    ajaxPost(url, form_id, options, success, error, xhr);
}


function ajaxSwitchElem(url, elem, target, callbacks) {
    target = (typeof target === 'undefined') ? (elem) : (target);
    callbacks = (typeof callbacks === 'undefined') ? {} : (callbacks);

    if ($.isArray(target)) {
        callbacks = target;
    }

    $.get(url, function(data) {
        var content = (target == '*') ? data : $(data).find(target);
        $(elem).replaceWith(content);

        for (var i=0; i<callbacks.length; i++) {
            callbacks[i]();
        }
    });
}

function ajaxSwitchElemContent(url, elem, target, callbacks) {
    target = (typeof target === 'undefined') ? (elem) : (target);
    callbacks = (typeof callbacks === 'undefined') ? {} : (callbacks);

    if ($.isArray(target)) {
        callbacks = target;
    }

    $.get(url, function(data) {
        var content = (target == '*') ? data : $(data).find(target);
        $(elem).html(content);

        for (var i=0; i<callbacks.length; i++) {
            callbacks[i]();
        }
    });
}


function ajaxCb_pushBefore(that) {
    $(that).before('<div class="alert alert-error alert-block fade in"><a class="close" data-dismiss="alert">×</a><h4 class="alert-heading">' + gettext('Error!') + '</h4>' + gettext('Your action was unable to be executed at this time. We apologise for the inconvenience.') + '</div>');
}
