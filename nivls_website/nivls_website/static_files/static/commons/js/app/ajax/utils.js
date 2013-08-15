/*jslint browser:true */
/*global $ */
/*global isString, gettext */

/*
    isString      : /utils/utils.js
*/

function ajaxPost(url, $selector, options, success, error, xhr) {
    'use strict';

    if ($selector) {
        if (isString($selector)) {
            $selector = $($selector);
        }

        $selector.find("button[type='submit']").button('loading');
    }

    if (options !== undefined) {
        if ($.isFunction(options)) {
            xhr = error;
            error = success;
            success = options;
            options = {};
        }
    } else {
        options = {};
    }

    if (options.data === undefined) {
        options.data = $selector.serialize();
    }

    options.success = function (data) {
        var proceed = true,
            form = null;

        if ($selector) {
            form = $('<noexists>' + data + '</noexists>').find('form');

            if (form.text() !== '') {
                proceed = false;
                $selector.replaceWith(form);
            }
        }

        if (success !== undefined) {
            success(data, proceed);
        }
    };

    options.error = function () {
        if ($selector) {
            $selector.find("button[type='submit']").button('reset');
        }
        if (error !== undefined) {
            error();
        }
    };

    if (xhr !== undefined) {
        options.xhr = xhr;
    }

    options.type = 'POST';
    options.url = url;
    $.ajax(options);
}


function ajaxFormUpload(url, data, $selector, success, error, xhr) {
    'use strict';

    if ($selector && Object.prototype.toString.call($selector) === '[object String]') {
        $selector = $($selector);
    }

    if (data === null) {
        data = new FormData($selector[0]);
    }
    var options = {'data': data,
                   'contentType': false,
                   'processData': false
                  };
    ajaxPost(url, $selector, options, success, error, xhr);
}


function ajaxSwitchElem(url, elem, target, callbacks) {
    'use strict';

    target = (target === undefined) ? elem : target;
    callbacks = (callbacks === undefined) ? {} : callbacks;

    if ($.isArray(target)) {
        callbacks = target;
    }

    $.get(url, function (data) {
        var content = target === '*' ? data : $(data).find(target),
            i = 0;
        $(elem).replaceWith(content);

        for (i = 0; i < callbacks.length; i = i + 1) {
            callbacks[i]();
        }
    });
}

function ajaxSwitchElemContent(url, elem, target, callbacks) {
    'use strict';

    target = (target === undefined) ? elem : target;
    callbacks = (callbacks === undefined) ? {} : callbacks;

    if ($.isArray(target)) {
        callbacks = target;
    }

    $.get(url, function (data) {
        var content = (target === '*') ? data : $(data).find(target),
            i = 0;
        $(elem).html(content);

        for (i = 0; i < callbacks.length; i = i + 1) {
            callbacks[i]();
        }
    });
}


function ajaxCb_pushBefore(that) {
    'use strict';

    $(that).before('<div class="alert alert-error alert-block fade in"><a class="close" data-dismiss="alert">×</a><h4 class="alert-heading">' + gettext('Error!') + '</h4>' + gettext('Your action was unable to be executed at this time. We apologise for the inconvenience.') + '</div>');
}
