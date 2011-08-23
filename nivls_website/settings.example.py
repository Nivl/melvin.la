import os

DEBUG = True
TEMPLATE_DEBUG = DEBUG

DOMAIN_NAME = 'localhost:8000'

INTERNAL_IPS = ('127.0.0.1',)

DEBUG_TOOLBAR_CONFIG = {
    'INTERCEPT_REDIRECTS': False,
    }

ADMINS = (
    ('admin', 'name@domain.tld'),
)

MANAGERS = ADMINS

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

TIME_ZONE = 'Europe/Paris'
LANGUAGE_CODE = 'en-us'

SITE_ID = 1

USE_I18N = False
USE_L10N = False


MEDIA_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__),
                                          "..",
                                          "media"))
MEDIA_URL = 'http://media.' + DOMAIN_NAME + '/'

STATIC_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__),
                                           "..",
                                           "static"))
STATIC_URL = 'http://static.' + DOMAIN_NAME + '/'

ADMIN_MEDIA_PREFIX = 'http://static.' + DOMAIN_NAME + '/admin/'

STATICFILES_DIRS = (
    os.path.abspath(os.path.join(os.getcwd(), "..", "static")),
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
    'django.core.context_processors.i18n',
    'django.core.context_processors.media',
    'django.core.context_processors.static',
    'django.contrib.messages.context_processors.messages',
    'nivls_website.context_processors.domain_name',
    )

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'debug_toolbar.middleware.DebugToolbarMiddleware',
    'subdomains.middleware.SubdomainURLRoutingMiddleware',
)

ROOT_URLCONF = 'nivls_website.urls'

REMOVE_WWW_FROM_SUBDOMAIN = True

SUBDOMAIN_URLCONFS = {
    None: 'nivls_website.urls',
    'admin': 'nivls_website.urls_admin',
    'media': 'nivls_website.urls_media',
    'static': 'nivls_website.urls_static',
    'blog': 'nivls_website.blog.urls',
    }

TEMPLATE_DIRS = (
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "templates"),
)

INSTALLED_APPS = (
    'django.contrib.markup',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.admin',
    'django.contrib.comments',
    'debug_toolbar',
    'south',
    'mptt',
    'categories',
    'editor',
    'sorl.thumbnail',
    'tags',
    'blog',
    'images',
    'about',
)

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
