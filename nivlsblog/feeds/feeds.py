# -*- coding: utf-8 -*-

from django.contrib.syndication.views   import Feed
from nivlsblog.entries.models           import Entry
from markdown                           import markdown
from django.template.defaultfilters     import truncatewords_html


class LastestEntriesFeed(Feed):
    title       = 'Nivl’s blog last entries'
    link        = '/'
    description = 'Nivl’s blog last entries'

    def items(self):
        return Entry.objects.order_by('-date')[:10]
    def item_title(self, item):
        return item.title
    def item_description(self, item):
        return truncatewords_html(markdown(item.content,
                                           ['safe', 'codehilite']),
                                  100)
