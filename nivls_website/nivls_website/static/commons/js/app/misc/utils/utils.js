var resolve_urls = django_js_utils.urls.resolve;

function replaceAll(txt, replace, with_this) {
    return txt.replace(new RegExp(replace, 'g'), with_this);
}

function resizeTextarea() {
    $('textarea').autosize({append: "\n"});
}
