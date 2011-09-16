from django.conf import settings
from commons.sitemaps import FullUrlSitemap
from models import Post

class PostSitemap(FullUrlSitemap):
    changefreq = "monthly"

    def items(self):
        return Post.objects.filter(is_public=1)

    def lastmod(self, obj):
        return obj.edit_date

    def location(self, obj):
        return "http://blog.%s%s" % (settings.DOMAIN_NAME, obj.get_absolute_url())

class StaticSitemap(FullUrlSitemap):
    changefreq = "never"
    pattern = list()

    def __init__(self, patterns):
        self.patterns = patterns

    def items(self):
        return  [p.name for p in self.patterns]

    def location(self, obj):
        return "http://blog.%s/%s/" % (settings.DOMAIN_NAME, obj)

