# -*- coding: utf-8 -*-

from django.conf.urls.defaults import *
from nivls_website.blog.models import Entry
from django.views.generic      import date_based
from nivls_website.blog.feeds  import *


urlpatterns = patterns('',
# Categories
    (r'^categories/(?P<slug>[\w-]+)/(page-(?P<page>[0-9]+))?$',
     'nivls_website.blog.views.entry_list_by_cat'),
# Tags
    (r'^tags/(?P<slug>[\w-]+)/(page-(?P<page>[0-9]+))?$',
     'nivls_website.blog.views.entry_list_by_tag'),
# Entries
    (url(r'^(page-(?P<page>[0-9]+))?$', 'nivls_website.blog.views.entry_list',
         name='blog')),
    (r'^(?P<year>\d{4})/(?P<month>\d{2})/(?P<day>\d{2})/(?P<slug>[\w-]+)$',
         'nivls_website.blog.views.entry_detail'),
# Feeds
    (r'^feeds/lastest_entries/$', LastestEntriesFeed()),
# Contact
    (url(r'^contact/$',
         'nivls_website.blog.views.contact',
         name='blog-contact')),
# Year
    (url(r'^archives/(?P<year>\d{4})/(page-(?P<page>\d+))?$',
         'nivls_website.blog.views.archive',
         name='blog-archive-year')),
    (url(r'^archives/(?P<year>\d{4})/(?P<month>\d{2})/(page-(?P<page>\d+))?$',
         'nivls_website.blog.views.archive',
         name='blog-archive-month')),
)

