// e: live-edit.js

$(document).bind('keyup.shift_/', function() {
    $('#help').modal('toggle');
});

$(document).bind('keyup./', function() {
    $('.form-search .search-query').focus();
});