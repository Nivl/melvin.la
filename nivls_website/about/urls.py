from django.conf.urls.defaults import patterns, url
from django.views.generic.base import RedirectView
from commons.sitemaps import StaticSitemap
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

urlpatterns += patterns(
    'about.views',

    url(r'^get/about/profile/(?P<pk>\d+)/$',
        'get_profile_about_me',
        name='about-get-profile-about-me'),

    url(r'^get/about/profile/(?P<pk>\d+)/form/$',
        'get_profile_about_me_form',
        name='about-get-profile-about-me-form'),

    url(r'^get/project/description/(?P<pk>\d+)/$',
        'get_project_description',
        name='about-get-project-description'),

    url(r'^get/project/description/(?P<pk>\d+)/form/$',
        'get_project_description_form',
        name='about-get-project-description-form'),
)

sitemaps = {
    'about_root': MainSitemap(),
    'about_static': StaticSitemap(static_urlpatterns),
    }

urlpatterns += static_urlpatterns
