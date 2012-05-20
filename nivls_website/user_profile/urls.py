from django.conf.urls.defaults import patterns, include, url
from forms import UserProfile

urlpatterns = patterns(
    'user_profile.views',

    url(r'^view/$', 'view_account'
        , name='view-account'),
    url(r'^edit/$', 'edit_account'
        , name='edit-account'),
    url(r'^manage-social-account/$', 'manage_social_account'
        , name='manage-social-account'),

    url(r'^sign-in/$', 'sign_in', name='sign-in'),
    url(r'^sign-up/$', 'sign_up', name='sign-up'),

    url(r'social/', include('social_auth.urls')),
    )

urlpatterns += patterns(
    '',
    url(r'^sign-out/$', 'django.contrib.auth.views.logout'
        , {'next_page': '/'}, name='sign-out'),
    )
