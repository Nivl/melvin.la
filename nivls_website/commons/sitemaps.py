from django.contrib.sitemaps import Sitemap

class StaticSitemap(Sitemap):
    changefreq = "monthly"
    pattern = list()

    def __init__(self, patterns, changefreq="monthly"):
        self.patterns = patterns
        self.changefreq = changefreq

    def items(self):
        return  [p.name for p in self.patterns]

    def location(self, obj):
        return "/%s/" % obj
