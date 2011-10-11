import os, sys

sys.path.append("/home/www/modules/")
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "nivls_website"))

os.environ['DJANGO_SETTINGS_MODULE'] = 'nivls_website.settings_admin'

import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler()

import nivls_website.monitor
nivls_website.monitor.start(interval=1.0)
