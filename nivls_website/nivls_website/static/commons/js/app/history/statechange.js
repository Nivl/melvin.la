if (Modernizr.history) {
    $(window).bind('statechange', function() {
        var navbar_id = $('#navbar-main-list > li.active').prop('id');
        var lab_tag_id = $('#lab-nav-list .active').parents('a').prop('id');
        var State = window.History.getState();
        var relativeURL = State.url.replace(window.History.getRootUrl(), '');
        relativeURL = '/' + relativeURL;

        var action = State.data['action'];
        if (action === undefined || $(action).length <= 0) {
            window.location = relativeURL;
        }

        if (navbar_id !== State.data['navbar_id']) {
            var navbar_target;
            if (State.data['navbar_id'] !== undefined) {
                navbar_target = $('#' + State.data['navbar_id']);
            } else {
                navbar_target = null;
            }
            moveNavbar(navbar_target);
        }

        if (lab_tag_id !== State.data['lab_tag_id']
            && State.data['lab_tag_id'] !== undefined) {
            labChangeMenu(State.data['lab_tag_id']);
        }

        if (State.data['breadcrumb'] !== undefined
            && State.data['breadcrumb'] !== null
            && State.data['breadcrumb'].length) {
            $('#breadcrumb').html(State.data['breadcrumb']).show();
        } else {
            $('#breadcrumb').fadeOut(function() {
                $(this).empty();
            });
        }

        $('#loading-msg').fadeIn();
        $.get(relativeURL, function(html) {
            var i;
            var response = $('<html />').html(html);
            var to_change = [];

            // Replace without fade
            to_change = ['#page-title', '#page-subtitle'];
            for (i=0; i<to_change.length; i++) {
                $(to_change[i]).html(response.find(to_change[i])
                                             .html());
            }
            // Replace with fades
            to_change = [action];
            for (i=0; i<to_change.length; i++) {
                $(to_change[i]).hide().html(response
                                            .find(to_change[i])
                                            .html()).fadeIn();
            }
            reloadJsEffects();
            $('#loading-msg').fadeOut();
        });
    });
}