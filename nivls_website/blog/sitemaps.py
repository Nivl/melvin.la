from django.conf import settings
from django.contrib.sitemaps import Sitemap
from models import Post

class PostSitemap(Sitemap):
    changefreq = "daily"

    def items(self):
        return Post.objects.filter(is_public=1, site=settings.SITE_ID)

    def lastmod(self, obj):
        return obj.edit_date

    def location(self, obj):
        return obj.get_absolute_url()
