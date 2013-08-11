// e: live-edit.js

$(document).on('keyup', null, 'shift+/', function() {
    $('#help').modal('toggle');
});

$(document).on('keyup', null, '/', function() {
    $('.form-search .search-query').focus();
});
