function enableBootstrapEffects() {
    $('[rel=tooltip]').tooltip();
    $('.form-search .search-query').typeahead({
        updated: function() {
            this.$element.trigger('submit');
        }
    });
}