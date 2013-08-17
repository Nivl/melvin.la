/*jslint browser:true */
/*global $, gapi, twttr */

function reloadShareButtons() {
    'use strict';

    if (gapi !== undefined) {
        gapi.plusone.go();
    }

    if (twttr.widgets !== undefined) {
        var $twttr_button = $('.twitter-share-button');

        $twttr_button.attr('data-url', document.location.href);
        $twttr_button.attr('data-text', $('title').text());
        twttr.widgets.load();
    }
}