# -*- coding: utf-8 -*-
from settings_global import *

SITE_ID = 1

MIDDLEWARE_CLASSES = MIDDLEWARE_CLASSES + (
    'sentry.client.middleware.Sentry404CatchMiddleware',
    )

INSTALLED_APPS = INSTALLED_APPS + (
    'about',
    'fileUpload',
    'lab',
    'blog',
    'django.contrib.admin',
    'sentry',
    'sentry.client',
    )
