/*jslint browser:true */
/*global $ */

function enableBootstrapEffects() {
    'use strict';

    $('[rel=tooltip]').tooltip();
    $('.form-search .search-query').typeahead({
        updated: function () {
            this.$element.trigger('submit');
        }
    });
}