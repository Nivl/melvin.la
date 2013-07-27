function highlightCode($target) {
    if ($target === undefined) {
        highlightAllCodes();
    } else {
        highlightBlock($target);
    }
}

function highlightAllCodes() {
    var a = false;

    $('pre > code').parent().each(function() {
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
    var parent = null;

    if ($target.prop("tagName") == 'CODE') {
        parent = $target.parent();
    } else {
        parent = $target.find('code').parent();
    }

    if (parent.length > 0) {
        parent.each(function() {
            $(this).addClass('prettyprint');
            $(this).addClass('linenums');
            $(this).html(prettyPrintOne($(this).html(), null, true));
        });
    }
}

jQuery.fn.prettify = function () { highlightCode(this) };