from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns(
    'django.contrib.staticfiles.views',
    (r'^(?P<path>.*)$', 'serve'),
    )
