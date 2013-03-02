var resolve_urls = django_js_utils.urls.resolve;
$.ajaxSetup({ cache: false });

function replaceAll(txt, replace, with_this) {
    return txt.replace(new RegExp(replace, 'g'), with_this);
}

$.fn.animateHighlight = function(to, duration) {
    if (duration === undefined) {
        duration = 1000;
    }

    this.stop().animate({backgroundColor: to}, duration);
    return this;
};

$.fn.flash = function(color, duration) {
    color = color || '#9ccfff';
    duration = duration || 1500;
    var current = this.css('backgroundColor');

    this.stop().css('background-color', color);
    this.animateHighlight(current, duration);
    return this;
};


$.fn.isReallyEmpty = function() {
    return $.trim($(this).html()).length == 0;
};

jQuery.extend(jQuery.expr[':'], {
    reallyEmpty: function (el) {
        return $(el).isReallyEmpty();
    }
});


function resizeTextarea() {
    $('textarea').autosize({append: "\n"});
}
