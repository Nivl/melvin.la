from django.conf.urls.defaults import patterns, url


def live_edit_url(app_name, obj_name, attr_name):
    return patterns(
        '%s.views.ajax' % app_name,

        url(r'^get/%s/(?P<pk>\d+)/%s/$' % (obj_name, attr_name.replace('_', '-')),
             'get_%s_%s' % (obj_name, attr_name),
             name='get-%s-%s-%s' % (app_name, obj_name, attr_name.replace('_', '-'))
            ),

        url(r'^get/%s/(?P<pk>\d+)/%s/form/$' % (obj_name, attr_name.replace('_', '-')),
             'get_%s_%s_form' % (obj_name, attr_name),
             name='get-%s-%s-%s-form' % (app_name, obj_name, attr_name.replace('_', '-'))
            )
        )
