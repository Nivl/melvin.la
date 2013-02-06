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

    url(r'^get/project/(?P<slug>[-\w]+)/small/$',
        'get_project_small',
        name='lab-get-project-descr'),

    url(r'^get/project/(?P<slug>[-\w]+)/small/form/$',
        'get_project_small_form',
        name='lab-get-project-descr-form'),

    url(r'^get/project/(?P<slug>[-\w]+)/name/$',
        'get_project_name',
        name='lab-get-project-name'),

    url(r'^get/project/(?P<slug>[-\w]+)/name/form/$',
        'get_project_name_form',
        name='lab-get-project-name-form'),
)

urlpatterns += static_urlpatterns

sitemaps = {
    'lab_static': StaticSitemap(static_urlpatterns, changefreq='daily'),
    'lab_project': ProjectSitemap,
    'lab_tag': TagSitemap,
}
