from django.shortcuts import get_object_or_404
from django.contrib.syndication.views import Feed
from models import Post, Tag, Category
from django.conf import settings
from django.utils.feedgenerator import Atom1Feed
import markdown

class LatestPostFeed(Feed):
    title = "Laplanche-melv.in last post"
    link = "/"
    description  = "blabla"

    def items(self):
        return Post.objects.order_by("-pub_date")[:10]

    def item_title(self, item):
        return item.title

    def item_link(self, item):
        return "http://blog." + settings.DOMAIN_NAME + item.get_absolute_url()

    def item_description(self, item):
        return markdown.markdown(item.parsed_content())


class TagFeed(LatestPostFeed):
    def get_object(self, request, slug):
        return get_object_or_404(Tag, slug=slug)

    def title(self, obj):
        return "Laplanche-melv.in - Tag: %s" % obj.name

    def description(self, obj):
        return "Latest post for the tag %s" % obj.name

    def link(self, obj):
        return obj.get_absolute_url()

    def items(self, obj):
        return Post.objects.filter(tags=obj).order_by("-pub_date")[:10]


class CatFeed(LatestPostFeed):
    def get_object(self, request, slug):
        return get_object_or_404(Category, slug=slug)

    def title(self, obj):
        return "Laplanche-melv.in - Category: %s" % obj.name

    def description(self, obj):
        return "Latest post for the category %s" % obj.name

    def link(self, obj):
        return obj.get_absolute_url()

    def items(self, obj):
        return Post.objects.filter(category=obj).order_by("-pub_date")[:10]


### ATOM

class LatestPostFeedAtom(LatestPostFeed):
    feed_type = Atom1Feed
    subtitle = LatestPostFeed.description

class TagFeedAtom(LatestPostFeedAtom, TagFeed):
    pass

class CatFeedAtom(LatestPostFeedAtom, CatFeed):
    pass
