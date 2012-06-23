from django.conf import settings


def static_root(context):
    return {'STATIC_ROOT': settings.STATIC_ROOT}

def domain_name(context):
    return {'DOMAIN_NAME': settings.DOMAIN_NAME}
