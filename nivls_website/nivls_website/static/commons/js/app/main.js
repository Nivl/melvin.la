/*global $, UAParser */
/*global reloadJsEffects */
/*jslint browser:true */

$(function () {
    "use strict";

    var uaParser = new UAParser(),
        results = uaParser.getResult();

    if (results.engine.name !== 'WebKit'
            && results.engine.name !== 'Gecko'
            && $.cookie('browser-warning') !== '1') {
        $('#browser-warning').modal('show');
        $('#browser-warning').find('button').click(function () {
            $.cookie('browser-warning', '1', {expires: 365, path: '/'});
        });
    }

    reloadJsEffects();
});


$(document).on('click', '.scroll', function (e) {
    "use strict";

    e.preventDefault();
    $('html,body').stop().animate({
        scrollTop: $(this.hash).offset().top
    }, 500);
});