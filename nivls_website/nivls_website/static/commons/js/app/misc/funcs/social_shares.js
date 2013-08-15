/*jslint browser:true */
/*global $, gapi */

function reloadShareButtons() {
    'use strict';

    if (gapi !== undefined) {
        gapi.plusone.go();
    }
}