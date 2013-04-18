var resolve_urls = django_js_utils.urls.resolve;

function replaceAll(txt, replace, with_this) {
    return txt.replace(new RegExp(replace, 'g'), with_this);
}

function resizeTextarea() {
    $('textarea').autosize({append: "\n"});
}

function isString(variable) {
    return Object.prototype.toString.call(variable) == '[object String]';
}