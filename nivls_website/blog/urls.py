from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns(
    '',
    url(r'^$', 'nivls_website.views.home', name='blog'),
)
