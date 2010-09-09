from django.conf.urls.defaults import *

urlpatterns = patterns('nivlsblog.categories.views',
    (r'^(?P<slug>[a-zA-Z0-9_.-]+)$', 'show_entries')
)

