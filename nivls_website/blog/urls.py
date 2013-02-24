from django.conf.urls.defaults import patterns, url
from feeds import *
from sitemaps import *
from commons.sitemaps import StaticSitemap
from commons.urls import live_edit_url

post_r = '(?P<year>\d{4})/(?P<month>\d{2})/(?P<day>\d{2})/(?P<slug>[-\w]+)'

static_urlpatterns = patterns(
    'blog.views',
    url(r'^$', 'home',
        name='blog'),
)

urlpatterns = patterns(
    'blog.views',

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

    url(r'^category/(?P<slug>[-\w]+)/$',
        'post_list_by_categories',
        name='category'),

    url(r'^tag/(?P<slug>[-\w]+)/$',
        'post_list_by_tags',
        name='tag'),
)

urlpatterns += patterns(
    'blog.views.ajax',

    url(r"^get/%s/comment/list/$" % post_r,
        'comment_list',
        name='post-comment-list'),

    url(r"^get/%s/comment/form/$" % post_r,
        'comment_form',
        name='post-comment-form'),

    url(r"^get/%s/comment/count/$" % post_r,
        'comment_count',
        name='post-comment-count'),

    url(r"^get/%s/comment/get/(?P<pk>\d+)/$" % post_r,
        'comment_single',
        name='post-comment-single'),

    url(r"^get/%s/comment/get/(?P<pk>\d+)/form/$" % post_r,
        'comment_single_form',
        name='post-comment-single-form'),
)


urlpatterns += live_edit_url('blog', 'post', 'title')
urlpatterns += live_edit_url('blog', 'post', 'is_public')
urlpatterns += live_edit_url('blog', 'post', 'parsed_content')
urlpatterns += live_edit_url('blog', 'post', 'category')

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
    'blog_static': StaticSitemap(static_urlpatterns, changefreq='daily'),
    'blog_post': PostSitemap,
}
urlpatterns += static_urlpatterns + feeds_urlpatterns
