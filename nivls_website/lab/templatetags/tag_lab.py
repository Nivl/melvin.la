from django import template
from django.db.models import Count
from django.contrib.sites.models import Site
from lab.models import *

register = template.Library()

@register.inclusion_tag("lab/templatetags/tags.html")
def lab_tags(act_menu):
    tags = Tag.objects.filter().annotate(num_project=Count('project__id')).order_by('-num_project', 'name')
    return {'tags': tags,
            'act_menu': act_menu}

@register.inclusion_tag("lab/templatetags/tags_js.html")
def lab_tags_js(act_menu):
    tags = Tag.objects.all()
    return {'tags': tags,
            'act_menu': act_menu}

@register.inclusion_tag("lab/templatetags/pagination.html")
def project_pagination(paginator):
    return {'paginator': paginator}
