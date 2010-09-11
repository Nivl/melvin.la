from django.conf.urls.defaults import *

urlpatterns = patterns('nivlsblog.categories.views',
    (r'^(?P<slug>[\w-]+)/$', 'show_entries', {'page': 1}),
    (r'^(?P<slug>[\w-]+)/page-(?P<page>[0-9]+)$', 'show_entries')
)

