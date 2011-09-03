from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns(
    '',
    url(r'^$', 'nivls_website.blog.views.home',
        name='home'),

    url(r'^((?P<year>\d{4})(/(?P<month>\d{2})(/(?P<day>\d{2}))?)?)/(page-(?P<page>[1-9]+)/)?$',
        'nivls_website.blog.views.post_list_by_archives',
        name='archives'),

    url(r'^(?P<year>\d{4})/(?P<month>\d{2})/(?P<day>\d{2})/(?P<slug>[-w]+)/$',
        'nivls_website.blog.views.post',
        name='post'),

    url(r'^categories/(?P<slug>[-w]+)/(page-(?P<page>\d+)/)?$',
        'nivls_website.blog.views.post_list_by_categories',
        name='category'),

    url(r'^tags/(?P<slug>[-w]+)/(page-(?P<page>\d+)/)?$',
        'nivls_website.blog.views.post_list_by_tags',
        name='tag'),
)
