from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns(
    '',
    url(r'^$', 'nivls_website.about.views.home', name='home'),
    url(r'^cv/$', 'nivls_website.about.views.cv', name='cv'),
    url(r'^portfolio/$', 'nivls_website.about.views.portfolio', name='portfolio'),
)
