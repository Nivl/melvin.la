# -*- coding: utf-8 -*-
from settings_global import *

SITE_ID = 1

ROOT_URLCONF = 'nivls_website.urls'

INSTALLED_APPS = INSTALLED_APPS + (
    'about',
    'lab',
    'seo',
    )
