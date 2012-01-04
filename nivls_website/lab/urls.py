from django.conf.urls.defaults import patterns, include, url
from sitemaps import *

sitemaps = {
    'project': ProjectSitemap,
    }

urlpatterns = patterns(
    '',
    url(r'^project/(?P<slug>[-\w]+)/$',
        'nivls_website.lab.views.project',
        name='project'),

    url(r'^sitemap\.xml$', 'django.contrib.sitemaps.views.sitemap',
        {'sitemaps': sitemaps}),
    url(r'^robots.txt$', include('robots.urls')),
)

