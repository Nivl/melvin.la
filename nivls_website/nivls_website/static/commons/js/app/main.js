
$(function() {
    if ($.browser.webkit != true // === undefined
        && $.browser.mozilla != true // === undefined
        && $.cookie('browser-warning') !== '1') {
       $('#browser-warning').modal('show');
       $('#browser-warning').find('button').click(function() {
         $.cookie('browser-warning', '1', {expires: 365, path: '/'});
     });
   }

    reloadJsEffects();
    storeData();
    preview();
    dropFile();

    $(window).konami(function() {
        $('body').toggleClass('konami');
    });
});


$(document).on('click', '.scroll', function(e) {
    e.preventDefault();
    $('html,body').stop().animate({
        scrollTop: $(this.hash).offset().top
    }, 500);
});
