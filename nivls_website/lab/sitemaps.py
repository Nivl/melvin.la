from django.conf import settings
from django.contrib.sitemaps import Sitemap
from models import Project

class ProjectSitemap(Sitemap):
    changefreq = "daily"

    def items(self):
        return Project.objects.all()

    def location(self, obj):
        return obj.get_absolute_url()
