from django.conf.urls.defaults import patterns, include, url
from django.views.generic.simple import direct_to_template
from django.contrib import admin
from commons.views import TexplainView

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
    url(r'^humans.txt$', TexplainView.as_view(template_name='humans.txt')),
    )
