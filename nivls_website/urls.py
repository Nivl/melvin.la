from django.conf.urls.defaults import patterns, include, url
from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'nivls_website.views.home', name='home'),
    # url(r'^nivls_website/', include('nivls_website.foo.urls')),

    url(r'^admin/', include(admin.site.urls)),
)
