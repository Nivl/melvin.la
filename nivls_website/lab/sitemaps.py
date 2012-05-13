from django.conf import settings
from django.contrib.sitemaps import Sitemap
from models import Project, Tag

class ProjectSitemap(Sitemap):
    changefreq = "daily"

    def items(self):
        return Project.objects.filter(site=settings.SITE_ID)

    def location(self, obj):
        return obj.get_absolute_url()

class TagSitemap(Sitemap):
    changefreq = "daily"

    def items(self):
        return Tag.objects.all()

    def location(self, obj):
        return obj.get_absolute_url()
