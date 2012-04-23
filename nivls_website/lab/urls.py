from django.conf.urls.defaults import patterns, include, url
from sitemaps import *

sitemaps = {
    'lab_project': ProjectSitemap,
    'lab_tag': TagSitemap,
    }

urlpatterns = patterns(
    '',
    url(r'^$', 'lab.views.home', name='lab-home'),
    url(r'^tag/(?P<slug>[-\w]+)/$', 'lab.views.tag', name='lab-tag'),
    url(r'^project/(?P<slug>[-\w]+)/$', 'lab.views.project', name='lab-project'),
    )

