import os, sys

sys.path.insert(0, '/home/laplan_m/.virtualenvs/nivls_website/lib/python2.7/site-packages/')
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", 'nivls_website'))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "nivls_website.settings")

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()

import nivls_website.monitor
nivls_website.monitor.start(interval=1.0)
