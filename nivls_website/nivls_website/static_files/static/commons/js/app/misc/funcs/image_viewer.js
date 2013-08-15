/*jslint browser:true */
/*global $, hs */

function loadImageViewer() {
    'use strict';

    $('article.post section img').parent('a').addClass('highslide');

    $('.highslide').each(function () {
        this.onclick = function () {
            return hs.expand(this);
        };
    });
}