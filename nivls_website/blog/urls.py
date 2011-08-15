from django.conf.urls.defaults import patterns, include, url
from django.contrib import admin
from settings import MEDIA_ROOT

admin.autodiscover()

urlpatterns = patterns(
    '',
    url(r'^$', 'nivls_website.views.home', name='blog'),

    (r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': MEDIA_ROOT}),

    url(r'^admin/', include(admin.site.urls)),
)
