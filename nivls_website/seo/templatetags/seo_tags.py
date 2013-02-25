from django import template
from django.contrib.sites.models import Site
from seo.models import SEO

register = template.Library()


@register.assignment_tag(takes_context=True)
def get_seo(context):
    context['seo'] = SEO.objects.get(pk=Site.objects.get_current())
    return context['seo']
