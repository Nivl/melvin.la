from django.conf.urls.defaults import patterns, url
from sitemaps import ProjectSitemap, TagSitemap
from commons.sitemaps import StaticSitemap
from commons.urls import live_edit_url

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

urlpatterns += live_edit_url('lab', 'project', 'description')
urlpatterns += live_edit_url('lab', 'project', 'name')
urlpatterns += live_edit_url('lab', 'project', 'catchphrase')
urlpatterns += live_edit_url('lab', 'project', 'license')
urlpatterns += live_edit_url('lab', 'project', 'realclients')
urlpatterns += live_edit_url('lab', 'project', 'clients')
urlpatterns += live_edit_url('lab', 'project', 'realcoworkers')
urlpatterns += live_edit_url('lab', 'project', 'coworkers')
urlpatterns += live_edit_url('lab', 'project', 'progress')
urlpatterns += live_edit_url('lab', 'progress', 'date')
urlpatterns += live_edit_url('lab', 'progress', 'description')
urlpatterns += live_edit_url('lab', 'video', 'name')
urlpatterns += live_edit_url('lab', 'video', 'description')

urlpatterns += static_urlpatterns

sitemaps = {
    'lab_static': StaticSitemap(static_urlpatterns, changefreq='daily'),
    'lab_project': ProjectSitemap,
    'lab_tag': TagSitemap,
}
