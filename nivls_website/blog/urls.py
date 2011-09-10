from django.conf.urls.defaults import patterns, include, url

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
        'nivls_website.blog.views.post',
        name='post'),

    url(r'^category/(?P<slug>[-\w]+)/$',
        'nivls_website.blog.views.post_list_by_categories',
        name='category'),

    url(r'^tag/(?P<slug>[-\w]+)/$',
        'nivls_website.blog.views.post_list_by_tags',
        name='tag'),

    url(r'^comments/', include('django.contrib.comments.urls')),
)
