from django.utils.translation import ugettext as _
from django.shortcuts import get_object_or_404
from django.contrib.syndication.views import Feed
from models import Post, Tag, Category
from django.conf import settings
from django.utils.feedgenerator import Atom1Feed
import markdown


class LatestPostFeed(Feed):
    title = _("%(sitename)s - Latest posts") % {'sitename': settings.BRAND_NAME}
    link = "/"
    description = _("List of the latest posts")

    def items(self):
        return Post.objects.filter(site=settings.SITE_ID) \
                           .order_by("-pub_date")[:10]

    def item_title(self, item):
        return item.title

    def item_link(self, item):
        return item.get_absolute_url()

    def item_description(self, item):
        return markdown.markdown(item.parsed_content())


class TagFeed(LatestPostFeed):
    def get_object(self, request, slug):
        return get_object_or_404(Tag, slug=slug, site=settings.SITE_ID)

    def title(self, obj):
        return _("%(sitename)s - Tag: %(name)s") \
            % {'name': obj.name,
               'sitename': settings.BRAND_NAME}

    def description(self, obj):
        return _("Latest posts for the tag '%(name)s'") % {'name': obj.name}

    def link(self, obj):
        return obj.get_absolute_url()

    def items(self, obj):
        return Post.objects.filter(site=settings.SITE_ID,
                                   tags=obj) \
                   .order_by("-pub_date")[:10]


class CatFeed(LatestPostFeed):
    def get_object(self, request, slug):
        return get_object_or_404(Category, slug=slug, site=settings.SITE_ID)

    def title(self, obj):
        return _("%(sitename)s - Category: %(name)s") \
            % {'name': obj.name,
               'sitename': settings.BRAND_NAME}

    def description(self, obj):
        return _("Latest posts for the category '%(name)s'") \
            % {'name': obj.name}

    def link(self, obj):
        return obj.get_absolute_url()

    def items(self, obj):
        return Post.objects.filter(site=settings.SITE_ID,
                                   category=obj) \
                   .order_by("-pub_date")[:10]


### ATOM

class LatestPostFeedAtom(LatestPostFeed):
    feed_type = Atom1Feed
    subtitle = LatestPostFeed.description


class TagFeedAtom(LatestPostFeedAtom, TagFeed):
    pass


class CatFeedAtom(LatestPostFeedAtom, CatFeed):
    pass
