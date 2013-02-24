#!/usr/bin/python
import os, sys

sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', '..', 'nivls_website'))

os.environ['DJANGO_SETTINGS_MODULE'] = 'nivls_website.settings.fr'

from django.core.servers.fastcgi import runfastcgi
runfastcgi(method='threaded', daemonize='false')
