from django import template
from django.contrib.sites.models import Site
from seo.models import *

register = template.Library()

@register.tag
def get_seo(parser, token):
    seo = SEO.objects.get(pk=Site.objects.get_current())
    return getSEO(seo)

class getSEO(template.Node):
    def __init__(self, seo):
        self.seo = seo

    def render(self, context):
        context['seo'] = self.seo
        return ''

# TODO:
#      Replace get_seo and getSEO by the code below when 1.4 will be released
#      (/!\ code not tested, may not work)

#@register.assignment_tag(takes_context=True)
#def get_seo(context):
#    context['seo'] = SEO.objects.get(pk=Site.objects.get_current())
#    return ''
