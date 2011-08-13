from django.conf.urls.defaults import patterns, include, url
from django.contrib import admin
from settings import MEDIA_ROOT

admin.autodiscover()

urlpatterns = patterns(
    '',
    # Examples:
    # url(r'^$', 'nivls_website.views.home', name='home'),
    # url(r'^nivls_website/', include('nivls_website.foo.urls')),

    (r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': MEDIA_ROOT}),

    url(r'^admin/', include(admin.site.urls)),
)
