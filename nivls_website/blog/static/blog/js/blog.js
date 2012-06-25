$(function() {
    $('#homeCarousel').carousel()

    function preview() {
	var $textarea = $('#id_comment'),
	$preview = $('#form-preview'),
	converter = new Markdown.getSanitizingConverter();

	$textarea.input(function(event) {
            $preview.html(converter.makeHtml($textarea.val()));
	}).trigger('input');

	$textarea.keydown(function() {
            $(this).stopTime();
            $(this).oneTime(500, function() { styleCode(); });
	});
    }
});
