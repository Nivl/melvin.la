from django.conf import settings

def domain_name(context):
  return {'DOMAIN_NAME': settings.DOMAIN_NAME}
