from django.conf.urls.defaults import patterns, include, url
from django.views.generic.simple import redirect_to
from feeds import *
from sitemaps import *

urlpatterns = patterns(
    '',
    url(r'^$', 'nivls_website.blog.views.home',
        name='home'),

    url(r'^(?P<year>\d{4})/$',
        'nivls_website.blog.views.post_list_by_archives',
        name='archives-year'),

    url(r'^(?P<year>\d{4})/(?P<month>\d{2})/$',
        'nivls_website.blog.views.post_list_by_archives',
        name='archives-month'),

    url(r'^(?P<year>\d{4})/(?P<month>\d{2})/(?P<day>\d{2})/$',
        'nivls_website.blog.views.post_list_by_archives',
        name='archives-day'),

    url(r'^(?P<year>\d{4})/(?P<month>\d{2})/(?P<day>\d{2})/(?P<slug>[-\w]+)/$',
        'nivls_website.blog.views.display_post',
        name='post'),

    url(r'^preview/'
        '(?P<year>\d{4})/(?P<month>\d{2})/(?P<day>\d{2})/(?P<slug>[-\w]+)/$',
        'nivls_website.blog.views.preview_post',
        name='preview-post'),

    url(r'^category/(?P<slug>[-\w]+)/$',
        'nivls_website.blog.views.post_list_by_categories',
        name='category'),

    url(r'^tag/(?P<slug>[-\w]+)/$',
        'nivls_website.blog.views.post_list_by_tags',
        name='tag'),

    url(r'^accounts/login/$', 'django.contrib.auth.views.login',
        {'template_name': 'blog/login.html'}, name='login'),

    url(r'^comments/', include('django.contrib.comments.urls')),
)


static_urlpatterns = patterns(
    '',
    url(r'^contact/$', 'nivls_website.blog.views.contact', name='contact'),
    )


feeds_urlpatterns = patterns(
    '',
    url(r'^feed/latest/rss/$', LatestPostFeed()),
    url(r'^tag/(?P<slug>[-\w]+)/rss/$', TagFeed()),
    url(r'^category/(?P<slug>[-\w]+)/rss/$', CatFeed()),

    url(r'^feed/latest/atom/$', LatestPostFeedAtom()),
    url(r'^tag/(?P<slug>[-\w]+)/atom/$', TagFeedAtom()),
    url(r'^category/(?P<slug>[-\w]+)/atom/$', CatFeedAtom()),
    )


sitemaps = {
    'post': PostSitemap,
    'static': StaticSitemap(static_urlpatterns),
    }


seo_urlpatterns = patterns(
    'django.contrib.sitemaps.views',
    url(r'^sitemap\.xml$', 'sitemap', {'sitemaps': sitemaps}),

    url(r'^robot.txt$', include('robots.urls')),
    )


old_urlpatterns = patterns(
    '',
    url(r'^category/contests/?$', redirect_to, {'url': '/tag/contests/'}),
    url(r'^tag/contest/?$', redirect_to, {'url': '/tag/contests/'}),
    url(r'^tag/game/?$', redirect_to, {'url': '/tag/jeux/'}),
    url(r'^tag/ecoles/?$', redirect_to, {'url': '/tag/ecole/'}),
    url(r'^tag/epitech-2/?$', redirect_to, {'url': '/category/epitech/'}),
    url(r'^tag/graphic/?$', redirect_to, {'url': '/tag/graphique/'}),
    )


urlpatterns = old_urlpatterns + urlpatterns + static_urlpatterns + feeds_urlpatterns + seo_urlpatterns
