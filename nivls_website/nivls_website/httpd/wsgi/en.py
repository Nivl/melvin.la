import os, sys

sys.path.append("/home/www/modules/")
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", ".."))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "nivls_website.settings")

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()

import nivls_website.monitor
nivls_website.monitor.start(interval=1.0)
