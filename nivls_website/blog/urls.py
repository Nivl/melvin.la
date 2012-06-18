from django.conf.urls.defaults import patterns, include, url
from django.views.generic.simple import redirect_to
from feeds import *
from sitemaps import *

post_r = '(?P<year>\d{4})/(?P<month>\d{2})/(?P<day>\d{2})/(?P<slug>[-\w]+)'

urlpatterns = patterns(
    'blog.views',
    url(r'^$', 'home',
        name='blog'),

    url(r'^(?P<year>\d{4})/$',
        'post_list_by_archives',
        name='archives-year'),

    url(r'^(?P<year>\d{4})/(?P<month>\d{2})/$',
        'post_list_by_archives',
        name='archives-month'),

    url(r'^(?P<year>\d{4})/(?P<month>\d{2})/(?P<day>\d{2})/$',
        'post_list_by_archives',
        name='archives-day'),

    url(r'^%s/$' % post_r,
        'display_post',
        name='post'),

    url(r"^%s/comments/list/$" % post_r,
        'comment_list',
        name='post-comment-list'),

    url(r"^%s/comments/form/$" % post_r,
        'comment_form',
        name='post-comment-form'),

    url(r"^%s/comments/count/$" % post_r,
        'comment_count',
        name='post-comment-count'),

    url(r"^%s/comments/get/(?P<pk>\d+)/$" % post_r,
        'comment_single',
        name='post-comment-single'),

    url(r"^%s/comments/get/(?P<pk>\d+)/form/$" % post_r,
        'comment_single_form',
        name='post-comment-single-form'),

    url(r'^preview/'
        '(?P<year>\d{4})/(?P<month>\d{2})/(?P<day>\d{2})/(?P<slug>[-\w]+)/$',
        'preview_post',
        name='preview-post'),

    url(r'^category/(?P<slug>[-\w]+)/$',
        'post_list_by_categories',
        name='category'),

    url(r'^tag/(?P<slug>[-\w]+)/$',
        'post_list_by_tags',
        name='tag'),

    url(r'^contact/form/$',
        'contact_form',
        name='contact-form'),
)

# Static which will be added to the sitemap
static_urlpatterns = patterns(
    '',
    url(r'^contact/$',
        'blog.views.contact',
        name='contact'),
    )


feeds_urlpatterns = patterns(
    '',
    url(r'^feed/latest/rss/$',
        LatestPostFeed(),
        name="rss-blog-latest"),
    url(r'^tag/(?P<slug>[-\w]+)/rss/$',
        TagFeed(),
        name="rss-blog-tag-latest"),
    url(r'^category/(?P<slug>[-\w]+)/rss/$',
        CatFeed(),
        name="rss-blog-category-latest"),

    url(r'^feed/latest/atom/$',
        LatestPostFeedAtom(),
        name="atom-blog-latest"),
    url(r'^tag/(?P<slug>[-\w]+)/atom/$',
        TagFeedAtom(),
        name="atom-blog-tag-latest"),
    url(r'^category/(?P<slug>[-\w]+)/atom/$',
        CatFeedAtom(),
        name="atom-blog-category-latest"),
    )

sitemaps = {
    'blog_post': PostSitemap,
    'blog_static': StaticSitemap(static_urlpatterns),
    }

urlpatterns += static_urlpatterns + feeds_urlpatterns
