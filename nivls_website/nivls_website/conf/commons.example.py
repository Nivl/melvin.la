# -*- coding: utf-8 -*-
import os

DEBUG = True
TEMPLATE_DEBUG = DEBUG
SOCIAL_AUTH_RAISE_EXCEPTIONS = DEBUG

ABSOLUTE_URL_OVERRIDES = {
    'auth.user': lambda o: "/accounts/view/%s/" % o.username,
    }

EMAIL_SUBJECT_PREFIX = "[Nivl's website] "
DOMAIN_NAME = 'localhost:8000'
SESSION_COOKIE_DOMAIN = '.' + DOMAIN_NAME
EMAIL_NO_REPLY = 'no-reply@' + DOMAIN_NAME
DEFAULT_FROM_EMAIL = EMAIL_NO_REPLY
ROOT_URLCONF = 'nivls_website.urls'

# 2.5MB - 2621440
# 5MB - 5242880
# 10MB - 10485760
# 20MB - 20971520
# 50MB - 5242880
# 100MB 104857600
# 250MB - 214958080
# 500MB - 429916160

MAX_UPLOAD_SIZE = 10485760 # For custom form only. The admin is limited  by the server

INTERNAL_IPS = ('127.0.0.1',)

DEBUG_TOOLBAR_CONFIG = {
    'INTERCEPT_REDIRECTS': False,
    }

ADMINS = (
    ('admin', 'name@domain.tld'),
)

MANAGERS = ADMINS

AKISMET_API_KEY = "PUT_YOUR_KEY_HERE" # http://akismet.com/get/

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': '',
        'USER': '',
        'PASSWORD': '',
        'HOST': '',
        'PORT': '',
    }
}

USE_TZ = True
TIME_ZONE = 'America/Chicago'
LANGUAGE_CODE = 'en'
DATE_FORMAT = 'F, d Y'
TIME_FORMAT = 'P'
USE_I18N = True
USE_L10N = True

MEDIA_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__),
                                          "..",
                                          "..",
                                          "..",
                                          "media"))
MEDIA_URL = 'http://media.' + DOMAIN_NAME + '/'

STATIC_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__),
                                           "..",
                                           "..",
                                           "..",
                                           "static"))
STATIC_URL = 'http://static.' + DOMAIN_NAME + '/'

ALLOWED_INCLUDE_ROOTS = (STATIC_ROOT + '/commons/css/',
                         STATIC_ROOT + '/about/css/')

STATICFILES_DIRS = (
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "static")),
)

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
#    'django.contrib.staticfiles.finders.DefaultStorageFinder',
)

SECRET_KEY = 'dtfgyu&^*(){:"56433RDTF90po;luhsau'

TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.contrib.auth.context_processors.auth',
    'django.core.context_processors.debug',
    'django.core.context_processors.request',
    'django.core.context_processors.i18n',
    'django.core.context_processors.media',
    'django.core.context_processors.static',
    'django.contrib.messages.context_processors.messages',
    'nivls_website.context_processors.static_root',
    'nivls_website.context_processors.domain_name',
    'social_auth.context_processors.social_auth_backends',
    )

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'logger.middleware.LoggerMiddleware',
    #'debug_toolbar.middleware.DebugToolbarMiddleware',
)

TEMPLATE_DIRS = (
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "templates"))
)

LOGIN_REDIRECT_URL = '/'
LOGIN_ERROR_URL = '/accounts/sign-in/fail/'
LOGIN_URL = '/accounts/sign-in/'

SOCIAL_AUTH_COMPLETE_URL_NAME  = 'socialauth_complete'
SOCIAL_AUTH_ASSOCIATE_URL_NAME = 'socialauth_associate_complete'

SOCIAL_AUTH_DEFAULT_USERNAME = 'new_social_auth_user'
SOCIAL_AUTH_EXTRA_DATA = False
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

AUTHENTIFICATION_BACKENDS = (
    'social_auth.backends.twitter.TwitterBackend',
    'social_auth.backends.facebook.FacebookBackend',
    'social_auth.backends.google.GoogleOAuth2Backend',
    'social_auth.backends.contrib.github.GithubBackend',
    'django.contrib.auth.backends.ModelBackend',
    )

TWITTER_CONSUMER_KEY         = ''
TWITTER_CONSUMER_SECRET      = ''
FACEBOOK_APP_ID              = ''
FACEBOOK_API_SECRET          = ''
FACEBOOK_EXTENDED_PERMISSIONS = ['email']
GOOGLE_OAUTH2_CLIENT_ID      = ''
GOOGLE_OAUTH2_CLIENT_SECRET  = ''
GOOGLE_OAUTH2_EXTRA_DATA     = [('id', 'id')]
GITHUB_APP_ID                = ''
GITHUB_API_SECRET            = ''

INSTALLED_APPS = (
    'django.contrib.markup',
    'django.contrib.humanize',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sitemaps',
    'django.contrib.admin',
#    'debug_toolbar',
    'bootstrap',
    'bootstrapform',
    'social_auth',
    'captcha',
    'django_js_utils',
)

AUTH_PROFILE_MODULE = 'user_profile.UserProfile'
DEFAULT_FILE_STORAGE = "commons.storage.UniqueFileSystemStorage"

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}
