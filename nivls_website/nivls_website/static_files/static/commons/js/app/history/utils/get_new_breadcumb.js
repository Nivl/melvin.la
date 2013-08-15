/*jslint browser:true */
/*global $ */

function getNewBreadcrumb(that) {
    'use strict';

    var breadcrumb = $('#breadcrumb').clone(),
        new_elem = '';

    if ($(that).data('depth') === undefined) {
        return breadcrumb;
    }

    breadcrumb.children('li').each(function () {
        var children = $(this).children('a');

        if (children.data('depth') !== undefined) {
            if (children.data('depth') >= $(that).data('depth')) {
                $(this).nextAll().remove();
                $(this).remove();

            }
        }
    });

    new_elem = "<li itemtype='http://data-vocabulary.org/Breadcrumb' itemscope><a";
    new_elem += ' data-depth="' + $(that).data('depth') + '"';
    new_elem += ' data-ajax="' + $(that).data('ajax') + '"';
    new_elem += ' itemprop="url"';
    if ($(that).attr('title') !== undefined) {
        new_elem += ' title="' + $(that).attr('title') + '"';
    }

    new_elem += 'href="' + $(that).attr('href') + '">';
    new_elem += "<span itemprop='title'>";
    if ($(that).attr('title') !== undefined) {
        new_elem += $(that).attr('title');
    } else {
        new_elem += $(that).html();
    }
    new_elem += '</span></a>';
    breadcrumb.append(new_elem);

    return breadcrumb;
}