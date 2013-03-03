var current_live_editing_element = null;
var live_edit_enabled = false;

uneditElement = function (e) {
    if (current_live_editing_element != null) {
        var $container = $('#' + current_live_editing_element['id']);
        if (e === undefined
            || ($container.is(e.target) == false
                && $container.has(e.target).length === 0)) {
            $container.toggleClass(current_live_editing_element['class']);
            $container.trigger('click');
        }
    }
};