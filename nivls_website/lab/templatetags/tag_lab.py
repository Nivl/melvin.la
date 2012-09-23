from django.conf import settings
from django import template
from django.db.models import Count
from django.contrib.sites.models import Site
from lab.models import *

register = template.Library()


@register.inclusion_tag("lab/templatetags/tags.html")
def lab_tags(act_menu):
    tags = Tag.objects.annotate(num_project=Count('project')) \
                      .filter(num_project__gt=0,
                              project__site=settings.SITE_ID) \
                      .order_by('-num_project', 'name')
    return {'tags': tags,
            'act_menu': act_menu}
