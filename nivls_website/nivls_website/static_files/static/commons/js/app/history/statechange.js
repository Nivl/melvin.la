/*jslint browser:true */
/*global $, Modernizr */
/*global moveNavbar, reloadJsEffects */

/*
    moveNavbar          : utils/move_navbar.js
    reloadJsEffects     : /reload.js
*/

function fancydisplayNewPage(response, elem, references) {
    'use strict';

    $(elem).fadeOut('fast', function () {
        $(elem).html(response.find(elem).html());
        $(elem).fancyShow('fast');

        references.current = references.current + 1;
        if (references.current === references.nb_of_elem) {
            reloadJsEffects();
            $('#loading-msg').fadeOut();
        }
    });
}

if (Modernizr.history) {
    $(window).bind('statechange', function () {
        'use strict';

        var navbar_id = $('#navbar-main-list > li.active').prop('id'),
            State = window.History.getState(),
            action = State.data.action,
            relativeURL = '/' + State.url.replace(window.History.getRootUrl(), ''),
            navbar_target = null;

        if (action === undefined || $(action).length <= 0) {
            window.location = relativeURL;
        }

        if (navbar_id !== State.data.navbar_id) {
            if (State.data.navbar_id !== undefined) {
                navbar_target = $('#' + State.data.navbar_id);
            } else {
                navbar_target = null;
            }
            moveNavbar(navbar_target);
        }

        if (State.data.breadcrumb !== undefined
                && State.data.breadcrumb !== null
                && State.data.breadcrumb.length) {
            $('#breadcrumb').html(State.data.breadcrumb).show();
        } else {
            $('#breadcrumb').fadeOut(function () {
                $(this).empty();
            });
        }

        $('#loading-msg').fadeIn();
        $.get(relativeURL, function (html) {

            var response = $('<html />').html(html),
                to_change = [],
                i = 0,
                references = {};

            // Replace without fade
            to_change = ['#app-js', '#page-title', '#bottom-header'];
            for (i = 0; i < to_change.length; i = i + 1) {
                $(to_change[i]).html(response.find(to_change[i])
                                             .html());
            }
            // Replace with fades
            to_change = [action];
            references = {'nb_of_elem': to_change.length, 'current': 0};

            for (i = 0; i < to_change.length; i = i + 1) {
                fancydisplayNewPage(response, to_change[i], references);
            }
        });
    });
}
