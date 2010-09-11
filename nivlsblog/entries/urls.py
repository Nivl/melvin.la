from django.conf.urls.defaults import *

urlpatterns = patterns('nivlsblog.entries.views',
    (r'^comments/', include('django.contrib.comments.urls')),
    (r'^(?P<entry_id>\d+)/$', 'detail'),
)
