from django.conf.urls.defaults  import *
from nivlsblog.feeds.feeds      import *

urlpatterns = patterns('',
    (r'^lastest_entries/$', LastestEntriesFeed()),
)
