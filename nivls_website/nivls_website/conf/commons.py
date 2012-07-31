# -*- coding: utf-8 -*-
import os
from nivls_website.conf.private import *

AUTH_PROFILE_MODULE = 'user_profile.UserProfile'
DEFAULT_FILE_STORAGE = "commons.storage.UniqueFileSystemStorage"

ROOT_URLCONF = 'nivls_website.urls'
LOGIN_REDIRECT_URL = '/'
LOGIN_ERROR_URL = '/accounts/sign-in/fail/'
LOGIN_URL = '/accounts/sign-in/'
ABSOLUTE_URL_OVERRIDES = {
    'auth.user': lambda o: "/accounts/view/%s/" % o.username,
}

LOCALE_PATHS = (
    os.path.abspath(os.path.join(os.path.dirname(__file__),
                                 "..",
                                 "..",
                                 "locale")),
)

SESSION_COOKIE_DOMAIN = '.' + DOMAIN_NAME
MAX_UPLOAD_SIZE = 5242880
MANAGERS = ADMINS

USE_TZ = True
TIME_ZONE = 'America/Los_Angeles'
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
ADMIN_MEDIA_PREFIX = STATIC_URL + "admin/"  # rm when 1.4

ALLOWED_INCLUDE_ROOTS = (STATIC_ROOT + '/commons/css/',
                         STATIC_ROOT + '/commons/compiled/')

STATICFILES_DIRS = (
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "static")),
)

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    #'django.contrib.staticfiles.finders.DefaultStorageFinder',
)

TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
    #'django.template.loaders.eggs.Loader',
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
)

MIDDLEWARE_CLASSES = (
    'django.middleware.gzip.GZipMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'logger.middleware.LoggerMiddleware',
    'nivls_website.middleware.Http405Middleware',
)

TEMPLATE_DIRS = (
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "templates"))
)

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
)

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
)

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
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
