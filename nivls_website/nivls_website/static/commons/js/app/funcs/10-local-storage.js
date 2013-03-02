$(document).off('click', '[data-storage-reset]')
    .on('click', '[data-storage-reset]', function() {
        var key = $(this).data('storage-reset');
        $.jStorage.deleteKey(key);
    });

$(document).off('input keydown', '[data-storage]')
    .on('input keydown', '[data-storage]', function() {
        var key = $(this).data('storage');
        $.jStorage.set(key, $(this).val(), {TTL: 604800000});
    });

function getStoredData() {
    $.jStorage.reInit();
    $('[data-storage]').each(function() {
        var key = $(this).data('storage');
        $(this).val($.jStorage.get(key, ''));
    });
}
