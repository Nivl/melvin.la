/*jslint browser:true */
/*global $ */
/*global prettyPrint, prettyPrintOne */

function highlightAllCodes() {
    'use strict';

    var a = false;

    $('pre > code').parent().each(function () {
        if (!$(this).hasClass('prettyprint')) {
            $(this).addClass('prettyprint');
            $(this).addClass('linenums');
            a = true;
        }
    });

    if (a) {
        prettyPrint();
    }
}

function highlightBlock($target) {
    'use strict';

    var parent = null;

    if ($target.prop("tagName") === 'CODE') {
        parent = $target.parent();
    } else {
        parent = $target.find('code').parent();
    }

    if (parent.length > 0) {
        parent.each(function () {
            $(this).addClass('prettyprint');
            $(this).addClass('linenums');
            $(this).html(prettyPrintOne($(this).html(), null, true));
        });
    }
}

function highlightCode($target) {
    'use strict';

    if ($target === undefined) {
        highlightAllCodes();
    } else {
        highlightBlock($target);
    }
}

$.fn.prettify = function () {
    'use strict';
    highlightCode(this);
};