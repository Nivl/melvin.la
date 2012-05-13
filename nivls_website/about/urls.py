from django.conf.urls.defaults import patterns, include, url
from sitemaps import *

urlpatterns = patterns(
    '',
    url(r'^$', 'about.views.home', name='home'),
)

# Static which will be added to the sitemap
static_urlpatterns = patterns(
    '',
    url(r'^cv/$', 'about.views.cv', name='cv'),
    url(r'^cv_pdf/$', 'about.views.cv_pdf', name='cv_pdf'),
    url(r'^portfolio/$', 'about.views.portfolio', name='portfolio'),
)


sitemaps = {
    'about_static': StaticSitemap(static_urlpatterns),
    }

urlpatterns += static_urlpatterns
