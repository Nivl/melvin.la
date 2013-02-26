from django.conf import settings
from django.contrib.sites.models import Site


def app(context):
    return {'STATIC_ROOT': settings.STATIC_ROOT,
            'DOMAIN_NAME': Site.objects.get_current().domain,
            'DEBUG': str(settings.DEBUG).lower()}
