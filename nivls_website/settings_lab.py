# -*- coding: utf-8 -*-
from settings_global import *


ROOT_URLCONF = 'nivls_website.lab.urls'
SITE_ID = 3
INSTALLED_APPS = INSTALLED_APPS + (
    'django.contrib.webdesign',

    'lab',
    'seo',
    )
