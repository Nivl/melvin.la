/*global $, django_js_utils */
/*jslint browser:true */

var resolve_urls = django_js_utils.urls.resolve;

function replaceAll(txt, replace, with_this) {
    'use strict';

    return txt.replace(new RegExp(replace, 'g'), with_this);
}

function resizeTextarea() {
    'use strict';

    $('textarea').autosize({append: "\n"});
}

function isString(variable) {
    'use strict';

    return Object.prototype.toString.call(variable) === '[object String]';
}