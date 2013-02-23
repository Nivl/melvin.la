from django.conf.urls.defaults import patterns, include, url
from django.contrib.auth.views import password_reset, password_reset_done
from django.contrib.auth.views import password_reset_complete

urlpatterns = patterns(
    'user_profile.views',

    url(r'^sign-in/$',
        'sign_in',
        name='sign-in'),

    url(r'^sign-in/fail/$',
        'sign_in_failed',
        name='sign-in-failed'),

    url(r'^sign-up/$',
        'sign_up',
        name='sign-up'),

    url(r'^activate/(?P<code>[a-f0-9]{8}-'
        '[a-f0-9]{4}-4[a-f0-9]{3}-'
        '[89ab][a-f0-9]{3}-'
        '[a-f0-9]{12})/$',
        'activate_account',
        name='activate-account'),

    url(r'^reset-password/confirm/(?P<uidb36>[0-9A-Za-z]+)-(?P<token>.+)/$',
        'my_password_reset_confirm',
        name='reset-password-confirm'),

    url(r'^view/(?P<name>[\w.@+-]+)/$',
        'view_account',
        name='view-account'),

    url(r'^edit/$',
        'edit_account',
        name='edit-account'),

    url(r'^edit-picture/$',
        'edit_picture',
        name='edit-picture'),

    url(r'^edit-picture/thumbnail/$',
        'edit_avatar',
        name='edit-avatar'),

    url(r'^manage-social-account/$',
        'manage_social_account',
        name='manage-social-account'),
)


urlpatterns += patterns(
    'user_profile.views.ajax',

    url(r'^sign-up/form/$',
        'sign_up_form',
        name='sign-up-form'),

    url(r'^reset-password/confirm/form/'
        '(?P<uidb36>[0-9A-Za-z]+)-(?P<token>.+)/$',
        'my_password_reset_confirm_form',
        name='reset-password-confirm-form'),

    url(r'^edit/password/form/$',
        'edit_password_form',
        name='edit-password-form'),

    url(r'^edit/email/form/$',
        'edit_email_form',
        name='edit-email-form'),

    url(r'^edit/profile/form/$',
        'edit_account_form',
        name='edit-account-form'),

    url(r'^edit/settings/form/$',
        'edit_settings_form',
        name='edit-settings-form'),

    url(r'^edit-picture/dropped-picture/$',
        'handle_dropped_picture',
        name='handle_dropped_picture'),

    url(r'^edit-picture/form/$',
        'edit_picture_form',
        name='edit-picture-form'),

    url(r'^edit-picture/thumbnail/form/$',
        'edit_avatar_form',
        name='edit-avatar-form'),
)


reset_password_opt = {
    'email_template_name': 'users/inc/password_reset_email.html',
    'subject_template_name': 'users/inc/password_reset_subject.txt',
}


urlpatterns += patterns(
    '',

    url(r'^sign-out/$', 'django.contrib.auth.views.logout',
        {'next_page': '/'},
        name='sign-out'),

    url(r'^reset-password/$',
        password_reset,
        dict({'template_name': 'users/password_reset.html'}.items() +
             reset_password_opt.items()),
        name='reset-password'),

    url(r'^reset-password/form/$',
        password_reset,
        dict({'template_name': 'users/ajax/password_reset_form.html'}.items() +
             reset_password_opt.items()),
        name='reset-password-form'),

    url(r'^reset-password/done/$',
        password_reset_done,
        {'template_name': 'users/ajax/password_reset_done.html'},
        name='reset-password-done'),

    url(r'^reset-password/confirm/done/$',
        password_reset_complete,
        {'template_name': 'users/ajax/password_confirm_done.html'},
        name='password_reset_complete'),

    url(r'^social/', include('social_auth.urls')),
)
