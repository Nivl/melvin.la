from django.conf import settings
from django.contrib.sitemaps import Sitemap

class StaticSitemap(Sitemap):
    changefreq = "monthly"
    pattern = list()

    def __init__(self, patterns):
        self.patterns = patterns

    def items(self):
        return  [p.name for p in self.patterns]

    def location(self, obj):
        return "/%s/" % obj

