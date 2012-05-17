from django.conf.urls.defaults import patterns, include, url
from django.views.generic.simple import direct_to_template
from django.contrib import admin
from commons.views import TexplainView

from blog.urls import sitemaps as smap_blog
from about.urls import sitemaps as smap_about
from lab.urls import sitemaps as smap_lab

admin.autodiscover()

urlpatterns = patterns(
    '',
    url(r'^lab/', include('lab.urls')),
    url(r'^blog/', include('blog.urls')),
    url(r'^admin/', include(admin.site.urls)),

    url(r'^accounts/view/$', 'nivls_website.views.view_account'
        , name='view-account'),
    url(r'^accounts/edit/$', 'nivls_website.views.edit_account'
        , name='edit-account'),
    url(r'^accounts/manage-social-account/$', 'nivls_website.views.manage_social_account'
        , name='manage-social-account'),
    url(r'^accounts/signin/$', 'nivls_website.views.signin', name='signin'),
    url(r'^accounts/signup/$', 'nivls_website.views.signup'
        , {'template_name': 'blog/signup.html'}
        , name='signup'),
    url(r'^accounts/signout/$', 'django.contrib.auth.views.logout'
        , {'next_page': '/'}, name='signout'),

    url(r'account/social/', include('social_auth.urls')),

    url(r'', include('about.urls')),
    )

sitemaps = dict(smap_about.items() + smap_blog.items() + smap_lab.items())

urlpatterns += patterns(
    'django.contrib.sitemaps.views',
    url(r'^sitemap\.xml$', 'sitemap', {'sitemaps': sitemaps}, name="sitemap"),

    url(r'^robots.txt$', TexplainView.as_view(template_name='robots.txt')),
    url(r'^humans.txt$', TexplainView.as_view(template_name='humans.txt')),
    )

js_info_dict = {
    'packages': ('lab',),
}

urlpatterns += patterns('',
    (r'^jsi18n/$', 'django.views.i18n.javascript_catalog', js_info_dict),
)
