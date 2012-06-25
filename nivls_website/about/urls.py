from django.conf.urls.defaults import patterns, include, url
from sitemaps import *

urlpatterns = patterns(
    'about.views',

    url(r'^$',
        'home',
        name='home'),
)

static_urlpatterns = patterns(
    'about.views',

    url(r'^cv/$',
        'cv',
        name='cv'),
    url(r'^cv_pdf/$',
        'cv_pdf',
        name='cv_pdf'),
    url(r'^portfolio/$',
        'portfolio',
        name='portfolio'),
)


sitemaps = {
    'about_static': StaticSitemap(static_urlpatterns), }

urlpatterns += static_urlpatterns
