from django.conf.urls.defaults import patterns, url
from sitemaps import *
from commons.sitemaps import StaticSitemap

static_urlpatterns = patterns(
    'lab.views',

    url(r'^$',
        'home',
        name='lab'),
)

urlpatterns = patterns(
    'lab.views',

    url(r'^tag/(?P<slug>[-\w]+)/$',
        'tag',
        name='lab-tag'),

    url(r'^project/(?P<slug>[-\w]+)/$',
        'project',
        name='lab-project'),
)


urlpatterns += patterns(
    'lab.views',

    url(r'^get/project/(?P<slug>[-\w]+)/description/$',
        'get_project_description',
        name='lab-get-project-description'),

    url(r'^get/project/(?P<slug>[-\w]+)/description/form/$',
        'get_project_description_form',
        name='lab-get-project-description-form'),


    url(r'^get/project/(?P<slug>[-\w]+)/name/$',
        'get_project_name',
        name='lab-get-project-name'),

    url(r'^get/project/(?P<slug>[-\w]+)/name/form/$',
        'get_project_name_form',
        name='lab-get-project-name-form'),


    url(r'^get/project/(?P<slug>[-\w]+)/catchphrase/$',
        'get_project_catchphrase',
        name='lab-get-project-catchphrase'),

    url(r'^get/project/(?P<slug>[-\w]+)/catchphrase/form/$',
        'get_project_catchphrase_form',
        name='lab-get-project-catchphrase-form'),


    url(r'^get/project/(?P<slug>[-\w]+)/license/$',
        'get_project_license',
        name='lab-get-project-license'),

    url(r'^get/project/(?P<slug>[-\w]+)/license/form/$',
        'get_project_license_form',
        name='lab-get-project-license-form'),


    url(r'^get/project/(?P<slug>[-\w]+)/real-clients/$',
        'get_project_realclients',
        name='lab-get-project-realclients'),

    url(r'^get/project/(?P<slug>[-\w]+)/real-clients/form/$',
        'get_project_realclients_form',
        name='lab-get-project-realclients-form'),


    url(r'^get/project/(?P<slug>[-\w]+)/clients/$',
        'get_project_clients',
        name='lab-get-project-clients'),

    url(r'^get/project/(?P<slug>[-\w]+)/clients/form/$',
        'get_project_clients_form',
        name='lab-get-project-clients-form'),


    url(r'^get/project/(?P<slug>[-\w]+)/real-coworkers/$',
        'get_project_realcoworkers',
        name='lab-get-project-realcoworkers'),

    url(r'^get/project/(?P<slug>[-\w]+)/real-coworkers/form/$',
        'get_project_realcoworkers_form',
        name='lab-get-project-realcoworkers-form'),


    url(r'^get/project/(?P<slug>[-\w]+)/coworkers/$',
        'get_project_coworkers',
        name='lab-get-project-coworkers'),

    url(r'^get/project/(?P<slug>[-\w]+)/coworkers/form/$',
        'get_project_coworkers_form',
        name='lab-get-project-coworkers-form'),


    url(r'^get/project/(?P<slug>[-\w]+)/progress/rate/$',
        'get_project_progress_rate',
        name='lab-get-project-progress-rate'),

    url(r'^get/project/(?P<slug>[-\w]+)/progress/rate/form/$',
        'get_project_progress_rate_form',
        name='lab-get-project-progress-rate-form'),


    url(r'^get/project/(?P<pk>\d+)/progress/date/$',
        'get_project_progress_date',
        name='lab-get-project-progress-date'),

    url(r'^get/project/(?P<pk>\d+)/progress/date/form/$',
        'get_project_progress_date_form',
        name='lab-get-project-progress-date-form'),


    url(r'^get/project/(?P<pk>\d+)/progress/description/$',
        'get_project_progress_description',
        name='lab-get-project-progress-description'),

    url(r'^get/project/(?P<pk>\d+)/progress/description/form/$',
        'get_project_progress_description_form',
        name='lab-get-project-progress-description-form'),
)

urlpatterns += static_urlpatterns

sitemaps = {
    'lab_static': StaticSitemap(static_urlpatterns, changefreq='daily'),
    'lab_project': ProjectSitemap,
    'lab_tag': TagSitemap,
}
