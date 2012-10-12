from django.conf.urls.defaults import patterns, url
from commons.sitemaps import StaticSitemap
from sitemaps import MainSitemap

urlpatterns = patterns(
    'about.views',

    url(r'^$',
        'home',
        name='home'),

    url(r'^about$',
        'about',
        name='about'),

    url(r'^contact/form/$',
        'contact_form',
        name='contact-form'),
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

    url(r'^contact/$',
        'contact',
        name='contact'),
)


sitemaps = {
    'about_root': MainSitemap(),
    'about_static': StaticSitemap(static_urlpatterns),
    }

urlpatterns += static_urlpatterns
