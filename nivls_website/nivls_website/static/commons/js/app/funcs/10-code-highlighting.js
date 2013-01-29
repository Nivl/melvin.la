function highlightCode($this) {
    if ($this === undefined) {
        highlightAllCodes();
    } else {
        highlightSingleCode($this);
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

function highlightSingleCode($this) {
    $this.html(prettyPrintOne($this.html()));
}