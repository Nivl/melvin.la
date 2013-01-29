var resolve_urls = django_js_utils.urls.resolve;
$.ajaxSetup({ cache: false });

function replaceAll(txt, replace, with_this) {
    return txt.replace(new RegExp(replace, 'g'), with_this);
}

$.fn.animateHighlight = function(highlightColor, duration) {
    var highlightBg = highlightColor || '#FFFF9C';
    var animateMs = duration || 1500;
    var originalBg = this.css('backgroundColor');
    this.stop().css('background-color', highlightBg)
    .animate({backgroundColor: originalBg}, animateMs);
};
