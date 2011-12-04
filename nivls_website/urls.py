from django.conf.urls.defaults import patterns, include, url
from about.sitemaps import *

urlpatterns = patterns(
    '',
    url(r'^$', 'nivls_website.about.views.home', name='home'),
)

static_urlpatterns = patterns(
    '',
    url(r'^cv/$', 'nivls_website.about.views.cv', name='cv'),
    url(r'^portfolio/$', 'nivls_website.about.views.portfolio', name='portfolio'),
)


sitemaps = {
    'static': StaticSitemap(static_urlpatterns),
    }


seo_urlpatterns = patterns(
    'django.contrib.sitemaps.views',
    url(r'^sitemap\.xml$', 'sitemap', {'sitemaps': sitemaps}),

    url(r'^robots.txt$', include('robots.urls')),
    )

urlpatterns = urlpatterns + static_urlpatterns + seo_urlpatterns
