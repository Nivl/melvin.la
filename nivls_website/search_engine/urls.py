from django.conf import settings
from django.conf.urls.defaults import patterns, url
from haystack.query import SearchQuerySet
from haystack.views import search_view_factory
from forms import AjaxSearchForm

urlpatterns = patterns(
    'search_engine.views',

    url(r'^autocomplete/$',
        'autocomplete',
        name="autocomplete"),

    url(r'^update-typeahead/$',
        'update_typeahead',
        name='update-typeahead'),

    url(r'^search/$',
        search_view_factory(
            form_class=AjaxSearchForm,
            searchqueryset=SearchQuerySet().filter(site_id=settings.SITE_ID),
            template='search/search.haml'),
        name='haystack_search'),
)
