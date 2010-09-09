from django.conf.urls.defaults import *

urlpatterns = patterns('nivlsblog.categories.views',
    (r'^(?P<slug>[a-zA-Z0-9_.-]+)$', 'show_entries', {'page': 1}),
    (r'^(?P<slug>[a-zA-Z0-9_.-]+)/page-(?P<page>[0-9]+)$', 'show_entries')
)

