from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns('search_engine.views',

                       url(r'^autocomplete/$',
                           'autocomplete',
                           name="autocomplete"),

                       url(r'^search/',
                           include('haystack.urls')),
)
