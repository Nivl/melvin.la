from commons import *

#
# Social Auth
#

INSTALLED_APPS += ('social_auth',)

MIDDLEWARE_CLASSES += (
    'social_auth.middleware.SocialAuthExceptionMiddleware',
)

SOCIAL_AUTH_RAISE_EXCEPTIONS = False
TEMPLATE_CONTEXT_PROCESSORS += (
    'social_auth.context_processors.social_auth_backends',
)

SOCIAL_AUTH_COMPLETE_URL_NAME = 'socialauth_complete'
SOCIAL_AUTH_ASSOCIATE_URL_NAME = 'socialauth_associate_complete'

SOCIAL_AUTH_DEFAULT_USERNAME = 'new_social_auth_user'
SOCIAL_AUTH_EXTRA_DATA = True
SOCIAL_AUTH_EXPIRATION = 'expires'

SOCIAL_AUTH_PIPELINE = (
    'social_auth.backends.pipeline.social.social_auth_user',
    'social_auth.backends.pipeline.associate.associate_by_email',
    'social_auth.backends.pipeline.user.get_username',
    'social_auth.backends.pipeline.user.create_user',
    'social_auth.backends.pipeline.social.associate_user',
    'social_auth.backends.pipeline.social.load_extra_data',
    'social_auth.backends.pipeline.user.update_user_details',
    'user_profile.pipelines.get_extra_data',
)

AUTHENTICATION_BACKENDS += (
    'social_auth.backends.twitter.TwitterBackend',
    'social_auth.backends.google.GoogleOAuth2Backend',
    'social_auth.backends.contrib.github.GithubBackend',
    'social_auth.backends.facebook.FacebookBackend',
)

#
# Debug toolbar
#

#INSTALLED_APPS = ('debug_toolbar',)

INTERNAL_IPS = ('127.0.0.1',)

DEBUG_TOOLBAR_CONFIG = {
    'INTERCEPT_REDIRECTS': False,
}

MIDDLEWARE_CLASSES += (
    #    'debug_toolbar.middleware.DebugToolbarMiddleware',
)


#
# Johnny cache
#

MIDDLEWARE_CLASSES = (
    'johnny.middleware.LocalStoreClearMiddleware',
    'johnny.middleware.QueryCacheMiddleware',
) + MIDDLEWARE_CLASSES


CACHES = {
    'default': dict(BACKEND='johnny.backends.memcached.MemcachedCache',
                    LOCATION=['127.0.0.1:11211'],
                    JOHNNY_CACHE=True,
                    )
}

JOHNNY_MIDDLEWARE_KEY_PREFIX = 'jc_nivls_website'

#
# Django pipeline
#

INSTALLED_APPS += ('pipeline',)

PIPELINE_COMPILERS = (
    'pipeline.compilers.less.LessCompiler',
)

PIPELINE_LESS_ARGUMENTS = '-x'

STATICFILES_STORAGE = 'pipeline.storage.PipelineCachedStorage'

PIPELINE_JS = {
    'assets': {'source_filenames': ('django_js_utils.js',
                                    'js/*.js',
                                    'bootstrap/js/bootstrap.min.js',
                                    'commons/js/libs/*.js',
                                    'commons/js/plugins/*.js',
                                    ),
               'output_filename': 'commons/compiled/assets.js',
               },

    'main': {'source_filenames': ('commons/js/app/misc/utils/*.js',
                                  'commons/js/app/misc/funcs/*.js',
                                  'commons/js/app/misc/preview.js',
                                  'commons/js/app/misc/reload.js',

                                  'commons/js/app/ajax/utils.js',
                                  'commons/js/app/ajax/forms.js',

                                  'commons/js/app/live_edit/utils.js',
                                  'commons/js/app/live_edit/events.js',
                                  'commons/js/app/live_edit/live_edit.js',
                                  'commons/js/app/live_edit/editable_elements.js',

                                  'commons/js/app/history/utils/*.js',
                                  'commons/js/app/history/funcs/*.js',
                                  'commons/js/app/history/*.js',

                                  'commons/js/app/*.js',
                                  ),
             'output_filename': 'commons/compiled/scripts.js',
             },
}

PIPELINE_CSS = {
    'assets': {'source_filenames': ('bootstrap/css/bootstrap.min.css',
                                    'commons/css/libs/*.css',
                                    'commons/css/plugins/*.css',
                                    ),
               'output_filename': 'commons/compiled/assets.css',
               'variant': 'datauri',
               },

    'main': {'source_filenames': ('commons/css/app/main.less',
                                  'commons/css/app/Markdown.Editor.less',
                                  'commons/css/responsive/main-responsive.less',
                                  ),
             'output_filename': 'commons/compiled/styles.css',
             'variant': 'datauri',
             },

    'wkhtml2pdf': {'source_filenames': ('commons/css/libs/*.css',
                                        'commons/css/plugins/*.css',
                                        'commons/css/app/main.less',
                                        ),
                   'output_filename': 'commons/compiled/wkhtml2pdf.css',
                   },

    'error': {'source_filenames': ('commons/css/libs/bootstrap.min.css',
                                   'commons/css/app/error.less',
                                   'commons/css/responsive/bootstrap-responsive.min.css',
                                   ),
              'output_filename': 'commons/compiled/error.css',
              'variant': 'datauri',
              },
}

PIPELINE = not DEBUG
PIPELINE_DISABLE_WRAPPER = True


#
# Haystack
#

INSTALLED_APPS += ('haystack',)

HAYSTACK_SITECONF = 'nivls_website.search_sites'
HAYSTACK_SEARCH_ENGINE = 'whoosh'

HAYSTACK_WHOOSH_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__),
                                                    '..',
                                                    '..',
                                                    '..',
                                                    'whoosh_index'))

#
# Hamlpy
#

HAMLPY_ATTR_WRAPPER = '"'

if not DEBUG:
    TEMPLATE_LOADERS = (
        ('django.template.loaders.cached.Loader', (
            'hamlpy.template.loaders.HamlPyFilesystemLoader',
            'hamlpy.template.loaders.HamlPyAppDirectoriesLoader',
            )),
        ) + TEMPLATE_LOADERS
else:
    TEMPLATE_LOADERS = (
        'hamlpy.template.loaders.HamlPyFilesystemLoader',
        'hamlpy.template.loaders.HamlPyAppDirectoriesLoader',
        ) + TEMPLATE_LOADERS

#
# Others
#

INSTALLED_APPS += (
    'bootstrapform',
    'captcha',
    'django_js_utils',
    'south',
    'haystack',
)
