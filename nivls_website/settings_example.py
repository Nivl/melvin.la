# -*- coding: utf-8 -*-

import os

DEBUG = True
TEMPLATE_DEBUG = DEBUG

# locmem doesn’t cache forever, so we cache for one year.
CACHE_BACKEND = 'locmem://?timeout=31536000'

# The first entry is the one used in the contact form.
ADMINS = (('USER', 'user@address.email'),)

MANAGERS = ADMINS

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': '',
        'USER': '',
        'PASSWORD': '',
        'HOST': '',
        'PORT': '',}}


EMAIL_HOST = 'smtp.host.com'
EMAIL_HOST_USER = 'host@address.email'
EMAIL_HOST_PASSWORD = 'psw'


TIME_ZONE = 'Europe/Paris'

LANGUAGE_CODE = 'en-us'

SITE_ID = 1

USE_I18N = True

USE_L10N = True

MEDIA_ROOT = os.path.join(os.path.abspath(os.path.dirname(__file__)),
                          'public', 'media')

MEDIA_URL = '/media/'
ADMIN_MEDIA_PREFIX = '/media/admin'

# Make this unique, and don't share it with anybody.
SECRET_KEY = '+_90789-789}"]85&*98kodnmsjofn)()&&^&^$%769&*()79087'


TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    )

ROOT_URLCONF = 'nivls_website.urls'

TEMPLATE_DIRS = (
    os.path.join(os.path.abspath(os.path.dirname(__file__)), '..', 'templates')
    )

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.admin',
    'django.contrib.comments',
    'django.contrib.markup',
    'django.contrib.humanize',
    'nivls_website.entries',
    'nivls_website.categories',
    'nivls_website.tags',
    'nivls_website.main',
    )
