from django.conf.urls.defaults import patterns, url
from django.views.generic.base import RedirectView
from commons.sitemaps import StaticSitemap
from commons.urls import live_edit_url
from sitemaps import MainSitemap

urlpatterns = patterns(
    'about.views',

    url(r'^$',
        'home',
        name='home'),

    url(r'^cv/$',
        RedirectView.as_view(url='/about/#resume', permanent=True),
        name='cv'),

    url(r'^contact/form/$',
        'contact_form',
        name='contact-form'),
)

static_urlpatterns = patterns(
    'about.views',

    url(r'^about/$',  # Hardcoded in cv (see above)
        'about',
        name='about'),

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

urlpatterns += live_edit_url('about', 'profile', 'about_me')
urlpatterns += live_edit_url('about', 'project', 'description')
urlpatterns += live_edit_url('about', 'navigationLink', 'model')

sitemaps = {
    'about_root': MainSitemap(),
    'about_static': StaticSitemap(static_urlpatterns),
    }

urlpatterns += static_urlpatterns
