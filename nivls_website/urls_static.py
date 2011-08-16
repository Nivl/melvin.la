from django.conf.urls.defaults import patterns, include, url
from settings import STATIC_ROOT

urlpatterns = patterns(
    'django.contrib.staticfiles.views',
    (r'^(?P<path>.*)$', 'serve'),
    )
