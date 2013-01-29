function loadImageViewer(){
    $('article.post section img').parent('a').addClass('highslide');

    $('.highslide').each(function (){
        var $that = $(this)
        this.onclick = function() {
            return hs.expand(this);
       };
    });
}