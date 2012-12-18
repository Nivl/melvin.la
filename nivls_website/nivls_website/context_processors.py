from django.conf import settings
from django.contrib.sites.models import Site


def static_root(context):
    return {'STATIC_ROOT': settings.STATIC_ROOT}


def domain_name(context):
    return {'DOMAIN_NAME': Site.objects.get_current().domain}


def debug(context):
    return {'DEBUG': str(settings.DEBUG).lower()}
