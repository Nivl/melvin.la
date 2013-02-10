from django.conf.urls.defaults import patterns, url

urlpatterns = patterns(
    'resumes.views',

    url(r'^get/content/key/(?P<pk>\d+)/$',
        'get_content_key',
        name='resume-get-content-key'),

    url(r'^get/content/key/(?P<pk>\d+)/form/$',
        'get_content_key_form',
        name='resume-get-content-key-form'),


    url(r'^get/content/value/(?P<pk>\d+)/$',
        'get_content_value',
        name='resume-get-content-value'),

    url(r'^get/content/value/(?P<pk>\d+)/form/$',
        'get_content_value_form',
        name='resume-get-content-value-form'),
)
