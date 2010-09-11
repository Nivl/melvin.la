from django.conf.urls.defaults  import *
from django.contrib             import admin
from django.conf                import settings

admin.autodiscover()

urlpatterns = patterns('',
    (r'^admin/', include(admin.site.urls)),
    (r'^$', 'nivlsblog.entries.views.listing', {'page': 1}),
    (r'^page-(?P<page>[0-9]+)$', 'nivlsblog.entries.views.listing'),
    (r'^feeds/', include('nivlsblog.feeds.urls')),
    (r'^contact/$', 'nivlsblog.main.views.contact'),
    (r'^entries/', include('nivlsblog.entries.urls')),
    (r'^categories/', include('nivlsblog.categories.urls')),
)


if settings.DEBUG:
    urlpatterns += patterns('',
                            (r'^media/(?P<path>.*)$',
                             'django.views.static.serve',
                             {'document_root': settings.MEDIA_ROOT}),
    )
