/*global $ */
/*jslint browser:true */

$.ajaxSetup({ cache: false });

$.fn.animateHighlight = function (to, duration) {
    'use strict';

    if (duration === undefined) {
        duration = 1000;
    }

    this.stop().animate({backgroundColor: to}, duration);
    return this;
};

$.fn.flash = function (color, duration) {
    'use strict';

    color = color || '#9ccfff';
    duration = duration || 1500;
    var current = this.css('backgroundColor');

    this.stop().css('background-color', color);
    this.animateHighlight(current, duration);
    return this;
};


$.fn.isReallyEmpty = function () {
    'use strict';

    return $.trim($(this).html()).length === 0;
};

$.fn.fancyHide = function (duration, callback) {
    'use strict';

    duration = duration || 400;
    callback =  callback || $.noop;

    $(this).stop()
        .fadeOut({duration: duration, queue: false})
        .animate({'margin-left': '-=30px'}, 200, function () {
            $(this).css('margin-left', '+=30px');
            callback();
        });
    return this;
};


$.fn.fancyShow = function (duration, callback) {
    'use strict';

    duration = duration || 400;
    callback =  callback || $.noop;

    $(this).stop()
        .css('margin-left', '-=30px')
        .fadeIn({duration: duration, queue: false})
        .animate({'margin-left': '+=30px'}, 200, callback);
    return this;
};


$.extend($.expr[':'], {
    reallyEmpty: function (el) {
        'use strict';

        return $(el).isReallyEmpty();
    }
});