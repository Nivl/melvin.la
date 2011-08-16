from django.conf.urls.defaults import patterns, include, url
from settings import MEDIA_ROOT

urlpatterns = patterns(
    '',
    url(r'^$', 'nivls_website.views.about', name='home'),

    (r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': MEDIA_ROOT}),
)
