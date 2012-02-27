from django.conf.urls.defaults import patterns, include, url
from about.sitemaps import *

urlpatterns = patterns(
    '',
    url(r'^$', 'nivls_website.about.views.home', name='home'),
)

# Static which wiil be added to the sitemap
static_urlpatterns = patterns(
    '',
    url(r'^cv/$', 'nivls_website.about.views.cv', name='cv'),
    url(r'^cv_pdf/$', 'nivls_website.about.views.cv_pdf', name='cv-pdf'),
    url(r'^portfolio/$', 'nivls_website.about.views.portfolio', name='portfolio'),
)


sitemaps = {
    'about_static': StaticSitemap(static_urlpatterns),
    }

urlpatterns += static_urlpatterns
