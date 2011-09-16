from django.contrib.sitemaps import Sitemap

class FullUrlSitemap(Sitemap):
    def __get(self, name, obj, default=None):
        try:
            attr = getattr(self, name)
        except AttributeError:
            return default
        if callable(attr):
            return attr(obj)
        return attr

    def get_urls(self, page=1, site=None):
        urls = []
        for item in self.paginator.page(page).object_list:
            loc = self.__get('location', item)
            priority = self.__get('priority', item, None)
            url_info = {
                'location':   loc,
                'lastmod':    self.__get('lastmod', item, None),
                'changefreq': self.__get('changefreq', item, None),
                'priority':   str(priority is not None and priority or '')
            }
            urls.append(url_info)
        return urls
