from django.conf.urls.defaults import patterns, include, url
from django.contrib import admin
from django.views.generic.base import RedirectView
from django.conf import settings
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
    url(r'^accounts/', include('user_profile.urls')),
    url(r'^search_engine/', include('search_engine.urls')),
    url(r'^captcha/', include('captcha.urls')),

    url(r'^ajax/get_header/$',
        'nivls_website.views.get_common_header',
        name='get-common-header'),

    url(r'^jsurls.js$', 'django_js_utils.views.jsurls', {}, 'jsurls'),
    url(r'', include('about.urls')),
)

sitemaps = dict(smap_about.items() + smap_blog.items() + smap_lab.items())

urlpatterns += patterns(
    'django.contrib.sitemaps.views',
    url(r'^sitemap\.xml$', 'sitemap', {'sitemaps': sitemaps}, name="sitemap"),

    url(r'^robots.txt$', TexplainView.as_view(template_name='robots.txt')),
    url(r'^humans.txt$', TexplainView.as_view(template_name='humans.txt')),

    url(r'^favicon.ico$', RedirectView.as_view(
            url='%s/commons/img/favicon.ico' % settings.STATIC_URL
            )),
    url(r'^apple-touch-icon-precomposed.png$', RedirectView.as_view(
            url='%s/commons/img/apple-touch-icon-precomposed.png' % settings.STATIC_URL
            )),
    url(r'^apple-touch-icon.png$', RedirectView.as_view(
            url='%s/commons/img/apple-touch-icon.png' % settings.STATIC_URL
            )),
)

js_info_dict = {
    'packages': ('lab', 'nivls_website'),
}

urlpatterns += patterns(
    '',
    (r'^jsi18n/$', 'django.views.i18n.javascript_catalog', js_info_dict),
)
