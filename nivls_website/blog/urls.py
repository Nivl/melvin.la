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

    url(r'^accounts/login/$', 'django.contrib.auth.views.login',
        {'template_name': 'blog/login.html'}, name='login'),

    url(r'^comments/', include('django.contrib.comments.urls')),
)


# Static which wiil be added to the sitemap
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
    'blog_post': PostSitemap,
    'blog_static': StaticSitemap(static_urlpatterns),
    }

urlpatterns += static_urlpatterns + feeds_urlpatterns
