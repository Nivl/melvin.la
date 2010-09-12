# -*- coding: utf-8 -*-

from django.conf.urls.defaults   import *
from django.contrib              import admin
from django.conf                 import settings
from django.views.generic.simple import redirect_to

admin.autodiscover()

urlpatterns = patterns('',
    (r'^admin/', include(admin.site.urls)),
    (r'^blog/', include('nivls_website.blog.urls')),
    (r'^$', redirect_to, {'url': '/blog', 'permanent': False})
)


if settings.DEBUG:
    urlpatterns += patterns('',
                            (r'^media/(?P<path>.*)$',
                             'django.views.static.serve',
                             {'document_root': settings.MEDIA_ROOT}),
    )
