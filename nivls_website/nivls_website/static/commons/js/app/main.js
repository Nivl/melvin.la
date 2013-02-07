
$(function() {
    var uaParser = new UAParser();
    var results = uaParser.getResult();

    if (results.engine.name != 'WebKit'
        && results.engine.name != 'Gecko'
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

    // Lab
    liveEdit('lab-project-description-', {}, 'lab-get-project-descr', 'lab-get-project-descr-form', 'lab-project-description-live-edit');
    liveEdit('lab-project-name-', {}, 'lab-get-project-name', 'lab-get-project-name-form', 'lab-project-name-live-edit', [null]);
    liveEdit('lab-project-catchphrase-', {}, 'lab-get-project-catchphrase', 'lab-get-project-catchphrase-form', 'lab-project-catchphrase-live-edit', [null]);
    liveEdit('lab-project-license-', {}, 'lab-get-project-license', 'lab-get-project-license-form', 'lab-project-license-live-edit', [null, 'A']);

    // Blog
    // comment_ajax.haml

});


$(document).on('click', '.scroll', function(e) {
    e.preventDefault();
    $('html,body').stop().animate({
        scrollTop: $(this.hash).offset().top
    }, 500);
});
