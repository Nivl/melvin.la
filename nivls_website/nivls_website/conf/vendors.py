from django.core.urlresolvers import reverse_lazy
from nivls_website.conf.commons import *

#
# Social Auth
#

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

INSTALLED_APPS += (
    'pipeline',
)

PIPELINE_COMPILERS = (
    'pipeline.compilers.less.LessCompiler',
)

MIDDLEWARE_CLASSES += (
    'pipeline.middleware.MinifyHTMLMiddleware',
)

STATICFILES_STORAGE = 'pipeline.storage.PipelineCachedStorage'

PIPELINE_JS = {
    'main': {'source_filenames': ('django_js_utils.js',
                                  'js/*.js',
                                  'commons/js/0/*.js',
                                  'commons/js/10/*.js',
                                  'commons/js/20/*.js',
                                  'commons/js/30/*.js',
                                  'commons/js/40/*.js',
                                  ),
             'output_filename': 'commons/compiled/scripts.js',
             },
    }

PIPELINE_CSS = {
    'main': {'source_filenames': ('commons/css/0/*.css',
                                  'commons/css/10/*.css',
                                  'commons/css/20/*.less',
                                  'commons/css/30/*.css',
                                  ),
             'output_filename': 'commons/compiled/styles.css',
             'variant': 'datauri',
             },
}

PIPELINE = True
PIPELINE_DISABLE_WRAPPER = True
