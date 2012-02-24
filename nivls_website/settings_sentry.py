# -*- coding: utf-8 -*-
from settings import *

SITE_ID = 3

ROOT_URLCONF = 'nivls_website.urls_sentry'

MIDDLEWARE_CLASSES = MIDDLEWARE_CLASSES + (
    'sentry.client.middleware.Sentry404CatchMiddleware',
    )

INSTALLED_APPS = INSTALLED_APPS + (
    'sentry',
    'sentry.client',
)
