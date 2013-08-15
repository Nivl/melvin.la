/*global $*/
/*jslint browser:true */

$(document).on('keyup', null, 'shift+/', function () {
    "use strict";

    $('#help').modal('toggle');
});

$(document).on('keyup', null, '/', function () {
    "use strict";

    $('.search-form input').focus();
});

// e: live-edit.js