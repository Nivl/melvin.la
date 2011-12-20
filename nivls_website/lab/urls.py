from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns(
    '',
    url(r'^project/(?P<slug>[-\w]+)/$',
        'nivls_website.lab.views.project',
        name='project'),
)
