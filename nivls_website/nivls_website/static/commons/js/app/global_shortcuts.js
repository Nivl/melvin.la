/*global $*/
/*jslint browser:true */

// e: live-edit.js

$(document).on('keyup', null, 'shift+/', function () {
    "use strict";

    $('#help').modal('toggle');
});

$(document).on('keyup', null, '/', function () {
    "use strict";

    $('.form-search .search-query').focus();
});
