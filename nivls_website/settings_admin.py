# -*- coding: utf-8 -*-
from settings import *

SITE_ID = 4

ROOT_URLCONF = 'nivls_website.urls_admin'

INSTALLED_APPS = INSTALLED_APPS + (
    'django.contrib.admin',
 )
