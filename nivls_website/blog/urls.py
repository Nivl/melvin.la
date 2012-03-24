from django.conf.urls.defaults import patterns, include, url
from django.views.generic.simple import redirect_to
from feeds import *
from sitemaps import *

urlpatterns = patterns(
    '',
    url(r'^$', 'nivls_website.blog.views.home',
        name='blog'),

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

    url(r'^comments/', include('django.contrib.comments.urls')),
)


# Static which wiil be added to the sitemap
static_urlpatterns = patterns(
    '',
    url(r'^contact/$', 'nivls_website.blog.views.contact', name='contact'),
    )


feeds_urlpatterns = patterns(
    '',
    url(r'^feed/latest/rss/$', LatestPostFeed(), name="rss-blog-latest"),
    url(r'^tag/(?P<slug>[-\w]+)/rss/$', TagFeed(), name="rss-blog-tag-latest"),
    url(r'^category/(?P<slug>[-\w]+)/rss/$', CatFeed(), name="rss-blog-category-latest"),

    url(r'^feed/latest/atom/$', LatestPostFeedAtom(), name="atom-blog-latest"),
    url(r'^tag/(?P<slug>[-\w]+)/atom/$', TagFeedAtom(), name="atom-blog-tag-latest"),
    url(r'^category/(?P<slug>[-\w]+)/atom/$', CatFeedAtom(), name="atom-blog-category-latest"),
    )

sitemaps = {
    'blog_post': PostSitemap,
    'blog_static': StaticSitemap(static_urlpatterns),
    }

urlpatterns += static_urlpatterns + feeds_urlpatterns
