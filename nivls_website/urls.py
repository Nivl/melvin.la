from django.conf.urls.defaults import patterns, include, url
from django.contrib import admin

from blog.urls import sitemaps as smap_blog
from about.urls import sitemaps as smap_about
from lab.urls import sitemaps as smap_lab

admin.autodiscover()

urlpatterns = patterns(
    '',
    url(r'^lab/', include('lab.urls')),
    url(r'^blog/', include('blog.urls')),
    url(r'^admin/', include(admin.site.urls)),

    url(r'^', include('about.urls')),
    )

sitemaps = dict(smap_about.items() + smap_blog.items() + smap_lab.items())

urlpatterns += patterns(
    'django.contrib.sitemaps.views',
    url(r'^sitemap\.xml$', 'sitemap', {'sitemaps': sitemaps}),

    url(r'^robots.txt$', include('robots.urls')),
    )
