$(function() {
    if ($.cookie('browser-warning') !== '1') {
	$('#browser-warning').modal('show');

	$('#browser-warning').find("button").click(function () {
	    $.cookie('browser-warning', '1', {expires: 365, path: '/'});
	});
    }
});
