from django.conf.urls.defaults import *

urlpatterns = patterns('nivlsblog.entries.views',
    (r'^$', 'index'),
    (r'^comments/', include('django.contrib.comments.urls')),
    (r'^(?P<entry_id>\d+)/$', 'detail'),
)
